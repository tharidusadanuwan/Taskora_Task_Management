import {
  ArrowDown,
  Minus,
  ArrowUp,
} from "lucide-react";

import type { TaskPriority } from "@/types/task.types";

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

// ==========================================
// PRIORITY CONFIGURATION
// ==========================================

export const priorityConfig = {
  LOW: {
    label: "Low",

    className: `
      bg-emerald-50 text-emerald-700
      dark:bg-emerald-500/15
      dark:text-emerald-300
    `,

    icon: ArrowDown,
  },

  MEDIUM: {
    label: "Medium",

    className: `
      bg-amber-50 text-amber-700
      dark:bg-amber-500/15
      dark:text-amber-300
    `,

    icon: Minus,
  },

  HIGH: {
    label: "High",

    className: `
      bg-red-50 text-red-700
      dark:bg-red-500/15
      dark:text-red-300
    `,

    icon: ArrowUp,
  },
} satisfies Record<
  TaskPriority,
  {
    label: string;
    className: string;
    icon: typeof ArrowUp;
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
// PRIORITY BADGE COMPONENT
// ==========================================

export default function PriorityBadge({
  priority,
  size = "md",
  showIcon = true,
  showLabel = true,
  className = "",
}: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  const Icon = config.icon;

  return (
    <span
      title={`${config.label} Priority`}
      aria-label={`${config.label} Priority`}
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
      {(showIcon || !showLabel) && (
        <Icon
          size={size === "lg" ? 16 : 13}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      )}

      {showLabel && config.label}
    </span>
  );
}