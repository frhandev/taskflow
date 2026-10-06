import AuthUser from "@/types/Auth/AuthUser";
import LoginRequest from "@/types/Auth/LoginRequest";
import RegisterRequest from "@/types/Auth/RegisterRequest";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getResponseError(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join(" ");
    }

    if (data.message) {
      return data.message;
    }
  } catch {
    // Response has no JSON error body.
  }

  return `Request failed with status ${response.status}.`;
}

export async function register(req: RegisterRequest): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    credentials: "include",

    body: JSON.stringify(req),
  });

  if (!res.ok) {
    throw new Error(await getResponseError(res));
  }

  return res.json();
}

export async function login(req: LoginRequest): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    credentials: "include",

    body: JSON.stringify(req),
  });

  if (!res.ok) {
    throw new Error(await getResponseError(res));
  }

  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await getResponseError(res));
  }
}

export async function getUser(): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await getResponseError(res));
  }

  return res.json();
}
