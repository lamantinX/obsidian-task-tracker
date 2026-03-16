import crypto from "node:crypto";

type SessionUser = {
  email: string;
  name: string;
};

type CredentialInput = {
  email: string;
  password: string;
};

const defaultUsers = [
  {
    email: "demo@example.com",
    password: "demo123",
    name: "Demo User"
  }
];

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export async function authenticateUser({ email, password }: CredentialInput): Promise<SessionUser> {
  const user = getUsers().find(
    (entry) => entry.email.toLowerCase() === email.trim().toLowerCase() && entry.password === password
  );

  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  return {
    email: user.email,
    name: user.name
  };
}

export async function createSessionToken(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export async function readSessionToken(token: string): Promise<SessionUser> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) {
    throw new AuthenticationError("Invalid session token");
  }

  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
  return parsed;
}

export async function requireSession(token: string | undefined): Promise<SessionUser> {
  if (!token) {
    throw new AuthenticationError("Authentication required");
  }

  return readSessionToken(token);
}

function sign(payload: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function sessionSecret() {
  return process.env.TASK_TRACKER_SESSION_SECRET ?? "local-dev-secret";
}

function getUsers() {
  const source = process.env.TASK_TRACKER_USERS;
  if (!source) {
    return defaultUsers;
  }

  try {
    const parsed = JSON.parse(source) as Array<{ email: string; password: string; name: string }>;
    return parsed.length > 0 ? parsed : defaultUsers;
  } catch {
    return defaultUsers;
  }
}
