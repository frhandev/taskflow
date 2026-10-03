"use client";

import { createTask } from "@/lib/api/tasks";
import CreateTaskRequest from "@/types/Tasks/CreateTaskRequest";
import FormErrors from "@/types/Tasks/FormErrors";
import Priority from "@/types/Tasks/priority";
import TaskFormData from "@/types/Tasks/taskFormData";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { getErrorMessage } from "@/lib/utils/errors";

function TaskForm() {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const [error, setError] = useState<FormErrors>({});

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();

    const newError: FormErrors = {};

    // Validate Title
    if (!trimmedTitle) {
      newError.title = "Title is required";
    } else if (trimmedTitle.length < 3) {
      newError.title = "Title must be at least 3 characters long";
    } else if (trimmedTitle.length > 150) {
      newError.title = "Title must not exceed 150 characters";
    }

    if (trimmedDescription.length > 1000) {
      newError.description = "Description must not exceed 1000 characters";
    }

    // Validate priority
    if (!["high", "medium", "low"].includes(formData.priority)) {
      newError.priority = "Priority must be high, medium, or low";
    }

    // Validate due date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.dueDate) {
      newError.dueDate = "Due date is required";
    } else if (new Date(formData.dueDate) < today) {
      newError.dueDate = "Due date cannot be in the past";
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    setError({}); // Clear errors if form is valid

    // Form is valid
    const newTask: CreateTaskRequest = {
      title: trimmedTitle,
      description: trimmedDescription,
      priority: formData.priority,
      dueDate: `${formData.dueDate}T00:00:00.000Z`,
    };

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      await createTask(newTask);
      router.push("/tasks");
      router.refresh();
    } catch (error) {
      setSubmissionError(
        `Failed to create task. Please try again. Error: ${getErrorMessage(error)}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <label htmlFor="title" className="font-semibold">
        Task Title
      </label>
      <input
        id="title"
        type="text"
        placeholder="Task Title"
        className="border p-2 rounded"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      {error.title && <p className="text-red-500 text-sm">{error.title}</p>}

      <label htmlFor="description" className="font-semibold">
        Task Description
      </label>
      <textarea
        id="description"
        maxLength={1000}
        placeholder="Task Description"
        className="border p-2 rounded"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      {error.description && (
        <p className="text-red-500 text-sm">{error.description}</p>
      )}

      <label htmlFor="priority" className="font-semibold">
        Task Priority
      </label>
      <select
        id="priority"
        className="border p-2 rounded"
        value={formData.priority}
        onChange={(e) =>
          setFormData({ ...formData, priority: e.target.value as Priority })
        }
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      {error.priority && (
        <p className="text-red-500 text-sm">{error.priority}</p>
      )}

      <label htmlFor="dueDate" className="font-semibold">
        Due Date
      </label>
      <input
        id="dueDate"
        type="date"
        className="border p-2 rounded"
        value={formData.dueDate}
        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
      />
      {error.dueDate && <p className="text-red-500 text-sm">{error.dueDate}</p>}

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Task"}
      </button>
      {submissionError && (
        <p className="text-red-500 text-sm">{submissionError}</p>
      )}
    </form>
  );
}

export default TaskForm;
