"use client";

import {
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  // ==========================================
  // DESKTOP SIDEBAR
  // ==========================================

  const toggleSidebar = () => {
    setSidebarCollapsed(
      (previous) => !previous
    );
  };

  // ==========================================
  // MOBILE SIDEBAR
  // ==========================================

  const openMobileSidebar = () => {
    setMobileOpen(true);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  // ==========================================
  // CLOSE MOBILE MENU ON DESKTOP
  // ==========================================

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 1024px)"
    );

    const handleResize = () => {
      if (mediaQuery.matches) {
        setMobileOpen(false);
      }
    };

    mediaQuery.addEventListener(
      "change",
      handleResize
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleResize
      );
    };
  }, []);

  // ==========================================
  // MOBILE SCROLL LOCK & ESCAPE KEY
  // ==========================================

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [mobileOpen]);

  return (
    <div
      className="
        min-h-dvh
        bg-[#F8FAFC]
        text-slate-900

        dark:bg-slate-900
        dark:text-slate-100
      "
    >
      {/* =====================================
          SIDEBAR
      ===================================== */}

      <Suspense fallback={null}>
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onToggleCollapse={toggleSidebar}
          onCloseMobile={closeMobileSidebar}
        />
      </Suspense>

      {/* =====================================
          MAIN WORKSPACE
      ===================================== */}

      <div
        className={`
          flex min-h-dvh min-w-0
          flex-col
          transition-[margin-left]
          duration-300 ease-in-out

          ${
            sidebarCollapsed
              ? "lg:ml-20"
              : "lg:ml-64"
          }
        `}
      >
        {/* =====================================
            HEADER
        ===================================== */}

        <Suspense fallback={null}>
          <Header
            mobileOpen={mobileOpen}
            onOpenMobile={openMobileSidebar}
          />
        </Suspense>

        {/* =====================================
            PAGE CONTENT
        ===================================== */}

        <main
          id="main-content"
          className="
            min-w-0 flex-1
            px-4 py-6
            sm:px-6
            lg:px-8 lg:py-8
          "
        >
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>

        {/* =====================================
            FOOTER
        ===================================== */}

        <footer
          className="
            border-t border-slate-200
            bg-white px-4 py-4
            sm:px-6 lg:px-8

            dark:border-slate-700
            dark:bg-slate-800
          "
        >
          <div
            className="
              mx-auto flex w-full
              max-w-[1600px]
              flex-col items-center
              justify-between gap-2
              text-xs text-slate-500
              sm:flex-row

              dark:text-slate-400
            "
          >
            <p>
              © 2026 Taskora. All rights reserved.
            </p>

            <p>
              Task Management System
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}