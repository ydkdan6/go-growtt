import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes — data stays fresh
      gcTime: 1000 * 60 * 10,          // 10 minutes — cache garbage collection
      retry: (failureCount, error) => {
        // Don't retry on 4xx client errors
        if (typeof error === "string") return false;
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;        // Retry up to 2x on network/server errors
      },
      refetchOnWindowFocus: false,      // Avoid surprise refetches on tab switch
    },
    mutations: {
      retry: false,                     // Never auto-retry mutations
    },
  },
});