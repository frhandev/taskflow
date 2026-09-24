"use client";

import Task from "@/types/Tasks/task";
import TaskCard from "./TaskCard";
import { useState } from "react";

function TaskList({ tasks }: { tasks: Task[] }) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const [taskItems, setTaskItems] = useState<Task[]>(tasks);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTaskItems((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus as Task["status"],
            }
          : task,
      ),
    );
  };

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

  const [sortBy, setSortBy] = useState<string>("newest");

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "oldest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "newest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "due-latest") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === "due-earliest") {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    return 0;
  });

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
            />
          ))
        )}
        {tasks.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-gray-500">No tasks yet.</p>
            <p className="text-gray-500">Click on <span className="font-bold">+ New Task</span> to create one.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default TaskList;
