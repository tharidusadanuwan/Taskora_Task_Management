"use client";

import {
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import Button from "@/components/ui/Button";
import LastUpdated from "@/components/ui/LastUpdated";

interface CalendarHeaderProps {
  dataUpdatedAt: number;
  isFetching: boolean;
  onRefresh: () => void;
}

export default function CalendarHeader({
  dataUpdatedAt,
  isFetching,
  onRefresh,
}: CalendarHeaderProps) {
  return (
    <section
      className="
        flex flex-col gap-4
        sm:flex-row sm:items-center
        sm:justify-between
      "
    >
      <div>
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl bg-indigo-50
              text-indigo-600
              dark:bg-indigo-500/15
              dark:text-indigo-400
            "
          >
            <CalendarDays size={23} />
          </div>

          <h1
            className="
              text-2xl font-bold tracking-tight
              text-slate-900 sm:text-3xl
              dark:text-slate-100
            "
          >
            Task Calendar
          </h1>
        </div>

        <p
          className="
            mt-2 text-sm text-slate-500
            dark:text-slate-400
          "
        >
          Plan your schedule, manage deadlines
          and organize your upcoming tasks.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <LastUpdated
          dataUpdatedAt={dataUpdatedAt}
        />

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isFetching}
          leftIcon={
            <RefreshCw
              size={17}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />
          }
        >
          Refresh
        </Button>
      </div>
    </section>
  );
}