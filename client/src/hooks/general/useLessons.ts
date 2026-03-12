import { useQuery } from "@tanstack/react-query";
import { getLessonsApi } from "@/api/general.api";
import { adaptLesson } from "@/types/general.types";
import type { Lesson } from "@/types/general.types";
import { parseApiError } from "@/utils/parseApiError";

export const lessonKeys = {
  all: ["lessons"] as const,
  list: () => [...lessonKeys.all, "list"] as const,
  byTrack: (track: string) => [...lessonKeys.all, "track", track] as const,
};

/**
 * Fetches all lessons from GET /learn/lessons/
 *
 * Usage:
 *   const { data: lessons, isLoading, isError } = useLessons();
 *
 * Filter by track:
 *   const { data: lessons = [] } = useLessons();
 *   const stockLessons = lessons.filter(l => l.track === "Stocks");
 */
export const useLessons = () => {
  return useQuery<Lesson[], string>({
    queryKey: lessonKeys.list(),
    queryFn: async () => {
      try {
        const raw = await getLessonsApi();
        return raw.map(adaptLesson);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    staleTime: 1000 * 60 * 10,  // 10 min
    gcTime: 1000 * 60 * 30,     // 30 min
  });
};

/**
 * Returns lessons filtered to a specific track.
 * Same cache as useLessons() — no extra network request.
 *
 * Usage:
 *   const { data: lessons, isLoading } = useLessonsByTrack("Stocks");
 */
export const useLessonsByTrack = (track: string) => {
  const query = useLessons();
  return {
    ...query,
    data: (query.data ?? []).filter(
      (l) => l.track.toLowerCase() === track.toLowerCase()
    ),
  };
};