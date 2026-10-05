import Task from "@/types/Tasks/task";
import TaskList from "@/components/tasks/TaskList";
import { getTasks } from "@/lib/api/tasks";

async function TasksPage() {
  const tasks: Task[] = await getTasks();

  return <TaskList tasks={tasks} />;
}

export default TasksPage;
