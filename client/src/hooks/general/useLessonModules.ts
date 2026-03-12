import { useQuery } from "@tanstack/react-query";
import { getModulesApi } from "@/api/general.api";
import { adaptModule } from "@/types/general.types";
import type { Module } from "@/types/general.types";
import { parseApiError } from "@/utils/parseApiError";

export const moduleKeys = {
  all: ["modules"] as const,
  list: () => [...moduleKeys.all, "list"] as const,
  byTrack: (track: string) => [...moduleKeys.all, "track", track] as const,
};

/**
 * Fetches all modules from GET /learn/modules/
 * Each module includes its nested lessons (already adapted).
 *
 * Usage:
 *   const { data: modules, isLoading, isError } = useModules();
 */
export const useModules = () => {
  return useQuery<Module[], string>({
    queryKey: moduleKeys.list(),
    queryFn: async () => {
      try {
        const raw = await getModulesApi();
        return raw.map(adaptModule);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    staleTime: 1000 * 60 * 10,  // 10 min
    gcTime: 1000 * 60 * 30,     // 30 min
  });
};

/**
 * Returns modules filtered to a specific track.
 * Same cache as useModules() — no extra network request.
 *
 * Usage:
 *   const { data: modules, isLoading } = useModulesByTrack("Stocks");
 */
export const useModulesByTrack = (track: string) => {
  const query = useModules();
  return {
    ...query,
    data: (query.data ?? []).filter(
      (m) => m.track.toLowerCase() === track.toLowerCase()
    ),
  };
};

/**
 * Returns a single module by ID from the cached list.
 * No extra network request if useModules() has already been called.
 *
 * Usage:
 *   const { data: module, isLoading } = useModuleById("d6a624b5-...");
 */
export const useModuleById = (id: string) => {
  const query = useModules();
  return {
    ...query,
    data: (query.data ?? []).find((m) => m.id === id),
  };
};