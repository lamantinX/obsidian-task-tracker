"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";

import type { AppSession } from "@/server/auth/server-session";
import type { ProductSummary, ProjectSummary, TaskStatus } from "@/server/vault/types";

type NewTaskModalProps = {
  products: ProductSummary[];
  projects: ProjectSummary[];
  sessionUser: AppSession;
};

export function NewTaskModal({ products, projects, sessionUser }: NewTaskModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [project, setProject] = useState("");
  const [status, setStatus] = useState<TaskStatus>("backlog");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [effort, setEffort] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
    if (projectMatch) {
      const currentProject = projects.find((entry) => entry.slug === projectMatch[1]);
      if (currentProject) {
        setProduct(currentProject.productSlug);
        setProject(currentProject.slug);
      }
      return;
    }

    const productMatch = pathname.match(/^\/products\/([^/]+)$/);
    if (productMatch) {
      setProduct(productMatch[1]);
      setProject("");
    }
  }, [pathname, projects]);

  const filteredProjects = useMemo(
    () => projects.filter((entry) => entry.productSlug === product),
    [product, projects]
  );

  useEffect(() => {
    if (project && !filteredProjects.some((entry) => entry.slug === project)) {
      setProject("");
    }
  }, [filteredProjects, project]);

  function resetForm() {
    setOpen(false);
    setMessage("");
    setTitle("");
    setStatus("backlog");
    setPriority("medium");
    setEffort("");
    setDescription("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      setMessage("");
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          product,
          project,
          status,
          priority,
          effort,
          description
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        setMessage(payload.message ?? "Failed to create task");
        return;
      }

      resetForm();
      router.refresh();
    });
  }

  return (
    <>
      <button className="primary-button" onClick={() => setOpen(true)} type="button">
        New Task
      </button>
      {open ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="panel-subheading">
              <div>
                <p className="eyebrow">Quick create</p>
                <h3>New task</h3>
              </div>
              <button className="ghost-button" onClick={() => setOpen(false)} type="button">
                Close
              </button>
            </div>
            <form className="stack-form" onSubmit={handleSubmit}>
              <input
                name="title"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="New task title"
                required
                value={title}
              />
              <label>
                <span>Product</span>
                <select onChange={(event) => setProduct(event.target.value)} required value={product}>
                  <option value="">Select product</option>
                  {products.map((entry) => (
                    <option key={entry.slug} value={entry.slug}>
                      {entry.slug}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Project</span>
                <select onChange={(event) => setProject(event.target.value)} required value={project}>
                  <option value="">Select project</option>
                  {filteredProjects.map((entry) => (
                    <option key={entry.slug} value={entry.slug}>
                      {entry.slug}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Creator</span>
                <input disabled readOnly value={sessionUser.email} />
              </label>
              <label>
                <span>Status</span>
                <select onChange={(event) => setStatus(event.target.value as TaskStatus)} value={status}>
                  <option value="backlog">backlog</option>
                  <option value="todo">todo</option>
                  <option value="in-progress">in-progress</option>
                  <option value="blocked">blocked</option>
                  <option value="done">done</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </label>
              <label>
                <span>Priority</span>
                <select onChange={(event) => setPriority(event.target.value as "high" | "medium" | "low")} value={priority}>
                  <option value="high">high</option>
                  <option value="medium">medium</option>
                  <option value="low">low</option>
                </select>
              </label>
              <input onChange={(event) => setEffort(event.target.value)} placeholder="Effort (e.g. 2h)" value={effort} />
              <textarea
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                rows={5}
                value={description}
              />
              <button className="primary-button" disabled={pending} type="submit">
                {pending ? "Creating..." : "Create task"}
              </button>
              {message ? <p className="error-text">{message}</p> : null}
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
