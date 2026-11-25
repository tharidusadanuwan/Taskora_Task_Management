"use client";

import { useEffect, useRef } from "react";

import {
  Trash2,
  LoaderCircle,
  X,
} from "lucide-react";

import type { Task } from "@/types/task.types";

interface DeleteTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export default function DeleteTaskModal({
  isOpen,
  task,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteTaskModalProps) {
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

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-modal-title"
      onCancel={(event) => {
        event.preventDefault();

        if (!isDeleting) onClose();
      }}
      onClick={(event) => {
        if (
          event.target === event.currentTarget &&
          !isDeleting
        ) {
          onClose();
        }
      }}
      className="
        fixed inset-0 m-auto
        w-[calc(100%-2rem)] max-w-md
        rounded-2xl border border-slate-200
        bg-white p-0 text-slate-900
        shadow-2xl

        backdrop:bg-slate-950/50
        backdrop:backdrop-blur-sm

        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-100
        dark:backdrop:bg-black/70
      "
    >
      {isOpen && task && (
        <div className="p-6">

          {/* =====================================
              MODAL HEADER
          ===================================== */}

          <div className="flex items-start justify-between">
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-full bg-red-50
                text-red-600

                dark:bg-red-500/15
                dark:text-red-400
              "
            >
              <Trash2 size={26} strokeWidth={1.8} />
            </div>

            <button
              type="button"
              disabled={isDeleting}
              onClick={onClose}
              aria-label="Close delete confirmation"
              className="
                rounded-lg p-2 text-slate-400
                transition-colors
                hover:bg-slate-100
                disabled:opacity-50

                dark:hover:bg-slate-700
                dark:hover:text-slate-100
              "
            >
              <X size={20} />
            </button>
          </div>

          {/* =====================================
              CONFIRMATION MESSAGE
          ===================================== */}

          <h2
            id="delete-modal-title"
            className="
              mt-5 text-xl font-bold text-slate-900
              dark:text-slate-100
            "
          >
            Delete Task?
          </h2>

          <p
            className="
              mt-2 text-sm leading-relaxed
              text-slate-500 dark:text-slate-400
            "
          >
            Are you sure you want to delete this task?
            This action cannot be undone.
          </p>

          {/* Task preview */}

          <div
            className="
              mt-5 rounded-xl border
              border-slate-200 bg-slate-50 p-4

              dark:border-slate-700
              dark:bg-slate-900/50
            "
          >
            <p
              className="
                break-words text-sm font-semibold
                text-slate-900 dark:text-slate-100
              "
            >
              {task.title}
            </p>

            <p
              className="
                mt-1 line-clamp-2 text-xs
                text-slate-500 dark:text-slate-400
              "
            >
              {task.description || "No description"}
            </p>
          </div>

          {/* =====================================
              MODAL BUTTONS
          ===================================== */}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              autoFocus
              disabled={isDeleting}
              onClick={onClose}
              className="
                rounded-lg border border-slate-200
                px-5 py-2.5 text-sm font-semibold
                text-slate-600 hover:bg-slate-50
                disabled:opacity-50

                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-700
              "
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={() => void onConfirm()}
              className="
                inline-flex items-center gap-2
                rounded-lg bg-red-600 px-5 py-2.5
                text-sm font-semibold text-white
                hover:bg-red-700
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {isDeleting ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={17} />
              )}

              {isDeleting ? "Deleting..." : "Delete Task"}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}