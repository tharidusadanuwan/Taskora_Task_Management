"use client";

import {
  Clock3,
  LoaderCircle,
  CircleCheck,
  CircleAlert,
} from "lucide-react";

import type {
  EventDisplayInfo,
} from "@fullcalendar/react";

import type {
  CalendarEventExtendedProps,
  CalendarEventStatus,
} from "@/types/calendar.types";

import {
  formatCalendarDateTime,
} from "@/utils/calendar.utils";

interface CalendarEventProps {
  eventInfo: EventDisplayInfo;
}

const statusConfig = {
  TODO: {
    label: "To Do",
    icon: Clock3,
  },

  IN_PROGRESS: {
    label: "In Progress",
    icon: LoaderCircle,
  },

  COMPLETED: {
    label: "Completed",
    icon: CircleCheck,
  },

  OVERDUE: {
    label: "Overdue",
    icon: CircleAlert,
  },
};

export default function CalendarEvent({
  eventInfo,
}: CalendarEventProps) {
  const { event, timeText } = eventInfo;

  const properties =
    event.extendedProps as CalendarEventExtendedProps;

  const eventStatus: CalendarEventStatus =
    properties.eventStatus ?? "TODO";

  const config =
    statusConfig[eventStatus] ??
    statusConfig.TODO;

  const Icon = config.icon;

  const tooltip = [
    event.title,

    `Status: ${config.label}`,

    `Priority: ${properties.priority}`,

    event.start
      ? `Due: ${formatCalendarDateTime(event.start)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div
      title={tooltip}
      className="
        flex w-full min-w-0
        cursor-pointer items-start
        gap-1.5 overflow-hidden
        rounded px-1.5 py-1
        text-[11px] leading-tight
      "
      style={{
        color: event.contrastColor || undefined,
      }}
    >
      <Icon
        size={12}
        strokeWidth={2}
        className="mt-0.5 shrink-0"
      />

      <div className="min-w-0 flex-1">
        <p
          className={`
            truncate font-semibold

            ${
              eventStatus === "COMPLETED"
                ? "line-through opacity-80"
                : ""
            }
          `}
        >
          {event.title}
        </p>

        {timeText && (
          <p
            className="
              mt-0.5 truncate
              text-[10px] opacity-80
            "
          >
            {timeText}
          </p>
        )}
      </div>
    </div>
  );
}