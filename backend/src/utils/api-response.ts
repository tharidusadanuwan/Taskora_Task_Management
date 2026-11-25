import type { Response } from "express";

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    details?: unknown
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(details !== undefined && {
        errors: details,
      }),
    });
  }
}