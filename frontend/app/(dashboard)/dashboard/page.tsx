
function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-4 text-lg text-gray-600">
        Welcome to the dashboard page!
      </p>
      <div className="mt-4 w-full max-w-md flex flex-row gap-4">
        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl mb-4 text-center">Total</h2>
          <h2 className="text-xl text-center">0</h2>
        </div>
        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl mb-4 text-center">Pending</h2>
          <h2 className="text-xl text-center">0</h2>
        </div>
        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl mb-4 text-center">Completed</h2>
          <h2 className="text-xl text-center">0</h2>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;