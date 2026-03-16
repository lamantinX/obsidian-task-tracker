import { TaskWorkspace } from "@/components/task-workspace";
import { requireAppSession } from "@/server/auth/server-session";
import { getVaultAdapter } from "@/server/vault";

type SearchParams = Promise<{
  taskId?: string;
  view?: string;
}>;

export default async function TasksPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAppSession();
  const resolved = await searchParams;
  const adapter = getVaultAdapter();
  const tasks = await adapter.listTasks();
  const selectedTask = resolved.taskId ? await adapter.getTask(resolved.taskId).catch(() => null) : null;

  return (
    <TaskWorkspace
      tasks={tasks}
      initialTask={selectedTask}
      initialView={resolved.view === "kanban" ? "kanban" : "table"}
    />
  );
}
