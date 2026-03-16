import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authenticateUser, createSessionToken } from "@/server/auth/session";
import { SESSION_COOKIE_NAME } from "@/server/auth/server-session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  try {
    const user = await authenticateUser({
      email: body.email ?? "",
      password: body.password ?? ""
    });
    const token = await createSessionToken(user);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid email or password" }, { status: 401 });
  }
}
