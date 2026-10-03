function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center py-2">
      <div className="h-10 w-48 animate-pulse rounded bg-gray-200" />

      <div className="mt-4 h-6 w-56 animate-pulse rounded bg-gray-200" />

      <div className="mt-8 flex w-full max-w-md gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-32 flex-1 animate-pulse rounded bg-gray-200"
          />
        ))}
      </div>

      <div className="mt-4 h-32 w-full max-w-md animate-pulse rounded bg-gray-200" />
    </div>
  );
}

export default DashboardLoading;
