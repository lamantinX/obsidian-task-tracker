import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductsOverview } from "@/components/products-overview";
import type { ProductSummary } from "@/server/vault/types";

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

describe("ProductsOverview", () => {
  it("renders products in a compact table", () => {
    render(<ProductsOverview products={products} />);

    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Example Product")).toBeInTheDocument();
  });
});
