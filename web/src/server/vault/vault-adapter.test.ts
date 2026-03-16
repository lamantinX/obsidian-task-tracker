import { describe, expect, it } from "vitest";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";

import { ConflictError, createVaultAdapter } from "@/server/vault/vault-adapter";

const fixtureRoot = path.resolve(__dirname, "../../../..");

async function withTempVault<T>(run: (vaultPath: string) => Promise<T>) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "vault-adapter-"));
  await fs.cp(path.join(fixtureRoot, "products"), path.join(tempDir, "products"), {
    recursive: true
  });
  await fs.cp(path.join(fixtureRoot, "projects"), path.join(tempDir, "projects"), {
    recursive: true
  });
  await fs.cp(path.join(fixtureRoot, "tasks"), path.join(tempDir, "tasks"), {
    recursive: true
  });
  await fs.cp(path.join(fixtureRoot, "knowledge"), path.join(tempDir, "knowledge"), {
    recursive: true
  });

  return run(tempDir).finally(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });
}

describe("vault adapter", () => {
  it("reads dashboard data from markdown vault", async () => {
    await withTempVault(async (vaultPath) => {
      const adapter = createVaultAdapter({ vaultPath });

      const snapshot = await adapter.getDashboardSnapshot("tester@example.com");

      expect(snapshot.kpis.totalTasks).toBe(1);
      expect(snapshot.kpis.todoTasks).toBe(1);
      expect(snapshot.kpis.backlogTasks).toBe(0);
      expect(snapshot.projects).toHaveLength(1);
      expect(snapshot.attention.required[0]?.id).toBe("EX-20250115-01");
    });
  });

  it("reads products and project hierarchy from the vault", async () => {
    await withTempVault(async (vaultPath) => {
      const adapter = createVaultAdapter({ vaultPath });

      const products = await adapter.listProducts();
      const product = await adapter.getProduct("_example-product");

      expect(products.map((entry) => entry.slug)).toContain("_example-product");
      expect(product.projects).toHaveLength(1);
      expect(product.projects[0]?.slug).toBe("_example");
      expect(product.projects[0]?.productSlug).toBe("_example-product");
    });
  });

  it("creates a task with backlog status and creator metadata", async () => {
    await withTempVault(async (vaultPath) => {
      const adapter = createVaultAdapter({ vaultPath });

      const created = await adapter.createTask({
        actor: "tester@example.com",
        input: {
          title: "Investigate analytics spike",
          product: "_example-product",
          project: "_example",
          priority: "medium",
          status: "backlog",
          description: "Check dashboard drift.\n",
          effort: "2h"
        }
      });

      expect(created.id).toBe("EX-002");
      expect(created.status).toBe("backlog");
      expect(created.creator).toBe("tester@example.com");

      const projectContent = await fs.readFile(path.join(vaultPath, "projects", "_example.md"), "utf8");
      expect(projectContent).toContain("next_id: 3");

      const taskContent = await fs.readFile(
        path.join(vaultPath, "tasks", "_example", "investigate-analytics-spike.md"),
        "utf8"
      );
      expect(taskContent).toContain("status: backlog");
      expect(taskContent).toContain("creator: tester@example.com");
      expect(taskContent).toContain("title: Investigate analytics spike");
    });
  });

  it("rejects task creation when product and project do not match", async () => {
    await withTempVault(async (vaultPath) => {
      const adapter = createVaultAdapter({ vaultPath });

      await expect(
        adapter.createTask({
          actor: "tester@example.com",
          input: {
            title: "Invalid task",
            product: "missing-product",
            project: "_example",
            priority: "medium",
            status: "backlog"
          }
        })
      ).rejects.toThrow("does not belong");
    });
  });

  it("updates a task, sets completed date on done, and rejects stale revisions", async () => {
    await withTempVault(async (vaultPath) => {
      const adapter = createVaultAdapter({ vaultPath });
      const task = await adapter.getTask("EX-20250115-01");

      const updated = await adapter.updateTask({
        actor: "tester@example.com",
        id: task.id,
        expectedRevision: task.revision,
        changes: {
          status: "done",
          priority: "low",
          due: "2025-02-05"
        }
      });

      expect(updated.status).toBe("done");
      expect(updated.priority).toBe("low");
      expect(updated.completed).toBeTruthy();

      await expect(
        adapter.updateTask({
          actor: "tester@example.com",
          id: task.id,
          expectedRevision: task.revision,
          changes: {
            status: "blocked"
          }
        })
      ).rejects.toBeInstanceOf(ConflictError);
    });
  });
});
