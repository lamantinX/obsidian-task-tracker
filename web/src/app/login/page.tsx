import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getOptionalSession } from "@/server/auth/server-session";

export default async function LoginPage() {
  const session = await getOptionalSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <section className="login-screen">
      <div className="login-card">
        <p className="eyebrow">Shared vault access</p>
        <h1>Sign in to the panel</h1>
        <p className="muted">
          Use team credentials to operate tasks and projects without touching raw Markdown.
        </p>
        <LoginForm />
        <div className="login-hint">
          <span>Default dev user</span>
          <strong>demo@example.com / demo123</strong>
        </div>
      </div>
    </section>
  );
}
