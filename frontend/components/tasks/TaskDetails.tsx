"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Pencil,
  Trash2,
  CalendarDays,
  Clock3,
  Flag,
  ClipboardList,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import type {
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task.types";

import { toast } from "sonner";

import {
  useTask,
  useUpdateTask,
  useUpdateTaskStatus,
  useDeleteTask,
} from "@/hooks/useTasks";

import { getApiError } from "@/utils/api-error";

import TaskModal from "./TaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

import {
  statusStyles,
  priorityStyles,
  formatTaskDate,
} from "./TaskTable";

import type { TaskFormValues } from "./TaskForm";

interface TaskDetailsProps {
  id: Task["id"];
}

// ==========================================
// SHARED STYLES
// ==========================================

const cardClass = `
  min-w-0 rounded-2xl border border-slate-200
  bg-white
  dark:border-slate-700 dark:bg-slate-800
`;

const headingClass = `
  text-lg font-bold text-slate-900
  dark:text-slate-100
`;

const descriptionClass = `
  text-slate-500 dark:text-slate-400
`;

const outlineButtonClass = `
  inline-flex items-center justify-center gap-2
  rounded-lg border border-slate-200
  px-4 py-2.5 text-sm font-semibold
  text-slate-600 transition-colors
  hover:bg-indigo-50 hover:text-indigo-600
  disabled:opacity-50

  dark:border-slate-700
  dark:text-slate-300
  dark:hover:bg-indigo-500/10
  dark:hover:text-indigo-400
`;

export default function TaskDetails({
  id,
}: TaskDetailsProps) {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data: task,
    isPending,
    isError,
    error,
    refetch,
  } = useTask(id);

  const updateMutation = useUpdateTask();
  const statusMutation = useUpdateTaskStatus();
  const deleteMutation = useDeleteTask();

  const isMutating =
    updateMutation.isPending ||
    statusMutation.isPending ||
    deleteMutation.isPending;

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <LoaderCircle
          size={32}
          className="animate-spin text-indigo-600 dark:text-indigo-400"
        />

        <p className={`text-sm ${descriptionClass}`}>
          Loading task details...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (!task) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <CircleAlert
          size={40}
          className="text-red-500 dark:text-red-400"
        />

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Unable to load task
        </h2>

        <p className={`text-sm ${descriptionClass}`}>
          {getApiError(error)}
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/tasks"
            className={`${outlineButtonClass} bg-white dark:bg-slate-800`}
          >
            Back to Tasks
          </Link>

          <button
            type="button"
            onClick={() => void refetch()}
            className="
              inline-flex items-center gap-2
              rounded-lg bg-indigo-600 px-5 py-2.5
              text-sm font-medium text-white
              hover:bg-indigo-700
            "
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const status = statusStyles[task.status];
  const priority = priorityStyles[task.priority];

  const overdue =
    task.isOverdue &&
    task.status !== "COMPLETED";

  // ==========================================
  // UPDATE TASK
  // ==========================================

  async function handleUpdate(values: TaskFormValues) {
    if (!values.dueDate) {
      toast.error("Please select a due date.");
      return;
    }

    const dueDate = new Date(values.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      toast.error("Please enter a valid due date.");
      return;
    }

    const data: UpdateTaskInput = {
      title: values.title.trim(),
      description: values.description?.trim() ?? "",
      status: values.status,
      priority: values.priority,
      dueDate: dueDate.toISOString(),
    };

    try {
      await updateMutation.mutateAsync({
        id,
        data,
      });

      setEditOpen(false);
    } catch {
      // API error notification is handled by useTasks.ts.
    }
  }

  // ==========================================
  // CHANGE STATUS
  // ==========================================

  async function handleStatusChange(
    newStatus: TaskStatus
  ) {
    if (!task || task.status === newStatus) return;

    try {
      await statusMutation.mutateAsync({
        id,
        status: newStatus,
      });
    } catch {
      // API error notification is handled by the mutation hook.
    }
  }

  // ==========================================
  // DELETE TASK
  // ==========================================

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(id);

      setDeleteOpen(false);

      router.replace("/tasks");
    } catch {
      // API error notification is handled by the mutation hook.
    }
  }

  // ==========================================
  // TASK INFORMATION
  // ==========================================

  const information = [
    {
      label: "Due Date",
      value: formatTaskDate(task.dueDate),
      icon: CalendarDays,
      overdue,
    },
    {
      label: "Priority",
      value: priority.label,
      icon: Flag,
      overdue: false,
    },
    {
      label: "Created At",
      value: formatTaskDate(task.createdAt),
      icon: Clock3,
      overdue: false,
    },
    {
      label: "Last Updated",
      value: formatTaskDate(task.updatedAt),
      icon: RefreshCw,
      overdue: false,
    },
  ];

  return (
    <div className="space-y-6">

      {/* Back button */}

      <Link
        href="/tasks"
        className="
          inline-flex items-center gap-2
          text-sm font-medium text-slate-500
          hover:text-indigo-600

          dark:text-slate-400
          dark:hover:text-indigo-400
        "
      >
        <ArrowLeft size={17} />
        Back to All Tasks
      </Link>

      {/* Refresh error */}

      {isError && (
        <div
          role="alert"
          className="
            rounded-lg bg-amber-50 p-4
            text-sm text-amber-700
            dark:bg-amber-500/10
            dark:text-amber-300
          "
        >
          Unable to refresh task details.
          Showing the last available data.
        </div>
      )}

      {/* =====================================
          TASK HEADER
      ===================================== */}

      <section className={`${cardClass} p-5 sm:p-7`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className="
                flex h-14 w-14 shrink-0
                items-center justify-center
                rounded-xl bg-indigo-50
                text-indigo-600

                dark:bg-indigo-500/15
                dark:text-indigo-400
              "
            >
              <ClipboardList size={27} />
            </div>

            <div className="min-w-0">
              <h1
                className="
                  break-words text-2xl font-bold
                  tracking-tight text-slate-900
                  sm:text-3xl
                  dark:text-slate-100
                "
              >
                {task.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${priority.className}`}
                >
                  {priority.label} Priority
                </span>

                {overdue && (
                  <span
                    className="
                      rounded-full bg-red-50
                      px-3 py-1.5 text-xs font-semibold
                      text-red-600

                      dark:bg-red-500/15
                      dark:text-red-400
                    "
                  >
                    Overdue
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isMutating}
              onClick={() => setEditOpen(true)}
              className={outlineButtonClass}
            >
              <Pencil size={16} />
              Edit Task
            </button>

            <button
              type="button"
              disabled={isMutating}
              onClick={() => setDeleteOpen(true)}
              className="
                inline-flex items-center gap-2
                rounded-lg border border-red-200
                bg-red-50 px-4 py-2.5
                text-sm font-semibold text-red-600
                transition-colors hover:bg-red-100
                disabled:opacity-50

                dark:border-red-500/30
                dark:bg-red-500/10
                dark:text-red-400
                dark:hover:bg-red-500/20
              "
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </section>

      {/* =====================================
          TASK CONTENT
      ===================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">

        {/* Description */}

        <section className={`${cardClass} p-6`}>
          <h2 className={headingClass}>
            Description
          </h2>

          <div
            className="
              mt-5 min-h-40 whitespace-pre-wrap
              break-words text-sm leading-7
              text-slate-600 dark:text-slate-300
            "
          >
            {task.description ||
              "No description has been added to this task."}
          </div>
        </section>

        {/* Task information */}

        <section className={`${cardClass} p-6`}>
          <h2 className={headingClass}>
            Task Information
          </h2>

          <div className="mt-5 space-y-5">
            {information.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3"
                >
                  <Icon
                    size={19}
                    className="shrink-0 text-slate-400 dark:text-slate-500"
                  />

                  <div>
                    <p className={`text-xs ${descriptionClass}`}>
                      {item.label}
                    </p>

                    <p
                      className={`mt-1 text-sm font-semibold ${
                        item.overdue
                          ? "text-red-600 dark:text-red-400"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =====================================
          UPDATE TASK STATUS
      ===================================== */}

      <section className={`${cardClass} p-6`}>
        <h2 className={headingClass}>
          Update Task Status
        </h2>

        <p className={`mt-1 text-sm ${descriptionClass}`}>
          Change the current progress of this task.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(
            [
              {
                value: "TODO",
                label: "To Do",
                icon: Clock3,
              },
              {
                value: "IN_PROGRESS",
                label: "In Progress",
                icon: LoaderCircle,
              },
              {
                value: "COMPLETED",
                label: "Completed",
                icon: CircleCheck,
              },
            ] as const
          ).map((item) => {
            const Icon = item.icon;

            const active =
              task.status === item.value;

            return (
              <button
                key={item.value}
                type="button"
                disabled={active || isMutating}
                aria-pressed={active}
                onClick={() =>
                  void handleStatusChange(item.value)
                }
                className={`
                  flex items-center justify-center
                  gap-3 rounded-xl border p-4
                  text-sm font-semibold transition-colors

                  ${
                    active
                      ? `
                        border-indigo-500
                        bg-indigo-50 text-indigo-700

                        dark:border-indigo-500
                        dark:bg-indigo-500/15
                        dark:text-indigo-300
                      `
                      : `
                        border-slate-200 text-slate-600
                        hover:border-indigo-300
                        hover:bg-indigo-50
                        disabled:opacity-50

                        dark:border-slate-700
                        dark:text-slate-300
                        dark:hover:border-indigo-500/50
                        dark:hover:bg-indigo-500/10
                        dark:hover:text-indigo-400
                      `
                  }
                `}
              >
                <Icon size={20} />

                {item.label}

                {active && (
                  <CircleCheck size={15} />
                )}
              </button>
            );
          })}
        </div>

        {statusMutation.isPending && (
          <p
            className="
              mt-4 flex items-center gap-2
              text-sm text-indigo-600
              dark:text-indigo-400
            "
          >
            <LoaderCircle
              size={16}
              className="animate-spin"
            />

            Updating task...
          </p>
        )}
      </section>

      {/* =====================================
          EDIT MODAL
      ===================================== */}

      <TaskModal
        isOpen={editOpen}
        task={task}
        isSubmitting={updateMutation.isPending}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />

      {/* =====================================
          DELETE MODAL
      ===================================== */}

      <DeleteTaskModal
        isOpen={deleteOpen}
        task={task}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}