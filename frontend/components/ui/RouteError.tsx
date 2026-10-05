"use client";
export default function RouteError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="empty-state">
      <h2>Something went wrong.</h2>
      <p>Please try loading your workspace again.</p>
      <button className="button dark" onClick={retry}>
        Try again
      </button>
    </div>
  );
}
