import Task from "@/types/Tasks/task";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-orange-100 text-orange-700",
    low: "bg-green-100 text-green-700",
  };

  const statusColors = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{task.title}</h3>

      <p className="mt-2 text-gray-600">{task.description}</p>

      <div className="mt-4 flex gap-2">
        {/* Status Badge */}
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusColors[task.status]
          }`}
        >
          {task.status}
        </span>

        {/* Priority Badge */}
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Due: {task.dueDate.toLocaleDateString()}
      </p>
      <p className="mt-1 text-sm text-gray-500">
        {" "}
        Created: {task.createdAt.toLocaleDateString()}
      </p>
    </div>
  );
}
