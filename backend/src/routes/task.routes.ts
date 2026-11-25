import { Router } from "express";

import { prisma } from "../config/database.js";

import {
  TaskRepository,
} from "../repositories/task.repository.js";

import {
  TaskService,
} from "../services/task.service.js";

import {
  TaskController,
} from "../controllers/task.controller.js";

import {
  TaskValidation,
} from "../validations/task.validation.js";

import {
  asyncHandler,
} from "../utils/async-handler.js";

const router = Router();

const taskRepository = new TaskRepository(prisma);

const taskService = new TaskService(taskRepository);

const taskController = new TaskController(taskService);

// GET /api/tasks
router.get(
  "/",
  TaskValidation.query,
  asyncHandler(taskController.getAll)
);

// GET /api/tasks/:id
router.get(
  "/:id",
  TaskValidation.id,
  asyncHandler(taskController.getById)
);

// POST /api/tasks
router.post(
  "/",
  TaskValidation.create,
  asyncHandler(taskController.create)
);

// PATCH /api/tasks/:id
router.patch(
  "/:id",
  TaskValidation.id,
  TaskValidation.update,
  asyncHandler(taskController.update)
);

// PATCH /api/tasks/:id/status
router.patch(
  "/:id/status",
  TaskValidation.id,
  TaskValidation.updateStatus,
  asyncHandler(taskController.updateStatus)
);

// DELETE /api/tasks/:id
router.delete(
  "/:id",
  TaskValidation.id,
  asyncHandler(taskController.delete)
);

export default router;