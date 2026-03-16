import Link from "next/link";

import { requireAppSession } from "@/server/auth/server-session";
import { getVaultAdapter } from "@/server/vault";

export default async function ProjectsPage() {
  await requireAppSession();
  const projects = await getVaultAdapter().listProjects();

  return (
    <section className="page-stack">
      <div className="section-header">
        <div>
          <h1>Projects</h1>
          <p className="section-note">Active project inventory across products.</p>
        </div>
      </div>
      <div className="surface-panel">
        <div className="table-wrap">
          <table className="entity-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Product</th>
                <th>Status</th>
                <th>Active</th>
                <th>Blocked</th>
                <th>Done</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
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
                  <td>{project.productName}</td>
                  <td>{project.status}</td>
                  <td>{project.activeTasks}</td>
                  <td>{project.blockedTasks}</td>
                  <td>{project.doneTasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
