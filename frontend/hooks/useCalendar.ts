"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useTheme } from "next-themes";

import { toast } from "sonner";

import { calendarService } from
  "@/services/calendar.service";

import { useDebounce } from
  "@/hooks/useDebounce";

import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/useTasks";

import { getApiError } from
  "@/utils/api-error";

import {
  filterCalendarTasks,
  filterTasksByDateRange,
  tasksToCalendarEvents,
  getCalendarStatistics,
  isTaskOverdue,
} from "@/utils/calendar.utils";

import {
  defaultCalendarFilters,
} from "@/types/calendar.types";

import type {
  CalendarFilters,
  CalendarDateRange,
  CalendarTheme,
  RescheduleTaskInput,
} from "@/types/calendar.types";

import type {
  Task,
} from "@/types/task.types";

// ==========================================
// QUERY KEYS
// ==========================================

export const CALENDAR_QUERY_KEY = [
  "tasks",
  "calendar",
] as const;

const EMPTY_TASKS: Task[] = [];

// ==========================================
// CALENDAR HOOK
// ==========================================

export function useCalendar(
  filters: CalendarFilters =
    defaultCalendarFilters,

  dateRange?: CalendarDateRange
) {
  const { resolvedTheme } = useTheme();

  const calendarTheme: CalendarTheme =
    resolvedTheme === "dark"
      ? "dark"
      : "light";

  // ========================================
// CURRENT TIME
// ========================================

const [now, setNow] = useState<Date>(
  () => new Date(0)
);

useEffect(() => {
  const updateTime = () => {
    setNow(new Date());
  };

  // Read the current time after mounting.

  updateTime();

  // Recalculate overdue tasks every minute.

  const timer = window.setInterval(
    updateTime,
    60_000
  );

  return () => {
    window.clearInterval(timer);
  };
}, []);

  // ========================================
  // DEBOUNCED SEARCH
  // ========================================

  const debouncedSearch = useDebounce(
    filters.search,
    300
  );

  // ========================================
  // FETCH CALENDAR TASKS
  // ========================================

  const query = useQuery({
    queryKey: CALENDAR_QUERY_KEY,

    queryFn: () =>
      calendarService.getAllTasks(),

    staleTime: 30_000,

    refetchInterval: 60_000,

    refetchOnWindowFocus: true,
  });

  const tasks =
    query.data ?? EMPTY_TASKS;

  // ========================================
  // FILTER TASKS
  // ========================================

  const filteredTasks = useMemo(() => {
    return filterCalendarTasks(
      tasks,
      {
        search: debouncedSearch,

        status: filters.status,

        priority: filters.priority,

        showCompleted:
          filters.showCompleted,

        showOverdueOnly:
          filters.showOverdueOnly,
      },
      now
    );
  }, [
    tasks,
    debouncedSearch,
    filters.status,
    filters.priority,
    filters.showCompleted,
    filters.showOverdueOnly,
    now,
  ]);

  // ========================================
  // VISIBLE DATE RANGE
  // ========================================

  const rangeStart = dateRange?.start;

  const rangeEnd = dateRange?.end;

  const visibleTasks = useMemo(() => {
    if (!rangeStart || !rangeEnd) {
      return filteredTasks;
    }

    return filterTasksByDateRange(
      filteredTasks,
      {
        start: rangeStart,
        end: rangeEnd,
      }
    );
  }, [
    filteredTasks,
    rangeStart,
    rangeEnd,
  ]);

  // ========================================
  // CALENDAR EVENTS
  // ========================================

  const events = useMemo(() => {
    return tasksToCalendarEvents(
      filteredTasks,
      calendarTheme,
      now
    );
  }, [
    filteredTasks,
    calendarTheme,
    now,
  ]);

  // ========================================
  // GLOBAL CALENDAR STATISTICS
  // ========================================

  const statistics = useMemo(() => {
    return getCalendarStatistics(
      tasks,
      now
    );
  }, [
    tasks,
    now,
  ]);

  // ========================================
  // VISIBLE DATE RANGE STATISTICS
  // ========================================

  const visibleStatistics =
    useMemo(() => {
      return getCalendarStatistics(
        visibleTasks,
        now
      );
    }, [
      visibleTasks,
      now,
    ]);

  // ========================================
  // RETURN CALENDAR DATA
  // ========================================

  return {
    ...query,

    tasks,

    filteredTasks,

    visibleTasks,

    events,

    statistics,

    visibleStatistics,

    calendarTheme,

    totalTasks:
      tasks.length,

    filteredTaskCount:
      filteredTasks.length,

    visibleTaskCount:
      visibleTasks.length,
  };
}

// ==========================================
// CREATE CALENDAR TASK
// ==========================================

export function useCreateCalendarTask() {
  // Reuse existing task mutation.
  // Existing hook handles notifications
  // and query invalidation.

  return useCreateTask();
}

// ==========================================
// UPDATE CALENDAR TASK
// ==========================================

export function useUpdateCalendarTask() {
  return useUpdateTask();
}

// ==========================================
// DELETE CALENDAR TASK
// ==========================================

export function useDeleteCalendarTask() {
  return useDeleteTask();
}

// ==========================================
// RESCHEDULE MUTATION CONTEXT
// ==========================================

interface RescheduleContext {
  previousTasks: Task[] | undefined;
}

// ==========================================
// RESCHEDULE CALENDAR TASK
// ==========================================

export function useRescheduleCalendarTask() {
  const queryClient = useQueryClient();

  return useMutation<
    Task,
    Error,
    RescheduleTaskInput,
    RescheduleContext
  >({
    mutationKey: [
      "calendar",
      "reschedule",
    ],

    // ======================================
    // API REQUEST
    // ======================================

    mutationFn: (input) =>
      calendarService.rescheduleTask(
        input
      ),

    // ======================================
    // OPTIMISTIC UPDATE
    // ======================================

    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: CALENDAR_QUERY_KEY,
      });

      const previousTasks =
        queryClient.getQueryData<Task[]>(
          CALENDAR_QUERY_KEY
        );

      const updatedDueDate =
        new Date(input.dueDate);

      if (
        Number.isNaN(
          updatedDueDate.getTime()
        )
      ) {
        return {
          previousTasks,
        };
      }

      queryClient.setQueryData<Task[]>(
        CALENDAR_QUERY_KEY,

        (currentTasks) => {
          if (!currentTasks) {
            return currentTasks;
          }

          return currentTasks.map(
            (task) => {
              if (
                task.id !== input.taskId
              ) {
                return task;
              }

              const updatedTask: Task = {
                ...task,

                dueDate:
                  updatedDueDate
                    .toISOString(),
              };

              return {
                ...updatedTask,

                isOverdue:
                  isTaskOverdue(
                    updatedTask
                  ),
              };
            }
          );
        }
      );

      return {
        previousTasks,
      };
    },

    // ======================================
    // SUCCESS
    // ======================================

    onSuccess: (
      updatedTask,
      input
    ) => {
      // Replace optimistic data
      // with the backend response.

      queryClient.setQueryData<Task[]>(
        CALENDAR_QUERY_KEY,

        (currentTasks) => {
          if (!currentTasks) {
            return currentTasks;
          }

          return currentTasks.map(
            (task) =>
              task.id === input.taskId
                ? updatedTask
                : task
          );
        }
      );

      // Update task details cache.

      queryClient.setQueryData(
        ["task", updatedTask.id],
        updatedTask
      );

      toast.success(
        "Task rescheduled successfully."
      );
    },

    // ======================================
    // ERROR AND ROLLBACK
    // ======================================

    onError: (
      error,
      input,
      context
    ) => {
      const previousTask =
        context?.previousTasks?.find(
          (task) =>
            task.id === input.taskId
        );

      if (previousTask) {
        queryClient.setQueryData<Task[]>(
          CALENDAR_QUERY_KEY,

          (currentTasks) =>
            currentTasks?.map(
              (task) =>
                task.id === input.taskId
                  ? previousTask
                  : task
            )
        );
      }

      toast.error(
        getApiError(error)
      );
    },

    // ======================================
    // SYNCHRONIZE ALL PAGES
    // ======================================

    onSettled: async (
      _data,
      _error,
      input
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "task",
            input.taskId,
          ],
        }),
      ]);
    },
  });
}