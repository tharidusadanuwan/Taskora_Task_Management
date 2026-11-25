import type { Metadata } from "next";

import TaskDetails from "@/components/tasks/TaskDetails";

export const metadata: Metadata = {
  title: "Task Details",
  description: "View and manage your task information.",
};

interface TaskDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskDetailsPage({
  params,
}: TaskDetailsPageProps) {
  const { id } = await params;

  return <TaskDetails id={id} />;
}