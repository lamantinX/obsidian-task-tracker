import { NextResponse } from "next/server";

import { readSessionToken } from "@/server/auth/session";
import { SESSION_COOKIE_NAME } from "@/server/auth/server-session";

export async function requireApiSession(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }

  try {
    return await readSessionToken(token);
  } catch {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }
}
