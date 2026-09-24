"use client";

import Task from "@/types/Tasks/task";
import TaskCard from "./TaskCard";
import { useState } from "react";

function TaskList({ tasks }: { tasks: Task[] }) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearchTerm =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriorityFilter =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearchTerm && matchesStatusFilter && matchesPriorityFilter;
  });

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="mt-6 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTasks.length === 0 && tasks.length > 0 ? (
          <div className="col-span-full text-center">
            <p className="text-gray-500">No tasks match the current filters.</p>
          </div>
        ) : (
          filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
        {tasks.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-gray-500">No tasks yet.</p>
            <p className="text-gray-500">Click on + New Task to create one.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default TaskList;
