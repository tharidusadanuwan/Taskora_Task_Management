"use client";

import type { ReactNode } from "react";

import {
  CircleAlert,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  onRetry?: () => void;
  onBack?: () => void;
  retryLabel?: string;
  backLabel?: string;
  isRetrying?: boolean;
  variant?: "section" | "page";
  className?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "Unable to load the requested information. Please try again.",
  icon,
  onRetry,
  onBack,
  retryLabel = "Try Again",
  backLabel = "Go Back",
  isRetrying = false,
  variant = "section",
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center
        justify-center p-6 text-center

        ${
          variant === "page"
            ? "min-h-[60vh]"
            : "min-h-80"
        }

        ${className}
      `}
    >
      {/* =====================================
          ERROR ICON
      ===================================== */}

      <div
        className="
          flex h-16 w-16
          items-center justify-center
          rounded-2xl bg-red-50
          text-red-600

          dark:bg-red-500/15
          dark:text-red-400
        "
      >
        {icon ?? (
          <CircleAlert
            size={34}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        )}
      </div>

      {/* =====================================
          ERROR TITLE AND MESSAGE
      ===================================== */}

      <div role="alert">
        <h3
          className="
            mt-5 text-xl font-bold
            text-slate-900

            dark:text-slate-100
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-2 max-w-md
            text-sm leading-relaxed
            text-slate-500

            dark:text-slate-400
          "
        >
          {message}
        </p>
      </div>

      {/* =====================================
          ERROR ACTIONS
      ===================================== */}

      {(onRetry || onBack) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

          {/* Back button */}

          {onBack && (
            <Button
              variant="outline"
              disabled={isRetrying}
              onClick={onBack}
              leftIcon={
                <ArrowLeft size={17} />
              }
            >
              {backLabel}
            </Button>
          )}

          {/* Retry button */}

          {onRetry && (
            <Button
              variant="primary"
              isLoading={isRetrying}
              loadingText="Retrying..."
              onClick={onRetry}
              leftIcon={
                <RefreshCw size={17} />
              }
            >
              {retryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}