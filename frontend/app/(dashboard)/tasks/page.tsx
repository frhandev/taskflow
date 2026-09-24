import Link from "next/dist/client/link";

function TasksPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-3">
      <h1 className="text-4xl font-bold">Tasks Page</h1>
      <Link href="/tasks/new" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Create New Task
      </Link>
    </div>
  );
}

export default TasksPage;