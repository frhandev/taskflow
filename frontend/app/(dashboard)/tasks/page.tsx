import Task from "@/types/Tasks/task";
import TaskList from "@/components/tasks/TaskList";
import { getTasks } from "@/lib/api/tasks";
import { cookies } from "next/headers";

async function TasksPage() {
  const cookieStore = await cookies();
  
    const authCookie = cookieStore.get("TaskFlow.Auth");
  
    const cookieHeader = authCookie
      ? `${authCookie.name}=${authCookie.value}`
      : "";
  
  const tasks: Task[] = await getTasks(cookieHeader);

  return <TaskList tasks={tasks} />;
}

export default TasksPage;
