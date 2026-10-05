import Link from "next/link";
import Icon, { IconName } from "../ui/Icon";

const links: { page: string; href: string; icon: IconName }[] = [
  { page: "dashboard", href: "/dashboard", icon: "dashboard" },
  { page: "tasks", href: "/tasks", icon: "tasks" },
];

function Sidebar({
  pathname,
  open,
  onClose,
}: {
  pathname: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      className={`sidebar ${open ? "is-open" : ""}`}
    >
      <Link className="brand" href="/dashboard" onClick={onClose}>
        <span className="brand-mark">
          <Icon name="logo" />
        </span>
        <span>
          taskflow<span className="brand-dot">.</span>
        </span>
      </Link>
      {/* <div className="workspace-label">
        <span className="tiny-label">{t("workspace")}</span>
        <div className="workspace-choice">
          <Icon name="folder" />
          <span>{profile.workspace}</span>
          <span className="workspace-dot" />
        </div>
      </div> */}
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
              <span>{(page)}</span>
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
        {/* <Link className="profile" href="/settings" onClick={onClose}>
          <span className="avatar">
            Alex
          </span>
          <span>
            <strong>Alex</strong>
            <small>Local Mode</small>
          </span>
          <Icon name="settings" />
        </Link> */}
      </div>
    </aside>
  );
}

export default Sidebar;
