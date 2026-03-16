export const TASK_STATUSES = [
  "backlog",
  "todo",
  "in-progress",
  "done",
  "blocked",
  "cancelled"
] as const;
export const TASK_PRIORITIES = ["high", "medium", "low"] as const;
export const UNASSIGNED_PRODUCT_SLUG = "unassigned";

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type TaskSummary = {
  id: string;
  title: string;
  project: string;
  projectName: string;
  productSlug: string;
  productName: string;
  priority: TaskPriority;
  status: TaskStatus;
  owner: string;
  creator: string;
  due: string;
  created: string;
  completed: string;
  effort: string;
  revision: string;
  path: string;
  blockedBy: string[];
  dispatchReady: boolean;
  executor: string;
  handoffStatus: string;
  relatedNotes: string[];
};

export type TaskDetails = TaskSummary & {
  description: string;
  body: string;
  tags: string[];
  actual: string;
  relatedResearch: string[];
};

export type ProductSummary = {
  slug: string;
  name: string;
  description: string;
  color: string;
  projectCount: number;
  activeTasks: number;
  backlogTasks: number;
  blockedTasks: number;
  path: string;
};

export type ProjectSummary = {
  slug: string;
  name: string;
  status: string;
  color: string;
  repo: string;
  knowledgeBoard: string;
  activeTasks: number;
  blockedTasks: number;
  doneTasks: number;
  path: string;
  productSlug: string;
  productName: string;
};

export type ProjectDetails = ProjectSummary & {
  fullName: string;
  nextId: number;
  tasks: TaskSummary[];
};

export type ProductDetails = ProductSummary & {
  projects: ProjectSummary[];
};

export type DashboardSnapshot = {
  kpis: {
    totalTasks: number;
    backlogTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    overdueTasks: number;
    readyForCodex: number;
    readyForDeerflow: number;
  };
  products: ProductSummary[];
  projects: ProjectSummary[];
  attention: {
    required: TaskSummary[];
    recentlyUpdated: Array<{
      id: string;
      title: string;
      type: "task" | "project" | "product";
      actor: string;
      at: string;
    }>;
  };
};

export type SearchResult = {
  id: string;
  title: string;
  type: "task" | "project" | "product" | "knowledge";
  href: string;
  subtitle: string;
};

export type CreateTaskInput = {
  title: string;
  product: string;
  project: string;
  priority: TaskPriority;
  status: TaskStatus;
  description?: string;
  effort?: string;
};

export type UpdateTaskChanges = Partial<
  Pick<
    TaskDetails,
    "title" | "priority" | "status" | "owner" | "due" | "effort" | "description"
  >
>;
