"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils/errors";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      await login({
        email: email.trim(),
        password,
      });

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="panel auth-card">
        <Link href="/" className="auth-logo">
          taskflow.
        </Link>

        <p className="eyebrow">
          WELCOME BACK
        </p>

        <h1>Let&apos;s get things done.</h1>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

          {error && (
            <p
              className="form-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            className="button dark"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Logging in…"
              : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          New to TaskFlow?{" "}
          <Link href="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}