import AuthUser from "@/types/Auth/AuthUser";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getServerUser(): Promise<AuthUser | null> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const cookieStore = await cookies();

  const authCookie = cookieStore.get("TaskFlow.Auth");

  if (!authCookie) {
    return null;
  }

  let res: Response;

  try {
    res = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `${authCookie.name}=${authCookie.value}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Unable to reach the authentication server.");
  }

  if (res.status == 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Authentication server error: ${res.status}`);
  }

  const user: AuthUser = await res.json();

  return user;
}
