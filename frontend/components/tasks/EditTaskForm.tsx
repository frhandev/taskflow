"use client";

import Task from "@/types/Tasks/task";
import UpdateTaskRequest from "@/types/Tasks/UpdateTaskRequest";
import TaskForm from "./TaskForm";
import Icon from "../ui/Icon";
import Modal from "../ui/Modal";

type EditTaskFormProps = {
  task: Task;
  onSave: (request: UpdateTaskRequest) => Promise<void>;
  onCancel: () => void;
};

function EditTaskForm({
  task,
  onSave,
  onCancel,
}: EditTaskFormProps) {
  return (
    <Modal
      titleId="dialog-title"
      onClose={onCancel}
    >
      <div className="modal-top">
        <span className="tiny-label">Edit task</span>

        <button
          type="button"
          className="icon-button"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="close" />
        </button>
      </div>

      <h2 id="dialog-title">Give it a little polish.</h2>

      <p className="modal-sub">
        Small steps make big things happen.
      </p>

      <TaskForm
        task={task}
        onSave={onSave}
        onCancel={onCancel}
      />
    </Modal>
  );
}

export default EditTaskForm;