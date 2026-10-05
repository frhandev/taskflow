"use client";

import { useEffect } from "react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="empty-state">
      <h2>Something went wrong.</h2>

      <p>Please try loading your workspace again.</p>

      <button className="button dark" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
