import type {
  Task,
} from "@/types/task.types";

import type {
  CalendarFilters,
  CalendarTaskEvent,
  CalendarStatistics,
  CalendarEventStatus,
  CalendarEventColors,
  CalendarDateRange,
  CalendarTheme,
} from "@/types/calendar.types";

// ==========================================
// LIGHT MODE EVENT COLORS
// ==========================================

const lightEventColors: Record<
  CalendarEventStatus,
  CalendarEventColors
> = {
  TODO: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
    textColor: "#92400E",
  },

  IN_PROGRESS: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3B82F6",
    textColor: "#1D4ED8",
  },

  COMPLETED: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
    textColor: "#047857",
  },

  OVERDUE: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
    textColor: "#B91C1C",
  },
};

// ==========================================
// DARK MODE EVENT COLORS
// ==========================================

const darkEventColors: Record<
  CalendarEventStatus,
  CalendarEventColors
> = {
  TODO: {
    backgroundColor: "#422006",
    borderColor: "#D97706",
    textColor: "#FCD34D",
  },

  IN_PROGRESS: {
    backgroundColor: "#172554",
    borderColor: "#3B82F6",
    textColor: "#93C5FD",
  },

  COMPLETED: {
    backgroundColor: "#022C22",
    borderColor: "#10B981",
    textColor: "#6EE7B7",
  },

  OVERDUE: {
    backgroundColor: "#450A0A",
    borderColor: "#EF4444",
    textColor: "#FCA5A5",
  },
};

// ==========================================
// VALID DATE CHECK
// ==========================================

export function isValidCalendarDate(
  value: string | Date | null | undefined
): boolean {
  if (!value) return false;

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return !Number.isNaN(date.getTime());
}

// ==========================================
// CHECK OVERDUE TASK
// ==========================================

export function isTaskOverdue(
  task: Task,
  now: Date = new Date()
): boolean {
  if (task.status === "COMPLETED") {
    return false;
  }

  if (!isValidCalendarDate(task.dueDate)) {
    return false;
  }

  return (
    new Date(task.dueDate).getTime() <
    now.getTime()
  );
}

// ==========================================
// GET CALENDAR EVENT STATUS
// ==========================================

export function getCalendarEventStatus(
  task: Task,
  now: Date = new Date()
): CalendarEventStatus {
  if (isTaskOverdue(task, now)) {
    return "OVERDUE";
  }

  return task.status;
}

// ==========================================
// GET EVENT COLORS
// ==========================================

export function getCalendarEventColors(
  status: CalendarEventStatus,
  theme: CalendarTheme = "light"
): CalendarEventColors {
  return theme === "dark"
    ? darkEventColors[status]
    : lightEventColors[status];
}

// ==========================================
// CONVERT TASK TO CALENDAR EVENT
// ==========================================

export function taskToCalendarEvent(
  task: Task,
  theme: CalendarTheme = "light",
  now: Date = new Date()
): CalendarTaskEvent {
  const eventStatus =
    getCalendarEventStatus(task, now);

  const colors = getCalendarEventColors(
    eventStatus,
    theme
  );

  return {
    id: task.id,

    title: task.title,

    start: task.dueDate,

    allDay: false,

    backgroundColor:
      colors.backgroundColor,

    borderColor:
      colors.borderColor,

    textColor:
      colors.textColor,

    editable:
      task.status !== "COMPLETED",

    startEditable:
      task.status !== "COMPLETED",

    durationEditable: false,

    extendedProps: {
      task,

      status: task.status,

      priority: task.priority,

      description:
        task.description || "",

      isOverdue:
        isTaskOverdue(task, now),

      eventStatus,
    },
  };
}

// ==========================================
// CONVERT ALL TASKS TO EVENTS
// ==========================================

export function tasksToCalendarEvents(
  tasks: Task[],
  theme: CalendarTheme = "light",
  now: Date = new Date()
): CalendarTaskEvent[] {
  return tasks
    .filter((task) =>
      isValidCalendarDate(task.dueDate)
    )
    .map((task) =>
      taskToCalendarEvent(task, theme, now)
    );
}

// ==========================================
// FILTER CALENDAR TASKS
// ==========================================

export function filterCalendarTasks(
  tasks: Task[],
  filters: CalendarFilters,
  now: Date = new Date()
): Task[] {
  const search =
    filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch =
      !search ||
      task.title
        .toLowerCase()
        .includes(search) ||
      (task.description || "")
        .toLowerCase()
        .includes(search);

    const matchesStatus =
      filters.status === "ALL" ||
      task.status === filters.status;

    const matchesPriority =
      filters.priority === "ALL" ||
      task.priority === filters.priority;

    const matchesCompleted =
      filters.showCompleted ||
      task.status !== "COMPLETED";

    const matchesOverdue =
      !filters.showOverdueOnly ||
      isTaskOverdue(task, now);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCompleted &&
      matchesOverdue
    );
  });
}

// ==========================================
// FILTER TASKS BY DATE RANGE
// ==========================================

export function filterTasksByDateRange(
  tasks: Task[],
  range: CalendarDateRange
): Task[] {
  const start =
    new Date(range.start).getTime();

  const end =
    new Date(range.end).getTime();

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    end <= start
  ) {
    return [];
  }

  return tasks.filter((task) => {
    if (!isValidCalendarDate(task.dueDate)) {
      return false;
    }

    const dueDate =
      new Date(task.dueDate).getTime();

    // FullCalendar uses an exclusive end date.

    return (
      dueDate >= start &&
      dueDate < end
    );
  });
}

// ==========================================
// CHECK SAME LOCAL DATE
// ==========================================

export function isSameCalendarDay(
  first: Date,
  second: Date
): boolean {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}

// ==========================================
// CALENDAR STATISTICS
// ==========================================

export function getCalendarStatistics(
  tasks: Task[],
  now: Date = new Date()
): CalendarStatistics {
  const today = now;

  const scheduledTasks = tasks.filter(
    (task) =>
      isValidCalendarDate(task.dueDate)
  );

  return {
    totalTasks: tasks.length,

    scheduledTasks:
      scheduledTasks.length,

    todoTasks: tasks.filter(
      (task) =>
        task.status === "TODO"
    ).length,

    inProgressTasks: tasks.filter(
      (task) =>
        task.status === "IN_PROGRESS"
    ).length,

    completedTasks: tasks.filter(
      (task) =>
        task.status === "COMPLETED"
    ).length,

    overdueTasks: tasks.filter(
      (task) =>
        isTaskOverdue(task, now)
    ).length,

    todayTasks: scheduledTasks.filter(
      (task) =>
        isSameCalendarDay(
          new Date(task.dueDate),
          today
        )
    ).length,

    upcomingTasks: scheduledTasks.filter(
      (task) =>
        task.status !== "COMPLETED" &&
        new Date(task.dueDate).getTime() >
          now.getTime()
    ).length,
  };
}

// ==========================================
// FORMAT CALENDAR DATE
// ==========================================

export function formatCalendarDate(
  value: string | Date
): string {
  if (!isValidCalendarDate(value)) {
    return "Invalid date";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
}

// ==========================================
// FORMAT CALENDAR TIME
// ==========================================

export function formatCalendarTime(
  value: string | Date
): string {
  if (!isValidCalendarDate(value)) {
    return "Invalid time";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  ).format(date);
}

// ==========================================
// FORMAT DATE AND TIME
// ==========================================

export function formatCalendarDateTime(
  value: string | Date
): string {
  if (!isValidCalendarDate(value)) {
    return "Invalid date";
  }

  return (
    formatCalendarDate(value) +
    " at " +
    formatCalendarTime(value)
  );
}

// ==========================================
// CONVERT TO DATETIME-LOCAL INPUT
// ==========================================

export function toCalendarDateTimeInput(
  value: string | Date
): string {
  if (!isValidCalendarDate(value)) {
    return "";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  return (
    `${year}-${month}-${day}` +
    `T${hours}:${minutes}`
  );
}

// ==========================================
// CONVERT LOCAL DATE TO ISO
// ==========================================

export function calendarDateToISO(
  value: string | Date
): string {
  if (!isValidCalendarDate(value)) {
    throw new Error(
      "Please select a valid date."
    );
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return date.toISOString();
}

// ==========================================
// DEFAULT DUE DATE FOR SELECTED DAY
// ==========================================

export function getSelectedDateDueDate(
  selectedDate: Date,
  allDay: boolean = true
): string {
  if (!isValidCalendarDate(selectedDate)) {
    return "";
  }

  const date = new Date(selectedDate);

  if (allDay) {
    // Default to 5:00 PM local time
    // when clicking a monthly calendar date.

    date.setHours(17, 0, 0, 0);
  }

  return toCalendarDateTimeInput(date);
}

// ==========================================
// RESCHEDULE TASK DATE
// ==========================================

export function getRescheduledDueDate(
  originalDueDate: string,
  selectedDate: Date,
  preserveTime: boolean = true
): string {
  if (
    !isValidCalendarDate(originalDueDate) ||
    !isValidCalendarDate(selectedDate)
  ) {
    throw new Error(
      "Invalid task due date."
    );
  }

  const original =
    new Date(originalDueDate);

  const updated =
    new Date(selectedDate);

  if (preserveTime) {
    updated.setHours(
      original.getHours(),
      original.getMinutes(),
      original.getSeconds(),
      original.getMilliseconds()
    );
  }

  return updated.toISOString();
}