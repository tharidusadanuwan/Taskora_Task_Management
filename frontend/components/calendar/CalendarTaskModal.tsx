"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  CalendarPlus,
  CalendarDays,
  Plus,
} from "lucide-react";

import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import type {
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
} from "@/types/task.types";

import type {
  SelectedCalendarDate,
} from "@/types/calendar.types";

import {
  getSelectedDateDueDate,
  formatCalendarDate,
  calendarDateToISO,
  isValidCalendarDate,
} from "@/utils/calendar.utils";

// ==========================================
// PROPS
// ==========================================

interface CalendarTaskModalProps {
  isOpen: boolean;

  selectedDate: SelectedCalendarDate | null;

  isSubmitting: boolean;

  onClose: () => void;

  onSubmit: (
    input: CreateTaskInput
  ) => Promise<void>;
}

// ==========================================
// FORM COMPONENT PROPS
// ==========================================

interface CalendarTaskFormProps {
  selectedDate: SelectedCalendarDate;

  isSubmitting: boolean;

  onSubmit: (
    input: CreateTaskInput
  ) => Promise<void>;
}

// ==========================================
// INPUT STYLES
// ==========================================

const inputClass = `
  w-full rounded-lg
  border border-slate-200
  bg-white px-3.5 py-3
  text-sm text-slate-700
  outline-none transition-colors
  placeholder:text-slate-400
  focus:border-indigo-500
  focus:ring-2 focus:ring-indigo-100
  disabled:cursor-not-allowed
  disabled:opacity-60
  dark:border-slate-700
  dark:bg-slate-900
  dark:text-slate-200
  dark:placeholder:text-slate-500
  dark:focus:ring-indigo-500/20
  dark:scheme-dark
`;

const labelClass = `
  mb-2 block text-sm
  font-semibold text-slate-700
  dark:text-slate-300
`;

// ==========================================
// CALENDAR TASK FORM
// ==========================================

function CalendarTaskForm({
  selectedDate,
  isSubmitting,
  onSubmit,
}: CalendarTaskFormProps) {
  const [form, setForm] =
    useState<CreateTaskInput>(() => ({
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",

      dueDate: getSelectedDateDueDate(
        selectedDate.date,
        selectedDate.allDay
      ),
    }));

  // ========================================
  // UPDATE FORM
  // ========================================

  function updateForm<
    K extends keyof CreateTaskInput
  >(
    key: K,
    value: CreateTaskInput[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  // ========================================
  // SUBMIT FORM
  // ========================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    const title = form.title.trim();

    if (
      title.length < 3 ||
      title.length > 150
    ) {
      toast.error(
        "Task title must contain 3–150 characters."
      );

      return;
    }

    if (form.description.length > 5000) {
      toast.error(
        "Description cannot exceed 5,000 characters."
      );

      return;
    }

    if (!form.dueDate) {
      toast.error(
        "Please select a due date."
      );

      return;
    }

    if (!isValidCalendarDate(form.dueDate)) {
      toast.error(
        "Please enter a valid due date."
      );

      return;
    }

    try {
      await onSubmit({
        title,

        description:
          form.description.trim(),

        status: form.status,

        priority: form.priority,

        dueDate: calendarDateToISO(
          form.dueDate
        ),
      });
    } catch {
      // Existing mutation hook handles
      // API error notifications.
    }
  }

  return (
    <form
      id="calendar-create-task-form"
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Selected date */}

      <div
        className="
          flex items-center gap-3
          rounded-lg border
          border-indigo-100
          bg-indigo-50 p-3
          dark:border-indigo-500/20
          dark:bg-indigo-500/10
        "
      >
        <CalendarDays
          size={19}
          className="
            shrink-0 text-indigo-600
            dark:text-indigo-400
          "
        />

        <div>
          <p
            className="
              text-xs font-medium
              text-indigo-600
              dark:text-indigo-400
            "
          >
            Selected date
          </p>

          <p
            className="
              mt-0.5 text-sm font-semibold
              text-indigo-800
              dark:text-indigo-300
            "
          >
            {formatCalendarDate(
              selectedDate.date
            )}
          </p>
        </div>
      </div>

      {/* Task title */}

      <div>
        <label
          htmlFor="calendar-task-title"
          className={labelClass}
        >
          Task Title

          <span className="ml-1 text-red-500 dark:text-red-400">
            *
          </span>
        </label>

        <input
          id="calendar-task-title"
          type="text"
          required
          minLength={3}
          maxLength={150}
          value={form.title}
          disabled={isSubmitting}
          placeholder="Enter task title"
          onChange={(event) =>
            updateForm(
              "title",
              event.target.value
            )
          }
          className={inputClass}
        />

        <p className="mt-1 text-right text-xs text-slate-400">
          {form.title.length}/150
        </p>
      </div>

      {/* Description */}

      <div>
        <label
          htmlFor="calendar-task-description"
          className={labelClass}
        >
          Description
        </label>

        <textarea
          id="calendar-task-description"
          rows={4}
          maxLength={5000}
          value={form.description}
          disabled={isSubmitting}
          placeholder="Describe your task..."
          onChange={(event) =>
            updateForm(
              "description",
              event.target.value
            )
          }
          className={`${inputClass} resize-y`}
        />

        <p className="mt-1 text-right text-xs text-slate-400">
          {form.description.length}/5000
        </p>
      </div>

      {/* Status and priority */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="calendar-task-status"
            className={labelClass}
          >
            Status
          </label>

          <select
            id="calendar-task-status"
            value={form.status}
            disabled={isSubmitting}
            onChange={(event) =>
              updateForm(
                "status",
                event.target.value as TaskStatus
              )
            }
            className={inputClass}
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
        </div>

        <div>
          <label
            htmlFor="calendar-task-priority"
            className={labelClass}
          >
            Priority
          </label>

          <select
            id="calendar-task-priority"
            value={form.priority}
            disabled={isSubmitting}
            onChange={(event) =>
              updateForm(
                "priority",
                event.target.value as TaskPriority
              )
            }
            className={inputClass}
          >
            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>
          </select>
        </div>
      </div>

      {/* Due date */}

      <div>
        <label
          htmlFor="calendar-task-due-date"
          className={labelClass}
        >
          Due Date

          <span className="ml-1 text-red-500 dark:text-red-400">
            *
          </span>
        </label>

        <input
          id="calendar-task-due-date"
          type="datetime-local"
          required
          value={form.dueDate}
          disabled={isSubmitting}
          onChange={(event) =>
            updateForm(
              "dueDate",
              event.target.value
            )
          }
          className={inputClass}
        />

        <p
          className="
            mt-2 text-xs text-slate-500
            dark:text-slate-400
          "
        >
          You can change the automatically
          selected date and time.
        </p>
      </div>
    </form>
  );
}

// ==========================================
// MAIN MODAL COMPONENT
// ==========================================

export default function CalendarTaskModal({
  isOpen,
  selectedDate,
  isSubmitting,
  onClose,
  onSubmit,
}: CalendarTaskModalProps) {
  return (
    <Modal
      isOpen={isOpen && Boolean(selectedDate)}
      onClose={onClose}
      title="Create New Task"
      description="Schedule a task on your calendar."
      size="xl"
      icon={<CalendarPlus size={23} />}
      isBusy={isSubmitting}
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="calendar-create-task-form"
            isLoading={isSubmitting}
            loadingText="Creating..."
            disabled={!selectedDate}
            leftIcon={<Plus size={17} />}
          >
            Create Task
          </Button>
        </>
      }
    >
      {isOpen && selectedDate && (
        <CalendarTaskForm
          key={selectedDate.date.toISOString()}
          selectedDate={selectedDate}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  );
}