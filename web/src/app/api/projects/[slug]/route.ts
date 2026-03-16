import { NextResponse } from "next/server";

import { requireApiSession } from "@/server/http/api-session";
import { getVaultAdapter } from "@/server/vault";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await requireApiSession(request);
  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { slug } = await params;
    const project = await getVaultAdapter().getProject(slug);
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }
}
