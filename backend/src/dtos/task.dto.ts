import type {
  TaskStatus,
  TaskPriority,
} from "../generated/prisma/enums.js";

export interface CreateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
}

export interface TaskQueryDto {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page: number;
  limit: number;
  sortBy: "createdAt" | "dueDate";
  sortOrder: "asc" | "desc";
}

export interface TaskResponseDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
}

export interface PaginationDto {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TaskListResponseDto {
  tasks: TaskResponseDto[];
  pagination: PaginationDto;
}