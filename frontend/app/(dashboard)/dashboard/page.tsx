import { getTasks } from "@/lib/api/tasks";
import Dashboard from "@/components/dashboard/Dashboard";

async function DashboardPage() {
  const tasks = await getTasks();

  return <Dashboard tasks={tasks} />;
}

export default DashboardPage;