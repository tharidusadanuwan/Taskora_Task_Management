"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

import { LoaderCircle } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// ==========================================
// BUTTON VARIANTS
// ==========================================

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-indigo-600 text-white
    hover:bg-indigo-700
    focus-visible:ring-indigo-500

    dark:bg-indigo-600
    dark:hover:bg-indigo-700
    dark:focus-visible:ring-indigo-400
  `,

  secondary: `
    bg-slate-100 text-slate-700
    hover:bg-slate-200
    focus-visible:ring-slate-400

    dark:bg-slate-700
    dark:text-slate-200
    dark:hover:bg-slate-600
    dark:focus-visible:ring-slate-500
  `,

  outline: `
    border border-slate-200
    bg-white text-slate-600
    hover:bg-slate-50
    hover:border-slate-300
    focus-visible:ring-indigo-500

    dark:border-slate-700
    dark:bg-slate-800
    dark:text-slate-300
    dark:hover:bg-slate-700
    dark:hover:border-slate-600
    dark:focus-visible:ring-indigo-400
  `,

  danger: `
    bg-red-600 text-white
    hover:bg-red-700
    focus-visible:ring-red-500

    dark:bg-red-600
    dark:hover:bg-red-700
    dark:focus-visible:ring-red-400
  `,

  ghost: `
    bg-transparent text-slate-600
    hover:bg-slate-100
    hover:text-slate-900
    focus-visible:ring-slate-400

    dark:text-slate-300
    dark:hover:bg-slate-700
    dark:hover:text-slate-100
    dark:focus-visible:ring-slate-500
  `,
};

// ==========================================
// BUTTON SIZES
// ==========================================

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0",
};

// ==========================================
// BUTTON COMPONENT
// ==========================================

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  function Button(
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`
          inline-flex shrink-0 items-center
          justify-center gap-2
          whitespace-nowrap rounded-lg
          font-semibold transition-colors
          outline-none
          focus-visible:ring-2
          focus-visible:ring-offset-2
          disabled:cursor-not-allowed
          disabled:opacity-50

          dark:focus-visible:ring-offset-slate-900

          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
      >
        {/* Left icon or loading spinner */}

        {isLoading ? (
          <LoaderCircle
            size={17}
            className="shrink-0 animate-spin"
            aria-hidden="true"
          />
        ) : (
          leftIcon
        )}

        {/* Button text */}

        {isLoading && loadingText
          ? loadingText
          : children}

        {/* Right icon */}

        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;