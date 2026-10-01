"use client";

import Task from "@/types/Tasks/task";
import TaskCard from "./TaskCard";
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";
import { completeTask, deleteTask, updateTask } from "@/lib/api/tasks";
import UpdateTaskRequest from "@/types/Tasks/UpdateTaskRequest";

function TaskList({ tasks }: { tasks: Task[] }) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const [taskItems, setTaskItems] = useState<Task[]>(tasks);

  const [actionError, setActionError] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  //Status Changing
  const handleStatusChange = async (taskId: string) => {
    setCompletingTaskId(taskId);
    setActionError(null);

    try {
      const completedTask = await completeTask(taskId);
      setTaskItems((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? completedTask : task)),
      );
    } catch (error) {
      setActionError(
        `Failed to complete task. Please try again. Error: ${error}`,
      );
    } finally {
      setCompletingTaskId(null);
    }
  };

  //Task Filtering
  const filteredTasks = taskItems.filter((task) => {
    const matchesSearchTerm =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriorityFilter =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearchTerm && matchesStatusFilter && matchesPriorityFilter;
  });

  // Sorting Tasks
  const [sortBy, setSortBy] = useState<string>("newest");

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "due-earliest") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === "due-latest") {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    return 0;
  });

  //Edit task
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  //Delete Task
  const [deletingTask, setDeletingTask] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    setDeletingTask(taskId);
    setActionError(null);

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!isConfirmed) {
      setDeletingTask(null);
      return;
    }

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
        `Failed to delete task. Please try again. Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setDeletingTask(null);
    }
  };

  return (
    <>
      <div className="flex gap-10">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priotityFilter">Priority:</label>
          <select
            id="priotityFilter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortBy">Sort By:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="due-latest">Due Date: Latest</option>
            <option value="due-earliest">Due Date: Earliest</option>
          </select>
        </div>
      </div>

      {editingTask && (
        <EditTaskForm
          key={editingTask.id}
          task={editingTask}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {actionError && (
        <p className="mt-2 text-sm text-red-500">{actionError}</p>
      )}
      <div className="mt-6 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTasks.length === 0 && taskItems.length > 0 ? (
          <div className="col-span-full text-center">
            <p className="text-gray-500">No tasks match the current filters.</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleStatusChange}
              onEdit={() => setEditingTask(task)}
              completingTaskId={completingTaskId}
              onDelete={handleDelete}
              isDeleting={deletingTask === task.id}
            />
          ))
        )}
        {taskItems.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-gray-500">No tasks yet.</p>
            <p className="text-gray-500">
              Click on <span className="font-bold">+ New Task</span> to create
              one.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default TaskList;
