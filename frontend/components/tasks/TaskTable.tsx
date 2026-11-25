"use client";

import Link from "next/link";

import {
  Eye,
  Pencil,
  Trash2,
  ClipboardList,
  CalendarDays,
} from "lucide-react";

import type {
  Task,
  TaskStatus,
  TaskPriority,
} from "@/types/task.types";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// ==========================================
// STATUS STYLES
// ==========================================

export const statusStyles: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  TODO: {
    label: "To Do",
    className: `
      bg-amber-50 text-amber-700
      dark:bg-amber-500/15 dark:text-amber-300
    `,
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: `
      bg-blue-50 text-blue-700
      dark:bg-blue-500/15 dark:text-blue-300
    `,
  },
  COMPLETED: {
    label: "Completed",
    className: `
      bg-emerald-50 text-emerald-700
      dark:bg-emerald-500/15 dark:text-emerald-300
    `,
  },
};

// ==========================================
// PRIORITY STYLES
// ==========================================

export const priorityStyles: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  LOW: {
    label: "Low",
    className: `
      bg-emerald-50 text-emerald-700
      dark:bg-emerald-500/15 dark:text-emerald-300
    `,
  },
  MEDIUM: {
    label: "Medium",
    className: `
      bg-amber-50 text-amber-700
      dark:bg-amber-500/15 dark:text-amber-300
    `,
  },
  HIGH: {
    label: "High",
    className: `
      bg-red-50 text-red-700
      dark:bg-red-500/15 dark:text-red-300
    `,
  },
};

// ==========================================
// DATE FORMATTING
// ==========================================

export function formatTaskDate(
  value: string | null | undefined
) {
  if (!value) return "No due date";

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

const actionClass = `
  inline-flex h-9 w-9 items-center justify-center
  rounded-lg border border-slate-200
  text-slate-500 transition-colors
  dark:border-slate-700 dark:text-slate-400
`;

// ==========================================
// TASK TABLE
// ==========================================

export default function TaskTable({
  tasks,
  onEdit,
  onDelete,
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
        <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-400">
          <ClipboardList size={32} strokeWidth={1.6} />
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100">
          No tasks found
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Create a new task or change your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
        <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
          <tr>
            {[
              "Task Name",
              "Status",
              "Priority",
              "Due Date",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {tasks.map((task) => {
            const status = statusStyles[task.status];
            const priority = priorityStyles[task.priority];

            const overdue =
              task.isOverdue &&
              task.status !== "COMPLETED";

            return (
              <tr
                key={task.id}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40"
              >
                {/* Task information */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                      <ClipboardList size={19} />
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="block max-w-64 truncate text-sm font-semibold text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
                      >
                        {task.title}
                      </Link>

                      <p className="mt-1 max-w-64 truncate text-xs text-slate-500 dark:text-slate-400">
                        {task.description || "No description"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Status */}

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </td>

                {/* Priority */}

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${priority.className}`}
                  >
                    {priority.label}
                  </span>
                </td>

                {/* Due date */}

                <td className="px-5 py-4">
                  <div
                    className={`flex items-center gap-2 whitespace-nowrap text-sm ${
                      overdue
                        ? "text-red-600 dark:text-red-400"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <CalendarDays size={15} />

                    {formatTaskDate(task.dueDate)}
                  </div>

                  {overdue && (
                    <p className="mt-1 text-xs font-medium text-red-500 dark:text-red-400">
                      Overdue
                    </p>
                  )}
                </td>

                {/* Actions */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tasks/${task.id}`}
                      title="View task"
                      aria-label={`View ${task.title}`}
                      className={`${actionClass}
                        hover:border-indigo-200
                        hover:bg-indigo-50
                        hover:text-indigo-600
                        dark:hover:border-indigo-500/50
                        dark:hover:bg-indigo-500/10
                        dark:hover:text-indigo-400
                      `}
                    >
                      <Eye size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onEdit(task)}
                      title="Edit task"
                      aria-label={`Edit ${task.title}`}
                      className={`${actionClass}
                        hover:border-blue-200
                        hover:bg-blue-50
                        hover:text-blue-600
                        dark:hover:border-blue-500/50
                        dark:hover:bg-blue-500/10
                        dark:hover:text-blue-400
                      `}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(task)}
                      title="Delete task"
                      aria-label={`Delete ${task.title}`}
                      className={`${actionClass}
                        hover:border-red-200
                        hover:bg-red-50
                        hover:text-red-600
                        dark:hover:border-red-500/50
                        dark:hover:bg-red-500/10
                        dark:hover:text-red-400
                      `}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}