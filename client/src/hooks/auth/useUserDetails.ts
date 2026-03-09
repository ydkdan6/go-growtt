import { useQuery } from "@tanstack/react-query";
import { getUserDetailApi } from "../../api/auth.api";
import { userKeys } from "@/config/queryKeys";
import type { UserDetail } from "../../types/auth.types";

// ─── Helper ───────────────────────────────────────────────────────────────────
export const getStoredUserId = (): string =>
  localStorage.getItem("user_id") ?? "";

/**
 * Hook to fetch and cache a user's full profile.
 *
 * This uses useQuery (not useMutation) because it's a GET — React Query will:
 *   - Cache the result for 5 minutes (staleTime from queryClient config)
 *   - Return the cached value instantly on subsequent renders
 *   - Automatically refetch in the background when stale
 *   - Share the same cache across ALL components using this hook
 *     (e.g. AppHeader, Profile page, Dashboard — all read the same cache)
 *
 * Usage:
 *   const { data: user, isLoading, isError } = useUserDetail();
 *   // or with an explicit userId:
 *   const { data: user } = useUserDetail("some-uuid");
 */
export const useUserDetail = (userId?: string | number) => {
  const id = userId ?? getStoredUserId();

  return useQuery<UserDetail, string>({
    queryKey: userKeys.detail(id),

    queryFn: async () => {
      try {
        return await getUserDetailApi(id);
      } catch (err) {
        // Import parseApiError lazily to avoid circular dep issues
        const { parseApiError } = await import("../../utils/parseApiError");
        throw parseApiError(err);
      }
    },

    // Only run the query if we actually have a userId
    enabled: Boolean(id),

    // Keep user data fresh — 5 min stale, 10 min cache (inherited from queryClient)
    // Override here if you want more aggressive caching for the header:
    staleTime: 1000 * 60 * 5,   // 5 minutes
    gcTime: 1000 * 60 * 15,     // 15 minutes — user profile rarely changes
  });
};