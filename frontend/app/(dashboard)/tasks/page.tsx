import Link from "next/link";
import Task from "@/types/Tasks/task";
import TaskList from "@/components/tasks/TaskList";
import { getTasks } from "@/lib/api/tasks";

async function TasksPage() {
  const tasks: Task[] = await getTasks();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-3 w-full">
      <h1 className="text-4xl font-bold">Tasks</h1>
      <p className="text-gray-600">Manage and organize your tasks.</p>

      <TaskList tasks={tasks} />
      <Link
        href="/tasks/new"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + New Task
      </Link>
    </div>
  );
}

export default TasksPage;
