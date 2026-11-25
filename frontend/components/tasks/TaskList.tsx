"use client";

import { useState } from "react";

import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";

import {
  RefreshCw,
  ClipboardList,
  Clock3,
  Timer,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type {
  Task,
  CreateTaskInput,
} from "@/types/task.types";

import { toast } from "sonner";

import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/useTasks";

import { useDashboard } from "@/hooks/useDashboard";
import { useDebounce } from "@/hooks/useDebounce";
import { getApiError } from "@/utils/api-error";

import TaskFilters, {
  defaultFilters,
  type TaskFilterValues,
} from "./TaskFilters";

import TaskTable from "./TaskTable";
import TaskModal from "./TaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

import type { TaskFormValues } from "./TaskForm";

import LastUpdated from "@/components/ui/LastUpdated";
import Button from "../ui/Button";

// ==========================================
// SHARED STYLES
// ==========================================

const cardClass = `
  rounded-2xl border border-slate-200
  bg-white
  dark:border-slate-700 dark:bg-slate-800
`;

const paginationButtonClass = `
  flex h-9 w-9 items-center justify-center
  rounded-lg border border-slate-200
  text-slate-600 transition-colors
  hover:bg-slate-50
  disabled:opacity-40
  disabled:cursor-not-allowed

  dark:border-slate-700
  dark:text-slate-300
  dark:hover:bg-slate-700
`;

export default function TaskList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ==========================================
  // FILTER AND PAGINATION STATE
  // ==========================================

  const [filters, setFilters] =
    useState<TaskFilterValues>({ ...defaultFilters });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(
    filters.search.trim(),
    400
  );

  // ==========================================
  // MODAL STATE
  // ==========================================

  const [modalOpen, setModalOpen] = useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [deletingTask, setDeletingTask] =
    useState<Task | null>(null);

  const createFromUrl =
    searchParams.get("create") === "true";

  const isTaskModalOpen =
    modalOpen || createFromUrl;

  // ==========================================
  // API QUERIES
  // ==========================================

  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    isPlaceholderData,
    dataUpdatedAt,
    refetch,
  } = useTasks({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  const dashboard = useDashboard();

  // ==========================================
  // API MUTATIONS
  // ==========================================

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending;

  const tasks = data?.tasks ?? [];
  const pagination = data?.pagination;

  const summary = dashboard.data?.summary;

  // ==========================================
  // STATISTICS
  // ==========================================

  const statistics = [
    {
      label: "Total Tasks",
      value: summary?.totalTasks ?? "—",
      icon: ClipboardList,
      color: "text-indigo-600 dark:text-indigo-400",
      background: "bg-indigo-50 dark:bg-indigo-500/15",
    },
    {
      label: "To Do",
      value: summary?.pendingTasks ?? "—",
      icon: Clock3,
      color: "text-amber-600 dark:text-amber-400",
      background: "bg-amber-50 dark:bg-amber-500/15",
    },
    {
      label: "In Progress",
      value: summary?.inProgressTasks ?? "—",
      icon: Timer,
      color: "text-blue-600 dark:text-blue-400",
      background: "bg-blue-50 dark:bg-blue-500/15",
    },
    {
      label: "Completed",
      value: summary?.completedTasks ?? "—",
      icon: CircleCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      background: "bg-emerald-50 dark:bg-emerald-500/15",
    },
  ];

  // ==========================================
  // FILTER HANDLER
  // ==========================================

  function handleFiltersChange(
    values: TaskFilterValues
  ) {
    setFilters(values);
    setPage(1);
  }

  // ==========================================
  // MODAL HANDLERS
  // ==========================================

  function removeCreateParam() {
    if (!createFromUrl) return;

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.delete("create");

    const query = params.toString();

    router.replace(
      query ? `${pathname}?${query}` : pathname,
      { scroll: false }
    );
  }

  function openEditModal(task: Task) {
    removeCreateParam();

    setEditingTask(task);
    setModalOpen(true);
  }

  function closeTaskModal() {
    setModalOpen(false);
    setEditingTask(null);

    removeCreateParam();
  }

  // ==========================================
  // CREATE AND UPDATE TASK
  // ==========================================

  async function handleSubmit(values: TaskFormValues) {
    if (!values.dueDate) {
      toast.error("Please select a due date.");
      return;
    }

    const dueDate = new Date(values.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      toast.error("Please enter a valid due date.");
      return;
    }

    const data: CreateTaskInput = {
      title: values.title.trim(),
      description: values.description?.trim() ?? "",
      status: values.status,
      priority: values.priority,
      dueDate: dueDate.toISOString(),
    };

    try {
      if (editingTask && !createFromUrl) {
        await updateMutation.mutateAsync({
          id: editingTask.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);

        setFilters({ ...defaultFilters });
        setPage(1);
      }

      closeTaskModal();
    } catch {
      // API error notification is handled by useTasks.ts.
    }
  }

  // ==========================================
  // DELETE TASK
  // ==========================================

  async function handleDelete() {
    if (!deletingTask) return;

    try {
      await deleteMutation.mutateAsync(
        deletingTask.id
      );

      setDeletingTask(null);

      if (tasks.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      }
    } catch {
      // API error notification is handled by the mutation hook.
    }
  }

  // ==========================================
  // PAGINATION VALUES
  // ==========================================

  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 0;

  const currentPage = pagination?.page ?? page;

  const firstItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) * limit + 1;

  const lastItem = Math.min(
    currentPage * limit,
    totalItems
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (number) =>
      number === 1 ||
      number === totalPages ||
      Math.abs(number - currentPage) <= 1
  );

  return (
    <div className="space-y-6">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="
              text-2xl font-bold tracking-tight
              text-slate-900 sm:text-3xl
              dark:text-slate-100
            "
          >
            All Tasks
          </h1>

          <p
            className="
              mt-2 text-sm text-slate-500
              dark:text-slate-400
            "
          >
            Create, organize and manage your daily tasks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LastUpdated dataUpdatedAt={dataUpdatedAt} />

          <Button
            variant="outline"
            onClick={() => void refetch()}
            disabled={isFetching}
            leftIcon={
              <RefreshCw
                size={17}
                className={
                  isFetching ? "animate-spin" : ""
                }
              />
            }
          >
            Refresh
          </Button>
        </div>
      </section>

      {/* =====================================
          TASK STATISTICS
      ===================================== */}

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className={`${cardClass} p-4 sm:p-5`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    ${item.background}
                    ${item.color}
                  `}
                >
                  <Icon size={21} />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-xs font-medium text-slate-500
                      sm:text-sm dark:text-slate-400
                    "
                  >
                    {item.label}
                  </p>

                  <p
                    className="
                      mt-1 text-2xl font-bold
                      text-slate-900 dark:text-slate-100
                    "
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* =====================================
          SEARCH AND FILTERS
      ===================================== */}

      <TaskFilters
        filters={filters}
        onChange={handleFiltersChange}
      />

      {/* =====================================
          TASK TABLE
      ===================================== */}

      <section className={`${cardClass} overflow-hidden`}>
        <div
          className="
            flex items-center justify-between gap-3
            border-b border-slate-200 px-5 py-4
            dark:border-slate-700
          "
        >
          <div>
            <h2
              className="
                text-base font-bold text-slate-900
                dark:text-slate-100
              "
            >
              Task List
            </h2>

            <p
              className="
                mt-1 text-xs text-slate-500
                dark:text-slate-400
              "
            >
              {totalItems} matching tasks
            </p>
          </div>

          {isFetching && !isPending && (
            <LoaderCircle
              size={18}
              className="animate-spin text-indigo-500 dark:text-indigo-400"
            />
          )}
        </div>

        {/* =====================================
            LOADING STATE
        ===================================== */}

        {isPending ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-3">
            <LoaderCircle
              size={30}
              className="animate-spin text-indigo-600 dark:text-indigo-400"
            />

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading tasks...
            </p>
          </div>
        ) : isError && !data ? (

          /* =====================================
              ERROR STATE
          ===================================== */

          <div className="flex min-h-80 flex-col items-center justify-center gap-3 p-6 text-center">
            <CircleAlert
              size={36}
              className="text-red-500 dark:text-red-400"
            />

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Unable to load tasks
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {getApiError(error)}
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="
                mt-2 rounded-lg bg-indigo-600
                px-5 py-2.5 text-sm font-medium
                text-white hover:bg-indigo-700
              "
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {isError && (
              <p
                role="alert"
                className="
                  bg-amber-50 p-3 text-sm
                  text-amber-700
                  dark:bg-amber-500/10
                  dark:text-amber-300
                "
              >
                Unable to refresh.
                Showing the last available tasks.
              </p>
            )}

            <TaskTable
              tasks={tasks}
              onEdit={openEditModal}
              onDelete={setDeletingTask}
            />
          </>
        )}

        {/* =====================================
            PAGINATION
        ===================================== */}

        {pagination && (
          <div
            className="
              flex flex-col gap-4 border-t
              border-slate-200 p-5
              lg:flex-row lg:items-center
              lg:justify-between
              dark:border-slate-700
            "
          >

            {/* Result count */}

            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {firstItem}–{lastItem}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {totalItems}
                </span>{" "}
                tasks
              </p>

              {/* Tasks per page */}

              <select
                aria-label="Tasks per page"
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
                className="
                  rounded-lg border border-slate-200
                  bg-white px-3 py-2 text-xs
                  text-slate-600 outline-none
                  focus:border-indigo-500

                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-300
                  dark:focus:border-indigo-500
                  dark:scheme-dark
                "
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            {/* Page buttons */}

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">

                {/* Previous page */}

                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={
                    !pagination.hasPreviousPage ||
                    isPlaceholderData
                  }
                  onClick={() =>
                    setPage((previous) =>
                      Math.max(1, previous - 1)
                    )
                  }
                  className={paginationButtonClass}
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page numbers */}

                {pageNumbers.map((number, index) => (
                  <div
                    key={number}
                    className="flex items-center gap-1.5"
                  >
                    {index > 0 &&
                      number - pageNumbers[index - 1] > 1 && (
                        <span className="px-1 text-slate-400 dark:text-slate-500">
                          ...
                        </span>
                      )}

                    <button
                      type="button"
                      disabled={isPlaceholderData}
                      aria-current={
                        number === currentPage
                          ? "page"
                          : undefined
                      }
                      onClick={() => setPage(number)}
                      className={`
                        flex h-9 min-w-9
                        items-center justify-center
                        rounded-lg px-2
                        text-sm font-medium
                        transition-colors
                        disabled:opacity-50

                        ${
                          number === currentPage
                            ? "bg-indigo-600 text-white"
                            : `
                              border border-slate-200
                              text-slate-600
                              hover:bg-slate-50

                              dark:border-slate-700
                              dark:text-slate-300
                              dark:hover:bg-slate-700
                            `
                        }
                      `}
                    >
                      {number}
                    </button>
                  </div>
                ))}

                {/* Next page */}

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={
                    !pagination.hasNextPage ||
                    isPlaceholderData
                  }
                  onClick={() =>
                    setPage((previous) => previous + 1)
                  }
                  className={paginationButtonClass}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* =====================================
          CREATE AND EDIT MODAL
      ===================================== */}

      <TaskModal
        isOpen={isTaskModalOpen}
        task={createFromUrl ? null : editingTask}
        isSubmitting={isSubmitting}
        onClose={closeTaskModal}
        onSubmit={handleSubmit}
      />

      {/* =====================================
          DELETE MODAL
      ===================================== */}

      <DeleteTaskModal
        isOpen={Boolean(deletingTask)}
        task={deletingTask}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}