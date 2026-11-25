"use client";

import { useTheme } from "next-themes";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type {
  StatusBreakdown,
} from "@/types/dashboard.types";

import type {
  TaskStatus,
} from "@/types/task.types";

interface StatusChartProps {
  data: StatusBreakdown[];
}

// ==========================================
// STATUS CONFIGURATION
// ==========================================

const STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    color: string;
  }
> = {
  TODO: {
    label: "To Do",
    color: "#F59E0B",
  },

  IN_PROGRESS: {
    label: "In Progress",
    color: "#3B82F6",
  },

  COMPLETED: {
    label: "Completed",
    color: "#10B981",
  },
};

export default function StatusChart({
  data,
}: StatusChartProps) {
  // ==========================================
  // THEME CONFIGURATION
  // ==========================================

  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const chartTheme = {
    emptyColor: isDark
      ? "#334155"
      : "#E2E8F0",

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

  const statuses: TaskStatus[] = [
    "TODO",
    "IN_PROGRESS",
    "COMPLETED",
  ];

  const chartData = statuses.map((status) => ({
    name: STATUS_CONFIG[status].label,

    value:
      data.find(
        (item) => item.status === status
      )?.count ?? 0,

    color: STATUS_CONFIG[status].color,
  }));

  const totalTasks = chartData.reduce(
    (total, item) => total + item.value,
    0
  );

  const isEmpty = totalTasks === 0;

  const displayData = isEmpty
    ? [
        {
          name: "No tasks",
          value: 1,
          color: chartTheme.emptyColor,
        },
      ]
    : chartData.filter(
        (item) => item.value > 0
      );

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
          Task Status
        </h2>

        <p
          className="
            mt-1 text-sm text-slate-500
            dark:text-slate-400
          "
        >
          Distribution of tasks by status
        </p>
      </div>

      {/* =====================================
          CHART CONTENT
      ===================================== */}

      <div
        className="
          mt-6 grid min-w-0
          grid-cols-1 items-center
          gap-6 sm:grid-cols-2
        "
      >
        {/* Doughnut chart */}

        <div
          className="relative h-56 min-w-0"
          role="img"
          aria-label={`Task status chart. ${totalTasks} total tasks.`}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
          >
            <PieChart>
              <Pie
                data={displayData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="90%"
                paddingAngle={isEmpty ? 0 : 3}
                cornerRadius={5}
                stroke="none"
                isAnimationActive={!isEmpty}
                animationDuration={700}
              >
                {displayData.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                  />
                ))}
              </Pie>

              {/* Theme-aware tooltip */}

              {!isEmpty && (
                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      chartTheme.tooltipBackground,

                    borderRadius: "12px",

                    border: `1px solid ${chartTheme.tooltipBorder}`,

                    boxShadow:
                      chartTheme.tooltipShadow,

                    fontSize: "13px",

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
              )}
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}

          <div
            className="
              pointer-events-none
              absolute inset-0
              flex flex-col
              items-center justify-center
            "
          >
            <span
              className="
                text-3xl font-bold
                tracking-tight text-slate-900

                dark:text-slate-100
              "
            >
              {totalTasks}
            </span>

            <span
              className="
                mt-1 text-xs text-slate-500
                dark:text-slate-400
              "
            >
              Total Tasks
            </span>
          </div>
        </div>

        {/* =====================================
            STATUS LEGEND
        ===================================== */}

        <div className="space-y-5">
          {chartData.map((item) => {
            const percentage =
              totalTasks > 0
                ? Math.round(
                    (item.value / totalTasks) * 100
                  )
                : 0;

            return (
              <div key={item.name}>
                <div className="flex items-center justify-between gap-3">

                  {/* Status name */}

                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <span
                      className="
                        text-sm font-medium
                        text-slate-600

                        dark:text-slate-300
                      "
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Status count */}

                  <span
                    className="
                      text-sm font-bold
                      text-slate-900

                      dark:text-slate-100
                    "
                  >
                    {item.value}
                  </span>
                </div>

                {/* Status progress bar */}

                <div
                  className="
                    mt-2 h-1.5
                    overflow-hidden rounded-full
                    bg-slate-100

                    dark:bg-slate-700
                  "
                >
                  <div
                    className="
                      h-full rounded-full
                      transition-all duration-500
                    "
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                {/* Percentage */}

                <p
                  className="
                    mt-1 text-right text-xs
                    text-slate-400

                    dark:text-slate-400
                  "
                >
                  {percentage}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {isEmpty && (
        <p
          className="
            mt-4 rounded-lg
            bg-slate-50 px-4 py-3
            text-center text-xs text-slate-500

            dark:bg-slate-900/50
            dark:text-slate-400
          "
        >
          Create your first task to see status statistics.
        </p>
      )}
    </section>
  );
}