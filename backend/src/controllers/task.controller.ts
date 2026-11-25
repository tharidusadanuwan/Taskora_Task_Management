import type { Request, Response } from "express";

import type {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
  TaskQueryDto,
} from "../dtos/task.dto.js";

import { TaskService } from "../services/task.service.js";
import { ApiResponse } from "../utils/api-response.js";

export class TaskController {
  constructor(
    private readonly taskService: TaskService
  ) {}

  create = async (
    _req: Request,
    res: Response
  ) => {
    const dto =
      res.locals.validated.body as CreateTaskDto;

    const task =
      await this.taskService.createTask(dto);

    return ApiResponse.success(
      res,
      task,
      "Task created successfully",
      201
    );
  };

  getAll = async (
    _req: Request,
    res: Response
  ) => {
    const query =
      res.locals.validated.query as TaskQueryDto;

    const result =
      await this.taskService.getAllTasks(query);

    return ApiResponse.success(
      res,
      result,
      "Tasks retrieved successfully"
    );
  };

  getById = async (
    _req: Request,
    res: Response
  ) => {
    const { id } = res.locals.validated.params;

    const task =
      await this.taskService.getTaskById(id);

    return ApiResponse.success(
      res,
      task,
      "Task retrieved successfully"
    );
  };

  update = async (
    _req: Request,
    res: Response
  ) => {
    const { id } = res.locals.validated.params;

    const dto =
      res.locals.validated.body as UpdateTaskDto;

    const task =
      await this.taskService.updateTask(id, dto);

    return ApiResponse.success(
      res,
      task,
      "Task updated successfully"
    );
  };

  updateStatus = async (
    _req: Request,
    res: Response
  ) => {
    const { id } = res.locals.validated.params;

    const dto =
      res.locals.validated.body as UpdateTaskStatusDto;

    const task =
      await this.taskService.updateTaskStatus(id, dto);

    return ApiResponse.success(
      res,
      task,
      "Task status updated successfully"
    );
  };

  delete = async (
    _req: Request,
    res: Response
  ) => {
    const { id } = res.locals.validated.params;

    await this.taskService.deleteTask(id);

    return ApiResponse.success(
      res,
      null,
      "Task deleted successfully"
    );
  };
}