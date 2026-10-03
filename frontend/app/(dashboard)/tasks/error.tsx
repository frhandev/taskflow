"use client";

function TaskError({
  reset,
}: {
  reset: () => void;
}) {

    return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Unable to load tasks</h1>

      <p className="text-gray-600">
        There was a problem loading tasks from the server.
      </p>

      <button
        onClick={() => reset()}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );
}

export default TaskError;
