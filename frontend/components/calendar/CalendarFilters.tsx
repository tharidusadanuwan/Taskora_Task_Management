"use client";

import {
  Search,
  RotateCcw,
} from "lucide-react";

import Button from "@/components/ui/Button";

import {
  defaultCalendarFilters,
} from "@/types/calendar.types";

import type {
  CalendarFilters as CalendarFilterValues,
} from "@/types/calendar.types";

interface CalendarFiltersProps {
  filters: CalendarFilterValues;
  onChange: (filters: CalendarFilterValues) => void;
  totalTasks: number;
  filteredTaskCount: number;
}

export default function CalendarFilters({
  filters,
  onChange,
  totalTasks,
  filteredTaskCount,
}: CalendarFiltersProps) {
  function updateFilter<
    K extends keyof CalendarFilterValues
  >(
    key: K,
    value: CalendarFilterValues[K]
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  const hasFilters =
    filters.search !== "" ||
    filters.status !== "ALL" ||
    filters.priority !== "ALL" ||
    !filters.showCompleted ||
    filters.showOverdueOnly;

  const inputClass = `
    h-11 w-full rounded-lg
    border border-slate-200
    bg-white px-3.5
    text-sm text-slate-700
    outline-none transition-colors
    placeholder:text-slate-400
    focus:border-indigo-500
    focus:ring-2 focus:ring-indigo-100
    dark:border-slate-700
    dark:bg-slate-900
    dark:text-slate-200
    dark:placeholder:text-slate-500
    dark:focus:ring-indigo-500/20
    dark:scheme-dark
  `;

  const checkboxClass = `
    h-4 w-4 rounded
    accent-indigo-600
    dark:accent-indigo-500
  `;

  return (
    <section
      className="
        space-y-4 rounded-xl
        border border-slate-200
        bg-white p-4
        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      <div
        className="
          grid grid-cols-1 gap-3
          sm:grid-cols-2
          xl:grid-cols-[2fr_1fr_1fr_auto]
        "
      >
        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="
              pointer-events-none absolute
              left-3.5 top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="search"
            aria-label="Search calendar tasks"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(event) =>
              updateFilter(
                "search",
                event.target.value
              )
            }
            className={`${inputClass} pl-11`}
          />
        </div>

        {/* Status filter */}

        <select
          aria-label="Filter by status"
          value={filters.status}
          onChange={(event) =>
            updateFilter(
              "status",
              event.target.value as
                CalendarFilterValues["status"]
            )
          }
          className={inputClass}
        >
          <option value="ALL">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">
            In Progress
          </option>
          <option value="COMPLETED">
            Completed
          </option>
        </select>

        {/* Priority filter */}

        <select
          aria-label="Filter by priority"
          value={filters.priority}
          onChange={(event) =>
            updateFilter(
              "priority",
              event.target.value as
                CalendarFilterValues["priority"]
            )
          }
          className={inputClass}
        >
          <option value="ALL">
            All Priorities
          </option>
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">
            Medium Priority
          </option>
          <option value="HIGH">
            High Priority
          </option>
        </select>

        <Button
          variant="outline"
          disabled={!hasFilters}
          onClick={() =>
            onChange({ ...defaultCalendarFilters })
          }
          leftIcon={<RotateCcw size={16} />}
        >
          Reset
        </Button>
      </div>

      {/* Additional filters */}

      <div
        className="
          flex flex-wrap items-center
          justify-between gap-4
          border-t border-slate-100 pt-4
          dark:border-slate-700
        "
      >
        <div className="flex flex-wrap items-center gap-5">
          <label
            className="
              flex cursor-pointer items-center
              gap-2 text-sm text-slate-600
              dark:text-slate-300
            "
          >
            <input
              type="checkbox"
              checked={filters.showCompleted}
              onChange={(event) =>
                updateFilter(
                  "showCompleted",
                  event.target.checked
                )
              }
              className={checkboxClass}
            />

            Show completed
          </label>

          <label
            className="
              flex cursor-pointer items-center
              gap-2 text-sm text-slate-600
              dark:text-slate-300
            "
          >
            <input
              type="checkbox"
              checked={filters.showOverdueOnly}
              onChange={(event) =>
                updateFilter(
                  "showOverdueOnly",
                  event.target.checked
                )
              }
              className={checkboxClass}
            />

            Overdue only
          </label>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {filteredTaskCount}
          </span>
          {" "}of{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {totalTasks}
          </span>
          {" "}tasks
        </p>
      </div>
    </section>
  );
}