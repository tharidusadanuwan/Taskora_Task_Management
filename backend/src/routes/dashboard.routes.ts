import { Router } from "express";

import { prisma } from "../config/database.js";

import {
  DashboardRepository,
} from "../repositories/dashboard.repository.js";

import {
  DashboardService,
} from "../services/dashboard.service.js";

import {
  DashboardController,
} from "../controllers/dashboard.controller.js";

import {
  asyncHandler,
} from "../utils/async-handler.js";

const router = Router();

// ==========================================
// DEPENDENCY INJECTION
// ==========================================

const dashboardRepository =
  new DashboardRepository(prisma);

const dashboardService =
  new DashboardService(dashboardRepository);

const dashboardController =
  new DashboardController(dashboardService);

// ==========================================
// DASHBOARD ROUTES
// ==========================================

router.get(
  "/",
  asyncHandler(dashboardController.getDashboard)
);

export default router;