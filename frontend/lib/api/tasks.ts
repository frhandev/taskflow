import CreateTaskRequest from "@/types/Tasks/CreateTaskRequest";
import Task from "@/types/Tasks/task";
import TaskApiDto from "@/types/Tasks/TaskApiDto";
import UpdateTaskRequest from "@/types/Tasks/UpdateTaskRequest";

function mapTaskDto(task: TaskApiDto): Task {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    dueDate: new Date(task.dueDate),
  };
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error fetching tasks: ${response.status}`);
  }

  const data: TaskApiDto[] = await response.json();

  return data.map(mapTaskDto);
}

export async function createTask(task: CreateTaskRequest): Promise<Task> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error(`Error creating task: ${response.status}`);
  }

  const data: TaskApiDto = await response.json();

  return mapTaskDto(data);
}

export async function completeTask(taskId: string): Promise<Task> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/complete`, {
    method: "PATCH",
  });
  
  if (!response.ok) {
    throw new Error(`Error completing task: ${response.status}`);
  }

  const data: TaskApiDto = await response.json();

  return mapTaskDto(data);
}

export async function updateTask(taskId: string, updatedTask: UpdateTaskRequest) : Promise<Task> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  });

  if (!response.ok) {
    throw new Error(`Error updating task: ${response.status}`);
  }

  const task: TaskApiDto = await response.json();

  return mapTaskDto(task);
}

export async function deleteTask(taskId: string) : Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if(!response.ok) {
    throw new Error(`Error updating task: ${response.status}`)
  }
}