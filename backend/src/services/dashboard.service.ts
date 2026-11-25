import {
  TaskStatus,
  TaskPriority,
} from "../generated/prisma/enums.js";

import type {
  IDashboardRepository,
} from "../repositories/dashboard.repository.js";

import type {
  DashboardResponseDto,
} from "../dtos/dashboard.dto.js";

import { TaskMapper } from "../mappers/task.mapper.js";

export class DashboardService {
  constructor(
    private readonly dashboardRepository: IDashboardRepository
  ) {}

  async getDashboard(): Promise<DashboardResponseDto> {
    const now = new Date();

    const statistics =
      await this.dashboardRepository.getStatistics(now);

    // ==========================================
    // STATUS COUNTS
    // ==========================================

    const statusCounts = new Map(
      statistics.statusGroups.map((group) => [
        group.status,
        group._count._all,
      ])
    );

    // ==========================================
    // PRIORITY COUNTS
    // ==========================================

    const priorityCounts = new Map(
      statistics.priorityGroups.map((group) => [
        group.priority,
        group._count._all,
      ])
    );

    // ==========================================
    // DASHBOARD SUMMARY
    // ==========================================

    const totalTasks = statistics.totalTasks;

    const completedTasks =
      statusCounts.get(TaskStatus.COMPLETED) ?? 0;

    const pendingTasks =
      statusCounts.get(TaskStatus.TODO) ?? 0;

    const inProgressTasks =
      statusCounts.get(TaskStatus.IN_PROGRESS) ?? 0;

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    // ==========================================
    // DASHBOARD RESPONSE
    // ==========================================

    return {
      summary: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks: statistics.overdueTasks,
        completionRate,
      },

      statusBreakdown: Object.values(TaskStatus).map(
        (status) => ({
          status,
          count: statusCounts.get(status) ?? 0,
        })
      ),

      priorityBreakdown: Object.values(TaskPriority).map(
        (priority) => ({
          priority,
          count: priorityCounts.get(priority) ?? 0,
        })
      ),

      recentTasks: TaskMapper.toResponseList(
        statistics.recentTasks,
        now
      ),
    };
  }
}