import api from "@/services/api";

import type { ApiResponse } from "@/types/api.types";

import type {
  Task,
  TaskFilters,
  TaskListResponse,
  CreateTaskInput,
  UpdateTaskInput,
  TaskStatus,
} from "@/types/task.types";

class TaskService {
  // ========================================
  // GET ALL TASKS
  // ========================================

  async getAll(
    filters: TaskFilters
  ): Promise<TaskListResponse> {
    const response = await api.get<
      ApiResponse<TaskListResponse>
    >("/tasks", {
      params: filters,
    });

    return response.data.data;
  }

  // ========================================
  // GET SINGLE TASK
  // ========================================

  async getById(id: string): Promise<Task> {
    const response = await api.get<
      ApiResponse<Task>
    >(`/tasks/${id}`);

    return response.data.data;
  }

  // ========================================
  // CREATE TASK
  // ========================================

  async create(
    data: CreateTaskInput
  ): Promise<Task> {
    const response = await api.post<
      ApiResponse<Task>
    >("/tasks", data);

    return response.data.data;
  }

  // ========================================
  // UPDATE TASK
  // ========================================

  async update(
    id: string,
    data: UpdateTaskInput
  ): Promise<Task> {
    const response = await api.patch<
      ApiResponse<Task>
    >(`/tasks/${id}`, data);

    return response.data.data;
  }

  // ========================================
  // UPDATE TASK STATUS
  // ========================================

  async updateStatus(
    id: string,
    status: TaskStatus
  ): Promise<Task> {
    const response = await api.patch<
      ApiResponse<Task>
    >(`/tasks/${id}/status`, {
      status,
    });

    return response.data.data;
  }

  // ========================================
  // DELETE TASK
  // ========================================

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
}

export const taskService = new TaskService();