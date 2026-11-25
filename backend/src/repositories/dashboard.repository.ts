import type {
  PrismaClient,
} from "../generated/prisma/client.js";

import {
  TaskStatus,
} from "../generated/prisma/enums.js";

export class DashboardRepository {
  constructor(private readonly db: PrismaClient) {}

  async getStatistics(now: Date) {
    const [
      totalTasks,
      statusGroups,
      priorityGroups,
      overdueTasks,
      recentTasks,
    ] = await this.db.$transaction(
      [
        this.db.task.count(),

        this.db.task.groupBy({
          by: ["status"],
          _count: {
            _all: true,
          },
        }),

        this.db.task.groupBy({
          by: ["priority"],
          _count: {
            _all: true,
          },
        }),

        this.db.task.count({
          where: {
            dueDate: {
              lt: now,
            },
            status: {
              not: TaskStatus.COMPLETED,
            },
          },
        }),

        this.db.task.findMany({
          take: 5,
          orderBy: [
            { createdAt: "desc" },
            { id: "asc" },
          ],
        }),
      ],
      {
        isolationLevel: "RepeatableRead",
      }
    );

    return {
      totalTasks,
      statusGroups,
      priorityGroups,
      overdueTasks,
      recentTasks,
    };
  }
}

export interface IDashboardRepository {
  getStatistics(
    now: Date
  ): ReturnType<DashboardRepository["getStatistics"]>;
}