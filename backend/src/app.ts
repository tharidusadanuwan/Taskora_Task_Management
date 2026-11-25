import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

import apiRoutes from "./routes/index.js";

import {
  errorMiddleware,
} from "./middlewares/error.middleware.js";

import {
  notFoundMiddleware,
} from "./middlewares/not-found.middleware.js";

const app = express();

// ==========================================
// APPLICATION CONFIGURATION
// ==========================================

app.disable("x-powered-by");

// ==========================================
// REQUEST LOGGING
// ==========================================

app.use(
  pinoHttp({
    logger,

    genReqId: (_req, res) => {
      const id = randomUUID();

      res.setHeader("X-Request-Id", id);

      return id;
    },

    customLogLevel: (_req, res, error) => {
      if (error || res.statusCode >= 500) {
        return "error";
      }

      if (res.statusCode >= 400) {
        return "warn";
      }

      return "info";
    },
  })
);

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,

    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// RATE LIMITING
// ==========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 300,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// ==========================================
// BODY PARSING
// ==========================================

app.use(
  express.json({
    limit: "100kb",
  })
);

// ==========================================
// ROOT ENDPOINT
// ==========================================

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Taskora API",
    version: "1.0.0",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api", apiRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;