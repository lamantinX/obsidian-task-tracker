import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AuthenticationError, readSessionToken } from "@/server/auth/session";

export const SESSION_COOKIE_NAME = "task_tracker_session";

export type AppSession = {
  email: string;
  name: string;
};

export async function getOptionalSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await readSessionToken(token);
  } catch {
    return null;
  }
}

export async function requireAppSession() {
  const session = await getOptionalSession();
  if (!session) {
    redirect("/login");
  }

  return session;
}

export function isAuthenticationError(error: unknown) {
  return error instanceof AuthenticationError;
}
