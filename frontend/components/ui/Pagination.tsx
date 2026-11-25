"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  showPageSize?: boolean;
  showFirstLast?: boolean;
  itemLabel?: string;
  className?: string;
}

// ==========================================
// GENERATE PAGE NUMBERS
// ==========================================

function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  if (totalPages <= 0) return [];

  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "...right",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...left",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...right",
    totalPages,
  ];
}

// ==========================================
// NAVIGATION BUTTON STYLES
// ==========================================

const navigationButtonClass = `
  inline-flex h-9 w-9 shrink-0
  items-center justify-center
  rounded-lg border border-slate-200
  bg-white text-slate-600
  transition-colors
  hover:bg-slate-50
  hover:text-indigo-600
  focus-visible:outline-2
  focus-visible:outline-indigo-500
  disabled:cursor-not-allowed
  disabled:opacity-40

  dark:border-slate-700
  dark:bg-slate-800
  dark:text-slate-300
  dark:hover:bg-slate-700
  dark:hover:text-indigo-400
  dark:focus-visible:outline-indigo-400
`;

// ==========================================
// PAGINATION COMPONENT
// ==========================================

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  isLoading = false,
  showPageSize = true,
  showFirstLast = true,
  itemLabel = "tasks",
  className = "",
}: PaginationProps) {
  const safePage = Math.max(
    1,
    Math.min(
      currentPage,
      Math.max(1, totalPages)
    )
  );

  const hasPreviousPage = safePage > 1;

  const hasNextPage = safePage < totalPages;

  const firstItem =
    totalItems === 0
      ? 0
      : (safePage - 1) * pageSize + 1;

  const lastItem = Math.min(
    safePage * pageSize,
    totalItems
  );

  const pageNumbers = getPageNumbers(
    safePage,
    totalPages
  );

  function handlePageChange(page: number) {
    if (
      isLoading ||
      page < 1 ||
      page > totalPages ||
      page === safePage
    ) {
      return;
    }

    onPageChange(page);
  }

  return (
    <nav
      aria-label="Pagination"
      className={`
        flex flex-col gap-4
        border-t border-slate-200
        px-5 py-4
        xl:flex-row xl:items-center
        xl:justify-between

        dark:border-slate-700

        ${className}
      `}
    >
      {/* =====================================
          RESULT COUNT
      ===================================== */}

      <div className="flex flex-wrap items-center gap-3">
        <p
          aria-live="polite"
          className="
            text-sm text-slate-500
            dark:text-slate-400
          "
        >
          Showing{" "}

          <span
            className="
              font-semibold text-slate-700
              dark:text-slate-200
            "
          >
            {firstItem}–{lastItem}
          </span>

          {" "}of{" "}

          <span
            className="
              font-semibold text-slate-700
              dark:text-slate-200
            "
          >
            {totalItems}
          </span>

          {" "}{itemLabel}
        </p>

        {/* Items per page */}

        {showPageSize && onPageSizeChange && (
          <select
            aria-label="Items per page"
            value={pageSize}
            disabled={isLoading}
            onChange={(event) =>
              onPageSizeChange(
                Number(event.target.value)
              )
            }
            className="
              h-9 rounded-lg
              border border-slate-200
              bg-white px-3
              text-xs text-slate-600
              outline-none
              focus:border-indigo-500
              disabled:opacity-50

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-300
              dark:focus:border-indigo-400
              dark:scheme-dark
            "
          >
            {pageSizeOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option} per page
              </option>
            ))}
          </select>
        )}
      </div>

      {/* =====================================
          PAGE NAVIGATION
      ===================================== */}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center gap-1.5">

          {/* First page */}

          {showFirstLast && (
            <button
              type="button"
              aria-label="First page"
              title="First page"
              disabled={
                !hasPreviousPage || isLoading
              }
              onClick={() =>
                handlePageChange(1)
              }
              className={navigationButtonClass}
            >
              <ChevronsLeft size={17} />
            </button>
          )}

          {/* Previous page */}

          <button
            type="button"
            aria-label="Previous page"
            title="Previous page"
            disabled={
              !hasPreviousPage || isLoading
            }
            onClick={() =>
              handlePageChange(safePage - 1)
            }
            className={navigationButtonClass}
          >
            <ChevronLeft size={17} />
          </button>

          {/* Page numbers */}

          {pageNumbers.map((page) => {
            if (typeof page === "string") {
              return (
                <span
                  key={page}
                  aria-hidden="true"
                  className="
                    px-1 text-sm
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  ...
                </span>
              );
            }

            const isActive = page === safePage;

            return (
              <button
                key={page}
                type="button"
                disabled={isLoading}
                aria-label={`Page ${page}`}
                aria-current={
                  isActive ? "page" : undefined
                }
                onClick={() =>
                  handlePageChange(page)
                }
                className={`
                  inline-flex h-9 min-w-9
                  items-center justify-center
                  rounded-lg px-2
                  text-sm font-semibold
                  transition-colors
                  disabled:opacity-50

                  focus-visible:outline-2
                  focus-visible:outline-indigo-500

                  ${
                    isActive
                      ? `
                        bg-indigo-600 text-white
                        dark:bg-indigo-600
                        dark:text-white
                      `
                      : `
                        border border-slate-200
                        bg-white text-slate-600
                        hover:bg-slate-50

                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-300
                        dark:hover:bg-slate-700
                      `
                  }
                `}
              >
                {page}
              </button>
            );
          })}

          {/* Next page */}

          <button
            type="button"
            aria-label="Next page"
            title="Next page"
            disabled={
              !hasNextPage || isLoading
            }
            onClick={() =>
              handlePageChange(safePage + 1)
            }
            className={navigationButtonClass}
          >
            <ChevronRight size={17} />
          </button>

          {/* Last page */}

          {showFirstLast && (
            <button
              type="button"
              aria-label="Last page"
              title="Last page"
              disabled={
                !hasNextPage || isLoading
              }
              onClick={() =>
                handlePageChange(totalPages)
              }
              className={navigationButtonClass}
            >
              <ChevronsRight size={17} />
            </button>
          )}
        </div>
      )}
    </nav>
  );
}