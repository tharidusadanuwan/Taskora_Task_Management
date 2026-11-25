import {
  ClipboardList,
  CircleCheck,
  Clock3,
  Timer,
  CircleAlert,
  TrendingUp,
} from "lucide-react";

import type {
  DashboardSummary,
} from "@/types/dashboard.types";

interface StatsCardsProps {
  summary: DashboardSummary;
}

export default function StatsCards({
  summary,
}: StatsCardsProps) {
  // ==========================================
  // STATISTICS CONFIGURATION
  // ==========================================

  const statistics = [
    {
      label: "Total Tasks",
      value: summary.totalTasks,
      description: "All tasks in workspace",
      icon: ClipboardList,

      color: `
        text-indigo-600
        dark:text-indigo-400
      `,

      background: `
        bg-indigo-50
        dark:bg-indigo-500/15
      `,
    },

    {
      label: "Completed",
      value: summary.completedTasks,
      description: "Successfully finished",
      icon: CircleCheck,

      color: `
        text-emerald-600
        dark:text-emerald-400
      `,

      background: `
        bg-emerald-50
        dark:bg-emerald-500/15
      `,
    },

    {
      label: "Pending",
      value: summary.pendingTasks,
      description: "Waiting to be started",
      icon: Clock3,

      color: `
        text-amber-600
        dark:text-amber-400
      `,

      background: `
        bg-amber-50
        dark:bg-amber-500/15
      `,
    },

    {
      label: "In Progress",
      value: summary.inProgressTasks,
      description: "Currently being worked on",
      icon: Timer,

      color: `
        text-blue-600
        dark:text-blue-400
      `,

      background: `
        bg-blue-50
        dark:bg-blue-500/15
      `,
    },

    {
      label: "Overdue",
      value: summary.overdueTasks,
      description: "Past their due date",
      icon: CircleAlert,

      color: `
        text-red-600
        dark:text-red-400
      `,

      background: `
        bg-red-50
        dark:bg-red-500/15
      `,
    },

    {
      label: "Completion Rate",
      value: `${summary.completionRate}%`,
      description: "Overall task progress",
      icon: TrendingUp,

      color: `
        text-violet-600
        dark:text-violet-400
      `,

      background: `
        bg-violet-50
        dark:bg-violet-500/15
      `,
    },
  ];

  // ==========================================
  // STATISTICS CARDS
  // ==========================================

  return (
    <section
      aria-label="Task statistics"
      className="
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-6
      "
    >
      {statistics.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="
              min-w-0 rounded-2xl
              border border-slate-200
              bg-white p-5
              transition-shadow duration-200
              hover:shadow-md

              dark:border-slate-700
              dark:bg-slate-800
              dark:hover:shadow-black/20
            "
          >
            {/* Icon */}

            <div
              className={`
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                ${item.background}
                ${item.color}
              `}
            >
              <Icon
                size={22}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            {/* Label */}

            <p
              className="
                mt-5 text-sm
                font-medium text-slate-500

                dark:text-slate-400
              "
            >
              {item.label}
            </p>

            {/* Value */}

            <h2
              className="
                mt-2 text-3xl
                font-bold tracking-tight
                text-slate-900

                dark:text-slate-100
              "
            >
              {item.value}
            </h2>

            {/* Description */}

            <p
              className="
                mt-2 text-xs
                leading-relaxed text-slate-400

                dark:text-slate-400
              "
            >
              {item.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}