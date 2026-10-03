"use client";

import { getErrorMessage } from "@/lib/utils/errors";
import FormErrors from "@/types/Tasks/FormErrors";
import Priority from "@/types/Tasks/priority";
import Task from "@/types/Tasks/task";
import UpdateTaskRequest from "@/types/Tasks/UpdateTaskRequest";
import { SubmitEventHandler, useState } from "react";

type EditTaskFormProps = {
  task: Task;
  onSave: (updatedTask: UpdateTaskRequest) => Promise<void>;
  onCancel: () => void;
};

function EditTaskForm({ task, onSave, onCancel }: EditTaskFormProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate.toISOString().split("T")[0],
  });

  const [error, setError] = useState<FormErrors>({});

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler = async (e) => {
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
    if (!formData.dueDate) {
      newError.dueDate = "Due date is required";
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    setError({});

    const updatedTask: UpdateTaskRequest = {
      title: trimmedTitle,
      description: trimmedDescription,
      priority: formData.priority,
      dueDate: `${formData.dueDate}T00:00:00.000Z`,
    };

    setIsSaving(true);
    setSubmissionError(null);

    try {
      await onSave(updatedTask);
    } catch (error) {
      setSubmissionError(
        `Failed to update task. Please try again. Error: ${getErrorMessage(error)}`,
      );
    } finally {
      setIsSaving(false);
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

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        {submissionError && (
          <p className="text-red-500 text-sm">{submissionError}</p>
        )}

        <button
          type="button"
          onClick={onCancel}
          className="rounded border px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditTaskForm;
