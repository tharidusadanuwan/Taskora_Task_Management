"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, Save, Plus } from "lucide-react";

import type {
  Task,
  TaskStatus,
  TaskPriority,
} from "@/types/task.types";

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
}

interface TaskFormProps {
  task?: Task | null;
  isSubmitting?: boolean;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

// ==========================================
// FORM STYLES
// ==========================================

const inputClass = `
  w-full rounded-lg border border-slate-200
  bg-white px-4 py-3 text-sm text-slate-800
  outline-none transition-colors
  placeholder:text-slate-400
  focus:border-indigo-500 focus:ring-2
  focus:ring-indigo-100

  dark:border-slate-700
  dark:bg-slate-900
  dark:text-slate-100
  dark:placeholder:text-slate-500
  dark:focus:border-indigo-500
  dark:focus:ring-indigo-500/20
  dark:scheme-dark
`;

const labelClass = `
  mb-2 block text-sm font-semibold
  text-slate-700 dark:text-slate-300
`;

const errorClass = `
  mt-1.5 text-xs text-red-500
  dark:text-red-400
`;

const invalidClass = `
  border-red-400
  dark:border-red-500
`;

// ==========================================
// DATE CONVERSION
// ==========================================

function toDateInput(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ==========================================
// TASK FORM
// ==========================================

export default function TaskForm({
  task,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");

  const [description, setDescription] = useState(
    task?.description ?? ""
  );

  const [status, setStatus] = useState<TaskStatus>(
    task?.status ?? "TODO"
  );

  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "MEDIUM"
  );

  const [dueDate, setDueDate] = useState(
    toDateInput(task?.dueDate)
  );

  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = Boolean(task);

  // ==========================================
  // VALIDATION
  // ==========================================

  function validate() {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Task title is required.";
    } else if (title.trim().length < 3) {
      newErrors.title =
        "Title must contain at least 3 characters.";
    } else if (title.trim().length > 200) {
      newErrors.title =
        "Title cannot exceed 200 characters.";
    }

    if (description.length > 2000) {
      newErrors.description =
        "Description cannot exceed 2000 characters.";
    }

    if (
      dueDate &&
      Number.isNaN(
        new Date(`${dueDate}T23:59:59`).getTime()
      )
    ) {
      newErrors.dueDate = "Please select a valid date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting || !validate()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate
        ? new Date(`${dueDate}T23:59:59`).toISOString()
        : null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset disabled={isSubmitting} className="space-y-5">

        {/* Title */}

        <div>
          <label
            htmlFor="task-title"
            className={labelClass}
          >
            Task Title{" "}
            <span className="text-red-500 dark:text-red-400">
              *
            </span>
          </label>

          <input
            id="task-title"
            type="text"
            placeholder="Enter task title"
            value={title}
            maxLength={200}
            required
            aria-invalid={Boolean(errors.title)}
            onChange={(event) => {
              setTitle(event.target.value);

              setErrors((previous) => ({
                ...previous,
                title: undefined,
              }));
            }}
            className={`${inputClass} ${
              errors.title ? invalidClass : ""
            }`}
          />

          {errors.title && (
            <p className={errorClass}>
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}

        <div>
          <label
            htmlFor="task-description"
            className={labelClass}
          >
            Description
          </label>

          <textarea
            id="task-description"
            rows={4}
            maxLength={2000}
            placeholder="Describe your task..."
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            className={`${inputClass} resize-y`}
          />

          <div className="mt-1 flex justify-between">
            <p className="text-xs text-red-500 dark:text-red-400">
              {errors.description}
            </p>

            <span className="text-xs text-slate-400 dark:text-slate-400">
              {description.length}/2000
            </span>
          </div>
        </div>

        {/* Status and priority */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="task-status"
              className={labelClass}
            >
              Status
            </label>

            <select
              id="task-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as TaskStatus)
              }
              className={inputClass}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="task-priority"
              className={labelClass}
            >
              Priority
            </label>

            <select
              id="task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as TaskPriority)
              }
              className={inputClass}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        {/* Due date */}

        <div>
          <label
            htmlFor="task-due-date"
            className={labelClass}
          >
            Due Date
          </label>

          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(event) =>
              setDueDate(event.target.value)
            }
            className={`${inputClass} ${
              errors.dueDate ? invalidClass : ""
            }`}
          />

          {errors.dueDate && (
            <p className={errorClass}>
              {errors.dueDate}
            </p>
          )}
        </div>
      </fieldset>

      {/* Form buttons */}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
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
          type="submit"
          disabled={isSubmitting}
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg bg-indigo-600 px-5 py-2.5
            text-sm font-semibold text-white
            hover:bg-indigo-700 disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? (
            <LoaderCircle
              size={17}
              className="animate-spin"
            />
          ) : isEditing ? (
            <Save size={17} />
          ) : (
            <Plus size={17} />
          )}

          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Create Task"}
        </button>
      </div>
    </form>
  );
}