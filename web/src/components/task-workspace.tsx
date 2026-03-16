"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useState } from "react";

import { formatRelativeDate, statusLabel } from "@/lib/format";
import type { TaskDetails, TaskPriority, TaskStatus, TaskSummary } from "@/server/vault/types";

type TaskWorkspaceProps = {
  tasks: TaskSummary[];
  initialTask: TaskDetails | null;
  initialView: "table" | "kanban";
};

const quickFilters = [
  { id: "all", label: "All" },
  { id: "backlog", label: "Backlog" },
  { id: "blocked", label: "Blocked" },
  { id: "overdue", label: "Overdue" },
  { id: "unassigned", label: "Unassigned" }
] as const;

const kanbanStatuses: TaskStatus[] = ["backlog", "todo", "in-progress", "blocked", "done"];

export function TaskWorkspace({ tasks, initialTask, initialView }: TaskWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"table" | "kanban">(initialView);
  const [filter, setFilter] = useState<(typeof quickFilters)[number]["id"]>("all");
  const [selectedTask, setSelectedTask] = useState<TaskDetails | null>(initialTask);
  const [formState, setFormState] = useState<{ status: TaskStatus; priority: TaskPriority; due: string }>({
    status: initialTask?.status ?? "backlog",
    priority: initialTask?.priority ?? "medium",
    due: initialTask?.due ?? ""
  });
  const [message, setMessage] = useState("");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "backlog") {
      return task.status === "backlog";
    }

    if (filter === "blocked") {
      return task.status === "blocked";
    }

    if (filter === "overdue") {
      return Boolean(task.due) && task.status !== "done" && task.due < new Date().toISOString().slice(0, 10);
    }

    if (filter === "unassigned") {
      return !task.owner;
    }

    return true;
  });

  async function openTask(id: string) {
    const response = await fetch(`/api/tasks/${id}`);
    const payload = (await response.json()) as TaskDetails;
    setSelectedTask(payload);
    setFormState({
      status: payload.status,
      priority: payload.priority,
      due: payload.due ?? ""
    });

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("taskId", id);
    nextParams.set("view", view);
    router.replace(`/tasks?${nextParams.toString()}`);
  }

  async function saveTask() {
    if (!selectedTask) {
      return;
    }

    setMessage("");
    const response = await fetch(`/api/tasks/${selectedTask.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        expectedRevision: selectedTask.revision,
        changes: formState
      })
    });

    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      setMessage(payload.message ?? "Save failed");
      return;
    }

    const payload = (await response.json()) as TaskDetails;
    setSelectedTask(payload);
    setFormState({
      status: payload.status,
      priority: payload.priority,
      due: payload.due ?? ""
    });
    setMessage("Saved");
    startTransition(() => router.refresh());
  }

  return (
    <section className="page-stack task-workspace">
      <div className="section-header">
        <div>
          <h1>Tasks</h1>
          <p className="section-note">Browse, filter, and update work without leaving the page.</p>
        </div>
        <div className="toolbar">
          <div className="toolbar-tabs">
            <button aria-pressed={view === "table"} onClick={() => setView("table")} type="button">
              Table
            </button>
            <button aria-pressed={view === "kanban"} onClick={() => setView("kanban")} type="button">
              Kanban
            </button>
          </div>
          <div className="toolbar-filters">
            {quickFilters.map((entry) => (
              <button
                className={filter === entry.id ? "is-active" : ""}
                key={entry.id}
                onClick={() => setFilter(entry.id)}
                type="button"
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="workspace-split">
        <div className="surface-panel">
          {view === "table" ? (
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
                  {filteredTasks.map((task) => (
                    <tr className="clickable-row" key={task.id} onClick={() => void openTask(task.id)}>
                      <td>
                        <strong>{task.title}</strong>
                        <span>
                          {task.productName} · {task.projectName} · {task.id}
                        </span>
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
          ) : (
            <div className="kanban-grid">
              {kanbanStatuses.map((status) => (
                <div className="kanban-column" key={status}>
                  <div className="panel-subheading">
                    <h3>{statusLabel(status)}</h3>
                  </div>
                  {filteredTasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <button className="kanban-card" key={task.id} onClick={() => void openTask(task.id)} type="button">
                        <strong>{task.title}</strong>
                        <span>{task.projectName}</span>
                        <span>{task.creator || "Unknown"}</span>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="drawer">
          {selectedTask ? (
            <>
              <div className="panel-subheading">
                <div>
                  <h3>{selectedTask.title}</h3>
                  <p className="section-note">{selectedTask.id}</p>
                </div>
                <a href={`obsidian://open?path=${encodeURIComponent(selectedTask.path)}`}>Raw markdown</a>
              </div>
              <p className="muted">{selectedTask.description || "No description"}</p>
              <div className="stack-form">
                <label>
                  <span>Creator</span>
                  <input readOnly value={selectedTask.creator || "Unknown"} />
                </label>
                <label>
                  <span>Status</span>
                  <select
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        status: event.target.value as TaskStatus
                      }))
                    }
                    value={formState.status}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
                <label>
                  <span>Priority</span>
                  <select
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        priority: event.target.value as TaskPriority
                      }))
                    }
                    value={formState.priority}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
                <label>
                  <span>Due date</span>
                  <input
                    onChange={(event) => setFormState((current) => ({ ...current, due: event.target.value }))}
                    type="date"
                    value={formState.due}
                  />
                </label>
                <button className="primary-button" onClick={() => void saveTask()} type="button">
                  Save changes
                </button>
                {message ? <p className="muted">{message}</p> : null}
              </div>
            </>
          ) : (
            <div className="empty-drawer">
              <h3>Select a task</h3>
              <p className="muted">Open a row or kanban card to edit it without leaving the workspace.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
