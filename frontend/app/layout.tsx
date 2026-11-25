import type { Metadata } from "next";
import { Figtree } from "next/font/google";

import QueryProvider from "@/providers/QueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";

import AppLayout from "@/components/layout/AppLayout";

import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Taskora | Task Management",
    template: "%s | Taskora",
  },

  description:
    "Organize your tasks, manage priorities and track your productivity with Taskora.",

  applicationName: "Taskora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`
          ${figtree.className}
          min-h-screen
          bg-[#F8FAFC]
          text-slate-900
          antialiased
          dark:bg-slate-900
          dark:text-slate-100
        `}
      >
        <ThemeProvider>
          <QueryProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}