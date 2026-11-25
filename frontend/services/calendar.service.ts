import { taskService } from "@/services/task.service";

import type {
  Task,
  UpdateTaskInput,
} from "@/types/task.types";

import type {
  CreateCalendarTaskInput,
  RescheduleTaskInput,
  CalendarDateRange,
} from "@/types/calendar.types";

import {
  filterTasksByDateRange,
  calendarDateToISO,
} from "@/utils/calendar.utils";

// ==========================================
// CONSTANTS
// ==========================================

const PAGE_LIMIT = 100;

// ==========================================
// CALENDAR SERVICE
// ==========================================

export const calendarService = {
  // ========================================
  // GET ALL CALENDAR TASKS
  // ========================================

  async getAllTasks(): Promise<Task[]> {
    const firstPage =
      await taskService.getAll({
        page: 1,
        limit: PAGE_LIMIT,
        sortBy: "dueDate",
        sortOrder: "asc",
      });

    const allTasks = [
      ...firstPage.tasks,
    ];

    const totalPages =
      firstPage.pagination.totalPages;

    for (
      let page = 2;
      page <= totalPages;
      page++
    ) {
      const response =
        await taskService.getAll({
          page,
          limit: PAGE_LIMIT,
          sortBy: "dueDate",
          sortOrder: "asc",
        });

      allTasks.push(
        ...response.tasks
      );
    }

    // Prevent duplicate task IDs.

    const uniqueTasks = Array.from(
      new Map(
        allTasks.map((task) => [
          task.id,
          task,
        ])
      ).values()
    );

    return uniqueTasks;
  },

  // ========================================
  // GET TASKS BY DATE RANGE
  // ========================================

  async getTasksByDateRange(
    range: CalendarDateRange
  ): Promise<Task[]> {
    const tasks =
      await calendarService.getAllTasks();

    return filterTasksByDateRange(
      tasks,
      range
    );
  },

  // ========================================
  // GET SINGLE TASK
  // ========================================

  async getTaskById(
    taskId: string
  ): Promise<Task> {
    return taskService.getById(taskId);
  },

  // ========================================
  // CREATE CALENDAR TASK
  // ========================================

  async createTask(
    input: CreateCalendarTaskInput
  ): Promise<Task> {
    return taskService.create({
      ...input,

      title: input.title.trim(),

      description:
        input.description.trim(),

      dueDate:
        calendarDateToISO(
          input.dueDate
        ),
    });
  },

  // ========================================
  // UPDATE CALENDAR TASK
  // ========================================

  async updateTask(
    taskId: string,
    input: UpdateTaskInput
  ): Promise<Task> {
    const payload: UpdateTaskInput = {
      ...input,
    };

    if (input.title !== undefined) {
      payload.title =
        input.title.trim();
    }

    if (input.description !== undefined) {
      payload.description =
        input.description.trim();
    }

    if (input.dueDate !== undefined) {
      payload.dueDate =
        calendarDateToISO(
          input.dueDate
        );
    }

    return taskService.update(
      taskId,
      payload
    );
  },

  // ========================================
  // RESCHEDULE CALENDAR TASK
  // ========================================

  async rescheduleTask(
    input: RescheduleTaskInput
  ): Promise<Task> {
    const dueDate =
      calendarDateToISO(
        input.dueDate
      );

    return taskService.update(
      input.taskId,
      {
        dueDate,
      }
    );
  },

  // ========================================
  // DELETE CALENDAR TASK
  // ========================================

  async deleteTask(
    taskId: string
  ) {
    return taskService.delete(taskId);
  },
};