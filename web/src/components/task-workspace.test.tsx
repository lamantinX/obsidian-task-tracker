import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TaskWorkspace } from "@/components/task-workspace";
import type { TaskDetails, TaskSummary } from "@/server/vault/types";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    refresh
  }),
  useSearchParams: () => new URLSearchParams("")
}));

const tasks: TaskSummary[] = [
  {
    id: "EX-0",
    title: "Backlog task",
    project: "_example",
    projectName: "Example Project",
    productSlug: "_example-product",
    productName: "Example Product",
    priority: "low",
    status: "backlog",
    owner: "",
    creator: "demo@example.com",
    due: "",
    created: "2026-03-01",
    completed: "",
    effort: "30m",
    revision: "rev-0",
    path: "/vault/tasks/_example/backlog-task.md",
    blockedBy: [],
    dispatchReady: false,
    executor: "human",
    handoffStatus: "inbox",
    relatedNotes: []
  },
  {
    id: "EX-1",
    title: "Blocked task",
    project: "_example",
    projectName: "Example Project",
    productSlug: "_example-product",
    productName: "Example Product",
    priority: "high",
    status: "blocked",
    owner: "",
    creator: "demo@example.com",
    due: "2026-03-10",
    created: "2026-03-01",
    completed: "",
    effort: "1h",
    revision: "rev-1",
    path: "/vault/tasks/_example/blocked-task.md",
    blockedBy: [],
    dispatchReady: false,
    executor: "human",
    handoffStatus: "inbox",
    relatedNotes: []
  },
  {
    id: "EX-2",
    title: "Todo task",
    project: "_example",
    projectName: "Example Project",
    productSlug: "_example-product",
    productName: "Example Product",
    priority: "medium",
    status: "todo",
    owner: "Demo User",
    creator: "demo@example.com",
    due: "",
    created: "2026-03-05",
    completed: "",
    effort: "2h",
    revision: "rev-2",
    path: "/vault/tasks/_example/todo-task.md",
    blockedBy: [],
    dispatchReady: false,
    executor: "human",
    handoffStatus: "inbox",
    relatedNotes: []
  }
];

const selectedTask: TaskDetails = {
  ...tasks[1],
  description: "Need to unblock",
  body: "## Description\n\nNeed to unblock",
  tags: [],
  actual: "",
  relatedResearch: []
};

describe("TaskWorkspace", () => {
  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("filters the table and can switch to kanban with backlog", async () => {
    render(<TaskWorkspace initialTask={null} initialView="table" tasks={tasks} />);

    expect(screen.getByRole("heading", { name: "Tasks" })).toBeInTheDocument();
    expect(screen.getByText("Blocked task")).toBeInTheDocument();
    expect(screen.getByText("Todo task")).toBeInTheDocument();
    expect(screen.getByText("Backlog task")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Blocked" }));

    expect(screen.getByText("Blocked task")).toBeInTheDocument();
    expect(screen.queryByText("Todo task")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "All" }));
    await userEvent.click(screen.getByRole("button", { name: "Kanban" }));

    expect(screen.getByRole("heading", { name: "Backlog" })).toBeInTheDocument();
    expect(screen.getByText("Todo")).toBeInTheDocument();
    expect(screen.getByText("Blocked task")).toBeInTheDocument();
  });

  it("saves task changes from the drawer", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          ...selectedTask,
          revision: "rev-3",
          status: "done",
          priority: "low"
        }),
        { status: 200 }
      )
    );

    render(<TaskWorkspace initialTask={selectedTask} initialView="table" tasks={tasks} />);

    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "done" } });
    fireEvent.change(screen.getByLabelText("Priority"), { target: { value: "low" } });
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(refresh).toHaveBeenCalled();
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });
});
