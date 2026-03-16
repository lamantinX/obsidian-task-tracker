import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductWorkspace } from "@/components/product-workspace";
import type { ProductDetails } from "@/server/vault/types";

const product: ProductDetails = {
  slug: "_example-product",
  name: "Example Product",
  description: "Shared work surface",
  color: "#135d66",
  projectCount: 1,
  activeTasks: 2,
  backlogTasks: 1,
  blockedTasks: 0,
  path: "/vault/products/_example-product.md",
  projects: [
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
  ]
};

describe("ProductWorkspace", () => {
  it("renders the plain product workspace", () => {
    render(<ProductWorkspace product={product} />);

    expect(screen.getByRole("heading", { name: "Example Product" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("Example Project")).toBeInTheDocument();
  });
});
