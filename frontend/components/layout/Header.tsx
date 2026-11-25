"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Menu,
  Plus,
  CalendarDays,
  ChevronRight,
  House,
} from "lucide-react";

import ThemeToggle from "@/components/ui/ThemeToggle";

interface HeaderProps {
  mobileOpen: boolean;
  onOpenMobile: () => void;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ==========================================
// DYNAMIC BREADCRUMBS
// ==========================================

function getBreadcrumbs(
  pathname: string
): BreadcrumbItem[] {
  if (pathname.startsWith("/tasks/")) {
    return [
      {
        label: "Tasks",
        href: "/tasks",
      },
      {
        label: "Details",
      },
    ];
  }

  switch (pathname) {
    case "/":
      return [{ label: "Dashboard" }];

    case "/tasks":
      return [{ label: "Tasks" }];

    case "/kanban":
      return [{ label: "Kanban" }];

    case "/calendar":
      return [{ label: "Calendar" }];

    default:
      return [{ label: "Page" }];
  }
}

// ==========================================
// MAIN HEADER COMPONENT
// ==========================================

export default function Header({
  mobileOpen,
  onOpenMobile,
}: HeaderProps) {
  const pathname = usePathname();

  const [currentDate, setCurrentDate] =
    useState("");

  const breadcrumbs =
    getBreadcrumbs(pathname);

  // ==========================================
  // CURRENT DATE
  // ==========================================

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(
        new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date())
      );
    };

    updateDate();

    const interval = setInterval(
      updateDate,
      60_000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-16 shrink-0
        items-center justify-between
        gap-3
        border-b border-slate-200
        bg-white
        px-4 sm:px-6 lg:px-8

        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      {/* =====================================
          LEFT SIDE
      ===================================== */}

      <div className="flex min-w-0 items-center gap-3">

        {/* Mobile menu */}

        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="taskora-sidebar"
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-lg
            border border-slate-200
            text-slate-600
            transition-colors
            hover:bg-slate-100
            lg:hidden

            dark:border-slate-700
            dark:text-slate-300
            dark:hover:bg-slate-700
          "
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb navigation */}

        <nav
          aria-label="Breadcrumb"
          className="min-w-0"
        >
          <ol className="flex min-w-0 items-center gap-2 text-sm">

            {/* Home */}

            <li className="hidden shrink-0 sm:block">
              <Link
                href="/"
                aria-label="Home"
                title="Home"
                className="
                  flex items-center
                  text-slate-500
                  transition-colors
                  hover:text-indigo-600

                  dark:text-slate-400
                  dark:hover:text-indigo-400
                "
              >
                <House
                  size={18}
                  strokeWidth={1.8}
                />
              </Link>
            </li>

            <li
              aria-hidden="true"
              className="hidden shrink-0 sm:block"
            >
              <ChevronRight
                size={15}
                className="
                  text-slate-300
                  dark:text-slate-600
                "
              />
            </li>

            {/* Workspace */}

            <li className="hidden shrink-0 sm:block">
              <Link
                href="/"
                className="
                  font-medium
                  text-slate-500
                  transition-colors
                  hover:text-indigo-600

                  dark:text-slate-400
                  dark:hover:text-indigo-400
                "
              >
                Workspace
              </Link>
            </li>

            {/* Dynamic breadcrumbs */}

            {breadcrumbs.map((item, index) => {
              const isLast =
                index === breadcrumbs.length - 1;

              return (
                <li
                  key={item.label}
                  className="
                    flex min-w-0
                    items-center gap-2
                  "
                >
                  <ChevronRight
                    size={15}
                    aria-hidden="true"
                    className={`
                      shrink-0
                      text-slate-300
                      dark:text-slate-600

                      ${
                        index === 0
                          ? "hidden sm:block"
                          : ""
                      }
                    `}
                  />

                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="
                        truncate font-medium
                        text-slate-500
                        transition-colors
                        hover:text-indigo-600

                        dark:text-slate-400
                        dark:hover:text-indigo-400
                      "
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={
                        isLast
                          ? "page"
                          : undefined
                      }
                      className="
                        truncate font-semibold
                        text-slate-900
                        dark:text-slate-100
                      "
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* =====================================
          RIGHT SIDE
      ===================================== */}

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">

        {/* Current date */}

        <div
          className="
            hidden items-center gap-2
            whitespace-nowrap
            text-sm font-medium
            text-slate-500
            xl:flex

            dark:text-slate-400
          "
        >
          <CalendarDays
            size={18}
            strokeWidth={1.8}
          />

          <span>{currentDate}</span>
        </div>

        {/* Vertical separator */}

        <div
          aria-hidden="true"
          className="
            hidden h-7 w-px
            bg-slate-200
            xl:block

            dark:bg-slate-700
          "
        />

        {/* Theme toggle */}

        <ThemeToggle />

        {/* Global New Task button */}

        <Link
          href="/tasks?create=true"
          scroll={false}
          aria-label="Create new task"
          className="
            inline-flex h-10
            items-center justify-center
            gap-2 rounded-lg
            bg-indigo-600
            px-3 sm:px-5
            text-sm font-semibold
            text-white
            transition-colors
            hover:bg-indigo-700
            active:bg-indigo-800

            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-indigo-600
          "
        >
          <Plus
            size={19}
            strokeWidth={2.3}
          />

          <span className="hidden sm:inline">
            New Task
          </span>

          <span className="sm:hidden">
            New
          </span>
        </Link>
      </div>
    </header>
  );
}