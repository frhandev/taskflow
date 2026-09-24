import { mockTasks } from "@/lib/data/tasks";

function DashboardPage() {

  const tasks = mockTasks; 

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const completedPercentage = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-4 text-lg text-gray-600">
        Welcome back to TaskFlow.
      </p>
      <div className="mt-4 w-full max-w-md flex flex-col md:flex-row gap-4">
        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl mb-4 text-center">Total</h2>
          <h2 className="text-xl text-center">{tasks.length}</h2>
        </div>

        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl mb-4 text-center">Pending</h2>
          <h2 className="text-xl text-center">{pendingTasks.length}</h2>
        </div>

        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl mb-4 text-center">Completed</h2>
          <h2 className="text-xl text-center">{completedTasks.length}</h2>
        </div>

      </div>
        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <h2 className="text-xl mb-4 text-center">Completion Rate</h2>
          <h2 className="text-xl text-center">{completedPercentage.toFixed(2)}%</h2>
        </div>
    </div>
  );
}

export default DashboardPage;