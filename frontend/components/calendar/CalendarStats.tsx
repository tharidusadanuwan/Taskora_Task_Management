import {
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  LoaderCircle,
  CircleCheck,
  CircleAlert,
} from "lucide-react";

import type {
  CalendarStatistics,
} from "@/types/calendar.types";

interface CalendarStatsProps {
  statistics: CalendarStatistics;
}

export default function CalendarStats({
  statistics,
}: CalendarStatsProps) {
  const cards = [
    {
      label: "Scheduled Tasks",
      value: statistics.scheduledTasks,
      icon: CalendarDays,
      color: "text-indigo-600 dark:text-indigo-400",
      background: "bg-indigo-50 dark:bg-indigo-500/15",
    },
    {
      label: "Due Today",
      value: statistics.todayTasks,
      icon: CalendarCheck,
      color: "text-violet-600 dark:text-violet-400",
      background: "bg-violet-50 dark:bg-violet-500/15",
    },
    {
      label: "Upcoming",
      value: statistics.upcomingTasks,
      icon: CalendarClock,
      color: "text-amber-600 dark:text-amber-400",
      background: "bg-amber-50 dark:bg-amber-500/15",
    },
    {
      label: "In Progress",
      value: statistics.inProgressTasks,
      icon: LoaderCircle,
      color: "text-blue-600 dark:text-blue-400",
      background: "bg-blue-50 dark:bg-blue-500/15",
    },
    {
      label: "Completed",
      value: statistics.completedTasks,
      icon: CircleCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      background: "bg-emerald-50 dark:bg-emerald-500/15",
    },
    {
      label: "Overdue",
      value: statistics.overdueTasks,
      icon: CircleAlert,
      color: "text-red-600 dark:text-red-400",
      background: "bg-red-50 dark:bg-red-500/15",
    },
  ];

  return (
    <section
      aria-label="Calendar statistics"
      className="
        grid grid-cols-2 gap-3
        lg:grid-cols-3
        2xl:grid-cols-6
      "
    >
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="
              flex min-w-0 items-center gap-3
              rounded-xl border border-slate-200
              bg-white p-3 sm:p-4
              transition-colors
              dark:border-slate-700
              dark:bg-slate-800
            "
          >
            <div
              className={`
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl sm:h-12 sm:w-12
                ${item.background}
                ${item.color}
              `}
            >
              <Icon size={22} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-xs font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {item.label}
              </p>

              <h2
                className="
                  mt-1 text-2xl font-bold
                  text-slate-900
                  dark:text-slate-100
                "
              >
                {item.value}
              </h2>
            </div>
          </div>
        );
      })}
    </section>
  );
}