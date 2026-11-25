"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";

import {
  Sun,
  Moon,
  Monitor,
  Check,
} from "lucide-react";

const themes = [
  {
    label: "Light",
    value: "light",
    icon: Sun,
  },
  {
    label: "Dark",
    value: "dark",
    icon: Moon,
  },
  {
    label: "System",
    value: "system",
    icon: Monitor,
  },
];

const subscribe = () => () => {};

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className="
          h-10 w-10 rounded-lg
          border border-slate-200
          dark:border-slate-700
        "
      />
    );
  }

  const ThemeIcon =
    theme === "system"
      ? Monitor
      : resolvedTheme === "dark"
        ? Moon
        : Sun;

  return (
    <Menu>
      {/* Theme button */}

      <MenuButton
        aria-label="Change appearance"
        title="Change appearance"
        className="
          flex h-10 w-10 items-center
          justify-center rounded-lg
          border border-slate-200
          bg-white text-slate-600
          transition-colors

          hover:bg-slate-50
          hover:text-indigo-600

          focus-visible:outline-2
          focus-visible:outline-indigo-500

          dark:border-slate-700
          dark:bg-slate-800
          dark:text-slate-300
          dark:hover:bg-slate-700
          dark:hover:text-indigo-400
        "
      >
        <ThemeIcon size={19} strokeWidth={1.8} />
      </MenuButton>

      {/* Theme dropdown */}

      <MenuItems
        anchor="bottom end"
        transition
        className="
          z-[70] mt-2 w-44
          rounded-xl border border-slate-200
          bg-white p-1.5 shadow-lg
          outline-none

          transition duration-150
          data-closed:scale-95
          data-closed:opacity-0

          dark:border-slate-700
          dark:bg-slate-800
          dark:shadow-black/30
        "
      >
        <p
          className="
            px-3 py-2 text-xs
            font-semibold text-slate-400
            dark:text-slate-400
          "
        >
          Appearance
        </p>

        {themes.map((item) => {
          const Icon = item.icon;
          const isSelected = theme === item.value;

          return (
            <MenuItem key={item.value}>
              <button
                type="button"
                onClick={() => setTheme(item.value)}
                className={`
                  flex w-full items-center
                  gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium
                  transition-colors

                  ${
                    isSelected
                      ? `
                        bg-indigo-50
                        text-indigo-600
                        dark:bg-indigo-500/15
                        dark:text-indigo-400
                      `
                      : `
                        text-slate-600
                        data-focus:bg-slate-100
                        dark:text-slate-300
                        dark:data-focus:bg-slate-700
                      `
                  }
                `}
              >
                <Icon size={17} />

                <span className="flex-1 text-left">
                  {item.label}
                </span>

                {isSelected && <Check size={16} />}
              </button>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}