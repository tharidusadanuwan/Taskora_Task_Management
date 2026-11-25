"use client";

import {
  useEffect,
  useRef,
  useId,
  type ReactNode,
} from "react";

import { X } from "lucide-react";

export type ModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  size?: ModalSize;
  isBusy?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

// ==========================================
// MODAL SIZES
// ==========================================

const modalSizes: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  icon,
  size = "lg",
  isBusy = false,
  closeOnBackdrop = true,
  showCloseButton = true,
  className = "",
}: ModalProps) {
  const dialogRef =
    useRef<HTMLDialogElement>(null);

  const titleId = useId();
  const descriptionId = useId();

  // ==========================================
  // OPEN AND CLOSE MODAL
  // ==========================================

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // ==========================================
  // PREVENT BACKGROUND SCROLLING
  // ==========================================

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  // ==========================================
  // HANDLE CLOSE
  // ==========================================

  function handleClose() {
    if (!isBusy) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={
        description ? descriptionId : undefined
      }
      aria-busy={isBusy}
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      onClick={(event) => {
        if (
          event.target === event.currentTarget &&
          closeOnBackdrop
        ) {
          handleClose();
        }
      }}
      className={`
        fixed inset-0 m-auto
        w-[calc(100%-2rem)]
        max-h-[90dvh]
        overflow-y-auto
        rounded-2xl border border-slate-200
        bg-white p-0 text-slate-900
        shadow-2xl

        backdrop:bg-slate-950/50
        backdrop:backdrop-blur-sm

        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-100
        dark:backdrop:bg-black/70

        ${modalSizes[size]}
        ${className}
      `}
    >
      {isOpen && (
        <div>

          {/* =====================================
              MODAL HEADER
          ===================================== */}

          <header
            className="
              flex items-start justify-between
              gap-4 border-b border-slate-200
              p-5 sm:p-6

              dark:border-slate-700
            "
          >
            <div className="flex min-w-0 items-start gap-3">

              {/* Modal icon */}

              {icon && (
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl bg-indigo-50
                    text-indigo-600

                    dark:bg-indigo-500/15
                    dark:text-indigo-400
                  "
                >
                  {icon}
                </div>
              )}

              {/* Title and description */}

              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="
                    text-xl font-bold
                    tracking-tight text-slate-900

                    dark:text-slate-100
                  "
                >
                  {title}
                </h2>

                {description && (
                  <p
                    id={descriptionId}
                    className="
                      mt-1 text-sm
                      leading-relaxed
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Close button */}

            {showCloseButton && (
              <button
                type="button"
                disabled={isBusy}
                onClick={handleClose}
                aria-label="Close modal"
                className="
                  shrink-0 rounded-lg p-2
                  text-slate-400
                  transition-colors
                  hover:bg-slate-100
                  hover:text-slate-700
                  disabled:opacity-50

                  dark:text-slate-400
                  dark:hover:bg-slate-700
                  dark:hover:text-slate-100
                "
              >
                <X size={21} />
              </button>
            )}
          </header>

          {/* =====================================
              MODAL CONTENT
          ===================================== */}

          <div className="p-5 sm:p-6">
            {children}
          </div>

          {/* =====================================
              MODAL FOOTER
          ===================================== */}

          {footer && (
            <footer
              className="
                flex flex-wrap items-center
                justify-end gap-3
                border-t border-slate-200
                p-5 sm:p-6

                dark:border-slate-700
              "
            >
              {footer}
            </footer>
          )}
        </div>
      )}
    </dialog>
  );
}