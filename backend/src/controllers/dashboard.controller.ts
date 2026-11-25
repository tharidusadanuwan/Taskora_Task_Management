import type { Request, Response } from "express";

import {
  DashboardService,
} from "../services/dashboard.service.js";

import {
  ApiResponse,
} from "../utils/api-response.js";

export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService
  ) {}

  getDashboard = async (
    _req: Request,
    res: Response
  ) => {
    const dashboard =
      await this.dashboardService.getDashboard();

    return ApiResponse.success(
      res,
      dashboard,
      "Dashboard statistics retrieved successfully"
    );
  };
}