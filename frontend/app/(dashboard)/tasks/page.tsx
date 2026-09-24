import TaskCard from "@/components/tasks/TaskCard";
import Link from "next/link";
import Task from "@/types/task";
import { mockTasks } from "@/lib/data/tasks";

function TasksPage() {
  const tasks: Task[] = mockTasks;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-3 w-full">
      <h1 className="text-4xl font-bold">Tasks</h1>
      <p className="text-gray-600">Manage and organize your tasks.</p>
      <Link
        href="/tasks/new"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + New Task
      </Link>
      <div className="mt-6 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <p className="text-gray-500">No tasks found.</p>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
