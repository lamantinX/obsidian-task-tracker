import { notFound } from "next/navigation";

import { ProjectWorkspace } from "@/components/project-workspace";
import { requireAppSession } from "@/server/auth/server-session";
import { getVaultAdapter } from "@/server/vault";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAppSession();
  const { slug } = await params;

  try {
    const project = await getVaultAdapter().getProject(slug);
    return <ProjectWorkspace project={project} />;
  } catch {
    notFound();
  }
}
