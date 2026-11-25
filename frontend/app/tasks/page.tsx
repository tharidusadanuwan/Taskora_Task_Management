import { Suspense } from "react";
import type { Metadata } from "next";
import { LoaderCircle } from "lucide-react";

import TaskList from "@/components/tasks/TaskList";

export const metadata: Metadata = {
  title: "All Tasks",
  description: "Create, organize and manage your tasks.",
};

function TaskListLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <LoaderCircle
        size={32}
        className="animate-spin text-indigo-600 dark:text-indigo-400"
      />

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Loading tasks...
      </p>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<TaskListLoading />}>
      <TaskList />
    </Suspense>
  );
}