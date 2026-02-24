import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { BottomNav } from "@/components/bottom-nav";
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  Bitcoin, 
  Building2, 
  Rocket, 
  Sparkles,
  BookOpen,
  Users,
  Sprout,
  Lock,
  ChevronRight,
  GraduationCap,
  Target,
  Lightbulb,
  Brain,
  Eye,
  Bell,
  Search,
  Play,
  BarChart3,
  Trophy,
  CheckCircle2,
  XCircle,
  Award
} from "lucide-react";
import growttLogo from "@assets/Growtt_Icon_Primary_1770990881558.jpg";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const tipMessages = [
  { icon: Lightbulb, text: "Confused how to start? Tap on a module to learn and unlock access to real investing" },
  { icon: Brain, text: "Why learn to invest first? Because knowledge is your most valuable investment" },
  { icon: Target, text: "Complete learning modules to earn seeds and unlock premium features" },
  { icon: GraduationCap, text: "Master the basics before risking your hard-earned money in the market" },
];

const professionalQuizQuestions = [
  {
    id: 1,
    question: "What does P/E ratio stand for in stock analysis?",
    options: [
      { id: "a", text: "Profit/Equity ratio" },
      { id: "b", text: "Price/Earnings ratio" },
      { id: "c", text: "Performance/Expense ratio" },
      { id: "d", text: "Portfolio/Efficiency ratio" },
    ],
    correctAnswer: "b",
  },
  {
    id: 2,
    question: "What is diversification in investing?",
    options: [
      { id: "a", text: "Putting all money in one high-return asset" },
      { id: "b", text: "Only investing in stocks" },
      { id: "c", text: "Spreading investments across different assets to reduce risk" },
      { id: "d", text: "Buying assets from the same industry" },
    ],
    correctAnswer: "c",
  },
  {
    id: 3,
    question: "What is a 'bear market'?",
    options: [
      { id: "a", text: "A market where prices are rising" },
      { id: "b", text: "A market where prices are falling by 20% or more" },
      { id: "c", text: "A market dominated by animal stocks" },
      { id: "d", text: "A market that only operates in winter" },
    ],
    correctAnswer: "b",
  },
  {
    id: 4,
    question: "What does 'ROI' stand for?",
    options: [
      { id: "a", text: "Rate of Income" },
      { id: "b", text: "Return on Investment" },
      { id: "c", text: "Risk of Inflation" },
      { id: "d", text: "Revenue over Interest" },
    ],
    correctAnswer: "b",
  },
  {
    id: 5,
    question: "What is a 'blue chip' stock?",
    options: [
      { id: "a", text: "A penny stock with high volatility" },
      { id: "b", text: "A stock from a small startup" },
      { id: "c", text: "A stock from a large, well-established company with reliable performance" },
      { id: "d", text: "A stock that only trades on weekends" },
    ],
    correctAnswer: "c",
  },
];

const investmentCategories = [
  { 
    id: "stocks", 
    name: "Stocks", 
    icon: TrendingUp, 
    color: "bg-blue-500/10 dark:bg-blue-500/20", 
    iconColor: "text-blue-600 dark:text-blue-400",
    description: "Learn the fundamentals of stock market investing",
    modules: 8,
    completed: 0
  },
  { 
    id: "crypto", 
    name: "Crypto", 
    icon: Bitcoin, 
    color: "bg-orange-500/10 dark:bg-orange-500/20", 
    iconColor: "text-orange-600 dark:text-orange-400",
    description: "Understand cryptocurrency and blockchain technology",
    modules: 6,
    completed: 0
  },
  { 
    id: "real-estate", 
    name: "Real Estate", 
    icon: Building2, 
    color: "bg-emerald-500/10 dark:bg-emerald-500/20", 
    iconColor: "text-emerald-600 dark:text-emerald-400",
    description: "Property investment strategies and REITs",
    modules: 5,
    completed: 0
  },
  { 
    id: "angel", 
    name: "Angel Investing", 
    icon: Rocket, 
    color: "bg-purple-500/10 dark:bg-purple-500/20", 
    iconColor: "text-purple-600 dark:text-purple-400",
    description: "Investing in early-stage startups",
    modules: 7,
    completed: 0
  },
];

const featuredBooks = [
  { title: "The Intelligent Investor", author: "Benjamin Graham", seeds: 50 },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", seeds: 40 },
  { title: "A Random Walk Down Wall Street", author: "Burton Malkiel", seeds: 60 },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [showFundingDialog, setShowFundingDialog] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showProfessionalQuiz, setShowProfessionalQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0); // 0 = intro, 1-5 = questions, 6 = results
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [isProfessional, setIsProfessional] = useState(false);
  const [showSeedsDashboard, setShowSeedsDashboard] = useState(false);
  
  const [activeWalletCard, setActiveWalletCard] = useState(0);
  const walletScrollRef = useRef<HTMLDivElement>(null);
  
  const userSeeds = 120;
  const totalBalance = 123122.90;
  const demoBalance = 5000000.00;
  
  const calculateQuizScore = () => {
    let correct = 0;
    professionalQuizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };
  
  const handleQuizSubmit = () => {
    const score = calculateQuizScore();
    const passed = score >= 4; // Need 4/5 to pass
    if (passed) {
      setIsProfessional(true);
    }
    setQuizStep(6); // Show results
  };
  
  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setShowProfessionalQuiz(false);
  };

  const navigateToCourse = (categoryId: string) => {
    setLocation(`/course/${categoryId}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tipMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const CurrentTipIcon = tipMessages[currentTipIndex].icon;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={growttLogo} alt="Growtt" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <p className="text-xs text-muted-foreground">Welcome back</p>
              <p className="font-semibold text-sm">Guest User</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" data-testid="button-search">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-notifications">
              <Bell className="w-5 h-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-4 lg:pt-6 space-y-5 lg:space-y-6">
        {/* Level Badge */}
        <div className="flex items-center gap-3">
          <Badge 
            variant={isProfessional ? "outline" : "secondary"} 
            className={`px-3 py-1 font-semibold cursor-pointer ${!isProfessional ? '' : 'text-muted-foreground'}`}
            onClick={() => !isProfessional && setIsProfessional(false)}
            data-testid="badge-beginner"
          >
            Beginner
          </Badge>
          <span className="text-muted-foreground text-sm">|</span>
          <Badge 
            variant={isProfessional ? "secondary" : "outline"}
            className={`px-3 py-1 font-semibold cursor-pointer ${isProfessional ? '' : 'text-muted-foreground'}`}
            onClick={() => !isProfessional && setShowProfessionalQuiz(true)}
            data-testid="badge-professional"
          >
            {isProfessional && <Award className="w-3 h-3 mr-1" />}
            Professional
          </Badge>
          <div className="ml-auto cursor-pointer" onClick={() => setShowSeedsDashboard(true)}>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5" data-testid="badge-seeds">
              <Sprout className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold">{userSeeds}</span>
              <span className="text-muted-foreground text-xs">seeds</span>
            </Badge>
          </div>
        </div>

        {/* Desktop: Two column layout for wallet and quick actions */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-5 lg:space-y-0">
        {/* Wallet Cards Carousel */}
        <div className="relative">
          <div 
            ref={walletScrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4"
            onScroll={(e) => {
              const el = e.currentTarget;
              const cardWidth = el.scrollWidth / 2;
              const idx = Math.round(el.scrollLeft / cardWidth);
              setActiveWalletCard(idx);
            }}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Wallet Balance Card */}
            <Card className="border-0 bg-growtt-wallet dark:bg-growtt-wallet overflow-visible rounded-2xl flex-shrink-0 w-full snap-center" data-testid="card-wallet-balance">
              <CardContent className="p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-foreground/60" />
                  <p className="text-foreground/70 text-sm font-medium">Wallet balance</p>
                  <Eye className="w-4 h-4 text-foreground/60 ml-auto" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">₦{totalBalance.toLocaleString()}</h2>
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={() => setShowFundingDialog(true)}
                    data-testid="button-add-funds"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Funds
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-white/50 dark:bg-white/10 border-foreground/20 text-foreground"
                    data-testid="button-withdraw"
                  >
                    <ArrowUpRight className="w-4 h-4 mr-1.5" />
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Demo Balance Card */}
            <Card className="border-0 bg-growtt-wallet dark:bg-growtt-wallet overflow-visible rounded-2xl flex-shrink-0 w-full snap-center" data-testid="card-demo-balance">
              <CardContent className="p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Play className="w-4 h-4 text-foreground/60" />
                  <p className="text-foreground/70 text-sm font-medium">Demo balance</p>
                  <Badge className="ml-auto bg-foreground/10 text-foreground/70 border-0 text-[10px]">Practice Mode</Badge>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-1">₦{demoBalance.toLocaleString()}</h2>
                <p className="text-foreground/50 text-xs mb-3">Risk-free virtual funds to practice trading</p>
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-primary text-primary-foreground"
                    data-testid="button-invest-demo"
                  >
                    <Play className="w-4 h-4 mr-1.5" />
                    Invest with Demo Funds
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-white/50 dark:bg-white/10 border-foreground/20 text-foreground"
                    data-testid="button-reset-demo"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-2">
            <button 
              className={`w-2 h-2 rounded-full transition-all ${activeWalletCard === 0 ? 'bg-primary w-5' : 'bg-muted-foreground/30'}`}
              onClick={() => walletScrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' })}
              data-testid="dot-wallet"
            />
            <button 
              className={`w-2 h-2 rounded-full transition-all ${activeWalletCard === 1 ? 'bg-primary w-5' : 'bg-muted-foreground/30'}`}
              onClick={() => walletScrollRef.current?.scrollTo({ left: walletScrollRef.current.scrollWidth / 2, behavior: 'smooth' })}
              data-testid="dot-demo"
            />
          </div>
        </div>

        {/* Quick Actions - Horizontal row with icons */}
        <div className="flex gap-3 lg:flex-col lg:justify-center">
          <Button
            variant="outline"
            className="flex-1 h-auto py-3 lg:py-4 flex-col lg:flex-row gap-1 lg:gap-3 lg:justify-start bg-growtt-ai border-0 text-white hover:bg-growtt-ai/90"
            onClick={() => setLocation("/growtt-ai")}
            data-testid="button-growtt-ai"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-xs lg:text-sm font-medium">Growtt AI</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex-1 h-auto py-3 lg:py-4 flex-col lg:flex-row gap-1 lg:gap-3 lg:justify-start bg-growtt-portfolio border-0 text-white hover:bg-growtt-portfolio/90"
            onClick={() => navigateToCourse("portfolio")}
            data-testid="button-portfolio"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs lg:text-sm font-medium">Portfolio</span>
          </Button>
          
          <Card 
            className="flex-1 border bg-gradient-to-r from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20 hover-elevate cursor-pointer"
            onClick={() => setLocation("/leaderboard")}
            data-testid="card-leaderboard"
          >
            <CardContent className="p-3 lg:p-4 flex flex-col lg:flex-row items-center gap-1 lg:gap-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xs lg:text-sm font-medium">Leaderboard</span>
            </CardContent>
          </Card>
        </div>
        </div>

        {/* Tips Banner - Full width, one message at a time */}
        <Card 
          className="border bg-gradient-to-r from-primary/5 to-accent/5 hover-elevate cursor-pointer"
          data-testid={`tip-card-${currentTipIndex}`}
          onClick={() => setCurrentTipIndex((prev) => (prev + 1) % tipMessages.length)}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CurrentTipIcon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-foreground leading-snug flex-1">
              {tipMessages[currentTipIndex].text}
            </p>
            <div className="flex gap-1">
              {tipMessages.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === currentTipIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Start Learning Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Start Learning</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs gap-1" onClick={() => setLocation("/learn")} data-testid="button-view-all-courses">
              View All
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4">
            {investmentCategories.map((category) => (
              <Card 
                key={category.id}
                className="border hover-elevate cursor-pointer"
                onClick={() => navigateToCourse(category.id)}
                data-testid={`category-${category.id}`}
              >
                <CardContent className="p-4">
                  <div className={`w-11 h-11 rounded-xl ${category.color} flex items-center justify-center mb-3`}>
                    <category.icon className={`w-5 h-5 ${category.iconColor}`} />
                  </div>
                  <p className="font-medium text-sm mb-1">{category.name}</p>
                  <div className="flex items-center gap-1.5">
                    <Progress value={0} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground">0/{category.modules}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Books Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Books
            </h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs gap-1" onClick={() => setLocation("/books")} data-testid="button-view-all-books">
              View All
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {featuredBooks.map((book, index) => (
              <Card 
                key={index}
                className="min-w-[180px] border hover-elevate cursor-pointer flex-shrink-0"
                data-testid={`book-${index}`}
              >
                <CardContent className="p-4">
                  <div className="w-full h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                    <BookOpen className="w-7 h-7 text-primary/50" />
                  </div>
                  <p className="font-medium text-sm line-clamp-1">{book.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Sprout className="w-3 h-3" />
                    {book.seeds} seeds
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Referrals Section */}
        <section>
          <Card className="border bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Invite Friends</p>
                <p className="text-xs text-muted-foreground">Earn 50 seeds for each friend who joins</p>
              </div>
              <Button size="sm" data-testid="button-referrals">
                Share
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Add Funds Dialog (Learn First) */}
      <Dialog open={showFundingDialog} onOpenChange={setShowFundingDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-center">Learn Before You Invest</DialogTitle>
            <DialogDescription className="text-center">
              Before adding funds, let's make sure you understand the basics of investing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Card className="border">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-2">Investment 101</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Learn how much you should be investing based on your income and goals.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="gap-1">
                    <Sprout className="w-3 h-3" />
                    Earn 30 seeds
                  </Badge>
                  <span className="text-xs text-muted-foreground">5 min read</span>
                </div>
              </CardContent>
            </Card>
            
            <Button className="w-full" data-testid="button-start-investment-101">
              <BookOpen className="w-4 h-4 mr-2" />
              Start Investment 101
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              Complete this module to unlock the ability to add funds
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Professional Verification Quiz */}
      <Dialog open={showProfessionalQuiz} onOpenChange={(open) => { if (!open) resetQuiz(); }}>
        <DialogContent className="max-w-sm mx-auto max-h-[85vh] overflow-y-auto">
          {quizStep === 0 && (
            <>
              <DialogHeader>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-2">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <DialogTitle className="text-center">Professional Verification</DialogTitle>
                <DialogDescription className="text-center">
                  Prove your investment knowledge to unlock Professional status and access advanced features.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <Card className="border bg-muted/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">5 Questions</p>
                        <p className="text-xs text-muted-foreground">Multiple choice format</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Pass Score: 80%</p>
                        <p className="text-xs text-muted-foreground">Get at least 4 out of 5 correct</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Professional Badge</p>
                        <p className="text-xs text-muted-foreground">Unlock advanced trading tools</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button className="w-full" onClick={() => setQuizStep(1)} data-testid="button-start-quiz">
                  Start Quiz
                </Button>
                
                <p className="text-center text-xs text-muted-foreground">
                  You can retake the quiz if you don't pass
                </p>
              </div>
            </>
          )}
          
          {quizStep >= 1 && quizStep <= 5 && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Question {quizStep} of 5</Badge>
                  <span className="text-xs text-muted-foreground">{Math.round((quizStep / 5) * 100)}% complete</span>
                </div>
                <Progress value={(quizStep / 5) * 100} className="h-2 mb-4" />
                <DialogTitle className="text-left text-base">
                  {professionalQuizQuestions[quizStep - 1].question}
                </DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <RadioGroup
                  value={quizAnswers[quizStep] || ""}
                  onValueChange={(value) => setQuizAnswers({ ...quizAnswers, [quizStep]: value })}
                  className="space-y-3"
                >
                  {professionalQuizQuestions[quizStep - 1].options.map((option) => (
                    <div 
                      key={option.id} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        quizAnswers[quizStep] === option.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted hover:border-muted-foreground/30'
                      }`}
                      onClick={() => setQuizAnswers({ ...quizAnswers, [quizStep]: option.id })}
                    >
                      <RadioGroupItem value={option.id} id={`q${quizStep}-${option.id}`} />
                      <Label htmlFor={`q${quizStep}-${option.id}`} className="flex-1 cursor-pointer text-sm">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex gap-3">
                {quizStep > 1 && (
                  <Button variant="outline" onClick={() => setQuizStep(quizStep - 1)} data-testid="button-quiz-back">
                    Back
                  </Button>
                )}
                {quizStep < 5 ? (
                  <Button 
                    className="flex-1" 
                    disabled={!quizAnswers[quizStep]}
                    onClick={() => setQuizStep(quizStep + 1)}
                    data-testid="button-quiz-next"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    className="flex-1" 
                    disabled={!quizAnswers[quizStep]}
                    onClick={handleQuizSubmit}
                    data-testid="button-quiz-submit"
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            </>
          )}
          
          {quizStep === 6 && (
            <>
              <DialogHeader>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  calculateQuizScore() >= 4 
                    ? 'bg-gradient-to-br from-green-400 to-green-600' 
                    : 'bg-gradient-to-br from-orange-400 to-orange-600'
                }`}>
                  {calculateQuizScore() >= 4 ? (
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  ) : (
                    <XCircle className="w-10 h-10 text-white" />
                  )}
                </div>
                <DialogTitle className="text-center">
                  {calculateQuizScore() >= 4 ? "Congratulations!" : "Almost There!"}
                </DialogTitle>
                <DialogDescription className="text-center">
                  {calculateQuizScore() >= 4 
                    ? "You've proven your investment knowledge. Welcome to Professional status!" 
                    : `You scored ${calculateQuizScore()}/5. You need at least 4 correct answers to pass.`
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <Card className={`border-2 ${calculateQuizScore() >= 4 ? 'border-green-500/30 bg-green-500/5' : 'border-orange-500/30 bg-orange-500/5'}`}>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold mb-1">{calculateQuizScore()}/5</p>
                    <p className="text-sm text-muted-foreground">Correct Answers</p>
                  </CardContent>
                </Card>
                
                {calculateQuizScore() >= 4 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Award className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="font-medium text-sm">Professional Badge Unlocked</p>
                        <p className="text-xs text-muted-foreground">Access advanced features</p>
                      </div>
                    </div>
                    <Button className="w-full" onClick={resetQuiz} data-testid="button-quiz-done">
                      Done
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center">
                      Don't worry! Review the learning modules to strengthen your knowledge, then try again.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={resetQuiz} data-testid="button-quiz-close">
                        Close
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={() => { setQuizStep(0); setQuizAnswers({}); }}
                        data-testid="button-quiz-retry"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Seeds Dashboard Sheet */}
      <Sheet open={showSeedsDashboard} onOpenChange={setShowSeedsDashboard}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl p-0 flex flex-col">
          <SheetHeader className="p-5 pb-3">
            <SheetTitle className="text-left text-lg">Your Seeds</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-5 pt-2 space-y-5">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Sprout className="w-8 h-8 text-primary" />
              </div>
              <p className="text-4xl font-bold mb-1" data-testid="text-seeds-balance">{userSeeds}</p>
              <p className="text-sm text-muted-foreground">Total Seeds</p>
            </div>

            <Card className="border bg-primary/5">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-2">What are Seeds?</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Seeds are Growtt's learning currency. You spend seeds to access investment modules, books, and features. As you progress through a module, you earn seeds back based on how much you complete.
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">100% complete</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">15% seeds back</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">75% complete</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">11% seeds back</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">50% complete</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">7% seeds back</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">25% complete</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">3% seeds back</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              <Card className="border">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Earned</p>
                  <p className="font-bold text-green-600 dark:text-green-400" data-testid="text-seeds-earned">+180</p>
                </CardContent>
              </Card>
              <Card className="border">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Used</p>
                  <p className="font-bold text-red-600 dark:text-red-400" data-testid="text-seeds-used">-60</p>
                </CardContent>
              </Card>
              <Card className="border">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Balance</p>
                  <p className="font-bold" data-testid="text-seeds-current">{userSeeds}</p>
                </CardContent>
              </Card>
            </div>

            <section>
              <h4 className="font-semibold text-sm mb-3">Seed Transactions</h4>
              <div className="space-y-2">
                {[
                  { label: "Stocks Module — 100% complete", seeds: "+5", type: "earned" as const, icon: GraduationCap, time: "2 hours ago", detail: "15% of 30 seeds back" },
                  { label: "Accessed Stocks Module", seeds: "-30", type: "spent" as const, icon: TrendingUp, time: "3 hours ago", detail: "Module access fee" },
                  { label: "Crypto Module — 50% complete", seeds: "+3", type: "earned" as const, icon: GraduationCap, time: "Yesterday", detail: "7% of 40 seeds back" },
                  { label: "Accessed Crypto Module", seeds: "-40", type: "spent" as const, icon: TrendingUp, time: "Yesterday", detail: "Module access fee" },
                  { label: "Accessed 'Rich Dad Poor Dad'", seeds: "-25", type: "spent" as const, icon: BookOpen, time: "2 days ago", detail: "Book access fee" },
                  { label: "Bonds Module — 75% complete", seeds: "+4", type: "earned" as const, icon: GraduationCap, time: "3 days ago", detail: "11% of 35 seeds back" },
                  { label: "Accessed Bonds Module", seeds: "-35", type: "spent" as const, icon: TrendingUp, time: "3 days ago", detail: "Module access fee" },
                  { label: "Referred a Friend", seeds: "+50", type: "earned" as const, icon: Users, time: "5 days ago", detail: "Referral bonus" },
                  { label: "Bought 200 Seeds", seeds: "+200", type: "earned" as const, icon: Sprout, time: "1 week ago", detail: "Purchased" },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50" data-testid={`seed-transaction-${i}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === "earned" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      <tx.icon className={`w-4 h-4 ${
                        tx.type === "earned" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.label}</p>
                      <p className="text-xs text-muted-foreground">{tx.detail} · {tx.time}</p>
                    </div>
                    <span className={`text-sm font-semibold flex-shrink-0 ${
                      tx.type === "earned" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {tx.seeds}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="p-5 pt-3 border-t bg-background">
            <Button className="w-full" size="lg" data-testid="button-buy-seeds">
              <Sprout className="w-5 h-5 mr-2" />
              Buy Seeds
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation */}
      <BottomNav currentPage="home" />
    </div>
  );
}
