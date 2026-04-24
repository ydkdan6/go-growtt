import { useQuery } from "@tanstack/react-query";
import { getUserDetailApi } from "../../api/general.api";
import { userKeys } from "@/config/queryKeys";
import type { UserDetail } from "../../types/general.types";

//  ─ Helper                                  ─
export const getStoredUserId = (): string =>
  localStorage.getItem("user_id") ?? "";

/**
 * Hook to fetch and cache a user's full profile.
 *
 * staleTime is set to 0 so that progress fields (learn_progress,
 * lesson_progress, module_progress, duration_progress) are always
 * re-fetched from the server when the component mounts — this ensures
 * the Learn page progress card reflects the latest values after a lesson
 * is completed without needing manual invalidation timing tricks.
 *
 * gcTime is kept at 15 min so the cached value is still shown instantly
 * while the background refetch is in flight (no flash of 0%).
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
        const { parseApiError } = await import("../../utils/parseApiError");
        throw parseApiError(err);
      }
    },

    enabled: Boolean(id),

    // 0 = always considered stale, so React Query refetches in the background
    // every time any component using this hook mounts or the window regains focus.
    // The previously cached value is still returned immediately (no loading flash)
    // while the fresh fetch is in flight — best of both worlds.
    staleTime: 0,

    // Keep the cached value in memory for 15 min so navigating back to any
    // page that uses this hook shows data instantly before the refetch completes.
    gcTime: 1000 * 60 * 15,
  });
};