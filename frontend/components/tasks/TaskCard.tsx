"use client";

import Task from "@/types/Tasks/task";
import Icon from "../ui/Icon";

type TaskCardProps = {
  task: Task;
  onComplete: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
  completingTaskId?: string | null;
  isDeleting: boolean;
  onDelete: (taskId: string) => void;
  card: boolean;
};

export default function TaskCard({
  task,
  onComplete,
  onEdit,
  completingTaskId,
  isDeleting,
  onDelete,
  card,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";

  const isCompleting = completingTaskId === task.id;

  const isBusy = isCompleting || isDeleting;

  const dueDate = new Date(task.dueDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDateOnly = new Date(dueDate);
  dueDateOnly.setHours(0, 0, 0, 0);

  const isOverdue =
    !isCompleted &&
    dueDateOnly < today;

  const dueDateLabel = dueDate.toLocaleDateString();

  const handleComplete = async () => {
    if (isCompleted || isBusy) return;

    await onComplete(task.id);
  };

  return (
    <article
      className={`task-row ${card ? "task-card" : ""} ${
        isCompleted ? "is-done" : ""
      }`}
    >
      {/* Complete */}

      <button
        type="button"
        className={`task-check ${isCompleted ? "checked" : ""}`}
        disabled={isBusy || isCompleted}
        onClick={() => void handleComplete()}
        aria-label={
          isCompleted
            ? `Completed: ${task.title}`
            : `Complete: ${task.title}`
        }
        aria-pressed={isCompleted}
      >
        {isCompleted && <Icon name="check" />}
      </button>

      {/* Task content */}

      <div className="task-copy">
        <button
          type="button"
          className="task-title"
          onClick={() => onEdit(task)}
          disabled={isBusy}
        >
          {task.title}
        </button>

        <p>{task.description || "—"}</p>
      </div>

      {/* Priority */}

      <span className={`priority-badge ${task.priority}`}>
        <i />
        {task.priority}
      </span>

      {/* Due date */}

      <span
        className={`task-date ${
          isOverdue ? "is-overdue" : ""
        }`}
      >
        <Icon name="calendar" />

        <span>
          {isOverdue && "Overdue · "}
          {dueDateLabel}
        </span>
      </span>

      {/* Actions */}

      <div className="task-actions">
        <button
          type="button"
          className="icon-button"
          onClick={() => onEdit(task)}
          disabled={isBusy}
          aria-label={`Edit ${task.title}`}
        >
          <Icon name="edit" />
        </button>

        <button
          type="button"
          className="icon-button danger-button"
          onClick={() => onDelete(task.id)}
          disabled={isBusy}
          aria-label={`Delete ${task.title}`}
        >
          <Icon name="trash" />
        </button>
      </div>
    </article>
  );
}