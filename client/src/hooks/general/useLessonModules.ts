import { useQuery } from "@tanstack/react-query";
import { getModulesApi, getModulesTrackApi } from "@/api/general.api";
import { adaptModule } from "@/types/general.types";
import type { Module } from "@/types/general.types";
import { parseApiError } from "@/utils/parseApiError";

export const moduleKeys = {
  all: ["modules"] as const,
  list: () => [...moduleKeys.all, "list"] as const,
  tracked: (moduleId: string, userId: string | number) =>
    [...moduleKeys.all, "tracked", moduleId, String(userId)] as const,
  byTrack: (track: string) => [...moduleKeys.all, "track", track] as const,
};

/** Fetches all modules — used for the list view (no tracking) */
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
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

/**
 * Fetches a single module with goal/progress tracking context.
 * Fires only when the module card is expanded and userId is available.
 *
 * GET /learn/modules-track/{moduleId}/{userId}/
 *
 * Usage:
 *   const { data: trackedModule } = useModuleTrack(module.id, userId);
 */
export const useModuleTrack = (moduleId: string, userId: string | number) => {
  return useQuery<Module, string>({
    queryKey: moduleKeys.tracked(moduleId, userId),
    queryFn: async () => {
      try {
        const raw = await getModulesTrackApi(moduleId, userId);
        // endpoint returns a single module object, not an array
        return adaptModule(raw);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    enabled: !!moduleId && !!userId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useModulesByTrack = (track: string) => {
  const query = useModules();
  return {
    ...query,
    data: (query.data ?? []).filter(
      (m) => m.track.toLowerCase() === track.toLowerCase()
    ),
  };
};

export const useModuleById = (id: string) => {
  const query = useModules();
  return {
    ...query,
    data: (query.data ?? []).find((m) => m.id === id),
  };
};