import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import slugify from "slugify";
import { z } from "zod";

import type {
  CreateTaskInput,
  DashboardSnapshot,
  ProductDetails,
  ProductSummary,
  ProjectDetails,
  ProjectSummary,
  SearchResult,
  TaskDetails,
  TaskPriority,
  TaskStatus,
  TaskSummary,
  UpdateTaskChanges
} from "@/server/vault/types";
import { TASK_STATUSES, UNASSIGNED_PRODUCT_SLUG } from "@/server/vault/types";

const yamlDateString = z.preprocess((value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value ?? "";
}, z.string());

const optionalYamlDateString = z.preprocess((value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value ?? "";
}, z.string());

const taskFrontmatterSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(TASK_STATUSES),
  project: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  owner: z.string().optional().nullable(),
  creator: z.string().optional().nullable(),
  executor: z.string().optional().nullable(),
  handoff_status: z.string().optional().nullable(),
  due: optionalYamlDateString.optional().nullable(),
  created: yamlDateString,
  completed: optionalYamlDateString.optional().nullable(),
  effort: z.string().optional().nullable(),
  actual: z.string().optional().nullable(),
  blocked_by: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  dispatch_ready: z.boolean().optional().default(false),
  related_research: z.array(z.string()).optional().default([]),
  related_notes: z.array(z.string()).optional().default([]),
  repo: z.string().optional().nullable(),
  kind: z.string().optional().nullable(),
  orchestration_status: z.string().optional().nullable(),
  deerflow_mode: z.string().optional().nullable(),
  codex_mode: z.string().optional().nullable()
});

const projectFrontmatterSchema = z.object({
  project: z.string(),
  full_name: z.string().optional().nullable(),
  repo: z.string().optional().nullable(),
  remote: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  started: optionalYamlDateString.optional().nullable(),
  color: z.string().optional().nullable(),
  id_prefix: z.string(),
  knowledge_board: z.string().optional().nullable(),
  product: z.string().optional().nullable(),
  next_id: z.number().int().optional().default(1)
});

const productFrontmatterSchema = z.object({
  product: z.string(),
  full_name: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  owner: z.string().optional().nullable(),
  description: z.string().optional().nullable()
});

type ProductRecord = {
  frontmatter: z.infer<typeof productFrontmatterSchema>;
  body: string;
  path: string;
};

type ProjectRecord = {
  frontmatter: z.infer<typeof projectFrontmatterSchema>;
  body: string;
  path: string;
};

type TaskRecord = {
  frontmatter: z.infer<typeof taskFrontmatterSchema>;
  body: string;
  path: string;
  revision: string;
};

type ProductContext = {
  productsBySlug: Map<string, ProductSummary>;
  projectsBySlug: Map<string, ProjectSummary>;
};

type VaultAdapterOptions = {
  vaultPath: string;
};

type CreateTaskArgs = {
  actor: string;
  input: CreateTaskInput;
};

type UpdateTaskArgs = {
  actor: string;
  id: string;
  expectedRevision: string;
  changes: UpdateTaskChanges;
};

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export function createVaultAdapter({ vaultPath }: VaultAdapterOptions) {
  return {
    getDashboardSnapshot: async (actor: string): Promise<DashboardSnapshot> => {
      const context = await buildContext(vaultPath);
      const tasks = await readTasks(vaultPath, context);
      const today = todayString();

      return {
        kpis: {
          totalTasks: tasks.length,
          backlogTasks: tasks.filter((task) => task.status === "backlog").length,
          todoTasks: tasks.filter((task) => task.status === "todo").length,
          inProgressTasks: tasks.filter((task) => task.status === "in-progress").length,
          blockedTasks: tasks.filter((task) => task.status === "blocked").length,
          overdueTasks: tasks.filter(
            (task) => Boolean(task.due) && !["done", "cancelled"].includes(task.status) && task.due < today
          ).length,
          readyForCodex: tasks.filter((task) => task.handoffStatus === "ready" && task.executor === "codex").length,
          readyForDeerflow: tasks.filter(
            (task) => task.handoffStatus === "ready" && task.executor === "deerflow"
          ).length
        },
        products: [...context.productsBySlug.values()].sort((left, right) => left.name.localeCompare(right.name)),
        projects: [...context.projectsBySlug.values()].sort((left, right) => left.name.localeCompare(right.name)),
        attention: {
          required: tasks
            .filter(
              (task) =>
                task.status === "blocked" ||
                !task.owner ||
                (Boolean(task.due) && !["done", "cancelled"].includes(task.status) && task.due < today)
            )
            .sort(compareTasks)
            .slice(0, 6),
          recentlyUpdated: tasks
            .slice()
            .sort((left, right) => right.created.localeCompare(left.created))
            .slice(0, 8)
            .map((task) => ({
              id: task.id,
              title: task.title,
              type: "task" as const,
              actor,
              at: task.created
            }))
        }
      };
    },

    listProducts: async (): Promise<ProductSummary[]> => {
      const context = await buildContext(vaultPath);
      return [...context.productsBySlug.values()].sort((left, right) => left.name.localeCompare(right.name));
    },

    getProduct: async (slug: string): Promise<ProductDetails> => {
      const context = await buildContext(vaultPath);
      const product = context.productsBySlug.get(slug);
      if (!product) {
        throw new Error(`Product ${slug} not found`);
      }

      return {
        ...product,
        projects: [...context.projectsBySlug.values()]
          .filter((project) => project.productSlug === slug)
          .sort((left, right) => left.name.localeCompare(right.name))
      };
    },

    listProjects: async (): Promise<ProjectSummary[]> => {
      const context = await buildContext(vaultPath);
      return [...context.projectsBySlug.values()].sort((left, right) => left.name.localeCompare(right.name));
    },

    getProject: async (slug: string): Promise<ProjectDetails> => {
      const context = await buildContext(vaultPath);
      const project = context.projectsBySlug.get(slug);
      if (!project) {
        throw new Error(`Project ${slug} not found`);
      }

      const rawProject = await readProject(vaultPath, slug);
      const tasks = await readTasks(vaultPath, context);

      return {
        ...project,
        fullName: rawProject.frontmatter.full_name ?? rawProject.frontmatter.project,
        nextId: rawProject.frontmatter.next_id,
        tasks: tasks.filter((task) => task.project === slug)
      };
    },

    listTasks: async (): Promise<TaskSummary[]> => {
      const context = await buildContext(vaultPath);
      return readTasks(vaultPath, context);
    },

    getTask: async (id: string): Promise<TaskDetails> => {
      const context = await buildContext(vaultPath);
      const task = await readTaskById(vaultPath, id);
      return normalizeTask(task, context);
    },

    createTask: async ({ actor, input }: CreateTaskArgs) => {
      const project = await readProject(vaultPath, input.project);
      const projectProduct = project.frontmatter.product ?? UNASSIGNED_PRODUCT_SLUG;
      if (projectProduct !== input.product) {
        throw new Error(`Project ${input.project} does not belong to product ${input.product}`);
      }

      const projectPath = path.join(vaultPath, "projects", `${input.project}.md`);
      const nextId = project.frontmatter.next_id;
      const id = `${project.frontmatter.id_prefix}-${String(nextId).padStart(3, "0")}`;
      const slug = slugify(input.title, { lower: true, strict: true });
      const taskPath = path.join(vaultPath, "tasks", input.project, `${slug}.md`);
      const created = todayString();

      const frontmatter = {
        id,
        title: input.title,
        status: input.status,
        project: input.project,
        priority: input.priority,
        owner: "",
        creator: actor,
        executor: "human",
        kind: "chore",
        repo: "",
        handoff_status: "inbox",
        orchestration_status: "none",
        deerflow_mode: "none",
        codex_mode: "none",
        due: "",
        tags: [],
        created,
        completed: "",
        blocked_by: [],
        effort: input.effort ?? "",
        actual: "",
        related_research: [],
        dispatch_ready: false,
        related_notes: []
      };

      const body = buildTaskBody(input.description ?? "", `${created}: Task created by ${actor}`);
      await fs.mkdir(path.dirname(taskPath), { recursive: true });
      await fs.writeFile(taskPath, renderMarkdown(frontmatter, body), "utf8");

      project.frontmatter.next_id = nextId + 1;
      await fs.writeFile(projectPath, renderMarkdown(project.frontmatter, project.body), "utf8");

      const context = await buildContext(vaultPath);
      const task = await readTaskById(vaultPath, id);
      return normalizeTask(task, context);
    },

    updateTask: async ({ actor, id, expectedRevision, changes }: UpdateTaskArgs) => {
      const existing = await readTaskById(vaultPath, id);
      if (existing.revision !== expectedRevision) {
        throw new ConflictError(`Task ${id} was modified by another user`);
      }

      const nextFrontmatter = {
        ...existing.frontmatter,
        title: changes.title ?? existing.frontmatter.title,
        priority: (changes.priority as TaskPriority | undefined) ?? existing.frontmatter.priority,
        status: (changes.status as TaskStatus | undefined) ?? existing.frontmatter.status,
        owner: changes.owner ?? existing.frontmatter.owner ?? "",
        due: changes.due ?? existing.frontmatter.due ?? "",
        effort: changes.effort ?? existing.frontmatter.effort ?? ""
      };

      if (nextFrontmatter.status === "done" && !nextFrontmatter.completed) {
        nextFrontmatter.completed = todayString();
      }

      if (nextFrontmatter.status !== "done") {
        nextFrontmatter.completed = "";
      }

      const nextBody = updateTaskBody(existing.body, changes.description, `${todayString()}: Updated by ${actor}`);
      await fs.writeFile(existing.path, renderMarkdown(nextFrontmatter, nextBody), "utf8");

      const context = await buildContext(vaultPath);
      const task = await readTaskById(vaultPath, id);
      return normalizeTask(task, context);
    },

    search: async (query: string): Promise<SearchResult[]> => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) {
        return [];
      }

      const context = await buildContext(vaultPath);
      const tasks = await readTasks(vaultPath, context);
      const taskResults = tasks
        .filter(
          (task) =>
            task.title.toLowerCase().includes(normalizedQuery) ||
            task.id.toLowerCase().includes(normalizedQuery)
        )
        .map((task) => ({
          id: task.id,
          title: task.title,
          type: "task" as const,
          href: `/tasks?taskId=${task.id}`,
          subtitle: `${task.projectName} · ${task.status}`
        }));

      const projectResults = [...context.projectsBySlug.values()]
        .filter(
          (project) =>
            project.slug.toLowerCase().includes(normalizedQuery) ||
            project.name.toLowerCase().includes(normalizedQuery)
        )
        .map((project) => ({
          id: project.slug,
          title: project.name,
          type: "project" as const,
          href: `/projects/${project.slug}`,
          subtitle: `${project.productName} · ${project.activeTasks} active tasks`
        }));

      const productResults = [...context.productsBySlug.values()]
        .filter(
          (product) =>
            product.slug.toLowerCase().includes(normalizedQuery) ||
            product.name.toLowerCase().includes(normalizedQuery)
        )
        .map((product) => ({
          id: product.slug,
          title: product.name,
          type: "product" as const,
          href: `/products/${product.slug}`,
          subtitle: `${product.projectCount} projects`
        }));

      return [...taskResults, ...projectResults, ...productResults].slice(0, 12);
    }
  };
}

async function buildContext(vaultPath: string): Promise<ProductContext> {
  const [productRecords, projectRecords, taskRecords] = await Promise.all([
    readProductRecords(vaultPath),
    readProjectRecords(vaultPath),
    readTaskRecords(vaultPath)
  ]);

  const productsBySlug = new Map<string, ProductSummary>();

  for (const record of productRecords) {
    productsBySlug.set(record.frontmatter.product, {
      slug: record.frontmatter.product,
      name: record.frontmatter.full_name ?? record.frontmatter.product,
      description: record.frontmatter.description ?? extractFirstParagraph(record.body),
      color: record.frontmatter.color ?? "#135d66",
      projectCount: 0,
      activeTasks: 0,
      backlogTasks: 0,
      blockedTasks: 0,
      path: record.path
    });
  }

  const projectsBySlug = new Map<string, ProjectSummary>();

  for (const project of projectRecords) {
    const productSlug = project.frontmatter.product ?? UNASSIGNED_PRODUCT_SLUG;
    if (!productsBySlug.has(productSlug)) {
      productsBySlug.set(productSlug, {
        slug: productSlug,
        name: productSlug === UNASSIGNED_PRODUCT_SLUG ? "Unassigned" : productSlug,
        description: "",
        color: "#8c7d6a",
        projectCount: 0,
        activeTasks: 0,
        backlogTasks: 0,
        blockedTasks: 0,
        path: ""
      });
    }

    const tasks = taskRecords.filter((task) => task.frontmatter.project === project.frontmatter.project);
    const product = productsBySlug.get(productSlug)!;

    product.projectCount += 1;
    product.activeTasks += tasks.filter((task) => !["done", "cancelled"].includes(task.frontmatter.status)).length;
    product.backlogTasks += tasks.filter((task) => task.frontmatter.status === "backlog").length;
    product.blockedTasks += tasks.filter((task) => task.frontmatter.status === "blocked").length;

    projectsBySlug.set(project.frontmatter.project, {
      slug: project.frontmatter.project,
      name: project.frontmatter.full_name ?? project.frontmatter.project,
      status: project.frontmatter.status ?? "active",
      color: project.frontmatter.color ?? "#4A90D9",
      repo: project.frontmatter.repo ?? "",
      knowledgeBoard: project.frontmatter.knowledge_board ?? "",
      activeTasks: tasks.filter((task) => !["done", "cancelled"].includes(task.frontmatter.status)).length,
      blockedTasks: tasks.filter((task) => task.frontmatter.status === "blocked").length,
      doneTasks: tasks.filter((task) => task.frontmatter.status === "done").length,
      path: project.path,
      productSlug,
      productName: product.name
    });
  }

  return { productsBySlug, projectsBySlug };
}

async function readProducts(vaultPath: string): Promise<ProductSummary[]> {
  const context = await buildContext(vaultPath);
  return [...context.productsBySlug.values()].sort((left, right) => left.name.localeCompare(right.name));
}

async function readTasks(vaultPath: string, context: ProductContext): Promise<TaskSummary[]> {
  const taskRecords = await readTaskRecords(vaultPath);
  return taskRecords.map((task) => normalizeTask(task, context)).sort(compareTasks);
}

async function readTaskById(vaultPath: string, id: string): Promise<TaskRecord> {
  const tasks = await readTaskRecords(vaultPath);
  const task = tasks.find((entry) => entry.frontmatter.id === id);
  if (!task) {
    throw new Error(`Task ${id} not found`);
  }

  return task;
}

async function readProject(vaultPath: string, slug: string): Promise<ProjectRecord> {
  const filePath = path.join(vaultPath, "projects", `${slug}.md`);
  const source = await fs.readFile(filePath, "utf8");
  const parsed = matter(source);

  return {
    frontmatter: projectFrontmatterSchema.parse(parsed.data),
    body: normalizeBody(parsed.content),
    path: filePath
  };
}

async function readProjectRecords(vaultPath: string): Promise<ProjectRecord[]> {
  const projectDir = path.join(vaultPath, "projects");
  const files = await fs.readdir(projectDir);

  return Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map((file) => readProject(vaultPath, file.replace(/\.md$/, "")))
  );
}

async function readProductRecords(vaultPath: string): Promise<ProductRecord[]> {
  const productsDir = path.join(vaultPath, "products");
  try {
    await fs.access(productsDir);
  } catch {
    return [];
  }

  const files = await fs.readdir(productsDir);
  const records = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const filePath = path.join(productsDir, file);
        const source = await fs.readFile(filePath, "utf8");
        const parsed = matter(source);

        if (!parsed.data || typeof parsed.data.product !== "string" || !parsed.data.product.trim()) {
          return null;
        }

        return {
          frontmatter: productFrontmatterSchema.parse(parsed.data),
          body: normalizeBody(parsed.content),
          path: filePath
        } satisfies ProductRecord;
      })
  );

  return records.filter((record): record is ProductRecord => record !== null);
}

async function readTaskRecords(vaultPath: string): Promise<TaskRecord[]> {
  const tasksRoot = path.join(vaultPath, "tasks");
  const projectDirs = await fs.readdir(tasksRoot);
  const taskFiles = await Promise.all(
    projectDirs.map(async (project) => {
      const directory = path.join(tasksRoot, project);
      const stat = await fs.stat(directory);
      if (!stat.isDirectory()) {
        return [] as string[];
      }

      const files = await fs.readdir(directory);
      return files.filter((file) => file.endsWith(".md")).map((file) => path.join(directory, file));
    })
  );

  return Promise.all(
    taskFiles.flat().map(async (filePath) => {
      const source = await fs.readFile(filePath, "utf8");
      const parsed = matter(source);

      return {
        frontmatter: taskFrontmatterSchema.parse(parsed.data),
        body: normalizeBody(parsed.content),
        path: filePath,
        revision: hash(source)
      } satisfies TaskRecord;
    })
  );
}

function normalizeTask(task: TaskRecord, context: ProductContext): TaskDetails {
  const project = context.projectsBySlug.get(task.frontmatter.project);
  const description = extractDescription(task.body);

  return {
    id: task.frontmatter.id,
    title: task.frontmatter.title,
    project: task.frontmatter.project,
    projectName: project?.name ?? task.frontmatter.project,
    productSlug: project?.productSlug ?? UNASSIGNED_PRODUCT_SLUG,
    productName: project?.productName ?? "Unassigned",
    priority: task.frontmatter.priority,
    status: task.frontmatter.status,
    owner: task.frontmatter.owner ?? "",
    creator: task.frontmatter.creator ?? "",
    due: task.frontmatter.due ?? "",
    created: task.frontmatter.created,
    completed: task.frontmatter.completed ?? "",
    effort: task.frontmatter.effort ?? "",
    revision: task.revision,
    path: task.path,
    blockedBy: task.frontmatter.blocked_by,
    dispatchReady: task.frontmatter.dispatch_ready,
    executor: task.frontmatter.executor ?? "",
    handoffStatus: task.frontmatter.handoff_status ?? "",
    relatedNotes: task.frontmatter.related_notes,
    description,
    body: task.body,
    tags: task.frontmatter.tags,
    actual: task.frontmatter.actual ?? "",
    relatedResearch: task.frontmatter.related_research
  };
}

function renderMarkdown(frontmatter: Record<string, unknown>, body: string) {
  return `---\n${serializeFrontmatter(frontmatter)}---\n\n${body.trimEnd()}\n`;
}

function serializeFrontmatter(frontmatter: Record<string, unknown>) {
  return Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${serializeValue(value)}`)
    .join("\n")
    .concat("\n");
}

function serializeValue(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.join(", ")}]`;
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (value == null || value === "") {
    return "";
  }

  if (typeof value === "string" && /[:#[\],{}]/.test(value)) {
    return JSON.stringify(value);
  }

  return String(value);
}

function normalizeBody(body: string) {
  return body.replace(/\r\n/g, "\n").trim();
}

function extractDescription(body: string) {
  const match = body.match(/##\s+[^\n]+\s+([\s\S]*?)(?:\n## |\s*$)/u);
  return match?.[1]?.trim() ?? "";
}

function extractFirstParagraph(body: string) {
  return body.split("\n\n")[0]?.trim() ?? "";
}

function buildTaskBody(description: string, journalEntry: string) {
  const normalizedDescription = description.trim() || "New task";
  return [
    "## Description",
    "",
    normalizedDescription,
    "",
    "## Acceptance Criteria",
    "",
    "- [ ] Define acceptance criteria",
    "",
    "## Journal",
    "",
    `- ${journalEntry}`
  ].join("\n");
}

function updateTaskBody(body: string, description: string | undefined, journalEntry: string) {
  const nextBody = typeof description === "string" ? replaceDescription(body, description) : body;

  if (nextBody.includes("## Journal")) {
    return nextBody.replace(/## Journal\s*/u, `## Journal\n\n- ${journalEntry}\n`);
  }

  return `${nextBody}\n\n## Journal\n\n- ${journalEntry}\n`;
}

function replaceDescription(body: string, description: string) {
  if (!body.includes("## Description")) {
    return `## Description\n\n${description.trim()}\n\n${body}`;
  }

  return body.replace(/## Description\s+([\s\S]*?)(?:\n## |\s*$)/u, `## Description\n\n${description.trim()}\n\n## `);
}

function compareTasks(left: TaskSummary, right: TaskSummary) {
  const order: Record<string, number> = {
    backlog: 0,
    todo: 1,
    "in-progress": 2,
    blocked: 3,
    done: 4,
    cancelled: 5
  };

  return (
    (order[left.status] ?? 99) - (order[right.status] ?? 99) ||
    left.created.localeCompare(right.created) ||
    left.title.localeCompare(right.title)
  );
}

function hash(value: string) {
  return crypto.createHash("sha1").update(value).digest("hex");
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}
