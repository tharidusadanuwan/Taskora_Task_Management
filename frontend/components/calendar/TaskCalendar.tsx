"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  CalendarDays,
  CircleAlert,
} from "lucide-react";

import { toast } from "sonner";

import type { EventDropArg } from "./CalendarView";

// ==========================================
// CALENDAR COMPONENTS
// ==========================================

import CalendarHeader from "./CalendarHeader";
import CalendarStats from "./CalendarStats";
import CalendarFilters from "./CalendarFilters";
import CalendarView from "./CalendarView";
import CalendarTaskModal from "./CalendarTaskModal";

// ==========================================
// REUSABLE UI COMPONENTS
// ==========================================

import Loading from "@/components/ui/Loading";
import ErrorState from "@/components/ui/ErrorState";

// ==========================================
// HOOKS
// ==========================================

import {
  useCalendar,
  useCreateCalendarTask,
  useRescheduleCalendarTask,
} from "@/hooks/useCalendar";

// ==========================================
// TYPES
// ==========================================

import {
  defaultCalendarFilters,
} from "@/types/calendar.types";

import type {
  CalendarFilters as CalendarFilterValues,
  CalendarDateRange,
  SelectedCalendarDate,
  CalendarEventExtendedProps,
} from "@/types/calendar.types";

import type {
  CreateTaskInput,
} from "@/types/task.types";

// ==========================================
// UTILITIES
// ==========================================

import {
  getRescheduledDueDate,
  isValidCalendarDate,
} from "@/utils/calendar.utils";

import { getApiError } from "@/utils/api-error";

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function TaskCalendar() {
  const router = useRouter();

  // ========================================
  // LOCAL STATE
  // ========================================

  const [filters, setFilters] =
    useState<CalendarFilterValues>({
      ...defaultCalendarFilters,
    });

  const [dateRange, setDateRange] =
    useState<CalendarDateRange>();

  const [selectedDate, setSelectedDate] =
    useState<SelectedCalendarDate | null>(
      null
    );

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const rescheduleLock = useRef(false);

  // ========================================
  // CALENDAR DATA
  // ========================================

  const {
    tasks,
    events,
    statistics,
    visibleTaskCount,
    totalTasks,
    filteredTaskCount,

    isPending,
    isError,
    error,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useCalendar(
    filters,
    dateRange
  );

  // ========================================
  // MUTATIONS
  // ========================================

  const createTask =
    useCreateCalendarTask();

  const rescheduleTask =
    useRescheduleCalendarTask();

  // ========================================
  // DATE RANGE CHANGE
  // ========================================

  const handleDateRangeChange =
    useCallback(
      (range: CalendarDateRange) => {
        setDateRange((previous) => {
          if (
            previous?.start === range.start &&
            previous?.end === range.end
          ) {
            return previous;
          }

          return range;
        });
      },
      []
    );

  // ========================================
  // OPEN CREATE TASK MODAL
  // ========================================

  function handleDateClick(
    selected: SelectedCalendarDate
  ) {
    if (createTask.isPending) return;

    setSelectedDate(selected);

    setIsCreateOpen(true);
  }

  // ========================================
  // CLOSE CREATE TASK MODAL
  // ========================================

  function closeCreateModal() {
    if (createTask.isPending) return;

    setIsCreateOpen(false);

    setSelectedDate(null);
  }

  // ========================================
  // CREATE TASK
  // ========================================

  async function handleCreateTask(
    input: CreateTaskInput
  ) {
    await createTask.mutateAsync(input);

    setIsCreateOpen(false);

    setSelectedDate(null);

    // The existing mutation hook handles
    // notifications and cache invalidation.
  }

  // ========================================
  // VIEW TASK DETAILS
  // ========================================

  function handleTaskClick(
    taskId: string
  ) {
    router.push(
      `/tasks/${encodeURIComponent(taskId)}`
    );
  }

  // ========================================
  // DRAG AND DROP RESCHEDULING
  // ========================================

  async function handleEventDrop(
    info: EventDropArg
  ) {
    if (
      rescheduleLock.current ||
      rescheduleTask.isPending
    ) {
      info.revert();
      return;
    }

    const properties =
      info.oldEvent.extendedProps as
        CalendarEventExtendedProps;

    const task = properties.task;

    if (!task || !info.event.start) {
      info.revert();

      toast.error(
        "Unable to identify the task schedule."
      );

      return;
    }

    if (task.status === "COMPLETED") {
      info.revert();

      toast.error(
        "Completed tasks cannot be rescheduled."
      );

      return;
    }

    if (
      !isValidCalendarDate(task.dueDate) ||
      !isValidCalendarDate(info.event.start)
    ) {
      info.revert();

      toast.error(
        "Please select a valid due date."
      );

      return;
    }

    rescheduleLock.current = true;

    try {
      // Preserve the original due time
      // when moving a task in Month view.
      //
      // Week and Day views use the newly
      // selected date and time.

      const preserveTime =
        info.view.type === "dayGridMonth";

      const newDueDate =
        getRescheduledDueDate(
          task.dueDate,
          info.event.start,
          preserveTime
        );

      if (
        new Date(newDueDate).getTime() ===
        new Date(task.dueDate).getTime()
      ) {
        info.revert();
        return;
      }

      await rescheduleTask.mutateAsync({
        taskId: task.id,

        dueDate: newDueDate,
      });
    } catch {
      // Restore FullCalendar's event
      // position if the API request fails.

      info.revert();

      // React Query rollback and error
      // notifications are handled inside
      // useRescheduleCalendarTask.
    } finally {
      rescheduleLock.current = false;
    }
  }

  // ========================================
  // LOADING STATE
  // ========================================

  if (isPending) {
    return (
      <Loading
        variant="page"
        message="Loading Task Calendar..."
        description="Retrieving your scheduled tasks."
      />
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================

  if (isError && tasks.length === 0) {
    return (
      <ErrorState
        variant="page"
        title="Unable to load Task Calendar"
        message={getApiError(error)}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="min-w-0 space-y-6">

      {/* Page header */}

      <CalendarHeader
        dataUpdatedAt={dataUpdatedAt}
        isFetching={isFetching}
        onRefresh={() => void refetch()}
      />

      {/* Statistics cards */}

      <CalendarStats
        statistics={statistics}
      />

      {/* Calendar filters */}

      <CalendarFilters
        filters={filters}
        onChange={setFilters}
        totalTasks={totalTasks}
        filteredTaskCount={filteredTaskCount}
      />

      {/* Cached data warning */}

      {isError && tasks.length > 0 && (
        <div
          role="alert"
          className="
            flex items-start gap-3
            rounded-xl border
            border-amber-200
            bg-amber-50 p-4
            text-sm text-amber-700
            dark:border-amber-500/30
            dark:bg-amber-500/10
            dark:text-amber-300
          "
        >
          <CircleAlert
            size={19}
            className="shrink-0"
          />

          <p>
            Unable to refresh calendar tasks.
            Showing previously loaded data.
          </p>
        </div>
      )}

      {/* Calendar view */}

      <CalendarView
        events={events}
        isRescheduling={
          rescheduleTask.isPending
        }
        onDateClick={handleDateClick}
        onTaskClick={handleTaskClick}
        onEventDrop={handleEventDrop}
        onDateRangeChange={
          handleDateRangeChange
        }
      />

      {/* Calendar summary */}

      <div
        className="
          flex flex-wrap items-center
          justify-between gap-3
          rounded-xl border
          border-slate-200 bg-white
          px-4 py-3
          dark:border-slate-700
          dark:bg-slate-800
        "
      >
        <div className="flex items-center gap-2">
          <CalendarDays
            size={17}
            className="
              text-indigo-600
              dark:text-indigo-400
            "
          />

          <p
            className="
              text-sm text-slate-600
              dark:text-slate-300
            "
          >
            <span
              className="
                font-semibold text-slate-900
                dark:text-slate-100
              "
            >
              {visibleTaskCount}
            </span>

            {" "}scheduled{" "}
            {visibleTaskCount === 1
              ? "task"
              : "tasks"}
            {" "}in this calendar view.
          </p>
        </div>

        <p
          className="
            text-xs text-slate-400
            dark:text-slate-500
          "
        >
          Calendar uses your local time zone.
        </p>
      </div>

      {/* Create Task modal */}

      <CalendarTaskModal
        isOpen={isCreateOpen}
        selectedDate={selectedDate}
        isSubmitting={createTask.isPending}
        onClose={closeCreateModal}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}