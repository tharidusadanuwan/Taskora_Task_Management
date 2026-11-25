import api from "./api";

import type {
  ApiResponse,
} from "@/types/api.types";

import type {
  DashboardData,
} from "@/types/dashboard.types";

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response =
      await api.get<ApiResponse<DashboardData>>(
        "/dashboard"
      );

    return response.data.data;
  },
};