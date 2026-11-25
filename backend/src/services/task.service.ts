import type {
  Prisma,
} from "../generated/prisma/client.js";

import type {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
  TaskQueryDto,
  TaskResponseDto,
  TaskListResponseDto,
} from "../dtos/task.dto.js";

import type {
  ITaskRepository,
} from "../repositories/task.repository.js";

import { TaskMapper } from "../mappers/task.mapper.js";
import { AppError } from "../utils/app-error.js";

export class TaskService {
  constructor(
    private readonly taskRepository: ITaskRepository
  ) {}

  // ==========================================
  // CREATE TASK
  // ==========================================

  async createTask(
    dto: CreateTaskDto
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: new Date(dto.dueDate),
    });

    return TaskMapper.toResponse(task);
  }

  // ==========================================
  // GET TASK BY ID
  // ==========================================

  async getTaskById(
    id: string
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return TaskMapper.toResponse(task);
  }

  // ==========================================
  // GET ALL TASKS
  // ==========================================

  async getAllTasks(
    query: TaskQueryDto
  ): Promise<TaskListResponseDto> {
    const {
      search,
      status,
      priority,
      page,
      limit,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.TaskWhereInput = {};

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const skip = (page - 1) * limit;

    const orderBy: Prisma.TaskOrderByWithRelationInput[] =
      [
        sortBy === "dueDate"
          ? { dueDate: sortOrder }
          : { createdAt: sortOrder },

        { id: "asc" },
      ];

    const { tasks, total } =
      await this.taskRepository.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      });

    const totalPages = Math.ceil(total / limit);

    return {
      tasks: TaskMapper.toResponseList(tasks),

      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1 && totalPages > 0,
      },
    };
  }

  // ==========================================
  // UPDATE TASK
  // ==========================================

  async updateTask(
    id: string,
    dto: UpdateTaskDto
  ): Promise<TaskResponseDto> {
    const data: Prisma.TaskUpdateInput = {};

    if (dto.title !== undefined) {
      data.title = dto.title;
    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    if (dto.priority !== undefined) {
      data.priority = dto.priority;
    }

    if (dto.dueDate !== undefined) {
      data.dueDate = new Date(dto.dueDate);
    }

    const task = await this.taskRepository.update(
      id,
      data
    );

    return TaskMapper.toResponse(task);
  }

  // ==========================================
  // UPDATE TASK STATUS
  // ==========================================

  async updateTaskStatus(
    id: string,
    dto: UpdateTaskStatusDto
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.updateStatus(
      id,
      dto.status
    );

    return TaskMapper.toResponse(task);
  }

  // ==========================================
  // DELETE TASK
  // ==========================================

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}