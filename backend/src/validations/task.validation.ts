import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskIdSchema,
  taskQuerySchema,
} from "../schemas/task.schema.js";

import { validate } from "../middlewares/validate.middleware.js";

export const TaskValidation = {
  create: validate(createTaskSchema, "body"),

  update: validate(updateTaskSchema, "body"),

  updateStatus: validate(updateTaskStatusSchema, "body"),

  id: validate(taskIdSchema, "params"),

  query: validate(taskQuerySchema, "query"),
};