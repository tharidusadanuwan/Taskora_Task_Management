"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { taskService } from "@/services/task.service";

import { getApiError } from "@/utils/api-error";

import type {
  TaskFilters,
  CreateTaskInput,
  UpdateTaskInput,
  TaskStatus,
} from "@/types/task.types";

// ==========================================
// GET ALL TASKS
// ==========================================

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => taskService.getAll(filters),
    placeholderData: keepPreviousData,
  });
}

// ==========================================
// GET SINGLE TASK
// ==========================================

export function useTask(id: string) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => taskService.getById(id),
    enabled: Boolean(id),
  });
}

// ==========================================
// CREATE TASK
// ==========================================

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) =>
      taskService.create(data),

    onSuccess: async () => {
      toast.success("Task created successfully");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },

    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

// ==========================================
// UPDATE TASK
// ==========================================

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTaskInput;
    }) => taskService.update(id, data),

    onSuccess: async (task) => {
      queryClient.setQueryData(
        ["task", task.id],
        task
      );

      toast.success("Task updated successfully");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["task", task.id],
        }),
      ]);
    },

    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

// ==========================================
// UPDATE TASK STATUS
// ==========================================

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: TaskStatus;
    }) => taskService.updateStatus(id, status),

    onSuccess: async (task) => {
      queryClient.setQueryData(
        ["task", task.id],
        task
      );

      toast.success("Task status updated successfully");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["task", task.id],
        }),
      ]);
    },

    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

// ==========================================
// DELETE TASK
// ==========================================

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      taskService.delete(id),

    onSuccess: async (_, id) => {
      queryClient.removeQueries({
        queryKey: ["task", id],
        exact: true,
      });

      toast.success("Task deleted successfully");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },

    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}