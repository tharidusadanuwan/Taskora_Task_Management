import "dotenv/config";
import Joi from "joi";

interface Environment {
  APP_NAME: string;
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  LOG_LEVEL: string;
}

const envSchema = Joi.object({
  APP_NAME: Joi.string().default("Taskora API"),

  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  PORT: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .default(8000),

  DATABASE_URL: Joi.string().required(),

  FRONTEND_URL: Joi.string()
    .uri()
    .default("http://localhost:3000"),

  LOG_LEVEL: Joi.string()
    .valid("fatal", "error", "warn", "info", "debug", "trace", "silent")
    .default("info"),
}).unknown(true);

const { error, value } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(
    `Environment configuration error: ${error.message}`
  );
}

export const env = value as Environment;