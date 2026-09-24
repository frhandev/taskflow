import Task from "@/types/tasks";

function TaskCard({ task }: { task: Task }) { 
    return (
        <div className="task-card max-w-full p-4 border rounded shadow-md bg-white text-center">
            <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500">Status: {task.status}</p>
            <p className="text-sm text-gray-500">Priority: {task.priority}</p>
            <p className="text-sm text-gray-500">Due Date: {task.dueDate.toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Created At: {task.createdAt.toLocaleDateString()}</p>
        </div>
    );
}

export default TaskCard;