"use client";

import React from "react";

import { formatRelativeDate, statusLabel } from "@/lib/format";
import type { ProjectDetails } from "@/server/vault/types";

export function ProjectWorkspace({ project }: { project: ProjectDetails }) {
  return (
    <section className="page-stack">
      <div className="section-header">
        <div>
          <div className="entity-title">
            <span className="entity-marker" style={{ backgroundColor: project.color }} />
            <h1>{project.fullName}</h1>
          </div>
          <p className="entity-subtitle">
            {project.productName} · {project.status}
          </p>
        </div>
      </div>

      <div className="two-column">
        <section className="surface-panel">
          <div className="panel-subheading">
            <h3>Project context</h3>
          </div>
          <dl className="meta-grid">
            <div className="meta-item">
              <dt>Product</dt>
              <dd>{project.productName}</dd>
            </div>
            <div className="meta-item">
              <dt>Project slug</dt>
              <dd>{project.slug}</dd>
            </div>
            <div className="meta-item">
              <dt>Status</dt>
              <dd>{project.status}</dd>
            </div>
            <div className="meta-item">
              <dt>Next task id</dt>
              <dd>{project.nextId}</dd>
            </div>
          </dl>
        </section>

        <section className="surface-panel">
          <div className="panel-subheading">
            <h3>Linked knowledge</h3>
          </div>
          <a className="knowledge-link" href={`obsidian://open?path=${project.knowledgeBoard}`}>
            <span>{project.knowledgeBoard || "No knowledge board configured"}</span>
          </a>
          <p className="muted">Use the global New Task action in the top bar to create work in this project.</p>
        </section>
      </div>

      <section className="surface-panel">
        <div className="panel-subheading">
          <h3>Active tasks</h3>
        </div>
        <div className="table-wrap">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Creator</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                    <span>{task.id}</span>
                  </td>
                  <td>{task.creator || "Unknown"}</td>
                  <td>{statusLabel(task.status)}</td>
                  <td>{task.priority}</td>
                  <td>{task.due ? formatRelativeDate(task.due) : "No date"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
