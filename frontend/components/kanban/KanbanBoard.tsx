"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Plus,
  Search,
  RefreshCw,
  LayoutGrid,
  ClipboardList,
  Clock3,
  LoaderCircle,
  CircleCheck,
  RotateCcw,
} from "lucide-react";

import { toast } from "sonner";

import KanbanColumn from "./KanbanColumn";

import {
  KanbanCardOverlay,
} from "./KanbanCard";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Loading from "@/components/ui/Loading";
import ErrorState from "@/components/ui/ErrorState";

import LastUpdated from "@/components/ui/LastUpdated";

import { taskService } from "@/services/task.service";

import {
  useCreateTask,
  useUpdateTaskStatus,
} from "@/hooks/useTasks";

import { useDebounce } from "@/hooks/useDebounce";

import { getApiError } from "@/utils/api-error";

import type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
} from "@/types/task.types";

// ==========================================
// CONSTANTS
// ==========================================

const STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
];

const KANBAN_QUERY_KEY = ["tasks", "kanban"];

const PAGE_LIMIT = 100;

const initialForm: CreateTaskInput = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
};

// ==========================================
// COLLISION DETECTION
// ==========================================

const collisionDetection: CollisionDetection = (
  args
) => {
  const pointerCollisions = pointerWithin(args);

  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  return rectIntersection(args);
};

// ==========================================
// RETRIEVE ALL TASKS
// ==========================================

async function getAllKanbanTasks(): Promise<Task[]> {
  const firstPage = await taskService.getAll({
    page: 1,
    limit: PAGE_LIMIT,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const allTasks = [...firstPage.tasks];

  const totalPages =
    firstPage.pagination.totalPages;

  for (
    let page = 2;
    page <= totalPages;
    page++
  ) {
    const response = await taskService.getAll({
      page,
      limit: PAGE_LIMIT,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    allTasks.push(...response.tasks);
  }

  // Prevent duplicate task IDs.

  return Array.from(
    new Map(
      allTasks.map((task) => [task.id, task])
    ).values()
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function KanbanBoard() {
  const queryClient = useQueryClient();

  // ========================================
  // LOCAL STATE
  // ========================================

  const [search, setSearch] = useState("");

  const [priority, setPriority] = useState<
    TaskPriority | "ALL"
  >("ALL");

  const [activeTaskId, setActiveTaskId] =
    useState<string | null>(null);

  const [updatingTaskId, setUpdatingTaskId] =
    useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [form, setForm] =
    useState<CreateTaskInput>(initialForm);

  const debouncedSearch = useDebounce(
    search,
    300
  );

  // ========================================
  // API QUERIES
  // ========================================

  const {
    data: tasks = [],
    isPending,
    isError,
    error,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useQuery({
    queryKey: KANBAN_QUERY_KEY,
    queryFn: getAllKanbanTasks,
    staleTime: 30_000,
  });

  const createTask = useCreateTask();

  const updateTaskStatus =
    useUpdateTaskStatus();

  // ========================================
  // DRAG AND DROP SENSORS
  // ========================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),

    useSensor(KeyboardSensor)
  );

  // ========================================
  // SEARCH AND FILTER
  // ========================================

  const filteredTasks = useMemo(() => {
    const searchValue =
      debouncedSearch.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchValue ||
        task.title
          .toLowerCase()
          .includes(searchValue) ||
        (task.description || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesPriority =
        priority === "ALL" ||
        task.priority === priority;

      return (
        matchesSearch &&
        matchesPriority
      );
    });
  }, [
    tasks,
    debouncedSearch,
    priority,
  ]);

  // ========================================
  // GROUP TASKS BY STATUS
  // ========================================

  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      COMPLETED: [],
    };

    filteredTasks.forEach((task) => {
      groups[task.status].push(task);
    });

    return groups;
  }, [filteredTasks]);

  const activeTask = tasks.find(
    (task) => task.id === activeTaskId
  );

  // ========================================
  // BOARD STATISTICS
  // ========================================

  const statistics = useMemo(() => {
    return {
      total: tasks.length,

      todo: tasks.filter(
        (task) => task.status === "TODO"
      ).length,

      inProgress: tasks.filter(
        (task) =>
          task.status === "IN_PROGRESS"
      ).length,

      completed: tasks.filter(
        (task) =>
          task.status === "COMPLETED"
      ).length,
    };
  }, [tasks]);

  const statCards = [
    {
      label: "Total Tasks",
      value: statistics.total,
      icon: ClipboardList,
      color: "text-indigo-600 dark:text-indigo-400",
      background: "bg-indigo-50 dark:bg-indigo-500/15",
    },

    {
      label: "To Do",
      value: statistics.todo,
      icon: Clock3,
      color: "text-amber-600 dark:text-amber-400",
      background: "bg-amber-50 dark:bg-amber-500/15",
    },

    {
      label: "In Progress",
      value: statistics.inProgress,
      icon: LoaderCircle,
      color: "text-blue-600 dark:text-blue-400",
      background: "bg-blue-50 dark:bg-blue-500/15",
    },

    {
      label: "Completed",
      value: statistics.completed,
      icon: CircleCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      background: "bg-emerald-50 dark:bg-emerald-500/15",
    },
  ];

  // ========================================
  // UPDATE TASK STATUS
  // ========================================

  async function handleStatusChange(
    taskId: string,
    newStatus: TaskStatus
  ) {
    if (updatingTaskId) return;

    const task = tasks.find(
      (item) => item.id === taskId
    );

    if (
      !task ||
      task.status === newStatus
    ) {
      return;
    }

    setUpdatingTaskId(taskId);

    // Stop active requests before changing cache.

    await queryClient.cancelQueries({
      queryKey: KANBAN_QUERY_KEY,
    });

    const previousTasks =
      queryClient.getQueryData<Task[]>(
        KANBAN_QUERY_KEY
      );

    // Optimistic update.

    queryClient.setQueryData<Task[]>(
      KANBAN_QUERY_KEY,
      (currentTasks = []) =>
        currentTasks.map((item) =>
          item.id === taskId
            ? {
                ...item,
                status: newStatus,
                isOverdue:
                  newStatus !== "COMPLETED" &&
                  new Date(
                    item.dueDate
                  ).getTime() < Date.now(),
              }
            : item
        )
    );

    try {
      const updatedTask =
        await updateTaskStatus.mutateAsync({
          id: taskId,
          status: newStatus,
        });

      // Replace optimistic data with API data.

      queryClient.setQueryData<Task[]>(
        KANBAN_QUERY_KEY,
        (currentTasks = []) =>
          currentTasks.map((item) =>
            item.id === taskId
              ? updatedTask
              : item
          )
      );
    } catch {
      // Restore previous data if API fails.

      queryClient.setQueryData(
        KANBAN_QUERY_KEY,
        previousTasks
      );
    } finally {
      setUpdatingTaskId(null);

      await queryClient.invalidateQueries({
        queryKey: KANBAN_QUERY_KEY,
      });
    }
  }

  // ========================================
  // DRAG EVENTS
  // ========================================

  function handleDragStart(
    event: DragStartEvent
  ) {
    setActiveTaskId(
      String(event.active.id)
    );
  }

  function handleDragEnd(
    event: DragEndEvent
  ) {
    setActiveTaskId(null);

    const { active, over } = event;

    if (!over) return;

    const newStatus =
      String(over.id) as TaskStatus;

    if (!STATUSES.includes(newStatus)) {
      return;
    }

    void handleStatusChange(
      String(active.id),
      newStatus
    );
  }

  function handleDragCancel() {
    setActiveTaskId(null);
  }

  // ========================================
  // CREATE TASK MODAL
  // ========================================

  function openCreateModal(
    status: TaskStatus = "TODO"
  ) {
    setForm({
      ...initialForm,
      status,
    });

    setIsCreateOpen(true);
  }

  function closeCreateModal() {
    if (createTask.isPending) return;

    setIsCreateOpen(false);

    setForm(initialForm);
  }

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
  // CREATE TASK
  // ========================================

  async function handleCreateTask(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

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

    const dueDate = new Date(form.dueDate);

    if (
      Number.isNaN(dueDate.getTime())
    ) {
      toast.error(
        "Please enter a valid due date."
      );

      return;
    }

    try {
      await createTask.mutateAsync({
        title,
        description:
          form.description.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: dueDate.toISOString(),
      });

      setIsCreateOpen(false);

      setForm(initialForm);

      await queryClient.invalidateQueries({
        queryKey: KANBAN_QUERY_KEY,
      });
    } catch {
      // Error notification is handled
      // by the existing mutation hook.
    }
  }

  // ========================================
  // RESET FILTERS
  // ========================================

  function resetFilters() {
    setSearch("");
    setPriority("ALL");
  }

  // ========================================
  // LOADING STATE
  // ========================================

  if (isPending) {
    return (
      <Loading
        variant="page"
        message="Loading Kanban Board..."
        description="Retrieving your tasks."
      />
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================

  if (isError && tasks.length === 0) {
    return (
      <ErrorState
        variant="page"
        title="Unable to load Kanban Board"
        message={getApiError(error)}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  // ========================================
  // FORM INPUT STYLES
  // ========================================

  const inputClass = `
    w-full rounded-lg
    border border-slate-200 dark:border-slate-700
    bg-white dark:bg-slate-900 dark:scheme-dark px-3.5 py-3
    text-sm text-slate-700 dark:text-slate-300
    outline-none transition-colors
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    focus:border-indigo-500
    focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20
    disabled:opacity-50
  `;

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="space-y-6">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <section
        className="
          flex flex-col gap-4
          sm:flex-row sm:items-center
          sm:justify-between
        "
      >
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-xl bg-indigo-50 dark:bg-indigo-500/15
                text-indigo-600 dark:text-indigo-400
              "
            >
              <LayoutGrid size={23} />
            </div>

            <h1
              className="
                text-2xl font-bold
                tracking-tight text-slate-900 dark:text-slate-100
                sm:text-3xl
              "
            >
              Kanban Board
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Visualize your work, organize tasks
            and manage progress.
          </p>
        </div>

        {/* Page actions */}

  <div className="flex flex-wrap items-center gap-3">

    <LastUpdated
      dataUpdatedAt={dataUpdatedAt}
    />

    <Button
      variant="outline"
      onClick={() => void refetch()}
      disabled={isFetching}
      leftIcon={
        <RefreshCw
          size={17}
          className={
            isFetching
              ? "animate-spin"
              : ""
          }
        />
      }
    >
      Refresh
    </Button>

  </div>
      </section>

      {/* =====================================
          STATISTICS CARDS
      ===================================== */}

      <section
        className="
          grid grid-cols-1 gap-3
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="
                flex items-center gap-4
                rounded-xl
                border border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-800 p-4
              "
            >
              <div
                className={`
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-xl
                  ${item.background}
                  ${item.color}
                `}
              >
                <Icon
                  size={23}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {item.value}
                </h2>
              </div>
            </div>
          );
        })}
      </section>

      {/* =====================================
          SEARCH AND FILTERS
      ===================================== */}

      <section
        className="
          flex flex-col gap-3
          rounded-xl border
          border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800
          p-4
          lg:flex-row lg:items-center
          lg:justify-between
        "
      >
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">

          {/* Search input */}

          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="
                pointer-events-none
                absolute left-3.5 top-1/2
                -translate-y-1/2
                text-slate-400 dark:text-slate-400
              "
            />

            <input
              type="search"
              aria-label="Search tasks"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="
                h-11 w-full rounded-lg
                border border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-900 dark:scheme-dark pl-11 pr-4
                text-sm text-slate-700 dark:text-slate-300
                outline-none
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-100 dark:focus:ring-indigo-500/20
              "
            />
          </div>

          {/* Priority filter */}

          <select
            aria-label="Filter by priority"
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value as
                  TaskPriority | "ALL"
              )
            }
            className="
              h-11 rounded-lg
              border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900 dark:scheme-dark px-4
              text-sm font-medium
              text-slate-600 dark:text-slate-300 outline-none
              focus:border-indigo-500
            "
          >
            <option value="ALL">
              All Priorities
            </option>

            <option value="LOW">
              Low Priority
            </option>

            <option value="MEDIUM">
              Medium Priority
            </option>

            <option value="HIGH">
              High Priority
            </option>
          </select>

          {(search ||
            priority !== "ALL") && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              leftIcon={
                <RotateCcw size={16} />
              }
            >
              Reset
            </Button>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {filteredTasks.length}
          </span>
          {" "}of{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {tasks.length}
          </span>
          {" "}tasks
        </p>
      </section>

      {/* =====================================
          DRAG AND DROP INSTRUCTIONS
      ===================================== */}

      <div
        className="
          flex items-center gap-2
          rounded-lg bg-indigo-50 dark:bg-indigo-500/15
          px-4 py-3
          text-xs text-indigo-700 dark:text-indigo-300
        "
      >
        <LayoutGrid
          size={16}
          className="shrink-0"
        />

        Drag and drop tasks between columns
        or use the status selector to update
        their progress.
      </div>

      {/* Background refresh error */}

      {isError && tasks.length > 0 && (
        <p
          role="alert"
          className="
            rounded-lg bg-amber-50 dark:bg-amber-500/15
            px-4 py-3 text-sm
            text-amber-700 dark:text-amber-300
          "
        >
          Unable to refresh tasks.
          Showing previously loaded data.
        </p>
      )}

      {/* =====================================
          KANBAN BOARD
      ===================================== */}

      <DndContext
        sensors={sensors}
        collisionDetection={
          collisionDetection
        }
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          className="
            grid grid-cols-1
            items-start gap-4
            lg:grid-cols-3
            xl:gap-5
          "
        >
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={groupedTasks[status]}
              updatingTaskId={
                updatingTaskId
              }
              onAddTask={openCreateModal}
              onStatusChange={(
                taskId,
                newStatus
              ) => {
                void handleStatusChange(
                  taskId,
                  newStatus
                );
              }}
            />
          ))}
        </div>

        {/* Drag preview */}

        <DragOverlay>
          {activeTask ? (
            <KanbanCardOverlay
              task={activeTask}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* =====================================
          CREATE TASK MODAL
      ===================================== */}

      <Modal
        isOpen={isCreateOpen}
        onClose={closeCreateModal}
        title="Create New Task"
        description="Add a new task to your Kanban Board."
        size="xl"
        icon={<ClipboardList size={23} />}
        isBusy={createTask.isPending}
        footer={
          <>
            <Button
              variant="outline"
              onClick={closeCreateModal}
              disabled={createTask.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="kanban-create-form"
              isLoading={createTask.isPending}
              loadingText="Creating..."
              leftIcon={<Plus size={17} />}
            >
              Create Task
            </Button>
          </>
        }
      >
        <form
          id="kanban-create-form"
          onSubmit={handleCreateTask}
          className="space-y-5"
        >

          {/* Task title */}

          <div>
            <label
              htmlFor="kanban-title"
              className="
                mb-2 block text-sm
                font-semibold text-slate-700 dark:text-slate-300
              "
            >
              Task Title
              <span className="ml-1 text-red-500 dark:text-red-400">
                *
              </span>
            </label>

            <input
              id="kanban-title"
              type="text"
              required
              minLength={3}
              maxLength={150}
              value={form.title}
              disabled={createTask.isPending}
              placeholder="Enter task title"
              onChange={(event) =>
                updateForm(
                  "title",
                  event.target.value
                )
              }
              className={inputClass}
            />

            <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-400">
              {form.title.length}/150
            </p>
          </div>

          {/* Task description */}

          <div>
            <label
              htmlFor="kanban-description"
              className="
                mb-2 block text-sm
                font-semibold text-slate-700 dark:text-slate-300
              "
            >
              Description
            </label>

            <textarea
              id="kanban-description"
              rows={4}
              maxLength={5000}
              value={form.description}
              disabled={createTask.isPending}
              placeholder="Describe your task..."
              onChange={(event) =>
                updateForm(
                  "description",
                  event.target.value
                )
              }
              className={`
                ${inputClass}
                resize-y
              `}
            />

            <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-400">
              {form.description.length}/5000
            </p>
          </div>

          {/* Status and priority */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label
                htmlFor="kanban-status"
                className="
                  mb-2 block text-sm
                  font-semibold text-slate-700 dark:text-slate-300
                "
              >
                Status
              </label>

              <select
                id="kanban-status"
                value={form.status}
                disabled={createTask.isPending}
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
                htmlFor="kanban-priority"
                className="
                  mb-2 block text-sm
                  font-semibold text-slate-700 dark:text-slate-300
                "
              >
                Priority
              </label>

              <select
                id="kanban-priority"
                value={form.priority}
                disabled={createTask.isPending}
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
              htmlFor="kanban-due-date"
              className="
                mb-2 block text-sm
                font-semibold text-slate-700 dark:text-slate-300
              "
            >
              Due Date
              <span className="ml-1 text-red-500 dark:text-red-400">
                *
              </span>
            </label>

            <input
              id="kanban-due-date"
              type="datetime-local"
              required
              value={form.dueDate}
              disabled={createTask.isPending}
              onChange={(event) =>
                updateForm(
                  "dueDate",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}