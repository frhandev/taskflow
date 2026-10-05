"use client";

import Task from "@/types/Tasks/task";
import Icon, { IconName } from "@/components/ui/Icon";

type StatsCardsProps = {
  tasks: Task[];
};

export default function StatsCards({
  tasks,
}: StatsCardsProps) {
  const total = tasks.length;

  const pending = tasks.filter(
    (task) => task.status === "pending",
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const completionRate =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  const cards: {
    label: string;
    value: string;
    icon: IconName;
    color: string;
  }[] = [
    {
      label: "Total",
      value: total.toString().padStart(2, "0"),
      icon: "tasks",
      color: "ivory",
    },
    {
      label: "Pending",
      value: pending.toString().padStart(2, "0"),
      icon: "clock",
      color: "peach",
    },
    {
      label: "Completed",
      value: completed.toString().padStart(2, "0"),
      icon: "check",
      color: "mint",
    },
    {
      label: "Completion rate",
      value: `${completionRate}%`,
      icon: "arrowUp",
      color: "lavender",
    },
  ];

  return (
    <>
      <div className="section-kicker">
        <span>At a glance</span>
        <span className="short-line" />
      </div>

      <section
        className="stats-grid"
        aria-label="Task statistics"
      >
        {cards.map((card, index) => (
          <div
            key={card.label}
            className={`stat-card ${card.color}`}
          >
            <div className="stat-top">
              <span>{card.label}</span>

              <Icon name={card.icon} />
            </div>

            <div className="stat-bottom">
              <strong>{card.value}</strong>

              <span className="stat-index">
                /0{index + 1}
              </span>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}