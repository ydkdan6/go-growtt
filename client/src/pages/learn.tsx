import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ThemeToggle } from "../components/theme-toggle";
import { BottomNav } from "../components/bottom-nav";
import {
  Sprout, ChevronRight, GraduationCap, BookOpen, Trophy,
  Flame, Target, Clock, CheckCircle2, Play, Star, Zap,
  AlertCircle, Lock,
} from "lucide-react";
import { useModules } from "@/hooks/general/useLessonModules";
import { useLessons } from "@/hooks/general/useLessons";
import { useUserDetail } from "@/hooks/general/useUserDetails";
import type { Module } from "@/types/general.types";

// ─── Hardcoded levels — backend track field is placeholder "string" ───────────
// Modules are split into 3 equal groups by position in the API response array:
//   first third  → Beginner
//   middle third → Intermediate
//   last third   → Advanced

const LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Start your investment journey from scratch",
    color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    icon: <Sprout className="w-3.5 h-3.5" />,
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Deepen your knowledge across asset classes",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: <Zap className="w-3.5 h-3.5" />,
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Master complex strategies and alternative assets",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: <Star className="w-3.5 h-3.5" />,
  },
];

// Split modules array into 3 level groups by position
const splitIntoLevels = (modules: Module[]): Record<string, Module[]> => {
  const total = modules.length;
  if (total === 0) return { beginner: [], intermediate: [], advanced: [] };

  const third = Math.ceil(total / 3);
  return {
    beginner:     modules.slice(0, third),
    intermediate: modules.slice(third, third * 2),
    advanced:     modules.slice(third * 2),
  };
};

// ─── Achievements ──────────────────────────────────────────────────────────────
const achievements = [
  { name: "First Steps",  description: "Complete your first lesson", icon: GraduationCap },
  { name: "Bookworm",     description: "Read 5 investment books",     icon: BookOpen      },
  { name: "On Fire",      description: "7-day learning streak",       icon: Flame         },
  { name: "Champion",     description: "Complete all courses",        icon: Trophy        },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ModuleCardSkeleton() {
  return (
    <Card className="border">
      <CardContent className="p-4 flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
          <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          <div className="h-2 bg-muted animate-pulse rounded w-full mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Learn() {
  const [, setLocation] = useLocation();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState("all");

  const { data: modules = [], isLoading: modulesLoading, isError: modulesError, refetch } = useModules();
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons();
  const { data: user } = useUserDetail();

  const isLoading = modulesLoading || lessonsLoading;

  // ── Progress from user detail ─────────────────────────────────────────────
  const learnProgress    = Number(user?.learn_progress)    || 0;
  const moduleProgress   = Number(user?.module_progress)   || 0;
  const lessonProgress   = Number(user?.lesson_progress)   || 0;
  const durationProgress = Number(user?.duration_progress) || 0;

  // ── Totals from API ───────────────────────────────────────────────────────
  const totalModules  = modules.length;
  const totalLessons  = lessons.length;
  const totalDuration = modules.reduce((sum, m) => sum + (parseFloat(m.duration) || 0), 0);

  // ── Split modules into 3 level buckets ────────────────────────────────────
  const levelGroups = splitIntoLevels(modules);

  // ── Level unlock logic ────────────────────────────────────────────────────
  // Intermediate unlocks when all beginner lessons done
  // Advanced unlocks when all beginner + intermediate lessons done
  const beginnerLessonCount = levelGroups.beginner.reduce(
    (s, m) => s + (m.lessons.length || m.lessonCount), 0
  );
  const intermediateLessonCount = levelGroups.intermediate.reduce(
    (s, m) => s + (m.lessons.length || m.lessonCount), 0
  );

  const isLevelUnlocked = (levelId: string): boolean => {
    if (levelId === "beginner")     return true;
    if (levelId === "intermediate") return lessonProgress >= beginnerLessonCount && beginnerLessonCount > 0;
    if (levelId === "advanced")     return lessonProgress >= (beginnerLessonCount + intermediateLessonCount) && (beginnerLessonCount + intermediateLessonCount) > 0;
    return true;
  };

  // ── Achievements driven by user flags ─────────────────────────────────────
  const achievementUnlocked = [
    true,                          // First Steps — always active for registered users
    user?.bookwarm_status ?? false,
    user?.onfire_status   ?? false,
    user?.champion_status ?? false,
  ];

  const navigateToCourse = (moduleId: string) => setLocation(`/course/${moduleId}`);

  // ── Module card renderer ──────────────────────────────────────────────────
  const renderModules = (moduleList: Module[], levelId: string) => {
    const unlocked = isLevelUnlocked(levelId);

    return (
      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {moduleList.map((module) => {
          const isExpanded    = expandedModule === module.id;
          const moduleLessons = module.lessons ?? [];
          const lessonCount   = moduleLessons.length || module.lessonCount;
          const isLocked      = module.locked || !unlocked;

          return (
            <Card
              key={module.id}
              className={`border transition-all ${isExpanded ? "ring-2 ring-primary/20" : "hover-elevate"} cursor-pointer ${isLocked ? "opacity-70" : ""}`}
              data-testid={`module-card-${module.id}`}
            >
              <CardContent className="p-4">
                <div
                  className="flex items-center gap-4"
                  onClick={() => !isLocked && setExpandedModule(isExpanded ? null : module.id)}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 relative">
                    <BookOpen className="w-6 h-6 text-primary" />
                    {isLocked && (
                      <div className="absolute inset-0 rounded-xl bg-background/70 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{module.title}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                      </span>
                      {module.duration && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                        </span>
                      )}
                      <Badge variant="secondary" className="text-[10px] gap-0.5 px-1.5 py-0">
                        <Sprout className="w-2.5 h-2.5 text-primary" />
                        {module.requiredSeed} seeds
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={0} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">0/{lessonCount}</span>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`} />
                </div>

                {/* Expanded — nested lessons */}
                {isExpanded && !isLocked && (
                  <div className="mt-4 pt-3 border-t space-y-1">
                    {module.description && (
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{module.description}</p>
                    )}
                    {moduleLessons.length > 0 ? (
                      moduleLessons.map((lesson, idx) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-muted/50 cursor-pointer hover-elevate"
                          onClick={(e) => { e.stopPropagation(); navigateToCourse(module.id); }}
                          data-testid={`lesson-${module.id}-${idx}`}
                        >
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-muted border">
                            <span className="text-xs font-medium text-muted-foreground">{idx + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{lesson.title}</p>
                          </div>
                          {lesson.duration && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                              <Clock className="w-3 h-3" />{lesson.duration}
                            </span>
                          )}
                          {lesson.locked
                            ? <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            : <Play className="w-4 h-4 text-primary flex-shrink-0" />
                          }
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-3">No lessons added yet.</p>
                    )}
                    <Button
                      className="w-full mt-2"
                      onClick={(e) => { e.stopPropagation(); navigateToCourse(module.id); }}
                      data-testid={`button-start-${module.id}`}
                    >
                      <Play className="w-4 h-4 mr-2" /> Start Module
                    </Button>
                  </div>
                )}

                {isExpanded && isLocked && (
                  <div className="mt-3 pt-3 border-t text-center">
                    <p className="text-xs text-muted-foreground">
                      Complete the previous level to unlock this module.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // ── Decide which levels/modules to show based on activeLevel ─────────────
  const visibleLevels = activeLevel === "all"
    ? LEVELS
    : LEVELS.filter(l => l.id === activeLevel);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Learn</span>
          </div>
          <div className="flex items-center gap-2">
            {/* <Badge variant="secondary" className="gap-1.5 px-3 py-1.5" data-testid="badge-seeds-learn">
              <Sprout className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold">120</span>
            </Badge> */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-6">

        {/* ── Progress stats ── */}
        <Card className="border bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Your Progress</p>
                <p className="text-2xl font-bold">{learnProgress}%</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold">{isLoading ? "–" : `${moduleProgress}/${totalModules}`}</p>
                  <p className="text-xs text-muted-foreground">Tracks</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold">{isLoading ? "–" : `${lessonProgress}/${totalLessons}`}</p>
                  <p className="text-xs text-muted-foreground">Lessons</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold">{isLoading ? "–" : `${durationProgress}/${totalDuration || 0}`}</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
              </div>
            </div>
            <Progress value={learnProgress} className="h-2" />
          </CardContent>
        </Card>

        {/* ── Daily Goal ── */}
        <Card className="border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Daily Goal</p>
              <p className="text-xs text-muted-foreground">
                {lessonProgress > 0
                  ? `You've completed ${lessonProgress} lesson${lessonProgress > 1 ? "s" : ""} — keep going!`
                  : "Complete 1 lesson today to start your streak"}
              </p>
            </div>
            <Button size="sm" data-testid="button-start-daily-lesson">Start</Button>
          </CardContent>
        </Card>

        {/* ── Level filter tabs — always Beginner / Intermediate / Advanced ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <Button
            variant={activeLevel === "all" ? "default" : "outline"}
            size="sm"
            className="flex-shrink-0"
            onClick={() => setActiveLevel("all")}
            data-testid="track-filter-all"
          >
            All Tracks
          </Button>
          {LEVELS.map((level) => {
            const unlocked = isLevelUnlocked(level.id);
            return (
              <Button
                key={level.id}
                variant={activeLevel === level.id ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0 gap-1.5"
                onClick={() => setActiveLevel(level.id)}
                data-testid={`track-filter-${level.id}`}
              >
                {level.icon}
                {level.label}
                {!unlocked && <Lock className="w-3 h-3 ml-0.5 opacity-60" />}
              </Button>
            );
          })}
        </div>

        {/* ── Error ── */}
        {modulesError && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <p className="text-sm text-muted-foreground">Failed to load modules.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>Try Again</Button>
          </div>
        )}

        {/* ── Skeletons ── */}
        {isLoading && (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {Array.from({ length: 4 }).map((_, i) => <ModuleCardSkeleton key={i} />)}
          </div>
        )}

        {/* ── Level sections ── */}
        {!isLoading && !modulesError && (
          <>
            {modules.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No modules available yet.</p>
              </div>
            ) : (
              visibleLevels.map((level) => {
                const levelModules = levelGroups[level.id] ?? [];
                const unlocked     = isLevelUnlocked(level.id);
                if (levelModules.length === 0) return null;

                return (
                  <section key={level.id}>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{level.label} Track</h3>
                      <Badge variant="outline" className={`text-xs gap-1 ${level.color}`}>
                        {level.icon}
                        {level.label}
                      </Badge>
                      {!unlocked && (
                        <Badge variant="outline" className="text-xs gap-1 text-muted-foreground ml-auto">
                          <Lock className="w-3 h-3" />
                          Complete {level.id === "intermediate" ? "Beginner" : "Intermediate"} first
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{level.description}</p>
                    {renderModules(levelModules, level.id)}
                  </section>
                );
              })
            )}
          </>
        )}

        {/* ── Achievements ── */}
        <section>
          <h3 className="font-semibold text-lg mb-3">Achievements</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {achievements.map((achievement, idx) => {
              const unlocked = achievementUnlocked[idx];
              return (
                <Card key={idx} className={`border transition-all ${unlocked ? "ring-1 ring-primary/20" : "opacity-50"}`}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      unlocked ? "bg-primary/10" : "bg-muted"
                    }`}>
                      {unlocked
                        ? <CheckCircle2 className="w-6 h-6 text-primary" />
                        : <achievement.icon className="w-6 h-6 text-muted-foreground" />
                      }
                    </div>
                    <p className="font-medium text-sm">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    {unlocked && (
                      <Badge className="mt-2 text-[10px]" variant="secondary">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-primary" /> Earned
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav currentPage="learn" />
    </div>
  );
}