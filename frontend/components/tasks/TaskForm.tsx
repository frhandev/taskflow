"use client";

import Priority from "@/types/priority";
import Task from "@/types/task";
import TaskFormData from "@/types/taskFormData";
import { SubmitEvent, useState } from "react";

type FormErrors = {
  title?: string;
  priority?: string;
  dueDate?: string;
};

function TaskForm() {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
  });

  const [error, setError] = useState<FormErrors>({});

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newError: FormErrors = {};

    // Validate Title
    if (!formData.title.trim()) {
      newError.title = "Title is required";
    } else if (formData.title.length < 3) {
      newError.title = "Title must be at least 3 characters long or more";
    }

    // Validate priority
    if (!["high", "medium", "low"].includes(formData.priority)) {
      newError.priority = "Priority must be high, medium, or low";
    }

    // Validate due date
    if (!formData.dueDate) {
      newError.dueDate = "Due date is required";
    } else if (new Date(formData.dueDate) < new Date(Date.now())) {
      newError.dueDate = "Due date cannot be in the past";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    // Form is valid
    const newTask: Task = {
      id: crypto.randomUUID(),
      status: "pending",
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: new Date(formData.dueDate),
      createdAt: new Date(Date.now()),
    };

    console.log(newTask);
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
        placeholder="Task Description"
        className="border p-2 rounded"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <label htmlFor="priority" className="font-semibold">
        Task Priority
      </label>
      <select
        className="border p-2 rounded"
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
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
        type="date"
        className="border p-2 rounded"
        value={formData.dueDate}
        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
      />
      {error.dueDate && <p className="text-red-500 text-sm">{error.dueDate}</p>}

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Task
      </button>
    </form>
  );
}

export default TaskForm;
