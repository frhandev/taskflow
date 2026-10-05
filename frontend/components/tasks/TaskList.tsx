"use client";

import { useState } from "react";
import Link from "next/link";

import Task from "@/types/Tasks/task";
import UpdateTaskRequest from "@/types/Tasks/UpdateTaskRequest";

import {
  completeTask,
  deleteTask,
  updateTask,
} from "@/lib/api/tasks";

import { getErrorMessage } from "@/lib/utils/errors";

import TaskCard from "./TaskCard";
import EditTaskForm from "./EditTaskForm";

import Icon from "../ui/Icon";
import EmptyState from "../ui/EmptyState";
import ConfirmDialog from "../ui/ConfirmDialog";

type ViewMode = "list" | "grid";

type SortOption =
  | "newest"
  | "oldest"
  | "due-earliest"
  | "due-latest"
  | "priority";

function TaskList({ tasks }: { tasks: Task[] }) {
  const [taskItems, setTaskItems] = useState<Task[]>(tasks);

  // View
  const [view, setView] = useState<ViewMode>("list");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");

  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");

  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Action states
  const [actionError, setActionError] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(
    null,
  );
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Editing
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // -----------------------------
  // Complete Task
  // -----------------------------

  const handleStatusChange = async (taskId: string) => {
    setCompletingTaskId(taskId);
    setActionError(null);

    try {
      const completedTask = await completeTask(taskId);

      setTaskItems((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? completedTask : task,
        ),
      );
    } catch (error) {
      setActionError(
        `Failed to complete task. Please try again. Error: ${getErrorMessage(error)}`,
      );
    } finally {
      setCompletingTaskId(null);
    }
  };

  // -----------------------------
  // Edit Task
  // -----------------------------

  const handleSave = async (request: UpdateTaskRequest) => {
    if (!editingTask) return;

    const updatedTask = await updateTask(editingTask.id, request);

    setTaskItems((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );

    setEditingTask(null);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  // -----------------------------
  // Delete Task
  // -----------------------------

  const requestDelete = (taskId: string) => {
    setDeletingTaskId(taskId);
    setActionError(null);
  };

  const confirmDelete = async () => {
    if (!deletingTaskId) return;

    const taskId = deletingTaskId;

    try {
      await deleteTask(taskId);

      setTaskItems((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );

      if (editingTask?.id === taskId) {
        setEditingTask(null);
      }

      setDeletingTaskId(null);
    } catch (error) {
      setActionError(
        `Failed to delete task. Please try again. Error: ${getErrorMessage(error)}`,
      );
    }
  };

  // -----------------------------
  // Filtering
  // -----------------------------

  const filteredTasks = taskItems.filter((task) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // -----------------------------
  // Sorting
  // -----------------------------

  const priorityOrder = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );

      case "oldest":
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );

      case "due-earliest":
        return (
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
        );

      case "due-latest":
        return (
          new Date(b.dueDate).getTime() -
          new Date(a.dueDate).getTime()
        );

      case "priority":
        return priorityOrder[b.priority] - priorityOrder[a.priority];

      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("newest");
  };

  return (
    <>
      {/* Intro */}

      <section className="intro">
        <div>
          <p className="eyebrow">
            A little structure. A lot of possibility.
          </p>

          <h1>Your next big thing.</h1>

          <p className="intro-sub">
            All your ideas, to-dos, and done-and-dusteds. In one place.
          </p>
        </div>

        <Link className="button dark" href="/tasks/new">
          <Icon name="plus" />
          New task
        </Link>
      </section>

      {/* Tasks */}

      <section className="tasks-section">
        {/* Status filters + view */}

        <div className="tasks-toolbar">
          <div
            className="filter-tabs"
            role="group"
            aria-label="Filter tasks by status"
          >
            {(["all", "pending", "completed"] as const).map((status) => (
              <button
                type="button"
                key={status}
                className={`filter-tab ${
                  statusFilter === status ? "active" : ""
                }`}
                aria-pressed={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              >
                {status}

                <span>
                  {status === "all"
                    ? taskItems.length
                    : taskItems.filter(
                        (task) => task.status === status,
                      ).length}
                </span>
              </button>
            ))}
          </div>

          <div className="view-toggle">
            {(["list", "grid"] as const).map((mode) => (
              <button
                type="button"
                key={mode}
                className={`icon-button ${
                  view === mode ? "selected" : ""
                }`}
                aria-label={`${mode} view`}
                aria-pressed={view === mode}
                onClick={() => setView(mode)}
              >
                <Icon name={mode} />
              </button>
            ))}
          </div>
        </div>

        {/* Search + filters */}

        <div className="search-toolbar">
          <div className="search-field">
            <Icon name="search" />

            <input
              id="task-search"
              type="search"
              value={searchTerm}
              placeholder="Find a task…"
              aria-label="Find a task"
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <kbd>/</kbd>
          </div>

          <select
            id="priority-filter"
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(
                event.target.value as
                  | "all"
                  | "high"
                  | "medium"
                  | "low",
              )
            }
          >
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            id="sort-filter"
            aria-label="Sort tasks"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="due-earliest">Due date: earliest</option>
            <option value="due-latest">Due date: latest</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* Error */}

        {actionError && (
          <p className="form-error" role="alert">
            {actionError}
          </p>
        )}

        {/* Result count */}

        <div className="results-heading">
          <span>
            {sortedTasks.length}{" "}
            {sortedTasks.length === 1 ? "task" : "tasks"}
          </span>

          <span className="tiny-label">
            LET&apos;S GET INTO IT ↗
          </span>
        </div>

        {/* Results */}

        <div
          className={`task-results ${
            view === "grid" ? "task-grid" : "task-list"
          }`}
        >
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                card={view === "grid"}
                onComplete={handleStatusChange}
                onEdit={() => setEditingTask(task)}
                onDelete={requestDelete}
                completingTaskId={completingTaskId}
                isDeleting={deletingTaskId === task.id}
              />
            ))
          ) : (
            <EmptyState onClear={clearFilters} />
          )}
        </div>
      </section>

      {/* Edit */}

      {editingTask && (
        <EditTaskForm
          key={editingTask.id}
          task={editingTask}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Delete confirmation */}

      {deletingTaskId && (
        <ConfirmDialog
          heading="Delete this task?"
          text="This action cannot be undone."
          button="Delete task"
          onConfirm={confirmDelete}
          onClose={() => setDeletingTaskId(null)}
        />
      )}
    </>
  );
}

export default TaskList;