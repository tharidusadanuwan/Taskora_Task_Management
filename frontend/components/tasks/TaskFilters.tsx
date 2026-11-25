"use client";

import { Search, RotateCcw } from "lucide-react";

export interface TaskFilterValues {
  search: string;
  status: "" | "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "" | "LOW" | "MEDIUM" | "HIGH";
  sortBy: "createdAt" | "dueDate";
  sortOrder: "asc" | "desc";
}

export const defaultFilters: TaskFilterValues = {
  search: "",
  status: "",
  priority: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

interface TaskFiltersProps {
  filters: TaskFilterValues;
  onChange: (filters: TaskFilterValues) => void;
}

const inputClass = `
  h-11 w-full rounded-lg border border-slate-200
  bg-white px-3 text-sm text-slate-700
  outline-none transition-colors
  placeholder:text-slate-400
  focus:border-indigo-500 focus:ring-2
  focus:ring-indigo-100

  dark:border-slate-700
  dark:bg-slate-900
  dark:text-slate-200
  dark:placeholder:text-slate-500
  dark:focus:border-indigo-500
  dark:focus:ring-indigo-500/20
  dark:scheme-dark
`;

export default function TaskFilters({
  filters,
  onChange,
}: TaskFiltersProps) {
  function updateFilter<K extends keyof TaskFilterValues>(
    key: K,
    value: TaskFilterValues[K]
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1.4fr_auto]">

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-3.5 text-slate-400 dark:text-slate-500"
          />

          <input
            type="search"
            aria-label="Search tasks"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
            className={`${inputClass} pl-10`}
          />
        </div>

        {/* Status */}

        <select
          aria-label="Filter by status"
          value={filters.status}
          onChange={(event) =>
            updateFilter(
              "status",
              event.target.value as TaskFilterValues["status"]
            )
          }
          className={inputClass}
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Priority */}

        <select
          aria-label="Filter by priority"
          value={filters.priority}
          onChange={(event) =>
            updateFilter(
              "priority",
              event.target.value as TaskFilterValues["priority"]
            )
          }
          className={inputClass}
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        {/* Sorting */}

        <select
          aria-label="Sort tasks"
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onChange={(event) => {
            const [sortBy, sortOrder] =
              event.target.value.split(":");

            onChange({
              ...filters,
              sortBy: sortBy as TaskFilterValues["sortBy"],
              sortOrder: sortOrder as TaskFilterValues["sortOrder"],
            });
          }}
          className={inputClass}
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="dueDate:asc">Due Date: Earliest</option>
          <option value="dueDate:desc">Due Date: Latest</option>
        </select>

        {/* Reset */}

        <button
          type="button"
          onClick={() => onChange({ ...defaultFilters })}
          className="
            inline-flex h-11 items-center justify-center
            gap-2 rounded-lg border border-slate-200
            px-4 text-sm font-medium text-slate-600
            transition-colors hover:bg-slate-50
            hover:text-indigo-600

            dark:border-slate-700
            dark:text-slate-300
            dark:hover:bg-slate-700
            dark:hover:text-indigo-400
          "
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </section>
  );
}