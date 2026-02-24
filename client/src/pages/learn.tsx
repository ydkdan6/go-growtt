import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { BottomNav } from "@/components/bottom-nav";
import { 
  TrendingUp, 
  Bitcoin, 
  Building2, 
  Rocket, 
  Sprout,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Trophy,
  Flame,
  Target,
  Clock,
  Lock,
  CheckCircle2,
  Play,
  Landmark,
  DollarSign,
  Users,
  Heart,
  BarChart3,
  Star,
  Zap
} from "lucide-react";

const learningTracks = [
  {
    id: "beginner",
    title: "Beginner Track",
    description: "Start your investment journey from scratch",
    level: "Beginner",
    paths: [
      { 
        id: "investing-101", 
        name: "Investing 101", 
        icon: GraduationCap, 
        color: "bg-primary",
        lessons: [
          { title: "What is Investing?", duration: "5 min", completed: false },
          { title: "Risk vs. Reward", duration: "7 min", completed: false },
          { title: "Types of Investments", duration: "8 min", completed: false },
          { title: "Setting Financial Goals", duration: "6 min", completed: false },
        ],
        seeds: 20,
        duration: "26 min",
      },
      { 
        id: "stocks", 
        name: "Stock Market Basics", 
        icon: TrendingUp, 
        color: "bg-blue-500",
        lessons: [
          { title: "What are Stocks?", duration: "5 min", completed: false },
          { title: "How the NGX Works", duration: "8 min", completed: false },
          { title: "Reading Stock Charts", duration: "10 min", completed: false },
          { title: "Your First Stock Purchase", duration: "7 min", completed: false },
          { title: "Understanding P/E Ratio", duration: "8 min", completed: false },
          { title: "Dividends Explained", duration: "6 min", completed: false },
        ],
        seeds: 30,
        duration: "44 min",
      },
      { 
        id: "savings", 
        name: "Savings & Money Market", 
        icon: Landmark, 
        color: "bg-teal-600",
        lessons: [
          { title: "Treasury Bills Explained", duration: "6 min", completed: false },
          { title: "FGN Bonds Overview", duration: "7 min", completed: false },
          { title: "Money Market Funds", duration: "5 min", completed: false },
          { title: "Fixed vs. Variable Returns", duration: "6 min", completed: false },
        ],
        seeds: 20,
        duration: "24 min",
      },
    ],
  },
  {
    id: "intermediate",
    title: "Intermediate Track",
    description: "Deepen your knowledge across asset classes",
    level: "Intermediate",
    paths: [
      { 
        id: "crypto", 
        name: "Cryptocurrency", 
        icon: Bitcoin, 
        color: "bg-orange-500",
        lessons: [
          { title: "What is Blockchain?", duration: "8 min", completed: false },
          { title: "Bitcoin Fundamentals", duration: "10 min", completed: false },
          { title: "Altcoins & Tokens", duration: "7 min", completed: false },
          { title: "Crypto Wallets & Security", duration: "8 min", completed: false },
          { title: "DeFi Explained", duration: "9 min", completed: false },
          { title: "Trading Crypto in Nigeria", duration: "6 min", completed: false },
        ],
        seeds: 35,
        duration: "48 min",
      },
      { 
        id: "real-estate", 
        name: "Real Estate Investing", 
        icon: Building2, 
        color: "bg-emerald-500",
        lessons: [
          { title: "Property Investment Basics", duration: "7 min", completed: false },
          { title: "REITs in Nigeria", duration: "8 min", completed: false },
          { title: "Location Analysis", duration: "6 min", completed: false },
          { title: "Rental Income Strategy", duration: "7 min", completed: false },
          { title: "Commercial vs. Residential", duration: "8 min", completed: false },
        ],
        seeds: 30,
        duration: "36 min",
      },
      { 
        id: "funds", 
        name: "Mutual & Equity Funds", 
        icon: BarChart3, 
        color: "bg-indigo-500",
        lessons: [
          { title: "What are Mutual Funds?", duration: "6 min", completed: false },
          { title: "Equity Funds Explained", duration: "7 min", completed: false },
          { title: "Dollar Funds & Hedging", duration: "8 min", completed: false },
          { title: "Choosing the Right Fund", duration: "7 min", completed: false },
        ],
        seeds: 25,
        duration: "28 min",
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Track",
    description: "Master complex strategies and alternative assets",
    level: "Advanced",
    paths: [
      { 
        id: "angel", 
        name: "Angel Investing", 
        icon: Rocket, 
        color: "bg-purple-500",
        lessons: [
          { title: "Startup Ecosystem in Africa", duration: "8 min", completed: false },
          { title: "Evaluating Startups", duration: "10 min", completed: false },
          { title: "Term Sheets & Deals", duration: "12 min", completed: false },
          { title: "Portfolio Strategy", duration: "9 min", completed: false },
          { title: "Exit Strategies", duration: "8 min", completed: false },
        ],
        seeds: 40,
        duration: "47 min",
      },
      { 
        id: "club-deals", 
        name: "Club Deals & Syndication", 
        icon: Users, 
        color: "bg-rose-500",
        lessons: [
          { title: "What are Club Deals?", duration: "6 min", completed: false },
          { title: "Pooling Capital Effectively", duration: "8 min", completed: false },
          { title: "Due Diligence Process", duration: "10 min", completed: false },
          { title: "Legal Frameworks", duration: "7 min", completed: false },
        ],
        seeds: 30,
        duration: "31 min",
      },
      { 
        id: "female-led", 
        name: "Impact Investing", 
        icon: Heart, 
        color: "bg-pink-500",
        lessons: [
          { title: "What is Impact Investing?", duration: "6 min", completed: false },
          { title: "Female-Led Startups", duration: "7 min", completed: false },
          { title: "ESG Criteria", duration: "8 min", completed: false },
          { title: "Measuring Social Returns", duration: "7 min", completed: false },
        ],
        seeds: 25,
        duration: "28 min",
      },
    ],
  },
];

const achievements = [
  { name: "First Steps", description: "Complete your first lesson", icon: GraduationCap, unlocked: false },
  { name: "Bookworm", description: "Read 5 investment books", icon: BookOpen, unlocked: false },
  { name: "On Fire", description: "7-day learning streak", icon: Flame, unlocked: false },
  { name: "Champion", description: "Complete all courses", icon: Trophy, unlocked: false },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner": return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    case "Intermediate": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "Advanced": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const getLevelIcon = (level: string) => {
  switch (level) {
    case "Beginner": return <Sprout className="w-3.5 h-3.5" />;
    case "Intermediate": return <Zap className="w-3.5 h-3.5" />;
    case "Advanced": return <Star className="w-3.5 h-3.5" />;
    default: return null;
  }
};

export default function Learn() {
  const [, setLocation] = useLocation();
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState("all");

  const navigateToCourse = (categoryId: string) => {
    setLocation(`/course/${categoryId}`);
  };

  const totalLessons = learningTracks.reduce((sum, track) => 
    sum + track.paths.reduce((s, p) => s + p.lessons.length, 0), 0
  );

  const filteredTracks = activeTrack === "all" 
    ? learningTracks 
    : learningTracks.filter(t => t.id === activeTrack);

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
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5" data-testid="badge-seeds-learn">
              <Sprout className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold">120</span>
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-6">
        {/* Learning Stats */}
        <Card className="border bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Your Progress</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold">0/{learningTracks.length}</p>
                  <p className="text-xs text-muted-foreground">Tracks</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold">0/{totalLessons}</p>
                  <p className="text-xs text-muted-foreground">Lessons</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
              </div>
            </div>
            <Progress value={0} className="h-2" />
          </CardContent>
        </Card>

        {/* Daily Goal */}
        <Card className="border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Daily Goal</p>
              <p className="text-xs text-muted-foreground">Complete 1 lesson today to start your streak</p>
            </div>
            <Button size="sm" data-testid="button-start-daily-lesson">
              Start
            </Button>
          </CardContent>
        </Card>

        {/* Track Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <Button
            variant={activeTrack === "all" ? "default" : "outline"}
            size="sm"
            className="flex-shrink-0"
            onClick={() => setActiveTrack("all")}
            data-testid="track-filter-all"
          >
            All Tracks
          </Button>
          {learningTracks.map((track) => (
            <Button
              key={track.id}
              variant={activeTrack === track.id ? "default" : "outline"}
              size="sm"
              className="flex-shrink-0 gap-1.5"
              onClick={() => setActiveTrack(track.id)}
              data-testid={`track-filter-${track.id}`}
            >
              {getLevelIcon(track.level)}
              {track.level}
            </Button>
          ))}
        </div>

        {/* Learning Tracks */}
        {filteredTracks.map((track) => (
          <section key={track.id}>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-semibold text-lg">{track.title}</h3>
              <Badge variant="outline" className={`text-xs gap-1 ${getLevelColor(track.level)}`}>
                {getLevelIcon(track.level)}
                {track.level}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{track.description}</p>
            
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
              {track.paths.map((path) => {
                const isExpanded = expandedPath === path.id;
                const completedCount = path.lessons.filter(l => l.completed).length;
                const progressPct = (completedCount / path.lessons.length) * 100;
                
                return (
                  <Card 
                    key={path.id}
                    className={`border ${isExpanded ? 'ring-2 ring-primary/20' : 'hover-elevate'} cursor-pointer`}
                    data-testid={`learn-path-${path.id}`}
                  >
                    <CardContent className="p-4">
                      <div 
                        className="flex items-center gap-4"
                        onClick={() => setExpandedPath(isExpanded ? null : path.id)}
                      >
                        <div className={`w-12 h-12 rounded-xl ${path.color} flex items-center justify-center flex-shrink-0`}>
                          <path.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{path.name}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {path.lessons.length} lessons
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {path.duration}
                            </span>
                            <Badge variant="secondary" className="text-[10px] gap-0.5 px-1.5 py-0">
                              <Sprout className="w-2.5 h-2.5 text-primary" />
                              +{path.seeds}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={progressPct} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground">{completedCount}/{path.lessons.length}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                      
                      {/* Expanded Lesson List */}
                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t space-y-1">
                          {path.lessons.map((lesson, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-muted/50 cursor-pointer hover-elevate"
                              onClick={(e) => { e.stopPropagation(); navigateToCourse(path.id); }}
                              data-testid={`lesson-${path.id}-${idx}`}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                lesson.completed ? 'bg-primary' : 'bg-muted border'
                              }`}>
                                {lesson.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                                ) : (
                                  <span className="text-xs font-medium text-muted-foreground">{idx + 1}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${lesson.completed ? 'text-muted-foreground line-through' : 'font-medium'}`}>
                                  {lesson.title}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                                <Clock className="w-3 h-3" />
                                {lesson.duration}
                              </span>
                              {!lesson.completed && (
                                <Play className="w-4 h-4 text-primary flex-shrink-0" />
                              )}
                            </div>
                          ))}
                          <Button 
                            className="w-full mt-2" 
                            onClick={(e) => { e.stopPropagation(); navigateToCourse(path.id); }}
                            data-testid={`button-start-${path.id}`}
                          >
                            Start Course
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}

        {/* Achievements */}
        <section>
          <h3 className="font-semibold text-lg mb-3">Achievements</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {achievements.map((achievement, idx) => (
              <Card 
                key={idx}
                className={`border ${achievement.unlocked ? '' : 'opacity-50'}`}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    achievement.unlocked ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <achievement.icon className={`w-6 h-6 ${
                      achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <BottomNav currentPage="learn" />
    </div>
  );
}
