import { NextResponse } from "next/server";

import { requireApiSession } from "@/server/http/api-session";
import { ConflictError } from "@/server/vault/vault-adapter";
import { getVaultAdapter } from "@/server/vault";
import type { UpdateTaskChanges } from "@/server/vault/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiSession(request);
  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = await params;
    const task = await getVaultAdapter().getTask(id);
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiSession(request);
  if (session instanceof NextResponse) {
    return session;
  }

  const body = (await request.json()) as {
    expectedRevision: string;
    changes: UpdateTaskChanges;
  };

  try {
    const { id } = await params;
    const task = await getVaultAdapter().updateTask({
      actor: session.email,
      id,
      expectedRevision: body.expectedRevision,
      changes: body.changes
    });
    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof ConflictError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }
}
