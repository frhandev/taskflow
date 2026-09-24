import Link from "next/link";

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4 flex flex-col fixed">
      <Link href="/" className="text-4xl font-bold">
        TaskFlow
      </Link>
      <div className="mt-8 flex flex-col space-y-2">
        <Link href="/dashboard" className="hover:bg-gray-600 p-2 rounded">
          Dashboard
        </Link>
        <Link href="/tasks" className="hover:bg-gray-600 p-2 rounded">
          Tasks
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
