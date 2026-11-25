import Joi from "joi";

import {
  TaskStatus,
  TaskPriority,
} from "../generated/prisma/enums.js";

const title = Joi.string()
  .trim()
  .min(3)
  .max(150)
  .messages({
    "string.empty": "Task title is required",
    "string.min": "Title must contain at least 3 characters",
    "string.max": "Title cannot exceed 150 characters",
    "any.required": "Task title is required",
  });

const description = Joi.string()
  .trim()
  .allow("")
  .max(5000)
  .messages({
    "string.max": "Description cannot exceed 5000 characters",
  });

const status = Joi.string()
  .valid(...Object.values(TaskStatus))
  .messages({
    "any.only": "Status must be TODO, IN_PROGRESS or COMPLETED",
  });

const priority = Joi.string()
  .valid(...Object.values(TaskPriority))
  .messages({
    "any.only": "Priority must be LOW, MEDIUM or HIGH",
  });

const dueDate = Joi.string()
  .isoDate()
  .messages({
    "string.isoDate": "Due date must be a valid ISO date",
    "any.required": "Due date is required",
  });

export const createTaskSchema = Joi.object({
  title: title.required(),
  description: description.default(""),
  status: status.default(TaskStatus.TODO),
  priority: priority.default(TaskPriority.MEDIUM),
  dueDate: dueDate.required(),
}).unknown(false);

export const updateTaskSchema = Joi.object({
  title,
  description,
  status,
  priority,
  dueDate,
})
  .min(1)
  .unknown(false)
  .messages({
    "object.min": "Provide at least one field to update",
  });

export const updateTaskStatusSchema = Joi.object({
  status: status.required(),
}).unknown(false);

export const taskIdSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({
      "string.guid": "Invalid task ID",
      "any.required": "Task ID is required",
    }),
}).unknown(false);

export const taskQuerySchema = Joi.object({
  search: Joi.string()
    .trim()
    .max(150)
    .allow("")
    .optional(),

  status: status.optional(),

  priority: priority.optional(),

  page: Joi.number()
    .integer()
    .min(1)
    .max(100000)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  sortBy: Joi.string()
    .valid("createdAt", "dueDate")
    .default("createdAt"),

  sortOrder: Joi.string()
    .valid("asc", "desc")
    .default("desc"),
}).unknown(false);