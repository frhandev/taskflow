function TasksLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center py-2">
      <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
      <div className="mt-3 h-5 w-64 animate-pulse rounded bg-gray-200" />

      <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded bg-gray-200"
          />
        ))}
      </div>
    </div>
  );
}

export default TasksLoading;
