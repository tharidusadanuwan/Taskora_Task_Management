import type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
} from "@/types/task.types";

// ==========================================
// CALENDAR VIEW TYPES
// ==========================================

export type CalendarViewType =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay";

// ==========================================
// CALENDAR FILTERS
// ==========================================

export interface CalendarFilters {
  search: string;
  status: TaskStatus | "ALL";
  priority: TaskPriority | "ALL";
  showCompleted: boolean;
  showOverdueOnly: boolean;
}

export const defaultCalendarFilters: CalendarFilters = {
  search: "",
  status: "ALL",
  priority: "ALL",
  showCompleted: true,
  showOverdueOnly: false,
};

// ==========================================
// CALENDAR EVENT STATUS
// ==========================================

export type CalendarEventStatus =
  | TaskStatus
  | "OVERDUE";

// ==========================================
// CALENDAR DATE RANGE
// ==========================================

export interface CalendarDateRange {
  start: string;
  end: string;
}

// ==========================================
// CALENDAR EVENT COLORS
// ==========================================

export interface CalendarEventColors {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

// ==========================================
// CALENDAR EVENT EXTENDED PROPERTIES
// ==========================================

export interface CalendarEventExtendedProps {
  task: Task;
  status: TaskStatus;
  priority: TaskPriority;
  description: string;
  isOverdue: boolean;
  eventStatus: CalendarEventStatus;
}

// ==========================================
// CALENDAR EVENT
// ==========================================

export interface CalendarTaskEvent {
  id: string;
  title: string;
  start: string;
  allDay: boolean;

  backgroundColor: string;
  borderColor: string;
  textColor: string;

  editable: boolean;
  startEditable: boolean;
  durationEditable: boolean;

  extendedProps: CalendarEventExtendedProps;
}

// ==========================================
// CALENDAR STATISTICS
// ==========================================

export interface CalendarStatistics {
  totalTasks: number;
  scheduledTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  todayTasks: number;
  upcomingTasks: number;
}

// ==========================================
// CREATE CALENDAR TASK
// ==========================================

export type CreateCalendarTaskInput =
  CreateTaskInput;

// ==========================================
// RESCHEDULE TASK
// ==========================================

export interface RescheduleTaskInput {
  taskId: string;
  dueDate: string;
}

// ==========================================
// SELECTED CALENDAR DATE
// ==========================================

export interface SelectedCalendarDate {
  date: Date;
  dateStr: string;
  allDay: boolean;
}

// ==========================================
// CALENDAR THEME
// ==========================================

export type CalendarTheme = "light" | "dark";