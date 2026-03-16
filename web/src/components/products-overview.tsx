import React from "react";
import Link from "next/link";

import type { ProductSummary } from "@/server/vault/types";

export function ProductsOverview({ products }: { products: ProductSummary[] }) {
  return (
    <section className="page-stack">
      <div className="section-header">
        <div>
          <h1>Products</h1>
          <p className="section-note">Grouped workspaces and their current load.</p>
        </div>
      </div>
      <div className="surface-panel">
        <div className="table-wrap">
          <table className="entity-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Projects</th>
                <th>Active</th>
                <th>Backlog</th>
                <th>Blocked</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.slug}>
                  <td>
                    <Link href={`/products/${product.slug}`}>
                      <div className="entity-title">
                        <span className="entity-marker" style={{ backgroundColor: product.color }} />
                        <div className="row-title">
                          <strong>{product.name}</strong>
                          <span className="row-meta">{product.slug}</span>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td>{product.projectCount}</td>
                  <td>{product.activeTasks}</td>
                  <td>{product.backlogTasks}</td>
                  <td>{product.blockedTasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
