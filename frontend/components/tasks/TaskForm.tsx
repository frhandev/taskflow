"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createTask } from "@/lib/api/tasks";
import { getErrorMessage } from "@/lib/utils/errors";

import CreateTaskRequest from "@/types/Tasks/CreateTaskRequest";
import UpdateTaskRequest from "@/types/Tasks/UpdateTaskRequest";
import FormErrors from "@/types/Tasks/FormErrors";
import Priority from "@/types/Tasks/priority";
import TaskFormData from "@/types/Tasks/taskFormData";
import Task from "@/types/Tasks/task";

import Icon from "../ui/Icon";

type TaskFormProps = {
  task?: Task;
  initialDate?: string;
  onSave?: (request: UpdateTaskRequest) => Promise<void>;
  onCancel?: () => void;
};

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayDate(): string {
  return formatDateForInput(new Date());
}

function TaskForm({
  task,
  initialDate,
  onSave,
  onCancel,
}: TaskFormProps) {
  const router = useRouter();

  const isEditing = Boolean(task);

  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "medium",
    dueDate: task
      ? formatDateForInput(task.dueDate)
      : initialDate ?? getTodayDate(),
  });

  const [error, setError] = useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submissionError, setSubmissionError] = useState<string | null>(
    null,
  );

  const cancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    router.push("/tasks");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();

    const newError: FormErrors = {};

    // Title
    if (!trimmedTitle) {
      newError.title = "Title is required";
    } else if (trimmedTitle.length < 3) {
      newError.title =
        "Title must be at least 3 characters long";
    } else if (trimmedTitle.length > 150) {
      newError.title =
        "Title must not exceed 150 characters";
    }

    // Description
    if (trimmedDescription.length > 1000) {
      newError.description =
        "Description must not exceed 1000 characters";
    }

    // Priority
    if (!["high", "medium", "low"].includes(formData.priority)) {
      newError.priority =
        "Priority must be high, medium, or low";
    }

    // Due Date
    if (
      !formData.dueDate ||
      !Number.isFinite(Date.parse(formData.dueDate))
    ) {
      newError.dueDate = "Due date is required";
    } else if (
      !isEditing &&
      formData.dueDate < getTodayDate()
    ) {
      newError.dueDate =
        "Due date cannot be in the past";
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    setError({});
    setSubmissionError(null);
    setIsSubmitting(true);

    const request: CreateTaskRequest | UpdateTaskRequest = {
      title: trimmedTitle,
      description: trimmedDescription,
      priority: formData.priority,
      dueDate: `${formData.dueDate}T00:00:00.000Z`,
    };

    try {
      if (isEditing) {
        if (!onSave) {
          throw new Error("Edit handler is missing");
        }

        await onSave(request);
      } else {
        await createTask(request);

        router.push("/tasks");
        router.refresh();
      }
    } catch (error) {
      setSubmissionError(
        `Failed to ${isEditing ? "update" : "create"} task. Please try again. Error: ${getErrorMessage(error)}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id="task-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="task-title">
        Task title
        <span>*</span>
      </label>

      <input
        id="task-title"
        autoFocus
        required
        minLength={3}
        maxLength={150}
        placeholder="What’s the next small step?"
        value={formData.title}
        onChange={(event) =>
          setFormData({
            ...formData,
            title: event.target.value,
          })
        }
      />

      {error.title && (
        <p className="form-error" role="alert">
          {error.title}
        </p>
      )}

      <label htmlFor="task-description">
        A few details
      </label>

      <textarea
        id="task-description"
        maxLength={1000}
        rows={3}
        placeholder="Add context, links, or a little inspiration…"
        value={formData.description}
        onChange={(event) =>
          setFormData({
            ...formData,
            description: event.target.value,
          })
        }
      />

      {error.description && (
        <p className="form-error" role="alert">
          {error.description}
        </p>
      )}

      <div className="form-row">
        <div>
          <label htmlFor="task-priority">
            Priority
          </label>

          <select
            id="task-priority"
            value={formData.priority}
            onChange={(event) =>
              setFormData({
                ...formData,
                priority: event.target.value as Priority,
              })
            }
          >
            {(["high", "medium", "low"] as Priority[]).map(
              (priority) => (
                <option
                  value={priority}
                  key={priority}
                >
                  {priority}
                </option>
              ),
            )}
          </select>

          {error.priority && (
            <p className="form-error" role="alert">
              {error.priority}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="task-due">
            Due date
            <span>*</span>
          </label>

          <input
            id="task-due"
            type="date"
            required
            min={isEditing ? undefined : getTodayDate()}
            value={formData.dueDate}
            onChange={(event) =>
              setFormData({
                ...formData,
                dueDate: event.target.value,
              })
            }
          />

          {error.dueDate && (
            <p className="form-error" role="alert">
              {error.dueDate}
            </p>
          )}
        </div>
      </div>

      {submissionError && (
        <p className="form-error" role="alert">
          {submissionError}
        </p>
      )}

      <div className="modal-footer">
        <button
          className="button"
          type="button"
          onClick={cancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          className="button dark"
          type="submit"
          disabled={isSubmitting}
        >
          <Icon name={isEditing ? "check" : "plus"} />

          {isSubmitting
            ? isEditing
              ? "Saving…"
              : "Creating…"
            : isEditing
              ? "Save changes"
              : "Create task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;