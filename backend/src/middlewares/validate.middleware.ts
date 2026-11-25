import type { RequestHandler } from "express";
import type { ObjectSchema } from "joi";
import { AppError } from "../utils/app-error.js";

type ValidationSource = "body" | "query" | "params";

export const validate = (
  schema: ObjectSchema,
  source: ValidationSource = "body"
): RequestHandler => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return next(
        new AppError("Validation failed", 400, details)
      );
    }

    res.locals.validated ??= {};
    res.locals.validated[source] = value;

    next();
  };
};