import { LoaderCircle } from "lucide-react";

interface LoadingProps {
  message?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  variant?: "inline" | "section" | "page";
  showMessage?: boolean;
  className?: string;
}

// ==========================================
// LOADING ICON SIZES
// ==========================================

const iconSizes = {
  sm: 18,
  md: 30,
  lg: 44,
};

// ==========================================
// LOADING VARIANTS
// ==========================================

const variantStyles = {
  inline: `
    inline-flex flex-row items-center
    justify-center gap-2
  `,

  section: `
    flex min-h-64 flex-col
    items-center justify-center
    gap-3 p-6
  `,

  page: `
    flex min-h-[60vh] flex-col
    items-center justify-center
    gap-4 p-6
  `,
};

// ==========================================
// LOADING COMPONENT
// ==========================================

export default function Loading({
  message = "Loading...",
  description,
  size = "md",
  variant = "section",
  showMessage = true,
  className = "",
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={`
        text-center
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {/* Loading spinner */}

      <LoaderCircle
        size={iconSizes[size]}
        strokeWidth={2}
        aria-hidden="true"
        className="
          shrink-0 animate-spin
          text-indigo-600

          dark:text-indigo-400
        "
      />

      {/* Loading message */}

      {showMessage && (
        <div>
          <p
            className="
              text-sm font-medium
              text-slate-600

              dark:text-slate-300
            "
          >
            {message}
          </p>

          {description && (
            <p
              className="
                mt-1 text-xs
                text-slate-400

                dark:text-slate-400
              "
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}