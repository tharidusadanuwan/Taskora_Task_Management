"use client";

import { useDroppable } from "@dnd-kit/core";

import {
  Plus,
  Clock3,
  LoaderCircle,
  CircleCheck,
  ClipboardList,
} from "lucide-react";

import KanbanCard from "./KanbanCard";

import type {
  Task,
  TaskStatus,
} from "@/types/task.types";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  updatingTaskId?: string | null;
  onAddTask: (status: TaskStatus) => void;
  onStatusChange: (
    taskId: string,
    status: TaskStatus
  ) => void;
}

// ==========================================
// COLUMN CONFIGURATION
// ==========================================

const columnConfig = {
  TODO: {
    title: "To Do",
    description: "Tasks waiting to be started",
    icon: Clock3,
    iconColor:
      "text-amber-600 dark:text-amber-400",
    iconBackground:
      "bg-amber-100 dark:bg-amber-500/15",
    dotColor: "bg-amber-500",
    borderColor:
      "border-t-amber-400 dark:border-t-amber-500",
    countColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },

  IN_PROGRESS: {
    title: "In Progress",
    description: "Tasks currently being worked on",
    icon: LoaderCircle,
    iconColor:
      "text-blue-600 dark:text-blue-400",
    iconBackground:
      "bg-blue-100 dark:bg-blue-500/15",
    dotColor: "bg-blue-500",
    borderColor:
      "border-t-blue-400 dark:border-t-blue-500",
    countColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },

  COMPLETED: {
    title: "Completed",
    description: "Successfully finished tasks",
    icon: CircleCheck,
    iconColor:
      "text-emerald-600 dark:text-emerald-400",
    iconBackground:
      "bg-emerald-100 dark:bg-emerald-500/15",
    dotColor: "bg-emerald-500",
    borderColor:
      "border-t-emerald-400 dark:border-t-emerald-500",
    countColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
};

export default function KanbanColumn({
  status,
  tasks,
  updatingTaskId,
  onAddTask,
  onStatusChange,
}: KanbanColumnProps) {
  const config = columnConfig[status];

  const Icon = config.icon;

  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: status,
    data: {
      status,
      type: "COLUMN",
    },
  });

  return (
    <section
      ref={setNodeRef}
      aria-label={`${config.title} tasks`}
      className={`
        flex min-h-[500px] min-w-0
        flex-col rounded-2xl
        border border-t-4
        p-3 sm:p-4
        transition-colors duration-200

        ${config.borderColor}

        ${
          isOver
            ? `
              border-indigo-300
              bg-indigo-50
              ring-2 ring-indigo-200

              dark:border-indigo-500/60
              dark:bg-indigo-500/10
              dark:ring-indigo-500/30
            `
            : `
              border-slate-200
              bg-slate-100/80

              dark:border-slate-700
              dark:bg-slate-900/70
            `
        }
      `}
    >
      {/* =====================================
          COLUMN HEADER
      ===================================== */}

      <header className="mb-5">
        <div className="flex items-center justify-between gap-2">

          <div className="flex min-w-0 items-center gap-2">

            {/* Column icon */}

            <div
              className={`
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg
                ${config.iconBackground}
                ${config.iconColor}
              `}
            >
              <Icon size={18} />
            </div>

            {/* Column title */}

            <h2
              className="
                text-sm font-bold text-slate-800
                dark:text-slate-100
              "
            >
              {config.title}
            </h2>

            {/* Task count */}

            <span
              className={`
                flex h-6 min-w-6
                items-center justify-center
                rounded-full px-1.5
                text-xs font-bold
                ${config.countColor}
              `}
            >
              {tasks.length}
            </span>
          </div>

          {/* Add task icon */}

          <button
            type="button"
            onClick={() => onAddTask(status)}
            aria-label={`Add ${config.title} task`}
            title="Add task"
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg text-slate-500
              transition-colors

              hover:bg-white
              hover:text-indigo-600

              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-indigo-400
            "
          >
            <Plus size={20} />
          </button>
        </div>

        <p
          className="
            mt-2 text-xs text-slate-500
            dark:text-slate-400
          "
        >
          {config.description}
        </p>
      </header>

      {/* =====================================
          TASK CARDS
      ===================================== */}

      <div className="flex flex-1 flex-col gap-3">

        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            isUpdating={
              updatingTaskId === task.id
            }
            onStatusChange={onStatusChange}
          />
        ))}

        {/* =====================================
            EMPTY COLUMN
        ===================================== */}

        {tasks.length === 0 && (
          <div
            className="
              flex min-h-40 flex-col
              items-center justify-center
              rounded-xl border-2
              border-dashed border-slate-200
              px-4 py-6 text-center

              dark:border-slate-700
            "
          >
            <ClipboardList
              size={30}
              strokeWidth={1.5}
              className="
                text-slate-300
                dark:text-slate-600
              "
            />

            <p
              className="
                mt-3 text-sm font-semibold
                text-slate-500
                dark:text-slate-400
              "
            >
              No tasks
            </p>

            <p
              className="
                mt-1 text-xs text-slate-400
                dark:text-slate-500
              "
            >
              Drag a task here or add a new one.
            </p>
          </div>
        )}

        {/* =====================================
            DROP INDICATOR
        ===================================== */}

        {isOver && (
          <div
            className="
              rounded-xl border-2
              border-dashed border-indigo-400
              bg-indigo-100/70
              px-4 py-5 text-center
              text-xs font-semibold
              text-indigo-600

              dark:border-indigo-500
              dark:bg-indigo-500/15
              dark:text-indigo-300
            "
          >
            Drop task here
          </div>
        )}

        {/* =====================================
            ADD TASK BUTTON
        ===================================== */}

        <button
          type="button"
          onClick={() => onAddTask(status)}
          className="
            flex w-full items-center
            justify-center gap-2
            rounded-xl border
            border-dashed border-slate-300
            px-4 py-3
            text-sm font-medium
            text-slate-500
            transition-colors

            hover:border-indigo-400
            hover:bg-indigo-50
            hover:text-indigo-600

            dark:border-slate-700
            dark:text-slate-400
            dark:hover:border-indigo-500
            dark:hover:bg-indigo-500/10
            dark:hover:text-indigo-400
          "
        >
          <Plus size={17} />

          Add Task
        </button>
      </div>
    </section>
  );
}