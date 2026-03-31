import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme-toggle";
import {
  ArrowLeft, Clock, BookOpen, Sprout, AlertCircle, Calendar,
} from "lucide-react";
import { useLessonById } from "@/hooks/general/useLessons";
import { useParams } from "wouter";

export default function LessonDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const { data: lesson, isLoading, isError } = useLessonById(id);

//   console.log("Lesson ID from params:", id);
//   console.log("lesson:", lesson, "isLoading:", isLoading, "isError:", isError);

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
            <Button variant="ghost" size="icon" onClick={() => history.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-semibold">Lesson</span>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-sm text-muted-foreground">Lesson not found.</p>
          <Button onClick={() => history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  // ── Format pub date ───────────────────────────────────────────────────────
  const formattedDate = lesson.pubDate
    ? new Date(lesson.pubDate).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold line-clamp-1">{lesson.title}</span>
          </div>
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
              <p className="text-xs text-muted-foreground">{lesson.requiredSeed} seeds needed to unlock this lesson</p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {lesson.requiredSeed} seeds
            </Badge>
          </CardContent>
        </Card>

        {/* Back button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Module
        </Button>
      </main>
    </div>
  );
}