"use client";

import FormErrors from "@/types/Tasks/FormErrors";
import Priority from "@/types/Tasks/priority";
import Task from "@/types/Tasks/task";
import { SubmitEventHandler, useState } from "react";

type EditTaskFormProps = {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
};

function EditTaskForm({ task, onSave, onCancel }: EditTaskFormProps) {

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate.toISOString().split('T')[0],
  });

  const [error, setError] = useState<FormErrors>({});

  const handleSubmit : SubmitEventHandler = (e) => {
    e.preventDefault();

    const newError : FormErrors = {};

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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day for comparison
    
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

    const updatedTask : Task = {
        ...task, 
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: new Date(formData.dueDate),
    }

    onSave(updatedTask)
  }

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

      <label htmlFor="priority" className="font-semibold">
        Task Priority
      </label>
      <select
      id="priority"
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
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Save
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditTaskForm;
