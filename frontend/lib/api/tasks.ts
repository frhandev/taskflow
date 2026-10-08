import CreateTaskRequest from "@/types/Tasks/CreateTaskRequest";
import Task from "@/types/Tasks/task";
import TaskApiDto from "@/types/Tasks/TaskApiDto";
import UpdateTaskRequest from "@/types/Tasks/UpdateTaskRequest";
import { getCsrfToken } from "./csrf";

function mapTaskDto(task: TaskApiDto): Task {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    dueDate: new Date(task.dueDate),
  };
}

export async function getTasks(cookieHeader: string): Promise<Task[]> {
  const backendUrl = process.env.BACKEND_INTERNAL_URL;

  if (!backendUrl) {
    throw new Error("BACKEND_INTERNAL_URL is not configured.");
  }

  const response = await fetch(`${backendUrl}/api/tasks`, {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Error fetching tasks: ${response.status}`);
  }

  const data: TaskApiDto[] = await response.json();

  return data.map(mapTaskDto);
}

export async function createTask(task: CreateTaskRequest): Promise<Task> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },

    credentials: "same-origin",

    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error(`Error creating task: ${response.status}`);
  }

  const data: TaskApiDto = await response.json();

  return mapTaskDto(data);
}

export async function completeTask(taskId: string): Promise<Task> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`/api/tasks/${taskId}/complete`, {
    method: "PATCH",
    credentials: "same-origin",

    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Error completing task: ${response.status}`);
  }

  const data: TaskApiDto = await response.json();

  return mapTaskDto(data);
}

export async function updateTask(
  taskId: string,
  updatedTask: UpdateTaskRequest,
): Promise<Task> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    credentials: "same-origin",

    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },

    body: JSON.stringify(updatedTask),
  });

  if (!response.ok) {
    throw new Error(`Error updating task: ${response.status}`);
  }

  const task: TaskApiDto = await response.json();

  return mapTaskDto(task);
}

export async function deleteTask(taskId: string): Promise<void> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
    credentials: "same-origin",

    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Error deleting task: ${response.status}`);
  }
}
