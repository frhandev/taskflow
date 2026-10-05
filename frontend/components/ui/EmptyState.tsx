"use client";
import Link from "next/link";
import Icon from "./Icon";
export default function EmptyState({
  today = false,
  onClear,
}: {
  today?: boolean;
  onClear?: () => void;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={today ? "coffee" : "inbox"} />
      </span>
      <h3>Nothing here. Yet.</h3>
      <p>Try a different filter, or give your next idea a place to live.</p>
      {today ? (
        <Link className="button yellow" href="/tasks/new">
          <Icon name="plus" />
          New task
        </Link>
      ) : (
        <button className="button" onClick={onClear}>
          <Icon name="close" />
          Clear filters
        </button>
      )}
    </div>
  );
}
