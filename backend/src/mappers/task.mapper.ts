import type { Task } from "../generated/prisma/client.js";
import { TaskStatus } from "../generated/prisma/enums.js";
import type { TaskResponseDto } from "../dtos/task.dto.js";

export class TaskMapper {
  static toResponse(
    task: Task,
    now: Date = new Date()
  ): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,

      dueDate: task.dueDate.toISOString(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),

      isOverdue:
        task.dueDate.getTime() < now.getTime() &&
        task.status !== TaskStatus.COMPLETED,
    };
  }

  static toResponseList(
    tasks: Task[],
    now: Date = new Date()
  ): TaskResponseDto[] {
    return tasks.map((task) => this.toResponse(task, now));
  }
}