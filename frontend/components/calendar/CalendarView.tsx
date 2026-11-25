"use client";

import {
  useRef,
  useMemo,
  useState,
  type ComponentProps,
} from "react";

import { useTheme } from "next-themes";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/classic";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";

import type {
  CalendarRef,
  DatesSetInfo as DatesSetArg,
  EventClickInfo as EventClickArg,
  EventDisplayInfo as EventContentArg,
} from "@fullcalendar/react";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarRange,
  Calendar,
  Info,
} from "lucide-react";

import Button from "@/components/ui/Button";

import CalendarEvent from "./CalendarEvent";

import type {
  CalendarTaskEvent,
  CalendarViewType,
  CalendarDateRange,
  SelectedCalendarDate,
} from "@/types/calendar.types";

// ==========================================
// FULLCALENDAR CALLBACK TYPES
// ==========================================

type DateClickArg = Parameters<
  NonNullable<
    ComponentProps<typeof FullCalendar>["dateClick"]
  >
>[0];

export type EventDropArg = Parameters<
  NonNullable<
    ComponentProps<typeof FullCalendar>["eventDrop"]
  >
>[0];

// ==========================================
// PROPS
// ==========================================

interface CalendarViewProps {
  events: CalendarTaskEvent[];

  isRescheduling?: boolean;

  onDateClick: (
    selected: SelectedCalendarDate
  ) => void;

  onTaskClick: (
    taskId: string
  ) => void;

  onEventDrop: (
    event: EventDropArg
  ) => void | Promise<void>;

  onDateRangeChange: (
    range: CalendarDateRange
  ) => void;
}

// ==========================================
// CALENDAR PLUGINS
// ==========================================

const calendarPlugins = [
  themePlugin,
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin,
];

// ==========================================
// CALENDAR VIEW OPTIONS
// ==========================================

const viewOptions = [
  {
    label: "Month",
    value: "dayGridMonth",
    icon: CalendarDays,
  },
  {
    label: "Week",
    value: "timeGridWeek",
    icon: CalendarRange,
  },
  {
    label: "Day",
    value: "timeGridDay",
    icon: Calendar,
  },
] as const;

// ==========================================
// CALENDAR LEGEND
// ==========================================

const legendItems = [
  {
    label: "To Do",
    color: "bg-amber-500",
  },
  {
    label: "In Progress",
    color: "bg-blue-500",
  },
  {
    label: "Completed",
    color: "bg-emerald-500",
  },
  {
    label: "Overdue",
    color: "bg-red-500",
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function CalendarView({
  events,
  isRescheduling = false,
  onDateClick,
  onTaskClick,
  onEventDrop,
  onDateRangeChange,
}: CalendarViewProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const calendarRef =
    useRef<CalendarRef | null>(null);

  const [currentView, setCurrentView] =
    useState<CalendarViewType>(
      "dayGridMonth"
    );

  const [calendarTitle, setCalendarTitle] =
    useState("");

  const calendarEvents = useMemo(
    () => events.map(({ backgroundColor, borderColor: _borderColor, textColor, ...event }) => {
      void _borderColor;
      return {
        ...event,
        color: backgroundColor,
        contrastColor: textColor,
        editable: event.editable && !isRescheduling,
        startEditable: event.startEditable && !isRescheduling,
      };
    }),
    [events, isRescheduling]
  );

  // ========================================
  // NAVIGATION
  // ========================================

  function goToPrevious() {
    calendarRef.current?.getApi().prev();
  }

  function goToNext() {
    calendarRef.current?.getApi().next();
  }

  function goToToday() {
    calendarRef.current?.getApi().today();
  }

  function changeView(
    view: CalendarViewType
  ) {
    calendarRef.current
      ?.getApi()
      .changeView(view);
  }

  // ========================================
  // DATE RANGE CHANGE
  // ========================================

  function handleDatesSet(
    info: DatesSetArg
  ) {
    setCalendarTitle(info.view.title);

    setCurrentView(
      info.view.type as CalendarViewType
    );

    onDateRangeChange({
      start: info.start.toISOString(),
      end: info.end.toISOString(),
    });
  }

  // ========================================
  // DATE CLICK
  // ========================================

  function handleDateClick(
    info: DateClickArg
  ) {
    if (isRescheduling) return;

    onDateClick({
      date: info.date,
      dateStr: info.dateStr,
      allDay: info.allDay,
    });
  }

  // ========================================
  // TASK CLICK
  // ========================================

  function handleEventClick(
    info: EventClickArg
  ) {
    info.jsEvent.preventDefault();

    onTaskClick(info.event.id);
  }

  // ========================================
  // RESCHEDULE
  // ========================================

  async function handleEventDrop(
    info: EventDropArg
  ) {
    if (isRescheduling) {
      info.revert();
      return;
    }

    await onEventDrop(info);
  }

  // ========================================
  // EVENT RENDERING
  // ========================================

  function renderEventContent(
    info: EventContentArg
  ) {
    return (
      <CalendarEvent eventInfo={info} />
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <section
      className="
        min-w-0 overflow-hidden
        rounded-2xl border
        border-slate-200 bg-white
        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      {/* Calendar toolbar */}

      <div
        className="
          flex flex-col gap-4
          border-b border-slate-200
          p-4 sm:p-5
          xl:flex-row xl:items-center
          xl:justify-between
          dark:border-slate-700
        "
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              aria-label="Previous calendar period"
              title="Previous"
            >
              <ChevronLeft size={19} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              aria-label="Next calendar period"
              title="Next"
            >
              <ChevronRight size={19} />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>

          <h2
            className="
              text-lg font-bold
              text-slate-900 sm:text-xl
              dark:text-slate-100
            "
          >
            {calendarTitle || "Calendar"}
          </h2>
        </div>

        {/* View switcher */}

        <div
          className="
            inline-flex w-fit max-w-full
            items-center gap-1
            rounded-lg border
            border-slate-200
            bg-slate-50 p-1
            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          {viewOptions.map((item) => {
            const Icon = item.icon;

            const isActive =
              currentView === item.value;

            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  changeView(item.value)
                }
                className={`
                  inline-flex items-center
                  justify-center gap-2
                  rounded-md px-3 py-2
                  text-xs font-semibold
                  transition-colors
                  sm:text-sm

                  ${
                    isActive
                      ? `
                        bg-white text-indigo-600
                        shadow-sm
                        dark:bg-slate-700
                        dark:text-indigo-400
                      `
                      : `
                        text-slate-500
                        hover:text-slate-900
                        dark:text-slate-400
                        dark:hover:text-slate-100
                      `
                  }
                `}
              >
                <Icon size={15} />

                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar information */}

      <div
        className="
          flex items-start gap-2
          border-b border-slate-100
          bg-indigo-50/50
          px-4 py-3
          text-xs text-indigo-700
          dark:border-slate-700
          dark:bg-indigo-500/10
          dark:text-indigo-300
        "
      >
        <Info size={16} className="shrink-0" />

        <p>
          Click a date to create a task,
          click a task to view its details,
          or drag a task to reschedule its
          due date.
        </p>
      </div>

      {/* FullCalendar */}

      <div className="overflow-x-auto p-3 sm:p-5">
        <div
          className={`
            taskora-calendar
            ${
              currentView === "dayGridMonth"
                ? "min-w-[650px]"
                : currentView === "timeGridWeek"
                  ? "min-w-[750px]"
                  : "min-w-[300px]"
            }
          `}
        >
          <FullCalendar
            ref={calendarRef}

            plugins={calendarPlugins}

            colorScheme={isDark ? "dark" : "light"}

            initialView="dayGridMonth"

            headerToolbar={false}

            events={calendarEvents}

            timeZone="local"

            locale="en"

            firstDay={1}

            height="auto"

            aspectRatio={1.65}

            fixedWeekCount={false}

            showNonCurrentDates={true}

            dayMaxEvents={3}

            moreLinkClick="popover"

            nowIndicator={true}

            weekends={true}

            editable={!isRescheduling}

            eventStartEditable={!isRescheduling}

            eventDurationEditable={false}

            eventAllow={(dropInfo, event) =>
              !isRescheduling &&
              event?.extendedProps.status !== "COMPLETED" &&
              (currentView === "dayGridMonth" || !dropInfo.allDay)
            }

            selectable={false}

            droppable={false}

            allDaySlot={false}

            slotMinTime="00:00:00"

            slotMaxTime="24:00:00"

            slotDuration="00:30:00"

            scrollTime="08:00:00"

            eventMinHeight={30}

            eventDisplay="block"

            displayEventTime={true}

            displayEventEnd={false}

            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }}

            slotHeaderFormat={{
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }}

            dayHeaderFormat={{
              weekday: "short",
            }}

            dateClick={handleDateClick}

            eventClick={handleEventClick}

            eventDrop={handleEventDrop}

            eventContent={renderEventContent}

            datesSet={handleDatesSet}
          />
        </div>
      </div>

      {/* Calendar legend */}

      <div
        className="
          flex flex-wrap items-center
          justify-between gap-4
          border-t border-slate-200
          px-4 py-4 sm:px-5
          dark:border-slate-700
        "
      >
        <div className="flex flex-wrap items-center gap-4">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2"
            >
              <span
                className={`
                  h-2.5 w-2.5 rounded-full
                  ${item.color}
                `}
              />

              <span
                className="
                  text-xs font-medium
                  text-slate-600
                  dark:text-slate-400
                "
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {isRescheduling && (
          <span
            role="status"
            className="
              text-xs font-medium
              text-indigo-600
              dark:text-indigo-400
            "
          >
            Updating task schedule...
          </span>
        )}
      </div>
    </section>
  );
}