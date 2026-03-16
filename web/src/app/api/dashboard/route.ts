import { NextResponse } from "next/server";

import { requireApiSession } from "@/server/http/api-session";
import { getVaultAdapter } from "@/server/vault";

export async function GET(request: Request) {
  const session = await requireApiSession(request);
  if (session instanceof NextResponse) {
    return session;
  }

  const snapshot = await getVaultAdapter().getDashboardSnapshot(session.email);
  return NextResponse.json(snapshot);
}
