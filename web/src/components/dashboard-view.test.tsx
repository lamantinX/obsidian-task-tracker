import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardView } from "@/components/dashboard-view";
import type { DashboardSnapshot } from "@/server/vault/types";

const snapshot: DashboardSnapshot = {
  kpis: {
    totalTasks: 12,
    backlogTasks: 2,
    todoTasks: 4,
    inProgressTasks: 3,
    blockedTasks: 2,
    overdueTasks: 1,
    readyForCodex: 1,
    readyForDeerflow: 1
  },
  products: [
    {
      slug: "_example-product",
      name: "Example Product",
      description: "",
      color: "#135d66",
      projectCount: 1,
      activeTasks: 4,
      backlogTasks: 2,
      blockedTasks: 1,
      path: "/vault/products/_example-product.md"
    }
  ],
  projects: [
    {
      slug: "_example",
      name: "Example Project",
      status: "active",
      color: "#4A90D9",
      repo: "",
      knowledgeBoard: "knowledge/projects/_example/index",
      activeTasks: 4,
      blockedTasks: 1,
      doneTasks: 2,
      path: "/vault/projects/_example.md",
      productSlug: "_example-product",
      productName: "Example Product"
    }
  ],
  attention: {
    required: [
      {
        id: "EX-1",
        title: "Fix blocker",
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
        effort: "2h",
        revision: "1",
        path: "/vault/tasks/_example/fix-blocker.md",
        blockedBy: [],
        dispatchReady: false,
        executor: "human",
        handoffStatus: "inbox",
        relatedNotes: []
      }
    ],
    recentlyUpdated: []
  }
};

describe("DashboardView", () => {
  it("renders the plain dashboard workspace", () => {
    render(<DashboardView snapshot={snapshot} />);

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Needs attention")).toBeInTheDocument();
    expect(screen.getByText("Fix blocker")).toBeInTheDocument();
    expect(screen.getByText("Example Product")).toBeInTheDocument();
  });
});
