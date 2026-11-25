"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ListTodo,
  Kanban,
  CalendarDays,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  ChevronRight,
  Layers3,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

// ==========================================
// NAVIGATION ITEMS
// ==========================================

const navigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "All Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    label: "Kanban Board",
    href: "/kanban",
    icon: Kanban,
  },
  {
    label: "Task Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
];

// ==========================================
// MAIN SIDEBAR COMPONENT
// ==========================================

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <>
      {/* =====================================
          MOBILE BACKDROP
      ===================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onCloseMobile}
          className="
            fixed inset-0 z-40
            bg-slate-950/50
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        id="taskora-sidebar"
        className={`
          fixed left-0 top-0 z-50
          flex h-dvh w-64 flex-col
          bg-[#172238] text-white
          transition-[width,transform]
          duration-300 ease-in-out

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0

          ${
            collapsed
              ? "lg:w-20"
              : "lg:w-64"
          }
        `}
      >
        {/* =====================================
            BRAND LOGO
        ===================================== */}

        <div
          className={`
            flex h-20 shrink-0
            items-center gap-3
            border-b border-white/10
            px-5

            ${
              collapsed
                ? "lg:justify-center lg:px-0"
                : ""
            }
          `}
        >
          <Link
            href="/"
            onClick={onCloseMobile}
            aria-label="Taskora dashboard"
            className="flex min-w-0 items-center gap-3"
          >
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl bg-indigo-600
              "
            >
              <Check
                size={25}
                strokeWidth={3}
              />
            </div>

            <div
              className={`
                min-w-0
                ${collapsed ? "lg:hidden" : ""}
              `}
            >
              <h1
                className="
                  text-xl font-bold
                  tracking-tight
                "
              >
                Taskora
              </h1>

              <p
                className="
                  mt-0.5 whitespace-nowrap
                  text-[9px] font-medium
                  uppercase tracking-widest
                  text-slate-400
                "
              >
                Task Management
              </p>
            </div>
          </Link>

          {/* Mobile close button */}

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="
              ml-auto rounded-lg p-2
              text-slate-400
              transition-colors
              hover:bg-white/10
              hover:text-white
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <div className="flex-1 overflow-y-auto px-3 py-7">
          <p
            className={`
              mb-4 px-3
              text-[11px] font-semibold
              uppercase tracking-widest
              text-slate-500

              ${collapsed ? "lg:hidden" : ""}
            `}
          >
            Workspace
          </p>

          <nav
            aria-label="Main navigation"
            className="space-y-2"
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={
                    active ? "page" : undefined
                  }
                  className={`
                    group relative
                    flex min-h-12
                    items-center gap-3
                    rounded-xl px-3 py-3
                    text-sm font-medium
                    transition-all duration-200

                    ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }

                    ${
                      collapsed
                        ? "lg:justify-center lg:px-0"
                        : ""
                    }
                  `}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />

                  <span
                    className={`
                      flex-1 whitespace-nowrap
                      ${collapsed ? "lg:hidden" : ""}
                    `}
                  >
                    {item.label}
                  </span>

                  {active && (
                    <ChevronRight
                      size={16}
                      className={`
                        shrink-0 text-indigo-200
                        ${collapsed ? "lg:hidden" : ""}
                      `}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* =====================================
            WORKSPACE INFORMATION
        ===================================== */}

        <div className="border-t border-white/10 p-3">
          <div
            className={`
              flex items-center gap-3
              rounded-xl bg-white/5 p-3

              ${
                collapsed
                  ? "lg:justify-center lg:p-2"
                  : ""
              }
            `}
          >
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-lg bg-indigo-500/15
                text-indigo-300
              "
            >
              <Layers3 size={21} />
            </div>

            <div
              className={`
                min-w-0 flex-1
                ${collapsed ? "lg:hidden" : ""}
              `}
            >
              <p className="truncate text-sm font-semibold">
                My Workspace
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Personal workspace
              </p>
            </div>
          </div>
        </div>

        {/* =====================================
            DESKTOP COLLAPSE BUTTON
        ===================================== */}

        <div className="hidden border-t border-white/10 p-3 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            title={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            aria-expanded={!collapsed}
            aria-controls="taskora-sidebar"
            className={`
              flex w-full items-center
              gap-3 rounded-lg
              px-3 py-3 text-sm
              text-slate-400
              transition-colors
              hover:bg-white/5
              hover:text-white

              ${collapsed ? "justify-center px-0" : ""}
            `}
          >
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <>
                <PanelLeftClose size={20} />

                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}