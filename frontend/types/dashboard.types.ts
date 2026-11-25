import type {
  Task,
  TaskStatus,
  TaskPriority,
} from "./task.types";

export interface DashboardSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface StatusBreakdown {
  status: TaskStatus;
  count: number;
}

export interface PriorityBreakdown {
  priority: TaskPriority;
  count: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  statusBreakdown: StatusBreakdown[];
  priorityBreakdown: PriorityBreakdown[];
  recentTasks: Task[];
}