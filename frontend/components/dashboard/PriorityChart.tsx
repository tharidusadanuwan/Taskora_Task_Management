"use client";

import { useTheme } from "next-themes";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type {
  PriorityBreakdown,
} from "@/types/dashboard.types";

import type {
  TaskPriority,
} from "@/types/task.types";

interface PriorityChartProps {
  data: PriorityBreakdown[];
}

// ==========================================
// PRIORITY CONFIGURATION
// ==========================================

const PRIORITY_CONFIG: Record<
  TaskPriority,
  {
    label: string;
    color: string;
  }
> = {
  LOW: {
    label: "Low",
    color: "#10B981",
  },

  MEDIUM: {
    label: "Medium",
    color: "#F59E0B",
  },

  HIGH: {
    label: "High",
    color: "#EF4444",
  },
};

export default function PriorityChart({
  data,
}: PriorityChartProps) {
  // ==========================================
  // THEME CONFIGURATION
  // ==========================================

  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const chartTheme = {
    gridColor: isDark
      ? "#334155"
      : "#E2E8F0",

    xAxisColor: "#94A3B8",

    yAxisColor: isDark
      ? "#CBD5E1"
      : "#64748B",

    cursorColor: isDark
      ? "#334155"
      : "#F8FAFC",

    tooltipBackground: isDark
      ? "#1E293B"
      : "#FFFFFF",

    tooltipBorder: isDark
      ? "#475569"
      : "#E2E8F0",

    tooltipText: isDark
      ? "#F1F5F9"
      : "#334155",

    tooltipShadow: isDark
      ? "0 4px 12px rgba(0,0,0,0.30)"
      : "0 4px 12px rgba(0,0,0,0.05)",
  };

  // ==========================================
  // PREPARE CHART DATA
  // ==========================================

  const priorities: TaskPriority[] = [
    "LOW",
    "MEDIUM",
    "HIGH",
  ];

  const chartData = priorities.map(
    (priority) => ({
      name: PRIORITY_CONFIG[priority].label,

      count:
        data.find(
          (item) =>
            item.priority === priority
        )?.count ?? 0,

      color: PRIORITY_CONFIG[priority].color,
    })
  );

  const totalTasks = chartData.reduce(
    (total, item) => total + item.count,
    0
  );

  const highPriority =
    chartData.find(
      (item) => item.name === "High"
    )?.count ?? 0;

  return (
    <section
      className="
        min-w-0 rounded-2xl
        border border-slate-200
        bg-white p-5 sm:p-6

        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      {/* =====================================
          CHART HEADER
      ===================================== */}

      <div>
        <h2
          className="
            text-lg font-bold text-slate-900
            dark:text-slate-100
          "
        >
          Task Priority
        </h2>

        <p
          className="
            mt-1 text-sm text-slate-500
            dark:text-slate-400
          "
        >
          Tasks grouped by priority level
        </p>
      </div>

      {/* =====================================
          BAR CHART
      ===================================== */}

      <div
        className="mt-6 h-56 min-w-0"
        role="img"
        aria-label="Task distribution by priority"
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 10,
              right: 15,
              bottom: 5,
              left: 0,
            }}
            barCategoryGap="35%"
          >
            {/* Theme-aware grid */}

            <CartesianGrid
              horizontal={false}
              strokeDasharray="4 4"
              stroke={chartTheme.gridColor}
            />

            {/* X-axis */}

            <XAxis
              type="number"
              allowDecimals={false}
              domain={[
                0,
                (dataMax: number) =>
                  Math.max(4, dataMax),
              ]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: chartTheme.xAxisColor,
                fontSize: 12,
              }}
            />

            {/* Y-axis */}

            <YAxis
              type="category"
              dataKey="name"
              width={65}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: chartTheme.yAxisColor,
                fontSize: 13,
              }}
            />

            {/* Theme-aware tooltip */}

            <Tooltip
              cursor={{
                fill: chartTheme.cursorColor,
              }}
              contentStyle={{
                backgroundColor:
                  chartTheme.tooltipBackground,

                borderRadius: "12px",

                border: `1px solid ${chartTheme.tooltipBorder}`,

                fontSize: "13px",

                boxShadow:
                  chartTheme.tooltipShadow,

                color:
                  chartTheme.tooltipText,
              }}
              labelStyle={{
                color:
                  chartTheme.tooltipText,

                fontWeight: 600,
              }}
              itemStyle={{
                color:
                  chartTheme.tooltipText,
              }}
            />

            {/* Priority bars */}

            <Bar
              dataKey="count"
              name="Tasks"
              radius={[0, 6, 6, 0]}
              maxBarSize={30}
              animationDuration={700}
            >
              {chartData.map((item) => (
                <Cell
                  key={item.name}
                  fill={item.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* =====================================
          PRIORITY SUMMARY
      ===================================== */}

      <div
        className="
          mt-5 grid grid-cols-3
          divide-x divide-slate-200
          rounded-xl bg-slate-50
          py-4

          dark:divide-slate-700
          dark:bg-slate-900/50
        "
      >
        {chartData.map((item) => (
          <div
            key={item.name}
            className="px-2 text-center"
          >
            <div className="flex items-center justify-center gap-2">

              {/* Priority color */}

              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              {/* Priority name */}

              <span
                className="
                  text-xs font-medium
                  text-slate-500

                  dark:text-slate-400
                "
              >
                {item.name}
              </span>
            </div>

            {/* Priority count */}

            <p
              className="
                mt-2 text-xl font-bold
                text-slate-900

                dark:text-slate-100
              "
            >
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {/* =====================================
          PRIORITY INFORMATION
      ===================================== */}

      <p
        className="
          mt-4 text-xs text-slate-500
          dark:text-slate-400
        "
      >
        {totalTasks === 0
          ? "No tasks have been assigned a priority yet."
          : highPriority > 0
            ? `${highPriority} high-priority ${
                highPriority === 1
                  ? "task"
                  : "tasks"
              } in your workspace.`
            : "No high-priority tasks in your workspace."}
      </p>
    </section>
  );
}