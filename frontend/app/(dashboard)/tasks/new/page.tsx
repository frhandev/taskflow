import TaskForm from "@/components/tasks/TaskForm";

function NewTaskPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-3">
      <h1 className="text-4xl font-bold">New Task Page</h1>
      <TaskForm />
    </div>
  );
}

export default NewTaskPage;