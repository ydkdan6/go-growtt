import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme-toggle";
import {
  ArrowLeft, Clock, BookOpen, Sprout, AlertCircle, Calendar, CheckCircle2,
} from "lucide-react";
import { useLessonById, useLessonTrack, lessonKeys } from "@/hooks/general/useLessons";
import { useUserDetail } from "@/hooks/general/useUserDetails";
import { useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/config/queryKeys";
import { moduleKeys } from "@/hooks/general/useLessonModules";
import { completeLessonApi } from "@/api/general.api";

function parseDurationToMs(duration: string | undefined): number {
  if (!duration) return 0;
  const match = duration.match(/(\d+(\.\d+)?)/);
  if (!match) return 0;
  return Math.round(parseFloat(match[1]) * 60 * 1000);
}

export default function LessonDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const queryClient = useQueryClient();
  const { data: user } = useUserDetail();
  const userId = user?.id;

  // ── Two fetches: base lesson data + tracked status ────────────────────────
  // useLessonById → content, title, duration etc (no auth/tracking)
  // useLessonTrack → same fields BUT includes real `status` from the backend
  const { data: lesson, isLoading: lessonLoading, isError } = useLessonById(id);
  const { data: trackedLesson, isLoading: trackLoading } = useLessonTrack(
    !!id && !!userId ? id : "",
    userId ?? ""
  );

  const isLoading = lessonLoading || (!!userId && trackLoading);

  // Use tracked data when available so status is always accurate
  const displayLesson = trackedLesson ?? lesson;

  // ── Completion state ──────────────────────────────────────────────────────
  // Seed initial value from tracked backend status so already-done lessons
  // show as complete immediately without re-triggering the timer
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTriggered = useRef(false);

  // Sync completion state from backend once tracked data arrives
  useEffect(() => {
    if (trackedLesson?.status === true) {
      setIsCompleted(true);
      hasTriggered.current = true; // prevent timer from firing again
    }
  }, [trackedLesson?.status]);

  // ── Invalidate all progress caches ───────────────────────────────────────
  const bustCaches = async (uid: string | number) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: userKeys.detail(uid) }),
      queryClient.invalidateQueries({ queryKey: moduleKeys.all }),
      queryClient.invalidateQueries({ queryKey: lessonKeys.list() }),
      // Also invalidate this specific lesson's tracked entry so status refreshes
      queryClient.invalidateQueries({ queryKey: lessonKeys.tracked(id, uid) }),
    ]);
    // Force immediate refetch of user progress so Learn page is warm on return
    queryClient.refetchQueries({ queryKey: userKeys.detail(uid) });
  };

  // ── Mark complete via PUT ─────────────────────────────────────────────────
  const markComplete = async () => {
    if (!lesson || !userId || hasTriggered.current) return;
    hasTriggered.current = true;
    setIsCompleting(true);
    try {
      await completeLessonApi(id, userId, {
        title: lesson.title ?? "",
        track: lesson.track ?? "",
        content: lesson.content ?? "",
        duration: lesson.duration ?? "",
        lesson_count: String(lesson.lessonCount ?? ""),
        required_seed: String(lesson.requiredSeed ?? ""),
        pub_date: lesson.pubDate ?? new Date().toISOString(),
      });
      setIsCompleted(true);
      await bustCaches(userId);
    } catch (err) {
      console.warn("Failed to mark lesson complete:", err);
      hasTriggered.current = false; // allow retry
    } finally {
      setIsCompleting(false);
    }
  };

  // ── Start silent background timer once both lesson + userId are ready ─────
  useEffect(() => {
    // Don't start if already completed, already triggered, or data not ready
    if (!lesson || !userId || hasTriggered.current) return;

    const durationMs = parseDurationToMs(lesson.duration);

    if (durationMs > 0) {
      timerRef.current = setTimeout(markComplete, durationMs);
    } else {
      // No duration — mark complete immediately
      markComplete();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lesson?.id, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Bust caches on unmount so Learn page is always fresh on back ──────────
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (userId) bustCaches(userId);
    };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = () => history.back();

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading lesson…</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !lesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-semibold">Lesson</span>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-sm text-muted-foreground">Lesson not found.</p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const formattedDate = displayLesson?.pubDate
    ? new Date(displayLesson.pubDate).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold line-clamp-1">{displayLesson?.title}</span>
          </div>

          {/* ── Completion badge in header ── */}
          {isCompleted ? (
            <Badge className="gap-1 flex-shrink-0 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </Badge>
          ) : isCompleting ? (
            <Badge variant="secondary" className="gap-1 flex-shrink-0">
              <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
              Saving…
            </Badge>
          ) : null}

          <Badge variant="secondary" className="gap-1 flex-shrink-0">
            <Sprout className="w-3 h-3 text-primary" />
            {displayLesson?.requiredSeed}
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-5">

        {/* ── Completion banner — prominent, shown right at the top ── */}
        {isCompleted && (
          <Card className="border-0 bg-primary/10">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">Lesson Complete 🎉</p>
                <p className="text-xs text-muted-foreground">
                  Great work! Your progress has been saved.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Title + meta ── */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <h1 className="text-2xl font-bold leading-tight flex-1">
              {displayLesson?.title}
            </h1>
            {/* Inline checkmark on title when done */}
            {isCompleted && (
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {displayLesson?.track && (
              <Badge variant="secondary" className="text-xs capitalize">
                {displayLesson.track}
              </Badge>
            )}
            {displayLesson?.duration && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {displayLesson.duration}
              </span>
            )}
            {displayLesson?.lessonCount && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                {displayLesson.lessonCount}
              </span>
            )}
            {formattedDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            )}
            {/* Status pill inline with other meta */}
            {isCompleted && (
              <Badge className="text-xs gap-1 bg-primary/10 text-primary border border-primary/20">
                <CheckCircle2 className="w-3 h-3" />
                Done
              </Badge>
            )}
          </div>
        </div>

        {/* ── Lesson content ── */}
        <Card className={`border ${isCompleted ? "border-primary/20" : ""}`}>
          <CardContent className="p-5">
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
              {displayLesson?.content}
            </p>
          </CardContent>
        </Card>

        {/* ── Seeds required ── */}
        <Card className="border bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Seeds Required</p>
              <p className="text-xs text-muted-foreground">
                {displayLesson?.requiredSeed} seeds needed to unlock this lesson
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {displayLesson?.requiredSeed} seeds
            </Badge>
          </CardContent>
        </Card>

        {/* ── Back button ── */}
        <Button
          variant={isCompleted ? "default" : "outline"}
          className="w-full"
          onClick={handleBack}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Back to Module
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Module
            </>
          )}
        </Button>
      </main>
    </div>
  );
}