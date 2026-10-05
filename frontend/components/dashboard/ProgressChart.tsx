"use client";

import Link from "next/link";
import { CSSProperties } from "react";

import Task from "@/types/Tasks/task";
import Icon from "@/components/ui/Icon";

type ProgressProps = {
  tasks: Task[];
};

function getLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function dayOffset(offset: number): string {
  const date = new Date();

  date.setDate(date.getDate() + offset);

  return getLocalDate(date);
}

export function CompletionRing({
  tasks,
}: ProgressProps) {
  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const completionRate =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  return (
    <section className="panel progress-panel">
      <span className="eyebrow">
        Progress
      </span>

      <h2>Keep the momentum going.</h2>

      <div
        className="progress-ring"
        style={
          {
            "--progress": `${completionRate}%`,
          } as CSSProperties
        }
      >
        <div>
          <strong>
            {completionRate}
            <span>%</span>
          </strong>

          <Icon name="spark" />
        </div>
      </div>

      <p className="progress-fraction">
        <strong>
          {completed} / {total}
        </strong>{" "}
        tasks completed
      </p>

      <p className="progress-note">
        Every finished task moves you a little closer.
      </p>

      <Link
        className="button"
        href="/tasks"
      >
        Open tasks
        <Icon name="arrow" />
      </Link>
    </section>
  );
}

export default function ProgressChart({
  tasks,
}: ProgressProps) {
  const days = Array.from(
    { length: 7 },
    (_, index) => {
      const date = dayOffset(index - 6);

      const count = tasks.filter(
        (task) =>
          getLocalDate(task.dueDate) === date,
      ).length;

      const name = new Date(
        `${date}T12:00:00`,
      ).toLocaleDateString("en-US", {
        weekday: "short",
      });

      return {
        date,
        count,
        name,
      };
    },
  );

  const max = Math.max(
    3,
    ...days.map((day) => day.count),
  );

  const weeklyTotal = days.reduce(
    (sum, day) => sum + day.count,
    0,
  );

  return (
    <section className="panel weekly-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">
            Weekly overview
          </span>

          <h2>This week</h2>

          <p className="muted">
            Tasks scheduled by due date over the last seven days.
          </p>
        </div>

        <span className="week-total">
          <Icon name="spark" />

          <strong>{weeklyTotal}</strong>

          <span>scheduled</span>
        </span>
      </div>

      <div
        className="week-chart"
        role="img"
        aria-label={`Weekly tasks: ${days
          .map(
            (day) =>
              `${day.name} ${day.count}`,
          )
          .join(", ")}`}
      >
        {days.map((day, index) => (
          <div
            className="chart-column"
            key={day.date}
          >
            <span className="chart-value">
              {day.count}
            </span>

            <div className="bar-track">
              <div
                className={`chart-bar ${
                  index === 6
                    ? "today-bar"
                    : ""
                }`}
                style={{
                  height: `${Math.max(
                    3,
                    (day.count / max) * 100,
                  )}%`,
                }}
              />
            </div>

            <span
              className={`chart-label ${
                index === 6
                  ? "today-label"
                  : ""
              }`}
            >
              {index === 6
                ? "Today"
                : day.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}