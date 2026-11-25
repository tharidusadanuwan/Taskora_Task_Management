import type { Metadata } from "next";

import { Suspense } from "react";

import TaskCalendar from
  "@/components/calendar/TaskCalendar";

import Loading from
  "@/components/ui/Loading";

export const metadata: Metadata = {
  title: "Task Calendar",

  description:
    "Plan your schedule, manage deadlines and organize your tasks with Taskora.",
};

export default function CalendarPage() {
  return (
    <Suspense
      fallback={
        <Loading
          variant="page"
          message="Loading Task Calendar..."
          description="Preparing your calendar."
        />
      }
    >
      <TaskCalendar />
    </Suspense>
  );
}