import { Router } from "express";

import taskRoutes from "./task.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

import { env } from "../config/env.js";
import { ApiResponse } from "../utils/api-response.js";

const router = Router();

// ==========================================
// HEALTH CHECK
// ==========================================

router.get("/health", (_req, res) => {
  return ApiResponse.success(
    res,
    {
      service: env.APP_NAME,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    "Taskora API is running"
  );
});

// ==========================================
// API ROUTES
// ==========================================

router.use("/tasks", taskRoutes);

router.use("/dashboard", dashboardRoutes);

export default router;