import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NewTaskModal } from "@/components/new-task-modal";
import type { ProductSummary, ProjectSummary } from "@/server/vault/types";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh
  }),
  usePathname: () => "/projects/_example",
  useSearchParams: () => new URLSearchParams("")
}));

const products: ProductSummary[] = [
  {
    slug: "_example-product",
    name: "Example Product",
    description: "",
    color: "#135d66",
    projectCount: 1,
    activeTasks: 2,
    backlogTasks: 1,
    blockedTasks: 0,
    path: "/vault/products/_example-product.md"
  }
];

const projects: ProjectSummary[] = [
  {
    slug: "_example",
    name: "Example Project",
    status: "active",
    color: "#4A90D9",
    repo: "",
    knowledgeBoard: "knowledge/projects/_example/index",
    activeTasks: 2,
    blockedTasks: 0,
    doneTasks: 0,
    path: "/vault/projects/_example.md",
    productSlug: "_example-product",
    productName: "Example Product"
  }
];

describe("NewTaskModal", () => {
  beforeEach(() => {
    refresh.mockReset();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 201 })));
  });

  it("renders creator and backlog defaults and constrains projects by product", async () => {
    render(
      <NewTaskModal
        products={products}
        projects={projects}
        sessionUser={{ email: "demo@example.com", name: "Demo User" }}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "New Task" }));

    expect(screen.getByDisplayValue("demo@example.com")).toBeDisabled();
    expect(screen.getByDisplayValue("backlog")).toBeInTheDocument();
    expect(screen.getByDisplayValue("_example-product")).toBeInTheDocument();
    expect(screen.getByDisplayValue("_example")).toBeInTheDocument();
  });

  it("submits through the shared modal and refreshes current workspace", async () => {
    render(
      <NewTaskModal
        products={products}
        projects={projects}
        sessionUser={{ email: "demo@example.com", name: "Demo User" }}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "New Task" }));
    fireEvent.change(screen.getByPlaceholderText("New task title"), {
      target: { value: "Fresh modal task" }
    });
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(refresh).toHaveBeenCalled();
    });
  });
});
