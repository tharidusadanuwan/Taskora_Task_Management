import Link from "next/link";

import {
  ArrowRight,
  ChevronRight,
  ClipboardList,
  Plus,
  CalendarDays,
} from "lucide-react";

import type {
  Task,
  TaskStatus,
  TaskPriority,
} from "@/types/task.types";

interface RecentTasksProps {
  tasks: Task[];
}

// ==========================================
// STATUS CONFIGURATION
// ==========================================

const STATUS_STYLES: Record<
  TaskStatus,
  {
    label: string;
    className: string;
    dot: string;
  }
> = {
  TODO: {
    label: "To Do",

    className: `
      bg-amber-50 text-amber-700
      dark:bg-amber-500/15
      dark:text-amber-300
    `,

    dot: `
      bg-amber-500
      dark:bg-amber-400
    `,
  },

  IN_PROGRESS: {
    label: "In Progress",

    className: `
      bg-blue-50 text-blue-700
      dark:bg-blue-500/15
      dark:text-blue-300
    `,

    dot: `
      bg-blue-500
      dark:bg-blue-400
    `,
  },

  COMPLETED: {
    label: "Completed",

    className: `
      bg-emerald-50 text-emerald-700
      dark:bg-emerald-500/15
      dark:text-emerald-300
    `,

    dot: `
      bg-emerald-500
      dark:bg-emerald-400
    `,
  },
};

// ==========================================
// PRIORITY CONFIGURATION
// ==========================================

const PRIORITY_STYLES: Record<
  TaskPriority,
  {
    label: string;
    className: string;
    dot: string;
  }
> = {
  LOW: {
    label: "Low",

    className: `
      bg-emerald-50 text-emerald-700
      dark:bg-emerald-500/15
      dark:text-emerald-300
    `,

    dot: `
      bg-emerald-500
      dark:bg-emerald-400
    `,
  },

  MEDIUM: {
    label: "Medium",

    className: `
      bg-amber-50 text-amber-700
      dark:bg-amber-500/15
      dark:text-amber-300
    `,

    dot: `
      bg-amber-500
      dark:bg-amber-400
    `,
  },

  HIGH: {
    label: "High",

    className: `
      bg-red-50 text-red-700
      dark:bg-red-500/15
      dark:text-red-300
    `,

    dot: `
      bg-red-500
      dark:bg-red-400
    `,
  },
};

// ==========================================
// DATE FORMATTING
// ==========================================

function formatDate(
  value: string | null | undefined
): string {
  if (!value) {
    return "No due date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

// ==========================================
// RECENT TASKS COMPONENT
// ==========================================

export default function RecentTasks({
  tasks,
}: RecentTasksProps) {
  const recentTasks = tasks.slice(0, 5);

  return (
    <section
      className="
        min-w-0 overflow-hidden
        rounded-2xl border
        border-slate-200 bg-white

        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      {/* =====================================
          SECTION HEADER
      ===================================== */}

      <div
        className="
          flex flex-wrap items-center
          justify-between gap-4
          p-5 sm:p-6
        "
      >
        <div>
          <h2
            className="
              text-lg font-bold text-slate-900
              dark:text-slate-100
            "
          >
            Recent Tasks
          </h2>

          <p
            className="
              mt-1 text-sm text-slate-500
              dark:text-slate-400
            "
          >
            Your most recently created tasks
          </p>
        </div>

        <Link
          href="/tasks"
          className="
            inline-flex items-center gap-2
            rounded-lg border
            border-slate-200
            px-4 py-2.5
            text-sm font-semibold
            text-slate-700
            transition-colors
            hover:border-indigo-200
            hover:bg-indigo-50
            hover:text-indigo-600

            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-300
            dark:hover:border-indigo-500/50
            dark:hover:bg-indigo-500/10
            dark:hover:text-indigo-400
          "
        >
          View All Tasks

          <ArrowRight size={16} />
        </Link>
      </div>

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {recentTasks.length === 0 ? (
        <div
          className="
            flex min-h-72 flex-col
            items-center justify-center
            border-t border-slate-100
            px-6 py-10 text-center

            dark:border-slate-700
          "
        >
          <div
            className="
              flex h-16 w-16
              items-center justify-center
              rounded-2xl bg-indigo-50
              text-indigo-500

              dark:bg-indigo-500/15
              dark:text-indigo-400
            "
          >
            <ClipboardList
              size={30}
              strokeWidth={1.6}
            />
          </div>

          <h3
            className="
              mt-5 text-lg font-bold
              text-slate-900

              dark:text-slate-100
            "
          >
            No tasks yet
          </h3>

          <p
            className="
              mt-2 max-w-sm
              text-sm leading-relaxed
              text-slate-500

              dark:text-slate-400
            "
          >
            Create your first task to start
            organizing your work and tracking
            your productivity.
          </p>

          <Link
            href="/tasks?create=true"
            className="
              mt-6 inline-flex
              items-center justify-center
              gap-2 rounded-lg
              bg-indigo-600 px-5 py-3
              text-sm font-semibold
              text-white transition-colors
              hover:bg-indigo-700

              dark:bg-indigo-600
              dark:hover:bg-indigo-700
            "
          >
            <Plus size={18} />

            Create First Task
          </Link>
        </div>
      ) : (
        <>
          {/* =====================================
              TASK TABLE
          ===================================== */}

          <div className="overflow-x-auto">
            <table
              className="
                w-full min-w-[760px]
                text-left
              "
            >
              {/* Table header */}

              <thead
                className="
                  border-y border-slate-200
                  bg-slate-50

                  dark:border-slate-700
                  dark:bg-slate-900/50
                "
              >
                <tr>
                  <th
                    scope="col"
                    className="
                      px-6 py-3.5
                      text-xs font-semibold
                      uppercase tracking-wide
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Task Name
                  </th>

                  <th
                    scope="col"
                    className="
                      px-4 py-3.5
                      text-xs font-semibold
                      uppercase tracking-wide
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Status
                  </th>

                  <th
                    scope="col"
                    className="
                      px-4 py-3.5
                      text-xs font-semibold
                      uppercase tracking-wide
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Priority
                  </th>

                  <th
                    scope="col"
                    className="
                      px-4 py-3.5
                      text-xs font-semibold
                      uppercase tracking-wide
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Due Date
                  </th>

                  <th
                    scope="col"
                    className="
                      px-6 py-3.5
                      text-right text-xs
                      font-semibold uppercase
                      tracking-wide text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Action
                  </th>
                </tr>
              </thead>

              {/* =====================================
                  TABLE BODY
              ===================================== */}

              <tbody
                className="
                  divide-y divide-slate-100
                  dark:divide-slate-700
                "
              >
                {recentTasks.map((task) => {
                  const status =
                    STATUS_STYLES[task.status];

                  const priority =
                    PRIORITY_STYLES[task.priority];

                  const overdue =
                    task.isOverdue &&
                    task.status !== "COMPLETED";

                  return (
                    <tr
                      key={task.id}
                      className="
                        transition-colors
                        hover:bg-slate-50

                        dark:hover:bg-slate-700/40
                      "
                    >
                      {/* =====================================
                          TASK TITLE
                      ===================================== */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">

                          {/* Task icon */}

                          <div
                            className="
                              flex h-10 w-10
                              shrink-0 items-center
                              justify-center
                              rounded-lg
                              bg-indigo-50
                              text-indigo-600

                              dark:bg-indigo-500/15
                              dark:text-indigo-400
                            "
                          >
                            <ClipboardList
                              size={19}
                              strokeWidth={1.8}
                            />
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/tasks/${task.id}`}
                              className="
                                block max-w-60
                                truncate text-sm
                                font-semibold
                                text-slate-900
                                hover:text-indigo-600

                                dark:text-slate-100
                                dark:hover:text-indigo-400
                              "
                            >
                              {task.title}
                            </Link>

                            <p
                              className="
                                mt-1 max-w-60
                                truncate text-xs
                                text-slate-500

                                dark:text-slate-400
                              "
                            >
                              {task.description ||
                                "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* =====================================
                          STATUS
                      ===================================== */}

                      <td className="px-4 py-4">
                        <span
                          className={`
                            inline-flex
                            items-center gap-1.5
                            whitespace-nowrap
                            rounded-full
                            px-2.5 py-1.5
                            text-xs font-semibold
                            ${status.className}
                          `}
                        >
                          <span
                            aria-hidden="true"
                            className={`
                              h-1.5 w-1.5
                              rounded-full
                              ${status.dot}
                            `}
                          />

                          {status.label}
                        </span>
                      </td>

                      {/* =====================================
                          PRIORITY
                      ===================================== */}

                      <td className="px-4 py-4">
                        <span
                          className={`
                            inline-flex
                            items-center gap-1.5
                            rounded-full
                            px-2.5 py-1.5
                            text-xs font-semibold
                            ${priority.className}
                          `}
                        >
                          <span
                            aria-hidden="true"
                            className={`
                              h-1.5 w-1.5
                              rounded-full
                              ${priority.dot}
                            `}
                          />

                          {priority.label}
                        </span>
                      </td>

                      {/* =====================================
                          DUE DATE
                      ===================================== */}

                      <td className="px-4 py-4">
                        <div
                          className={`
                            flex items-center gap-2
                            whitespace-nowrap
                            text-sm

                            ${
                              overdue
                                ? `
                                  font-medium
                                  text-red-600
                                  dark:text-red-400
                                `
                                : `
                                  text-slate-600
                                  dark:text-slate-300
                                `
                            }
                          `}
                        >
                          <CalendarDays
                            size={15}
                            className="shrink-0"
                          />

                          {formatDate(task.dueDate)}
                        </div>

                        {overdue && (
                          <p
                            className="
                              mt-1 text-xs
                              font-medium text-red-500

                              dark:text-red-400
                            "
                          >
                            Overdue
                          </p>
                        )}
                      </td>

                      {/* =====================================
                          DETAILS BUTTON
                      ===================================== */}

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/tasks/${task.id}`}
                          aria-label={`View ${task.title}`}
                          title="View task details"
                          className="
                            inline-flex h-9 w-9
                            items-center justify-center
                            rounded-lg border
                            border-slate-200
                            text-slate-500
                            transition-colors
                            hover:border-indigo-200
                            hover:bg-indigo-50
                            hover:text-indigo-600

                            dark:border-slate-700
                            dark:text-slate-400
                            dark:hover:border-indigo-500/50
                            dark:hover:bg-indigo-500/10
                            dark:hover:text-indigo-400
                          "
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* =====================================
              TABLE FOOTER
          ===================================== */}

          <div
            className="
              flex items-center justify-between
              gap-3 border-t border-slate-200
              px-6 py-4

              dark:border-slate-700
            "
          >
            <p
              className="
                text-xs text-slate-500
                dark:text-slate-400
              "
            >
              Showing {recentTasks.length} recent{" "}
              {recentTasks.length === 1
                ? "task"
                : "tasks"}
            </p>

            <Link
              href="/tasks"
              className="
                text-xs font-semibold
                text-indigo-600
                hover:text-indigo-700

                dark:text-indigo-400
                dark:hover:text-indigo-300
              "
            >
              Manage all tasks
            </Link>
          </div>
        </>
      )}
    </section>
  );
}