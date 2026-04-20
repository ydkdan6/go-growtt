import { useQuery } from "@tanstack/react-query";
import { getLessonsApi, getLessonByIdApi, getLessonsTrackApi } from "@/api/general.api";
import { adaptLesson } from "@/types/general.types";
import type { Lesson } from "@/types/general.types";
import { parseApiError } from "@/utils/parseApiError";

export const lessonKeys = {
  all: ["lessons"] as const,
  list: () => [...lessonKeys.all, "list"] as const,
  byTrack: (track: string) => [...lessonKeys.all, "track", track] as const,
  tracked: (lessonId: string, userId: string | number) =>
    [...lessonKeys.all, "tracked", lessonId, String(userId)] as const,
};

/** Fetches all lessons — used for counts/totals in the progress bar */
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
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

/** Fetches a single lesson by ID — used in LessonDetail page */
export const useLessonById = (id: string) => {
  return useQuery<Lesson, string>({
    queryKey: [...lessonKeys.all, "detail", id],
    queryFn: async () => {
      try {
        const raw = await getLessonByIdApi(id);
        return adaptLesson(raw);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

/**
 * Fetches a single lesson with goal/progress tracking context.
 * Fires when a lesson row is expanded or focused and userId is available.
 *
 * GET /learn/lessons-track/{lessonId}/{userId}/
 *
 * Usage:
 *   const { data: trackedLesson } = useLessonTrack(lesson.id, userId);
 */
export const useLessonTrack = (lessonId: string, userId: string | number) => {
  return useQuery<Lesson, string>({
    queryKey: lessonKeys.tracked(lessonId, userId),
    queryFn: async () => {
      try {
        const raw = await getLessonsTrackApi(lessonId, userId);
        return adaptLesson(raw);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    enabled: !!lessonId && !!userId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useLessonsByTrack = (track: string) => {
  const query = useLessons();
  return {
    ...query,
    data: (query.data ?? []).filter(
      (l) => l.track.toLowerCase() === track.toLowerCase()
    ),
  };
};