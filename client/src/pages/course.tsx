import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ThemeToggle } from "../components/theme-toggle";
import {
  ArrowLeft, Sprout, Lock, CheckCircle2, PlayCircle,
  Clock, BookOpen, ChevronRight, SkipForward,
  PartyPopper, ArrowRight, Trophy, AlertCircle,
} from "lucide-react";
import { useModuleById } from "@/hooks/general/useLessonModules";

export default function Course({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const [courseCompleted, setCourseCompleted] = useState(false);

  const { data: module, isLoading, isError } = useModuleById(params?.id ?? "");

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading module…</p>
        </div>
      </div>
    );
  }

  // ── Not found / error ────────────────────────────────────────────────────
  if (isError || !module) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/learn")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-semibold flex-1">Module</span>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-muted-foreground text-sm">
            Module not found. It may have been removed or you followed a broken link.
          </p>
          <Button onClick={() => setLocation("/learn")}>Back to Learn</Button>
        </div>
      </div>
    );
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const lessons        = module.lessons ?? [];
  const totalLessons   = lessons.length || module.lessonCount || 0;
  const totalSeeds     = module.requiredSeed;
  const completedCount = 0; // per-lesson tracking not yet on backend
  const progressPct    = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  // ── Completion screen ─────────────────────────────────────────────────────
  if (courseCompleted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/learn")} data-testid="button-back-completion">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-semibold flex-1">Module Complete</span>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 lg:px-6">
          <div className="max-w-md w-full text-center space-y-6 py-12">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <PartyPopper className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Module Completed!</h1>
              <p className="text-muted-foreground">
                You've finished{" "}
                <span className="font-semibold text-foreground">{module.title}</span>.
                Keep going to unlock the next level.
              </p>
            </div>

            <Card className="border">
              <CardContent className="p-5">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-lg font-bold">{totalLessons}</p>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Sprout className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-lg font-bold">+{totalSeeds}</p>
                    <p className="text-xs text-muted-foreground">Seeds Earned</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-lg font-bold">1</p>
                    <p className="text-xs text-muted-foreground">Achievement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3 pt-2">
              <Button className="w-full" onClick={() => setLocation("/learn")} data-testid="button-start-investing">
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setLocation("/learn")} data-testid="button-back-to-learn">
                Back to Learn
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Main view ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/learn")} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold line-clamp-1">{module.title}</span>
          </div>
          <Badge variant="secondary" className="gap-1 flex-shrink-0">
            <Sprout className="w-3 h-3 text-primary" />
            {totalSeeds}
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-5">
        {/* Intro */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{module.title}</h1>
          {module.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{module.description}</p>
          )}
        </div>

        {/* Progress */}
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm text-muted-foreground">{completedCount} / {totalLessons} lessons</span>
            </div>
            <Progress value={progressPct} className="h-2 mb-3" />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {module.duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{module.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{totalLessons} lessons</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons */}
        <section>
          <h3 className="font-semibold mb-3">Lessons</h3>
          {lessons.length > 0 ? (
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <Card
                  key={lesson.id}
                  className={`border ${lesson.locked ? "opacity-60" : "hover-elevate cursor-pointer"}`}
                  data-testid={`lesson-${index}`}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      lesson.locked ? "bg-muted" : "bg-primary/10"
                    }`}>
                      {lesson.locked
                        ? <Lock className="w-4 h-4 text-muted-foreground" />
                        : <PlayCircle className="w-5 h-5 text-primary" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{lesson.title}</p>
                      {lesson.content && (
                        <p className="text-xs text-muted-foreground truncate">{lesson.content}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        {lesson.duration && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />{lesson.duration}
                          </span>
                        )}
                        <Badge variant="secondary" className="text-xs gap-1 px-2 py-0.5">
                          <Sprout className="w-3 h-3" />
                          {lesson.requiredSeed} seeds
                        </Badge>
                      </div>
                    </div>
                    {!lesson.locked && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // No nested lessons yet — show lesson_count placeholder slots
            <div className="space-y-3">
              {Array.from({ length: totalLessons || 1 }).map((_, index) => (
                <Card
                  key={index}
                  className={`border ${index > 0 ? "opacity-60" : "hover-elevate cursor-pointer"}`}
                  data-testid={`lesson-placeholder-${index}`}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      index > 0 ? "bg-muted" : "bg-primary/10"
                    }`}>
                      {index > 0
                        ? <Lock className="w-4 h-4 text-muted-foreground" />
                        : <PlayCircle className="w-5 h-5 text-primary" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">Lesson {index + 1}</p>
                      <p className="text-xs text-muted-foreground">Coming soon</p>
                    </div>
                    {index === 0 && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* CTAs */}
        <div className="sticky bottom-4 pt-2 space-y-2">
          <Button
            className="w-full shadow-lg"
            size="lg"
            disabled={module.locked}
            onClick={() => setCourseCompleted(true)}
            data-testid="button-start-course"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            {module.locked ? `Requires ${totalSeeds} seeds to unlock` : "Start First Lesson"}
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            size="lg"
            onClick={() => setCourseCompleted(true)}
            data-testid="button-skip-learning"
          >
            <SkipForward className="w-4 h-4" />
            Skip Learning
          </Button>
        </div>
      </main>
    </div>
  );
}