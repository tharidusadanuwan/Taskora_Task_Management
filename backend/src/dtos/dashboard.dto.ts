import type {
  TaskStatus,
  TaskPriority,
} from "../generated/prisma/enums.js";

import type {
  TaskResponseDto,
} from "./task.dto.js";

export interface DashboardSummaryDto {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface StatusBreakdownDto {
  status: TaskStatus;
  count: number;
}

export interface PriorityBreakdownDto {
  priority: TaskPriority;
  count: number;
}

export interface DashboardResponseDto {
  summary: DashboardSummaryDto;
  statusBreakdown: StatusBreakdownDto[];
  priorityBreakdown: PriorityBreakdownDto[];
  recentTasks: TaskResponseDto[];
}