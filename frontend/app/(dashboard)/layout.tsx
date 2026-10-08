import DashboardShell from "@/components/layout/DashboardShell";
import { getServerUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getServerUser();
  
  if (!user) {
    redirect("/login");
  }

  return (
      <DashboardShell user={user}>{children}</DashboardShell>
  );
}
