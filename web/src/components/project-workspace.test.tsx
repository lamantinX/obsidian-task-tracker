import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectWorkspace } from "@/components/project-workspace";
import type { ProjectDetails } from "@/server/vault/types";

const project: ProjectDetails = {
  slug: "_example",
  name: "Example Project",
  fullName: "Example Project",
  status: "active",
  color: "#4A90D9",
  repo: "",
  knowledgeBoard: "knowledge/projects/_example/index",
  activeTasks: 1,
  blockedTasks: 0,
  doneTasks: 0,
  nextId: 2,
  path: "/vault/projects/_example.md",
  productSlug: "_example-product",
  productName: "Example Product",
  tasks: [
    {
      id: "EX-1",
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
  ]
};

describe("ProjectWorkspace", () => {
  it("renders the plain project workspace", () => {
    render(<ProjectWorkspace project={project} />);

    expect(screen.getByRole("heading", { name: "Example Project" })).toBeInTheDocument();
    expect(screen.getByText("Project context")).toBeInTheDocument();
    expect(screen.getByText("Example Product")).toBeInTheDocument();
    expect(screen.getByText("demo@example.com")).toBeInTheDocument();
  });
});
