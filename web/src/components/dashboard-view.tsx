import React from "react";
import Link from "next/link";

import { formatRelativeDate, statusLabel } from "@/lib/format";
import type { DashboardSnapshot } from "@/server/vault/types";

export function DashboardView({ snapshot }: { snapshot: DashboardSnapshot }) {
  const summary = [
    { label: "Open", value: snapshot.kpis.totalTasks },
    { label: "In progress", value: snapshot.kpis.inProgressTasks },
    { label: "Blocked", value: snapshot.kpis.blockedTasks },
    { label: "Overdue", value: snapshot.kpis.overdueTasks }
  ];

  return (
    <section className="page-stack">
      <div className="section-header">
        <div>
          <h1>Dashboard</h1>
          <p className="section-note">Current work, blockers, and product movement.</p>
        </div>
      </div>
      <dl className="summary-row">
        {summary.map((item) => (
          <div className="summary-item" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="content-grid">
        <section className="surface-panel">
          <div className="panel-subheading">
            <h3>Needs attention</h3>
            <Link href="/tasks">Open tasks</Link>
          </div>
          <div className="attention-list">
            {snapshot.attention.required.map((task) => (
              <Link href={`/tasks?taskId=${task.id}`} key={task.id} className="attention-row">
                <div className="row-title">
                  <strong>{task.title}</strong>
                  <span className="row-meta">
                    {task.projectName} · {statusLabel(task.status)}
                  </span>
                </div>
                <span>{task.due ? formatRelativeDate(task.due) : "No due date"}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="surface-panel">
          <div className="panel-subheading">
            <h3>Ready to move</h3>
            <Link href="/products">View all</Link>
          </div>
          <div className="mini-project-list">
            {snapshot.products.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.slug} className="mini-project-row">
                <div className="row-title">
                  <strong>{product.name}</strong>
                  <span className="row-meta">{product.projectCount} projects</span>
                </div>
                <span>{product.backlogTasks} backlog</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
