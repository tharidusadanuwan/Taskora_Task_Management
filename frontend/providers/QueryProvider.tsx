"use client";

import {
  useState,
  type ReactNode,
} from "react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({
  children,
}: QueryProviderProps) {
  const { resolvedTheme } = useTheme();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: true,
          },

          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={
          resolvedTheme === "dark"
            ? "dark"
            : "light"
        }
      />
    </QueryClientProvider>
  );
}