import { redirect } from "next/navigation";

import { getServerUser } from "@/lib/auth/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (user) {
    redirect("/dashboard");
  }

  return children;
}
