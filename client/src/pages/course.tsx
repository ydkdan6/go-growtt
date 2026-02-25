import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ThemeToggle } from "../components/theme-toggle";
import { 
  ArrowLeft,
  TrendingUp, 
  Bitcoin, 
  Building2, 
  Rocket, 
  Sprout,
  Lock,
  CheckCircle2,
  PlayCircle,
  Clock,
  BookOpen,
  ChevronRight,
  BarChart3,
  LineChart,
  SkipForward,
  PartyPopper,
  ArrowRight,
  Trophy
} from "lucide-react";

const courseData: Record<string, {
  name: string;
  icon: typeof TrendingUp;
  color: string;
  iconColor: string;
  description: string;
  intro: string;
  modules: Array<{
    title: string;
    description: string;
    duration: string;
    seeds: number;
    completed: boolean;
    locked: boolean;
  }>;
}> = {
  stocks: {
    name: "Stocks",
    icon: TrendingUp,
    color: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    description: "Learn the fundamentals of stock market investing",
    intro: "Stocks represent ownership in a company. When you buy a stock, you're buying a small piece of that company. This course will teach you everything you need to know to start investing in stocks confidently.",
    modules: [
      { title: "What is a Stock?", description: "Understanding ownership and equity", duration: "5 min", seeds: 15, completed: false, locked: false },
      { title: "How the Stock Market Works", description: "Exchanges, trading, and market mechanics", duration: "8 min", seeds: 20, completed: false, locked: true },
      { title: "Types of Stocks", description: "Growth, value, dividend stocks explained", duration: "7 min", seeds: 18, completed: false, locked: true },
      { title: "Reading Stock Charts", description: "Understanding price movements and patterns", duration: "10 min", seeds: 25, completed: false, locked: true },
      { title: "Fundamental Analysis", description: "Evaluating company financials", duration: "12 min", seeds: 30, completed: false, locked: true },
      { title: "Technical Analysis Basics", description: "Chart patterns and indicators", duration: "10 min", seeds: 25, completed: false, locked: true },
      { title: "Building Your Portfolio", description: "Diversification and allocation", duration: "8 min", seeds: 20, completed: false, locked: true },
      { title: "Risk Management", description: "Protecting your investments", duration: "6 min", seeds: 15, completed: false, locked: true },
    ]
  },
  crypto: {
    name: "Crypto",
    icon: Bitcoin,
    color: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    description: "Understand cryptocurrency and blockchain technology",
    intro: "Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. Learn how blockchain technology works and how to navigate the crypto markets safely.",
    modules: [
      { title: "What is Cryptocurrency?", description: "Digital money explained simply", duration: "6 min", seeds: 18, completed: false, locked: false },
      { title: "Understanding Blockchain", description: "The technology behind crypto", duration: "10 min", seeds: 25, completed: false, locked: true },
      { title: "Bitcoin Deep Dive", description: "The first and largest cryptocurrency", duration: "8 min", seeds: 20, completed: false, locked: true },
      { title: "Altcoins & Tokens", description: "Beyond Bitcoin - Ethereum, Solana, and more", duration: "9 min", seeds: 22, completed: false, locked: true },
      { title: "Crypto Wallets", description: "Securing your digital assets", duration: "7 min", seeds: 18, completed: false, locked: true },
      { title: "Trading Strategies", description: "How to buy, sell, and trade crypto", duration: "12 min", seeds: 30, completed: false, locked: true },
    ]
  },
  "real-estate": {
    name: "Real Estate",
    icon: Building2,
    color: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    description: "Property investment strategies and REITs",
    intro: "Real estate investing involves purchasing, owning, managing, or selling property for profit. Learn different ways to invest in real estate, from direct ownership to REITs.",
    modules: [
      { title: "Real Estate Investing Basics", description: "Introduction to property investing", duration: "7 min", seeds: 18, completed: false, locked: false },
      { title: "REITs Explained", description: "Invest in real estate without buying property", duration: "8 min", seeds: 20, completed: false, locked: true },
      { title: "Rental Property Analysis", description: "Evaluating investment properties", duration: "10 min", seeds: 25, completed: false, locked: true },
      { title: "Commercial vs Residential", description: "Different property types compared", duration: "8 min", seeds: 20, completed: false, locked: true },
      { title: "Financing Real Estate", description: "Mortgages, loans, and leverage", duration: "9 min", seeds: 22, completed: false, locked: true },
    ]
  },
  angel: {
    name: "Angel Investing",
    icon: Rocket,
    color: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    description: "Investing in early-stage startups",
    intro: "Angel investing means providing capital to early-stage startups in exchange for equity. It's high-risk but can yield significant returns. Learn how to evaluate startups and build a diversified portfolio.",
    modules: [
      { title: "What is Angel Investing?", description: "Introduction to startup investing", duration: "6 min", seeds: 18, completed: false, locked: false },
      { title: "Evaluating Startups", description: "What makes a good investment", duration: "12 min", seeds: 30, completed: false, locked: true },
      { title: "Deal Structures", description: "SAFEs, convertible notes, and equity", duration: "10 min", seeds: 25, completed: false, locked: true },
      { title: "Due Diligence", description: "Researching potential investments", duration: "11 min", seeds: 28, completed: false, locked: true },
      { title: "Building Your Portfolio", description: "Diversification in angel investing", duration: "8 min", seeds: 20, completed: false, locked: true },
      { title: "Exit Strategies", description: "How angel investors make money", duration: "7 min", seeds: 18, completed: false, locked: true },
      { title: "Legal Considerations", description: "Accreditation and regulations", duration: "9 min", seeds: 22, completed: false, locked: true },
    ]
  },
  portfolio: {
    name: "Portfolio",
    icon: BarChart3,
    color: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    description: "Learn how to build and manage an investment portfolio",
    intro: "A portfolio is a collection of financial investments like stocks, bonds, commodities, and cash. Learn how to build a diversified portfolio that matches your goals and risk tolerance.",
    modules: [
      { title: "What is a Portfolio?", description: "Understanding investment portfolios", duration: "5 min", seeds: 15, completed: false, locked: false },
      { title: "Types of Portfolios", description: "Conservative, moderate, and aggressive portfolios", duration: "7 min", seeds: 18, completed: false, locked: true },
      { title: "Asset Allocation", description: "Dividing investments across asset classes", duration: "8 min", seeds: 20, completed: false, locked: true },
      { title: "Diversification", description: "Spreading risk across investments", duration: "6 min", seeds: 15, completed: false, locked: true },
      { title: "Rebalancing", description: "Maintaining your target allocation", duration: "7 min", seeds: 18, completed: false, locked: true },
      { title: "Portfolio Tracking", description: "Monitoring performance over time", duration: "5 min", seeds: 12, completed: false, locked: true },
    ]
  },
  assets: {
    name: "Assets",
    icon: LineChart,
    color: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    description: "Understand different types of assets and how they work",
    intro: "Assets are resources with economic value that you own or control. Learn about different asset classes and how they can help you build wealth over time.",
    modules: [
      { title: "What is an Asset?", description: "Understanding assets vs liabilities", duration: "5 min", seeds: 15, completed: false, locked: false },
      { title: "Types of Assets", description: "Stocks, bonds, real estate, and more", duration: "8 min", seeds: 20, completed: false, locked: true },
      { title: "Liquid vs Illiquid Assets", description: "How easily can you sell your assets?", duration: "6 min", seeds: 15, completed: false, locked: true },
      { title: "Appreciating Assets", description: "Assets that grow in value over time", duration: "7 min", seeds: 18, completed: false, locked: true },
      { title: "Income-Generating Assets", description: "Assets that pay you regularly", duration: "8 min", seeds: 20, completed: false, locked: true },
      { title: "Building Your Asset Base", description: "Creating long-term wealth", duration: "6 min", seeds: 15, completed: false, locked: true },
    ]
  }
};

export default function Course({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const [courseCompleted, setCourseCompleted] = useState(false);
  const course = courseData[params.id];
  
  if (!course) {
    setLocation("/");
    return null;
  }

  const Icon = course.icon;
  const completedModules = course.modules.filter(m => m.completed).length;
  const totalModules = course.modules.length;
  const progressPercent = (completedModules / totalModules) * 100;
  const totalSeeds = course.modules.reduce((sum, m) => sum + m.seeds, 0);

  if (courseCompleted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation("/learn")}
              data-testid="button-back-completion"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-semibold flex-1">Course Complete</span>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 lg:px-6">
          <div className="max-w-md w-full text-center space-y-6 py-12">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <PartyPopper className="w-12 h-12 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">Course Completed!</h1>
              <p className="text-muted-foreground">
                You've finished the <span className="font-semibold text-foreground">{course.name}</span> course. 
                You're now ready to start investing in this asset class.
              </p>
            </div>

            <Card className="border">
              <CardContent className="p-5">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-lg font-bold">{totalModules}</p>
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

            <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {course.name} investing is now unlocked
            </Badge>

            <div className="space-y-3 pt-2">
              <Button className="w-full" onClick={() => setLocation(`/invest/${params.id === "angel" ? "angel-investing" : params.id}`)} data-testid="button-start-investing">
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Investing in {course.name}
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

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/learn")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-lg ${course.color} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${course.iconColor}`} />
            </div>
            <span className="font-semibold">{course.name}</span>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Sprout className="w-3 h-3 text-primary" />
            {totalSeeds}
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-5">
        {/* Course Intro */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{course.name}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">{course.intro}</p>
        </div>

        {/* Progress Card */}
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm text-muted-foreground">{completedModules} / {totalModules} modules</span>
            </div>
            <Progress value={progressPercent} className="h-2 mb-3" />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.modules.reduce((sum, m) => sum + parseInt(m.duration), 0)} min total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{totalModules} lessons</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules List */}
        <section>
          <h3 className="font-semibold mb-3">Lessons</h3>
          <div className="space-y-3">
            {course.modules.map((module, index) => (
              <Card 
                key={index}
                className={`border ${module.locked ? 'opacity-60' : 'hover-elevate cursor-pointer'}`}
                data-testid={`module-${index}`}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    module.completed 
                      ? 'bg-primary text-primary-foreground' 
                      : module.locked 
                        ? 'bg-muted' 
                        : course.color
                  }`}>
                    {module.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : module.locked ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <PlayCircle className={`w-5 h-5 ${course.iconColor}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{module.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{module.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground">{module.duration}</span>
                      <Badge variant="secondary" className="text-xs gap-1 px-2 py-0.5">
                        <Sprout className="w-3 h-3" />
                        {module.seeds}
                      </Badge>
                    </div>
                  </div>
                  {!module.locked && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom CTAs */}
        <div className="sticky bottom-4 pt-2 space-y-2">
          <Button className="w-full shadow-lg" size="lg" onClick={() => setCourseCompleted(true)} data-testid="button-start-course">
            <PlayCircle className="w-5 h-5 mr-2" />
            Start First Lesson
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
