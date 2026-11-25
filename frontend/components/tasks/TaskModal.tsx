"use client";

import { useEffect, useRef } from "react";
import { X, ClipboardList } from "lucide-react";

import type { Task } from "@/types/task.types";

import TaskForm, {
  type TaskFormValues,
} from "./TaskForm";

interface TaskModalProps {
  isOpen: boolean;
  task?: Task | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
}

export default function TaskModal({
  isOpen,
  task,
  isSubmitting = false,
  onClose,
  onSubmit,
}: TaskModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // ==========================================
  // DIALOG CONTROL
  // ==========================================

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // ==========================================
  // BODY SCROLL CONTROL
  // ==========================================

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="task-modal-title"
      onCancel={(event) => {
        event.preventDefault();

        if (!isSubmitting) onClose();
      }}
      onClick={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
      className="
        fixed inset-0 m-auto
        w-[calc(100%-2rem)]
        max-w-xl max-h-[90dvh]
        overflow-y-auto rounded-2xl border
        border-slate-200 bg-white p-0
        text-slate-900 shadow-2xl

        backdrop:bg-slate-950/50
        backdrop:backdrop-blur-sm

        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-100
        dark:backdrop:bg-black/70
        dark:scheme-dark
      "
    >
      {isOpen && (
        <div>

          {/* =====================================
              MODAL HEADER
          ===================================== */}

          <div
            className="
              flex items-center justify-between gap-4
              border-b border-slate-200 p-5 sm:p-6
              dark:border-slate-700
            "
          >
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
                <ClipboardList size={22} />
              </div>

              <div>
                <h2
                  id="task-modal-title"
                  className="
                    text-xl font-bold text-slate-900
                    dark:text-slate-100
                  "
                >
                  {task ? "Edit Task" : "Create New Task"}
                </h2>

                <p
                  className="
                    mt-1 text-sm text-slate-500
                    dark:text-slate-400
                  "
                >
                  {task
                    ? "Update your task information."
                    : "Add a new task to your workspace."}
                </p>
              </div>
            </div>

            {/* Close button */}

            <button
              type="button"
              aria-label="Close task form"
              disabled={isSubmitting}
              onClick={onClose}
              className="
                rounded-lg p-2 text-slate-400
                transition-colors
                hover:bg-slate-100
                hover:text-slate-700
                disabled:opacity-50

                dark:text-slate-400
                dark:hover:bg-slate-700
                dark:hover:text-slate-100
              "
            >
              <X size={21} />
            </button>
          </div>

          {/* =====================================
              MODAL FORM
          ===================================== */}

          <div className="p-5 sm:p-6">
            <TaskForm
              key={task ? String(task.id) : "new-task"}
              task={task}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      )}
    </dialog>
  );
}