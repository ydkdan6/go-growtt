import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme-toggle";
import {
  ArrowLeft, Clock, BookOpen, Sprout, AlertCircle, Calendar, CheckCircle2,
} from "lucide-react";
import { useLessonById, lessonKeys } from "@/hooks/general/useLessons";
import { useUserDetail } from "@/hooks/general/useUserDetails";
import { useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/config/queryKeys";
import { moduleKeys } from "@/hooks/general/useLessonModules";
import { completeLessonApi } from "@/api/general.api";

// Parse "5 mins", "10 minutes", "2 min", "3" → milliseconds
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

  const { data: lesson, isLoading, isError } = useLessonById(id);

  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Prevent double-firing if lesson/userId resolve at different times
  const hasTriggered = useRef(false);

  const handleBack = () => history.back();

  // ── Mark complete via API then bust all progress caches ──────────────────
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
      // Bust every cache the Learn page depends on so it re-fetches on return
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) }),
        queryClient.invalidateQueries({ queryKey: moduleKeys.all }),
        queryClient.invalidateQueries({ queryKey: lessonKeys.list() }),
      ]);
      // Force an immediate refetch so the data is warm before the user goes back
      queryClient.refetchQueries({ queryKey: userKeys.detail(userId) });
    } catch (err) {
      console.warn("Failed to mark lesson complete:", err);
      // Reset so user can retry on revisit
      hasTriggered.current = false;
    } finally {
      setIsCompleting(false);
    }
  };

  // ── Start silent countdown once lesson + userId are ready ────────────────
  useEffect(() => {
    if (!lesson || !userId || hasTriggered.current) return;

    // If already completed on the backend, just show the done state
    if ((lesson as any).status === true) {
      setIsCompleted(true);
      hasTriggered.current = true;
      return;
    }

    const durationMs = parseDurationToMs(lesson.duration);

    if (durationMs > 0) {
      // Silent background timer — no countdown shown to user
      timerRef.current = setTimeout(() => {
        markComplete();
      }, durationMs);
    } else {
      // No duration set — mark complete immediately
      markComplete();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lesson?.id, userId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const formattedDate = lesson.pubDate
    ? new Date(lesson.pubDate).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold line-clamp-1">{lesson.title}</span>
          </div>
          {/* Only visible indicator — shows when done */}
          {isCompleted && (
            <Badge variant="secondary" className="gap-1 flex-shrink-0">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              Done
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1 flex-shrink-0">
            <Sprout className="w-3 h-3 text-primary" />
            {lesson.requiredSeed}
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-5">

        {/* Title + meta */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold leading-tight">{lesson.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {lesson.track && (
              <Badge variant="secondary" className="text-xs capitalize">
                {lesson.track}
              </Badge>
            )}
            {lesson.duration && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {lesson.duration}
              </span>
            )}
            {lesson.lessonCount && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                {lesson.lessonCount}
              </span>
            )}
            {formattedDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            )}
          </div>
        </div>

        {/* Completion banner — only shown after timer fires */}
        {isCompleted && (
          <Card className="border border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Lesson Complete</p>
                <p className="text-xs text-muted-foreground">Your progress has been saved</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saving indicator — brief flash while API call is in flight */}
        {isCompleting && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
            <div className="w-3.5 h-3.5 border border-primary border-t-transparent rounded-full animate-spin" />
            Saving progress…
          </div>
        )}

        {/* Content */}
        <Card className="border">
          <CardContent className="p-5">
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
              {lesson.content}
            </p>
          </CardContent>
        </Card>

        {/* Seeds required */}
        <Card className="border bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Seeds Required</p>
              <p className="text-xs text-muted-foreground">
                {lesson.requiredSeed} seeds needed to unlock this lesson
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {lesson.requiredSeed} seeds
            </Badge>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Module
        </Button>
      </main>
    </div>
  );
}