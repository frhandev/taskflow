"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Icon from "@/components/ui/Icon";
import AuthUser from "@/types/Auth/AuthUser";
export default function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AuthUser;
}) {
  const pathname = usePathname(),
    router = useRouter();

  const [open, setOpen] = useState(false);
  const page = pathname.startsWith("/tasks") ? "tasks" : "dashboard";

  useEffect(() => {
    document.title = `TaskFlow — ${page}`;
  }, [page]);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        document.querySelector("dialog[open]") ||
        (event.target as HTMLElement)?.closest(
          'input,textarea,select,[contenteditable="true"]',
        )
      )
        return;
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        router.push("/tasks/new");
      }
      if (event.key === "/") {
        event.preventDefault();
        sessionStorage.setItem("taskflow-focus-search", "1");
        router.push("/tasks");
        if (pathname === "/tasks")
          document.querySelector<HTMLInputElement>("#task-search")?.focus();
      }
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [router, pathname]);
  return (
    <div className="workspace-shell">
      <Sidebar
        pathname={pathname}
        open={open}
        onClose={() => setOpen(false)}
        user={user}
      />
      {open && (
        <button
          className="sidebar-scrim"
          onClick={() => setOpen(false)}
          aria-label="close"
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="menu"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
            >
              <Icon name="menu" />
            </button>
            <span className="crumb-home">Workspace</span>
            <span className="crumb-slash">/</span>
            <strong>{page}</strong>
          </div>
          <div className="top-actions">
            <span className="top-date">
              <Icon name="calendar" />
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
          <footer className="page-footer">
            <span>A little more focus. A little more flow.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
