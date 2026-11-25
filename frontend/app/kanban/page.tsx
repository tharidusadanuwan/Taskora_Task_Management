import type { Metadata } from "next";

import KanbanBoard from "@/components/kanban/KanbanBoard";

export const metadata: Metadata = {
  title: "Kanban Board | Taskora",

  description:
    "Organize your tasks, visualize progress and manage your workflow with Taskora.",
};

export default function KanbanPage() {
  return <KanbanBoard />;
}