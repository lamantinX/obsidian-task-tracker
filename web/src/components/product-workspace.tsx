import React from "react";
import Link from "next/link";

import type { ProductDetails } from "@/server/vault/types";

export function ProductWorkspace({ product }: { product: ProductDetails }) {
  return (
    <section className="page-stack">
      <div className="section-header">
        <div>
          <div className="entity-title">
            <span className="entity-marker" style={{ backgroundColor: product.color }} />
            <h1>{product.name}</h1>
          </div>
          <p className="entity-subtitle">{product.description || "No product description yet."}</p>
        </div>
      </div>

      <section className="surface-panel">
        <dl className="summary-row">
          <div className="summary-item">
            <dt>Projects</dt>
            <dd>{product.projectCount}</dd>
          </div>
          <div className="summary-item">
            <dt>Active tasks</dt>
            <dd>{product.activeTasks}</dd>
          </div>
          <div className="summary-item">
            <dt>Backlog</dt>
            <dd>{product.backlogTasks}</dd>
          </div>
          <div className="summary-item">
            <dt>Blocked</dt>
            <dd>{product.blockedTasks}</dd>
          </div>
        </dl>
      </section>

      <section className="surface-panel">
        <div className="panel-subheading">
          <h3>Projects</h3>
        </div>
        <div className="table-wrap">
          <table className="entity-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Active</th>
                <th>Blocked</th>
                <th>Done</th>
              </tr>
            </thead>
            <tbody>
              {product.projects.map((project) => (
                <tr key={project.slug}>
                  <td>
                    <Link href={`/projects/${project.slug}`}>
                      <div className="entity-title">
                        <span className="entity-marker" style={{ backgroundColor: project.color }} />
                        <div className="row-title">
                          <strong>{project.name}</strong>
                          <span className="row-meta">{project.slug}</span>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td>{project.status}</td>
                  <td>{project.activeTasks}</td>
                  <td>{project.blockedTasks}</td>
                  <td>{project.doneTasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
