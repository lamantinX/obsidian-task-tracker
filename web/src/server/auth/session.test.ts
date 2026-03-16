import { describe, expect, it } from "vitest";

import {
  AuthenticationError,
  authenticateUser,
  createSessionToken,
  readSessionToken,
  requireSession
} from "@/server/auth/session";

describe("session auth", () => {
  it("authenticates configured users and returns a signed session token", async () => {
    const token = await createSessionToken({
      email: "demo@example.com",
      name: "Demo User"
    });

    const session = await readSessionToken(token);

    expect(session.email).toBe("demo@example.com");
    expect(session.name).toBe("Demo User");
  });

  it("rejects invalid credentials", async () => {
    await expect(
      authenticateUser({
        email: "demo@example.com",
        password: "wrong-password"
      })
    ).rejects.toBeInstanceOf(AuthenticationError);
  });

  it("requires a valid session for protected routes", async () => {
    await expect(requireSession(undefined)).rejects.toBeInstanceOf(AuthenticationError);
  });
});
