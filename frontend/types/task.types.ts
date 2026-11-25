export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "COMPLETED";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface Task {
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

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export type UpdateTaskInput =
  Partial<CreateTaskInput>;

export interface TaskFilters {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page: number;
  limit: number;
  sortBy: "createdAt" | "dueDate";
  sortOrder: "asc" | "desc";
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: Pagination;
}