"use client";

import Link from "next/link";
import Icon, { IconName } from "../ui/Icon";
import AuthUser from "@/types/Auth/AuthUser";
import { useState } from "react";
import { logout } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils/errors";
import { useRouter } from "next/navigation";

const links: { page: string; href: string; icon: IconName }[] = [
  { page: "dashboard", href: "/dashboard", icon: "dashboard" },
  { page: "tasks", href: "/tasks", icon: "tasks" },
];

function Sidebar({
  pathname,
  open,
  onClose,
  user,
}: {
  pathname: string;
  open: boolean;
  onClose: () => void;
  user: AuthUser;
}) {
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      setLogoutError(getErrorMessage(error));
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <Link className="brand" href="/dashboard" onClick={onClose}>
        <span className="brand-mark">
          <Icon name="logo" />
        </span>
        <span>
          taskflow<span className="brand-dot">.</span>
        </span>
      </Link>
      <div className="workspace-label">
        <span className="tiny-label">{user.email}</span>
        <div className="workspace-choice">
          <Icon name="folder" />
          <span>{user.email}</span>
          <span className="workspace-dot" />
        </div>
      </div>
      <nav>
        {links.map(({ page, href, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`nav-link ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon name={icon} />
              <span>{page}</span>
              {page === "dashboard" && (
                <Icon name="arrow" className="nav-arrow" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="mini-note mb-10">
          <span className="note-star" aria-hidden="true">
            ✳
          </span>
          <strong>Less busy. More meaningful.</strong>
          <p>One thing at a time is a pretty good plan.</p>
          <div className="note-line" />
        </div>
        <div className="sidebar-user mb-10 ">
          <span className="tiny-label">Signed in as</span>

          <strong className="sidebar-user-email" title={user.email}>
            {user.email}
          </strong>

          {logoutError && (
            <p className="form-error" role="alert">
              {logoutError}
            </p>
          )}

          <button
            type="button"
            className="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out…" : "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
