"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { register } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils/errors";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters.",
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await register({
        email: email.trim(),
        password,
        confirmPassword,
      });

      router.push("/login?registered=true");
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
          START SOMETHING GOOD
        </p>

        <h1>Create your account.</h1>

        <p className="muted">
          Big ideas. Small steps. One place.
        </p>

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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

          <label htmlFor="confirm-password">
            Confirm password
          </label>

          <input
            id="confirm-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value,
              )
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
              ? "Creating account…"
              : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/login">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}