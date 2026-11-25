import type {
  Prisma,
  Task,
  PrismaClient,
} from "../generated/prisma/client.js";

import type {
  TaskStatus,
} from "../generated/prisma/enums.js";

export interface FindTasksOptions {
  where: Prisma.TaskWhereInput;
  orderBy: Prisma.TaskOrderByWithRelationInput[];
  skip: number;
  take: number;
}

export interface ITaskRepository {
  create(data: Prisma.TaskCreateInput): Promise<Task>;

  findById(id: string): Promise<Task | null>;

  findMany(options: FindTasksOptions): Promise<{
    tasks: Task[];
    total: number;
  }>;

  update(
    id: string,
    data: Prisma.TaskUpdateInput
  ): Promise<Task>;

  updateStatus(
    id: string,
    status: TaskStatus
  ): Promise<Task>;

  delete(id: string): Promise<Task>;
}

export class TaskRepository implements ITaskRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(
    data: Prisma.TaskCreateInput
  ): Promise<Task> {
    return this.db.task.create({
      data,
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.db.task.findUnique({
      where: { id },
    });
  }

  async findMany(options: FindTasksOptions): Promise<{
    tasks: Task[];
    total: number;
  }> {
    const [tasks, total] = await this.db.$transaction(
      [
        this.db.task.findMany({
          where: options.where,
          orderBy: options.orderBy,
          skip: options.skip,
          take: options.take,
        }),

        this.db.task.count({
          where: options.where,
        }),
      ],
      {
        isolationLevel: "RepeatableRead",
      }
    );

    return {
      tasks,
      total,
    };
  }

  async update(
    id: string,
    data: Prisma.TaskUpdateInput
  ): Promise<Task> {
    return this.db.task.update({
      where: { id },
      data,
    });
  }

  async updateStatus(
    id: string,
    status: TaskStatus
  ): Promise<Task> {
    return this.db.task.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<Task> {
    return this.db.task.delete({
      where: { id },
    });
  }
}