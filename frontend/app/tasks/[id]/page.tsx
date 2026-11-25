import type { Metadata } from "next";
import { Suspense } from "react";

import TaskDetails from "@/components/tasks/TaskDetails";
import Loading from "@/components/ui/Loading";

export const metadata: Metadata = {
  title: "Task Details",
  description: "View and manage task details.",
};

interface TaskDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

// ==========================================
// TASK DETAILS CONTENT
// ==========================================

async function TaskDetailsContent({
  params,
}: TaskDetailsPageProps) {
  const { id } = await params;

  return <TaskDetails id={id} />;
}

// ==========================================
// TASK DETAILS PAGE
// ==========================================

export default function TaskDetailsPage({
  params,
}: TaskDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <Loading
          variant="page"
          message="Loading task details..."
        />
      }
    >
      <TaskDetailsContent params={params} />
    </Suspense>
  );
}