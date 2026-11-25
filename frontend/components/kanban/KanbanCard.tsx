"use client";

import Link from "next/link";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import {
  CalendarDays,
  GripVertical,
  ArrowUpRight,
  CircleAlert,
} from "lucide-react";

import PriorityBadge from "@/components/ui/PriorityBadge";

import type {
  Task,
  TaskStatus,
} from "@/types/task.types";

interface KanbanCardProps {
  task: Task;
  isUpdating?: boolean;
  onStatusChange?: (
    taskId: string,
    status: TaskStatus
  ) => void;
}

// ==========================================
// DATE FORMATTER
// ==========================================

function formatDueDate(date: string): string {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

// ==========================================
// CARD CONTENT
// ==========================================

export function KanbanCardContent({
  task,
  isUpdating = false,
  onStatusChange,
}: KanbanCardProps) {
  const overdue =
    task.isOverdue &&
    task.status !== "COMPLETED";

  return (
    <div className="space-y-3">

      {/* =====================================
          PRIORITY AND OVERDUE BADGES
      ===================================== */}

      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge
          priority={task.priority}
          size="sm"
        />

        {overdue && (
          <span
            className="
              inline-flex items-center gap-1
              rounded-full bg-red-50
              px-2 py-1 text-[11px]
              font-semibold text-red-600

              dark:bg-red-500/15
              dark:text-red-400
            "
          >
            <CircleAlert size={12} />

            Overdue
          </span>
        )}
      </div>

      {/* =====================================
          TASK TITLE
      ===================================== */}

      <Link
        href={`/tasks/${task.id}`}
        className="
          block break-words text-sm
          font-bold leading-relaxed
          text-slate-900
          transition-colors
          hover:text-indigo-600

          dark:text-slate-100
          dark:hover:text-indigo-400
        "
      >
        {task.title}
      </Link>

      {/* =====================================
          DESCRIPTION
      ===================================== */}

      <p
        className="
          line-clamp-3 break-words
          text-xs leading-relaxed
          text-slate-500

          dark:text-slate-400
        "
      >
        {task.description ||
          "No description provided."}
      </p>

      {/* =====================================
          DUE DATE AND DETAILS LINK
      ===================================== */}

      <div
        className="
          flex flex-wrap items-center
          justify-between gap-2
          border-t border-slate-100 pt-3

          dark:border-slate-700
        "
      >
        <div
          className={`
            flex items-center gap-1.5
            text-xs font-medium

            ${
              overdue
                ? "text-red-600 dark:text-red-400"
                : "text-slate-500 dark:text-slate-400"
            }
          `}
        >
          <CalendarDays
            size={14}
            strokeWidth={1.8}
          />

          {formatDueDate(task.dueDate)}
        </div>

        <Link
          href={`/tasks/${task.id}`}
          aria-label={`View ${task.title}`}
          title="View task details"
          className="
            flex h-8 w-8 items-center
            justify-center rounded-lg
            text-slate-400
            transition-colors

            hover:bg-indigo-50
            hover:text-indigo-600

            dark:text-slate-400
            dark:hover:bg-indigo-500/15
            dark:hover:text-indigo-400
          "
        >
          <ArrowUpRight size={17} />
        </Link>
      </div>

      {/* =====================================
          ACCESSIBLE STATUS SELECTOR
      ===================================== */}

      {onStatusChange && (
        <select
          aria-label={`Change status of ${task.title}`}
          value={task.status}
          disabled={isUpdating}
          onChange={(event) =>
            onStatusChange(
              task.id,
              event.target.value as TaskStatus
            )
          }
          className="
            w-full rounded-lg
            border border-slate-200
            bg-slate-50 px-3 py-2
            text-xs font-medium
            text-slate-600 outline-none
            transition-colors

            focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-100

            disabled:cursor-not-allowed
            disabled:opacity-50

            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-300
            dark:focus:border-indigo-500
            dark:focus:ring-indigo-500/20
            dark:scheme-dark
          "
        >
          <option value="TODO">
            To Do
          </option>

          <option value="IN_PROGRESS">
            In Progress
          </option>

          <option value="COMPLETED">
            Completed
          </option>
        </select>
      )}

      {/* =====================================
          UPDATING STATE
      ===================================== */}

      {isUpdating && (
        <p
          role="status"
          className="
            text-xs text-indigo-600
            dark:text-indigo-400
          "
        >
          Updating task...
        </p>
      )}
    </div>
  );
}

// ==========================================
// DRAGGABLE KANBAN CARD
// ==========================================

export default function KanbanCard({
  task,
  isUpdating = false,
  onStatusChange,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: {
      task,
      type: "TASK",
    },
    disabled: isUpdating,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`
        relative rounded-xl
        border border-slate-200
        bg-white p-4 shadow-sm
        transition-shadow
        hover:shadow-md

        dark:border-slate-700
        dark:bg-slate-800
        dark:shadow-black/10
        dark:hover:border-slate-600

        ${
          isDragging
            ? "z-50 opacity-30"
            : isUpdating
              ? "pointer-events-none opacity-60"
              : "opacity-100"
        }
      `}
    >
      {/* =====================================
          DRAG HANDLE
      ===================================== */}

      <div className="mb-2 flex justify-end">
        <button
          ref={setActivatorNodeRef}
          type="button"
          disabled={isUpdating}
          aria-label={`Drag ${task.title}`}
          title="Drag task"
          {...attributes}
          {...listeners}
          className="
            flex h-7 w-7 touch-none
            cursor-grab items-center
            justify-center rounded-md
            text-slate-400
            transition-colors

            hover:bg-slate-100
            hover:text-slate-700

            active:cursor-grabbing
            disabled:cursor-not-allowed

            dark:text-slate-500
            dark:hover:bg-slate-700
            dark:hover:text-slate-200
          "
        >
          <GripVertical size={18} />
        </button>
      </div>

      {/* Card content */}

      <KanbanCardContent
        task={task}
        isUpdating={isUpdating}
        onStatusChange={onStatusChange}
      />
    </article>
  );
}

// ==========================================
// DRAG OVERLAY
// ==========================================

export function KanbanCardOverlay({
  task,
}: {
  task: Task;
}) {
  return (
    <div
      className="
        w-[280px] rotate-2
        cursor-grabbing rounded-xl
        border-2 border-indigo-400
        bg-white p-4
        shadow-2xl

        dark:border-indigo-500
        dark:bg-slate-800
        dark:shadow-black/40
      "
    >
      <div className="mb-2 flex justify-end">
        <GripVertical
          size={18}
          className="
            text-indigo-400
            dark:text-indigo-300
          "
        />
      </div>

      <KanbanCardContent task={task} />
    </div>
  );
}