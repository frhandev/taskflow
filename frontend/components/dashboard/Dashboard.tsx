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

import Hero from "./Hero";
import StatsCards from "./StatsCards";
import ProgressChart, { CompletionRing } from "./ProgressChart";

import TaskCard from "@/components/tasks/TaskCard";
import EditTaskForm from "@/components/tasks/EditTaskForm";

import Icon from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

function getLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

export default function Dashboard({ tasks }: { tasks: Task[] }) {
  const [taskItems, setTaskItems] = useState<Task[]>(tasks);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  // -----------------------------
  // Today's tasks
  // -----------------------------

  const today = taskItems
    .filter((task) => getLocalDate(task.dueDate) === getLocalDate())
    .sort(
      (a, b) =>
        priorityOrder[b.priority] - priorityOrder[a.priority],
    );

  // -----------------------------
  // Complete
  // -----------------------------

  const handleComplete = async (taskId: string) => {
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
  // Edit
  // -----------------------------

  const handleSave = async (request: UpdateTaskRequest) => {
    if (!editingTask) return;

    const updatedTask = await updateTask(
      editingTask.id,
      request,
    );

    setTaskItems((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );

    setEditingTask(null);
  };

  // -----------------------------
  // Delete
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
    } catch (error) {
      setActionError(
        `Failed to delete task. Please try again. Error: ${getErrorMessage(error)}`,
      );

      // Important:
      // ConfirmDialog must know that the operation failed.
      throw error;
    }
  };

  return (
    <>
      {/* Intro */}

      <section className="intro">
        <div>
          <p className="eyebrow">
            <Icon name="spark" />
            Good to see you.
          </p>

          <h1>
            Dashboard
            <span className="heading-dot">.</span>
          </h1>
        </div>

        <Link
          className="button dark"
          href="/tasks/new"
        >
          <Icon name="plus" />
          New task
        </Link>
      </section>

      {/* Dashboard overview */}

      <Hero />

      <StatsCards tasks={taskItems} />

      {/* Today */}

      <div className="dashboard-columns">
        <section className="panel today-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                Today
              </span>

              <h2>
                Today&apos;s tasks

                <span className="round-count">
                  {today.length}
                </span>
              </h2>
            </div>

            <Link
              className="text-button"
              href="/tasks"
            >
              View all
              <Icon name="arrow" />
            </Link>
          </div>

          {actionError && (
            <p
              className="form-error"
              role="alert"
            >
              {actionError}
            </p>
          )}

          <div className="today-list">
            {today.length > 0 ? (
              today.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  card={false}
                  onComplete={handleComplete}
                  onEdit={setEditingTask}
                  onDelete={requestDelete}
                  completingTaskId={completingTaskId}
                  isDeleting={
                    deletingTaskId === task.id
                  }
                />
              ))
            ) : (
              <EmptyState today />
            )}
          </div>
        </section>

        <CompletionRing tasks={taskItems} />
      </div>

      {/* <ProgressChart tasks={taskItems} /> */}

      {/* Edit modal */}

      {editingTask && (
        <EditTaskForm
          key={editingTask.id}
          task={editingTask}
          onSave={handleSave}
          onCancel={() =>
            setEditingTask(null)
          }
        />
      )}

      {/* Delete confirmation */}

      {deletingTaskId && (
        <ConfirmDialog
          heading="Delete this task?"
          text="This action cannot be undone."
          button="Delete task"
          onConfirm={confirmDelete}
          onClose={() =>
            setDeletingTaskId(null)
          }
        />
      )}
    </>
  );
}