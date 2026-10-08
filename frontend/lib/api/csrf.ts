type CsrfResponse = {
  token: string;
};

export async function getCsrfToken(): Promise<string> {
  const response = await fetch("/api/auth/csrf", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to get security token: ${response.status}`);
  }

  const data: CsrfResponse = await response.json();

  if (!data.token) {
    throw new Error("Security token is missing.");
  }

  return data.token;
}
