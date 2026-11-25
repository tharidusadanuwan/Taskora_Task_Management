"use client";

import type { ReactNode } from "react";

import {
  ClipboardList,
  Plus,
} from "lucide-react";

import Button from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  compact?: boolean;
  className?: string;
}

export default function EmptyState({
  title = "No records found",
  description = "There is no information to display at the moment.",
  icon,
  actionLabel,
  actionIcon,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  compact = false,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center
        justify-center text-center

        ${
          compact
            ? "min-h-40 px-4 py-6"
            : "min-h-80 px-6 py-10"
        }

        ${className}
      `}
    >
      {/* =====================================
          EMPTY STATE ICON
      ===================================== */}

      <div
        className={`
          flex items-center justify-center
          rounded-2xl bg-indigo-50
          text-indigo-600

          dark:bg-indigo-500/15
          dark:text-indigo-400

          ${compact ? "h-12 w-12" : "h-16 w-16"}
        `}
      >
        {icon ?? (
          <ClipboardList
            size={compact ? 24 : 32}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        )}
      </div>

      {/* =====================================
          EMPTY STATE TITLE
      ===================================== */}

      <h3
        className={`
          mt-5 font-bold text-slate-900

          dark:text-slate-100

          ${compact ? "text-base" : "text-xl"}
        `}
      >
        {title}
      </h3>

      {/* =====================================
          DESCRIPTION
      ===================================== */}

      <p
        className="
          mt-2 max-w-sm
          text-sm leading-relaxed
          text-slate-500

          dark:text-slate-400
        "
      >
        {description}
      </p>

      {/* =====================================
          ACTION BUTTONS
      ===================================== */}

      {((actionLabel && onAction) ||
        (secondaryActionLabel &&
          onSecondaryAction)) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

          {/* Secondary action */}

          {secondaryActionLabel &&
            onSecondaryAction && (
              <Button
                variant="outline"
                onClick={onSecondaryAction}
              >
                {secondaryActionLabel}
              </Button>
            )}

          {/* Primary action */}

          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              leftIcon={
                actionIcon ?? <Plus size={17} />
              }
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}