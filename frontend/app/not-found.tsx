import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty-state">
      <h1>A little off track.</h1>
      <p>That page does not exist.</p>
      <Link href="/dashboard" className="button dark">
        Back to TaskFlow
      </Link>
    </main>
  );
}
