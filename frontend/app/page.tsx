import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-3">
      <h1 className="text-4xl font-bold">TaskFlow</h1>
      <h2 className="text-xl">Welcome to TaskFlow</h2>
      <Link href="/dashboard" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go to Dashboard
      </Link>
    </div>
  );
}
