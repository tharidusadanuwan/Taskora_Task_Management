"use client";

import Link from "next/link";

import {
  RefreshCw,
  CircleAlert,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";
import { getApiError } from "@/utils/api-error";

import LastUpdated from "@/components/ui/LastUpdated";

import StatsCards from "./StatsCards";
import StatusChart from "./StatusChart";
import PriorityChart from "./PriorityChart";
import RecentTasks from "./RecentTasks";

// ==========================================
// DASHBOARD LOADING SKELETON
// ==========================================

function DashboardSkeleton() {
  return (
    <div
      className="animate-pulse space-y-6"
      role="status"
      aria-label="Loading dashboard"
    >
      {/* Header skeleton */}

      <div className="space-y-3">
        <div className="h-8 w-64 max-w-full rounded-lg bg-slate-200 dark:bg-slate-700" />

        <div className="h-4 w-80 max-w-full rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Statistics skeleton */}

      <div
        className="
          grid grid-cols-1 gap-4
          sm:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-6
        "
      >
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="
                rounded-2xl border
                border-slate-200
                bg-white p-5

                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-700" />

              <div className="mt-5 h-4 w-24 rounded bg-slate-100 dark:bg-slate-700" />

              <div className="mt-3 h-8 w-16 rounded bg-slate-200 dark:bg-slate-600" />

              <div className="mt-3 h-3 w-full rounded bg-slate-100 dark:bg-slate-700" />
            </div>
          )
        )}
      </div>

      {/* Progress skeleton */}

      <div
        className="
          h-36 rounded-2xl border
          border-slate-200 bg-white
          dark:border-slate-700
          dark:bg-slate-800
        "
      />

      {/* Charts skeleton */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div
          className="
            h-96 rounded-2xl border
            border-slate-200 bg-white
            dark:border-slate-700
            dark:bg-slate-800
          "
        />

        <div
          className="
            h-96 rounded-2xl border
            border-slate-200 bg-white
            dark:border-slate-700
            dark:bg-slate-800
          "
        />
      </div>

      {/* Table skeleton */}

      <div
        className="
          h-80 rounded-2xl border
          border-slate-200 bg-white
          dark:border-slate-700
          dark:bg-slate-800
        "
      />

      <span className="sr-only">
        Loading your workspace...
      </span>
    </div>
  );
}

// ==========================================
// MAIN DASHBOARD
// ==========================================

export default function Dashboard() {
  const {
    data,
    error,
    isPending,
    isError,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useDashboard();

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (isPending) {
    return <DashboardSkeleton />;
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (!data) {
    return (
      <div
        className="
          flex min-h-[60vh]
          flex-col items-center
          justify-center
          rounded-2xl border
          border-slate-200 bg-white
          px-6 py-12 text-center

          dark:border-slate-700
          dark:bg-slate-800
        "
      >
        <div
          className="
            flex h-16 w-16
            items-center justify-center
            rounded-2xl bg-red-50
            text-red-500

            dark:bg-red-500/15
            dark:text-red-400
          "
        >
          <CircleAlert size={32} />
        </div>

        <h2
          className="
            mt-5 text-xl font-bold
            text-slate-900
            dark:text-slate-100
          "
        >
          Unable to load dashboard
        </h2>

        <p
          className="
            mt-2 max-w-md
            text-sm leading-relaxed
            text-slate-500
            dark:text-slate-400
          "
        >
          {getApiError(error)}
        </p>

        <button
          type="button"
          disabled={isFetching}
          onClick={() => refetch()}
          className="
            mt-6 inline-flex
            items-center gap-2
            rounded-lg bg-indigo-600
            px-5 py-3
            text-sm font-semibold
            text-white
            transition-colors
            hover:bg-indigo-700
            disabled:cursor-not-allowed
            disabled:opacity-60

            dark:bg-indigo-600
            dark:hover:bg-indigo-700
          "
        >
          <RefreshCw
            size={17}
            className={
              isFetching ? "animate-spin" : ""
            }
          />

          {isFetching
            ? "Retrying..."
            : "Try Again"}
        </button>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD DATA
  // ==========================================

  const {
    summary,
    statusBreakdown,
    priorityBreakdown,
    recentTasks,
  } = data;

  const completionRate = Math.min(
    100,
    Math.max(0, summary.completionRate)
  );

  const remainingTasks = Math.max(
    0,
    summary.totalTasks -
      summary.completedTasks
  );

  return (
    <div className="space-y-6">

      {/* =====================================
          DASHBOARD INTRODUCTION
      ===================================== */}

      <section
        className="
          flex flex-col gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h1
            className="
              text-2xl font-bold
              tracking-tight text-slate-900
              sm:text-3xl

              dark:text-slate-100
            "
          >
            Dashboard overview
          </h1>

          <p
            className="
              mt-2 text-sm text-slate-500
              dark:text-slate-400
            "
          >
            Here&apos;s what&apos;s happening
            with your tasks today.
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* Last updated timestamp */}

          <LastUpdated
            dataUpdatedAt={dataUpdatedAt}
          />

          {/* Refresh button */}

          <button
            type="button"
            disabled={isFetching}
            onClick={() => refetch()}
            className="
              inline-flex items-center
              justify-center gap-2
              rounded-lg border
              border-slate-200 bg-white
              px-4 py-2.5
              text-sm font-medium
              text-slate-600
              transition-colors
              hover:border-indigo-200
              hover:text-indigo-600
              disabled:cursor-not-allowed
              disabled:opacity-60

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-300
              dark:hover:border-indigo-500/50
              dark:hover:bg-slate-700
              dark:hover:text-indigo-400
            "
          >
            <RefreshCw
              size={16}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            {isFetching
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>
      </section>

      {/* =====================================
          BACKGROUND REFRESH ERROR
      ===================================== */}

      {isError && (
        <div
          role="alert"
          className="
            flex items-center gap-3
            rounded-xl border
            border-amber-200
            bg-amber-50 p-4
            text-sm text-amber-800

            dark:border-amber-500/30
            dark:bg-amber-500/10
            dark:text-amber-300
          "
        >
          <CircleAlert
            size={19}
            className="shrink-0"
          />

          Unable to refresh the dashboard.
          Showing the last available data.
        </div>
      )}

      {/* =====================================
          STATISTICS CARDS
      ===================================== */}

      <StatsCards summary={summary} />

      {/* =====================================
          COMPLETION PROGRESS
      ===================================== */}

      <section
        className="
          rounded-2xl border
          border-slate-200
          bg-white p-5 sm:p-6

          dark:border-slate-700
          dark:bg-slate-800
        "
      >
        <div
          className="
            flex flex-col gap-5
            sm:flex-row sm:items-center
            sm:justify-between
          "
        >
          <div className="flex items-center gap-4">

            {/* Progress icon */}

            <div
              className="
                flex h-12 w-12
                shrink-0 items-center
                justify-center
                rounded-xl bg-indigo-50
                text-indigo-600

                dark:bg-indigo-500/15
                dark:text-indigo-400
              "
            >
              <TrendingUp
                size={24}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2
                className="
                  text-base font-bold
                  text-slate-900
                  dark:text-slate-100
                "
              >
                Overall Task Progress
              </h2>

              <p
                className="
                  mt-1 text-sm text-slate-500
                  dark:text-slate-400
                "
              >
                {summary.completedTasks} of{" "}
                {summary.totalTasks} tasks completed
              </p>
            </div>
          </div>

          <Link
            href="/tasks"
            className="
              inline-flex items-center gap-2
              self-start text-sm font-semibold
              text-indigo-600
              hover:text-indigo-700
              sm:self-auto

              dark:text-indigo-400
              dark:hover:text-indigo-300
            "
          >
            Manage Tasks

            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Progress information */}

        <div className="mt-6 flex items-center justify-between">
          <span
            className="
              text-sm font-medium text-slate-600
              dark:text-slate-300
            "
          >
            Completion Rate
          </span>

          <span
            className="
              text-lg font-bold text-indigo-600
              dark:text-indigo-400
            "
          >
            {completionRate}%
          </span>
        </div>

        {/* Progress bar */}

        <div
          role="progressbar"
          aria-label="Overall task completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completionRate}
          className="
            mt-3 h-3 w-full
            overflow-hidden rounded-full
            bg-slate-100

            dark:bg-slate-700
          "
        >
          <div
            className="
              h-full rounded-full
              bg-indigo-600
              transition-all duration-700

              dark:bg-indigo-500
            "
            style={{
              width: `${completionRate}%`,
            }}
          />
        </div>

        <p
          className="
            mt-3 text-xs text-slate-500
            dark:text-slate-400
          "
        >
          {summary.totalTasks === 0
            ? "Create your first task to start tracking your progress."
            : remainingTasks === 0
              ? "Great work! All your tasks are completed."
              : `${remainingTasks} ${
                  remainingTasks === 1
                    ? "task"
                    : "tasks"
                } remaining to be completed.`}
        </p>
      </section>

      {/* =====================================
          DASHBOARD CHARTS
      ===================================== */}

      <div
        className="
          grid min-w-0
          grid-cols-1 gap-6
          xl:grid-cols-2
        "
      >
        <StatusChart
          data={statusBreakdown}
        />

        <PriorityChart
          data={priorityBreakdown}
        />
      </div>

      {/* =====================================
          RECENT TASKS
      ===================================== */}

      <RecentTasks tasks={recentTasks} />
    </div>
  );
}