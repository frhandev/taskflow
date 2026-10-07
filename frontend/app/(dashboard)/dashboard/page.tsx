import { getTasks } from "@/lib/api/tasks";
import Dashboard from "@/components/dashboard/Dashboard";
import { cookies } from "next/headers";

async function DashboardPage() {
  const cookieStore = await cookies();

  const authCookie = cookieStore.get("TaskFlow.Auth");

  const cookieHeader = authCookie
    ? `${authCookie.name} = ${authCookie.value}`
    : "";

  const tasks = await getTasks(cookieHeader);

  return <Dashboard tasks={tasks} />;
}

export default DashboardPage;
