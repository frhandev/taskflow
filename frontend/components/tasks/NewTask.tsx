"use client";
import TaskForm from "./TaskForm";
import Icon from "@/components/ui/Icon";
export default function NewTask({ initialDate }: { initialDate?: string }) {
  return (
    <>
      <section className="intro">
        <div>
          <p className="eyebrow">
            <Icon name="plus" />
            New task
          </p>
          <h1>Put an idea in motion.</h1>
          <p className="intro-sub">Small steps make big things happen.</p>
        </div>
        <span className="settings-star" aria-hidden="true">
          ✳
        </span>
      </section>
      <section className="panel new-task-panel">
        <TaskForm initialDate={initialDate} />
      </section>
    </>
  );
}
