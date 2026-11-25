import type { ErrorRequestHandler } from "express";

import {
  Prisma,
} from "../generated/prisma/client.js";

import { AppError } from "../utils/app-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { logger } from "../config/logger.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return ApiResponse.error(
      res,
      error.message,
      error.statusCode,
      error.details
    );
  }

  if (
    error instanceof
    Prisma.PrismaClientKnownRequestError
  ) {
    if (error.code === "P2025") {
      return ApiResponse.error(
        res,
        "Task not found",
        404
      );
    }

    if (error.code === "P2002") {
      return ApiResponse.error(
        res,
        "A record with this value already exists",
        409
      );
    }
  }

  if (error?.type === "entity.parse.failed") {
    return ApiResponse.error(
      res,
      "Invalid JSON request body",
      400
    );
  }

  if (error?.type === "entity.too.large") {
    return ApiResponse.error(
      res,
      "Request body is too large",
      413
    );
  }

  logger.error(
    {
      err: error,
      method: req.method,
      path: req.path,
    },
    "Unhandled application error"
  );

  return ApiResponse.error(
    res,
    "Internal server error",
    500
  );
};