import {
  Clock3,
  LoaderCircle,
  CircleCheck,
} from "lucide-react";

import type { TaskStatus } from "@/types/task.types";

interface StatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showDot?: boolean;
  className?: string;
}

// ==========================================
// STATUS CONFIGURATION
// ==========================================

export const statusConfig = {
  TODO: {
    label: "To Do",

    className: `
      bg-amber-50 text-amber-700
      dark:bg-amber-500/15
      dark:text-amber-300
    `,

    dotColor: `
      bg-amber-500
      dark:bg-amber-400
    `,

    icon: Clock3,
  },

  IN_PROGRESS: {
    label: "In Progress",

    className: `
      bg-blue-50 text-blue-700
      dark:bg-blue-500/15
      dark:text-blue-300
    `,

    dotColor: `
      bg-blue-500
      dark:bg-blue-400
    `,

    icon: LoaderCircle,
  },

  COMPLETED: {
    label: "Completed",

    className: `
      bg-emerald-50 text-emerald-700
      dark:bg-emerald-500/15
      dark:text-emerald-300
    `,

    dotColor: `
      bg-emerald-500
      dark:bg-emerald-400
    `,

    icon: CircleCheck,
  },
} satisfies Record<
  TaskStatus,
  {
    label: string;
    className: string;
    dotColor: string;
    icon: typeof Clock3;
  }
>;

// ==========================================
// BADGE SIZES
// ==========================================

const sizeStyles = {
  sm: "px-2 py-1 text-[11px]",
  md: "px-3 py-1.5 text-xs",
  lg: "px-4 py-2 text-sm",
};

// ==========================================
// STATUS BADGE COMPONENT
// ==========================================

export default function StatusBadge({
  status,
  size = "md",
  showIcon = false,
  showDot = true,
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];

  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex w-fit items-center
        justify-center gap-1.5
        whitespace-nowrap rounded-full
        font-semibold
        ${config.className}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {showIcon ? (
        <Icon
          size={size === "lg" ? 16 : 13}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        showDot && (
          <span
            aria-hidden="true"
            className={`
              h-1.5 w-1.5 shrink-0
              rounded-full
              ${config.dotColor}
            `}
          />
        )
      )}

      {config.label}
    </span>
  );
}