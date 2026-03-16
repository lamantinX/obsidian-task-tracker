"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError("");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? "")
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        setError(payload.message ?? "Unable to sign in");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        <span>Email</span>
        <input defaultValue="demo@example.com" name="email" type="email" />
      </label>
      <label>
        <span>Password</span>
        <input defaultValue="demo123" name="password" type="password" />
      </label>
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Signing in..." : "Open panel"}
      </button>
      {error ? <p className="error-text">{error}</p> : null}
    </form>
  );
}
