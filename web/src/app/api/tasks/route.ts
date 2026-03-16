import { NextResponse } from "next/server";

import { requireApiSession } from "@/server/http/api-session";
import { getVaultAdapter } from "@/server/vault";
import type { CreateTaskInput } from "@/server/vault/types";

export async function GET(request: Request) {
  const session = await requireApiSession(request);
  if (session instanceof NextResponse) {
    return session;
  }

  const tasks = await getVaultAdapter().listTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const session = await requireApiSession(request);
  if (session instanceof NextResponse) {
    return session;
  }

  const input = (await request.json()) as CreateTaskInput;
  const task = await getVaultAdapter().createTask({
    actor: session.email,
    input
  });

  return NextResponse.json(task, { status: 201 });
}
