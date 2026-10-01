import createTaskRequest from "@/types/Tasks/createTaskRequest";
import Task from "@/types/Tasks/task";
import TaskApiDto from "@/types/Tasks/TaskApiDto";

export async function getTasks() : Promise<Task[]>{
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error fetching tasks: ${response.status}`);
  }

  const data: TaskApiDto[] = await response.json();

  return data.map((task) => ({
    ...task,
    createdAt: new Date(task.createdAt),
    dueDate: new Date(task.dueDate),
  }));
}

export async function createTask(task: createTaskRequest): Promise<Task> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error(`Error creating task: ${response.status}`);
    }

    const data: TaskApiDto = await response.json();

    return {
        ...data,
        createdAt: new Date(data.createdAt),
        dueDate: new Date(data.dueDate)
    };
}
