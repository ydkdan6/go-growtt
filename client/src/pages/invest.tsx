import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ThemeToggle } from "../components/theme-toggle";
import { BottomNav } from "../components/bottom-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { 
  TrendingUp, 
  Bitcoin, 
  Building2, 
  Rocket, 
  Sprout,
  Lock,
  ChevronRight,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  Landmark,
  FileText,
  Users,
  DollarSign,
  Banknote,
  Heart,
  BarChart3,
  Gem,
  SkipForward,
  PlayCircle,
  BookOpen,
  Clock,
  CheckCircle2,
  PartyPopper,
  ArrowRight,
  Trophy,
  Shield,
  Info,
  Star
} from "lucide-react";

const marketData = [
  { name: "NGX ASI", value: "98,432", change: "+1.24%", positive: true },
  { name: "BTC/NGN", value: "₦152.4M", change: "+2.87%", positive: true },
  { name: "USD/NGN", value: "₦1,520", change: "-0.3%", positive: false },
  { name: "T-Bill Rate", value: "18.5%", change: "+0.2%", positive: true },
];

const assetCategories = [
  { id: "all", label: "All" },
  { id: "fixed", label: "Fixed Income" },
  { id: "equities", label: "Equities" },
  { id: "alternatives", label: "Alternatives" },
  { id: "funds", label: "Funds" },
  { id: "commodities", label: "Commodities" },
];

const investmentOptions = [
  { 
    id: "treasury-bills", 
    name: "Treasury Bills", 
    icon: Landmark, 
    color: "bg-sky-500",
    description: "Low-risk government-backed securities",
    returnRange: "15-19% p.a.",
    minAmount: "₦50,000",
    category: "fixed",
    locked: false,
    requiredSeeds: 0,
    riskLevel: "Low",
    tenure: "91-364 days",
    details: "Treasury Bills are short-term government securities issued by the Central Bank of Nigeria. They are considered one of the safest investment options available.",
    lessons: [
      { title: "What are Treasury Bills?", duration: "4 min", seeds: 10 },
      { title: "How T-Bill Auctions Work", duration: "5 min", seeds: 12 },
      { title: "Calculating T-Bill Returns", duration: "6 min", seeds: 15 },
    ]
  },
  { 
    id: "fgn-bonds", 
    name: "FGN Bonds", 
    icon: Landmark, 
    color: "bg-teal-600",
    description: "Federal Government of Nigeria long-term bonds",
    returnRange: "14-18% p.a.",
    minAmount: "₦100,000",
    category: "fixed",
    locked: false,
    requiredSeeds: 0,
    riskLevel: "Low",
    tenure: "2-30 years",
    details: "FGN Bonds are long-term debt instruments issued by the Federal Government of Nigeria to finance government spending and manage the national debt.",
    lessons: [
      { title: "Understanding Government Bonds", duration: "5 min", seeds: 12 },
      { title: "Bond Yields & Pricing", duration: "7 min", seeds: 18 },
      { title: "How to Buy FGN Bonds", duration: "5 min", seeds: 12 },
    ]
  },
  { 
    id: "commercial-papers", 
    name: "Commercial Papers", 
    icon: FileText, 
    color: "bg-slate-600",
    description: "Short-term corporate debt instruments",
    returnRange: "16-22% p.a.",
    minAmount: "₦500,000",
    category: "fixed",
    locked: true,
    requiredSeeds: 100,
    riskLevel: "Medium",
    tenure: "30-270 days",
    details: "Commercial Papers are unsecured short-term debt instruments issued by corporations to meet their short-term financing needs. They typically offer higher yields than treasury bills.",
    lessons: [
      { title: "What are Commercial Papers?", duration: "4 min", seeds: 10 },
      { title: "Evaluating Issuer Creditworthiness", duration: "6 min", seeds: 15 },
      { title: "Commercial Paper vs T-Bills", duration: "5 min", seeds: 12 },
    ]
  },
  { 
    id: "stocks", 
    name: "Stocks", 
    icon: TrendingUp, 
    color: "bg-blue-500",
    description: "Trade shares on the Nigerian Stock Exchange",
    returnRange: "Variable",
    minAmount: "₦5,000",
    category: "equities",
    locked: true,
    requiredSeeds: 100,
    riskLevel: "High",
    tenure: "Flexible",
    details: "Trade shares of companies listed on the Nigerian Stock Exchange (NGX). Build wealth through capital appreciation and dividends from Nigeria's leading companies.",
    lessons: [
      { title: "Introduction to Stocks", duration: "5 min", seeds: 12 },
      { title: "How Stock Exchanges Work", duration: "6 min", seeds: 15 },
      { title: "Reading Stock Charts", duration: "8 min", seeds: 20 },
      { title: "Placing Your First Trade", duration: "5 min", seeds: 12 },
    ]
  },
  { 
    id: "crypto", 
    name: "Crypto", 
    icon: Bitcoin, 
    color: "bg-orange-500",
    description: "Buy & sell Bitcoin, Ethereum, and more",
    returnRange: "Variable",
    minAmount: "₦1,000",
    category: "alternatives",
    locked: true,
    requiredSeeds: 150,
    riskLevel: "Very High",
    tenure: "Flexible",
    details: "Trade popular cryptocurrencies including Bitcoin, Ethereum, Solana, and more. Access the global digital asset market from Nigeria.",
    lessons: [
      { title: "Crypto Fundamentals", duration: "6 min", seeds: 15 },
      { title: "Understanding Blockchain", duration: "8 min", seeds: 20 },
      { title: "Buying Your First Crypto", duration: "5 min", seeds: 12 },
      { title: "Crypto Security Basics", duration: "6 min", seeds: 15 },
    ]
  },
  { 
    id: "real-estate", 
    name: "Real Estate", 
    icon: Building2, 
    color: "bg-emerald-500",
    description: "Invest in property across Nigeria",
    returnRange: "12-25% p.a.",
    minAmount: "₦250,000",
    category: "alternatives",
    locked: true,
    requiredSeeds: 200,
    riskLevel: "Medium",
    tenure: "1-5 years",
    details: "Invest in fractional real estate across Nigeria's top cities. Earn rental income and capital appreciation without the hassle of property management.",
    lessons: [
      { title: "Real Estate Investing 101", duration: "6 min", seeds: 15 },
      { title: "REITs vs Direct Property", duration: "7 min", seeds: 18 },
      { title: "Evaluating Property Deals", duration: "8 min", seeds: 20 },
    ]
  },
  { 
    id: "club-deals", 
    name: "Club Deals", 
    icon: Users, 
    color: "bg-rose-500",
    description: "Pool funds with other investors for bigger deals",
    returnRange: "20-35% p.a.",
    minAmount: "₦100,000",
    category: "alternatives",
    locked: true,
    requiredSeeds: 200,
    riskLevel: "High",
    tenure: "6-24 months",
    details: "Pool resources with other verified investors to access high-value deals in real estate, agriculture, and private equity that would otherwise require larger capital.",
    lessons: [
      { title: "What are Club Deals?", duration: "5 min", seeds: 12 },
      { title: "How Syndication Works", duration: "7 min", seeds: 18 },
      { title: "Evaluating Club Deals", duration: "6 min", seeds: 15 },
    ]
  },
  { 
    id: "dollar-funds", 
    name: "Dollar Funds", 
    icon: DollarSign, 
    color: "bg-green-600",
    description: "Dollar-denominated investments to hedge against naira",
    returnRange: "5-10% p.a.",
    minAmount: "$100",
    category: "funds",
    locked: true,
    requiredSeeds: 150,
    riskLevel: "Low-Medium",
    tenure: "Flexible",
    details: "Invest in dollar-denominated money market and fixed income funds to protect against naira depreciation while earning steady returns.",
    lessons: [
      { title: "Why Dollar Investments?", duration: "5 min", seeds: 12 },
      { title: "Understanding FX Risk", duration: "6 min", seeds: 15 },
      { title: "Dollar Fund Options", duration: "5 min", seeds: 12 },
    ]
  },
  { 
    id: "naira-funds", 
    name: "Naira Funds", 
    icon: Banknote, 
    color: "bg-primary",
    description: "Naira money market and savings funds",
    returnRange: "12-16% p.a.",
    minAmount: "₦10,000",
    category: "funds",
    locked: false,
    requiredSeeds: 0,
    riskLevel: "Low",
    tenure: "Flexible",
    details: "Invest in professionally managed naira money market funds offering competitive returns with daily liquidity. Perfect for short-term savings goals.",
    lessons: [
      { title: "Money Market Funds 101", duration: "4 min", seeds: 10 },
      { title: "Comparing Fund Returns", duration: "5 min", seeds: 12 },
      { title: "Setting Up Auto-Invest", duration: "4 min", seeds: 10 },
    ]
  },
  { 
    id: "equity-funds", 
    name: "Equity Funds", 
    icon: BarChart3, 
    color: "bg-indigo-500",
    description: "Diversified equity mutual funds managed by experts",
    returnRange: "15-30% p.a.",
    minAmount: "₦25,000",
    category: "funds",
    locked: true,
    requiredSeeds: 150,
    riskLevel: "High",
    tenure: "1+ years",
    details: "Invest in professionally managed equity mutual funds that give you exposure to a diversified basket of stocks on the Nigerian Stock Exchange.",
    lessons: [
      { title: "What are Equity Funds?", duration: "5 min", seeds: 12 },
      { title: "Expense Ratios & Fees", duration: "6 min", seeds: 15 },
      { title: "Choosing the Right Fund", duration: "7 min", seeds: 18 },
    ]
  },
  { 
    id: "gold", 
    name: "Gold", 
    icon: Gem, 
    color: "bg-yellow-500",
    description: "Invest in gold as a store of value and inflation hedge",
    returnRange: "8-15% p.a.",
    minAmount: "₦10,000",
    category: "commodities",
    locked: false,
    requiredSeeds: 0,
    riskLevel: "Medium",
    tenure: "Flexible",
    details: "Buy fractional gold backed by physical reserves. Gold has been a reliable store of value for centuries and serves as an excellent inflation hedge.",
    lessons: [
      { title: "Why Invest in Gold?", duration: "5 min", seeds: 12 },
      { title: "Physical vs Paper Gold", duration: "6 min", seeds: 15 },
      { title: "Gold in Your Portfolio", duration: "5 min", seeds: 12 },
    ]
  },
  { 
    id: "crude-oil", 
    name: "Crude Oil", 
    icon: Gem, 
    color: "bg-stone-700",
    description: "Trade Nigeria's top export commodity",
    returnRange: "Variable",
    minAmount: "₦50,000",
    category: "commodities",
    locked: true,
    requiredSeeds: 150,
    riskLevel: "Very High",
    tenure: "Flexible",
    details: "Gain exposure to crude oil prices, Nigeria's most valuable export commodity. Trade oil futures and ETFs with potential for significant returns.",
    lessons: [
      { title: "Oil Market Fundamentals", duration: "6 min", seeds: 15 },
      { title: "OPEC & Price Drivers", duration: "7 min", seeds: 18 },
      { title: "Trading Oil Commodities", duration: "6 min", seeds: 15 },
    ]
  },
  { 
    id: "agriculture", 
    name: "Agriculture", 
    icon: Sprout, 
    color: "bg-lime-600",
    description: "Invest in cocoa, cashew, sesame and agric value chains",
    returnRange: "15-25% p.a.",
    minAmount: "₦25,000",
    category: "commodities",
    locked: true,
    requiredSeeds: 100,
    riskLevel: "Medium-High",
    tenure: "6-18 months",
    details: "Fund agricultural projects across Nigeria's value chains including cocoa, cashew, sesame, and rice production. Earn returns from harvest proceeds.",
    lessons: [
      { title: "Agric Investment Basics", duration: "5 min", seeds: 12 },
      { title: "Understanding Crop Cycles", duration: "6 min", seeds: 15 },
      { title: "Evaluating Agric Deals", duration: "7 min", seeds: 18 },
    ]
  },
  { 
    id: "female-led-startups", 
    name: "Female-Led Startups", 
    icon: Heart, 
    color: "bg-pink-500",
    description: "Invest in women-founded businesses across Africa",
    returnRange: "Variable",
    minAmount: "₦50,000",
    category: "alternatives",
    locked: true,
    requiredSeeds: 250,
    riskLevel: "Very High",
    tenure: "2-5 years",
    details: "Back women-led startups shaping Africa's future. Invest alongside top VCs in curated deals from female founders across tech, healthcare, and fintech.",
    lessons: [
      { title: "Impact Investing 101", duration: "5 min", seeds: 12 },
      { title: "Evaluating Startups", duration: "8 min", seeds: 20 },
      { title: "Gender Lens Investing", duration: "6 min", seeds: 15 },
    ]
  },
  { 
    id: "angel-investing", 
    name: "Angel Investing", 
    icon: Rocket, 
    color: "bg-purple-600",
    description: "Fund early-stage startups for equity",
    returnRange: "Variable",
    minAmount: "₦500,000",
    category: "alternatives",
    locked: true,
    requiredSeeds: 300,
    riskLevel: "Very High",
    tenure: "3-7 years",
    details: "Invest in pre-seed and seed stage startups across Africa. Access vetted deal flow and build a portfolio of early-stage ventures with high growth potential.",
    lessons: [
      { title: "Angel Investing Basics", duration: "6 min", seeds: 15 },
      { title: "Startup Valuation", duration: "8 min", seeds: 20 },
      { title: "Due Diligence Process", duration: "7 min", seeds: 18 },
      { title: "Building a Deal Flow", duration: "6 min", seeds: 15 },
    ]
  },
];

type InvestmentOption = typeof investmentOptions[number];

type SheetView = "learning" | "completed";

export default function Invest() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState<InvestmentOption | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetView, setSheetView] = useState<SheetView>("learning");

  const filteredOptions = activeCategory === "all"
    ? investmentOptions
    : investmentOptions.filter(o => o.category === activeCategory);

  const handleAssetTap = (option: InvestmentOption) => {
    setSelectedAsset(option);
    setSheetView("learning");
    setSheetOpen(true);
  };

  const handleSkipOrComplete = () => {
    setSheetView("completed");
  };

  const handleStartInvesting = () => {
    if (selectedAsset) {
      setSheetOpen(false);
      setLocation(`/invest/${selectedAsset.id}`);
    }
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setSelectedAsset(null);
  };

  const totalLessonSeeds = selectedAsset?.lessons?.reduce((sum, l) => sum + l.seeds, 0) || 0;
  const totalLessonTime = selectedAsset?.lessons?.reduce((sum, l) => sum + parseInt(l.duration), 0) || 0;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Invest</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5" data-testid="badge-seeds-invest">
              <Sprout className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold">120</span>
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-6">
        {/* Portfolio Summary */}
        <Card className="border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <h2 className="text-3xl font-bold">₦0.00</h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <PieChart className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" data-testid="button-deposit">
                <Wallet className="w-4 h-4 mr-1.5" />
                Deposit
              </Button>
              <Button variant="outline" className="flex-1" data-testid="button-withdraw-invest">
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Market Overview */}
        <section>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-semibold text-lg">Market Overview</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs gap-1" data-testid="button-see-all-markets">
              See All
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {marketData.map((market, idx) => (
              <Card key={idx} className="border">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{market.name}</p>
                  <p className="font-semibold">{market.value}</p>
                  <div className={`flex items-center gap-1 text-xs ${
                    market.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {market.positive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {market.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Asset Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {assetCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              className="flex-shrink-0"
              onClick={() => setActiveCategory(cat.id)}
              data-testid={`invest-category-${cat.id}`}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Investment Options */}
        <section>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-semibold text-lg">
              {activeCategory === "all" ? "All Investment Assets" : assetCategories.find(c => c.id === activeCategory)?.label}
            </h3>
            <Badge variant="secondary">{filteredOptions.length} assets</Badge>
          </div>
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {filteredOptions.map((option) => (
              <Card 
                key={option.id}
                className="border hover-elevate cursor-pointer"
                onClick={() => handleAssetTap(option)}
                data-testid={`invest-option-${option.id}`}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center relative flex-shrink-0`}>
                    <option.icon className="w-6 h-6 text-white" />
                    {option.locked && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-card border flex items-center justify-center">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{option.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{option.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">{option.returnRange}</span>
                      <span className="text-xs text-muted-foreground">Min: {option.minAmount}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Learn to Unlock */}
        <Card className="border bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <LineChart className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Unlock All Assets</p>
              <p className="text-xs text-muted-foreground">Complete learning courses to access all investment options</p>
            </div>
            <Button size="sm" onClick={() => setLocation('/learn')} data-testid="button-go-learn">
              Learn
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav currentPage="invest" />

      {/* Asset Learning / Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => { if (!open) handleCloseSheet(); else setSheetOpen(true); }}>
        <SheetContent side="bottom" className="h-[92vh] overflow-y-auto rounded-t-2xl p-0">
          {selectedAsset && sheetView === "learning" && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-5 pb-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-12 h-12 rounded-xl ${selectedAsset.color} flex items-center justify-center flex-shrink-0`}>
                    <selectedAsset.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <SheetTitle className="text-left text-lg">{selectedAsset.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selectedAsset.description}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <Card className="border bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Learn Before You Invest</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Complete this quick module to understand {selectedAsset.name.toLowerCase()} investing and unlock this asset class.
                    </p>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{totalLessonTime} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{selectedAsset.lessons.length} lessons</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Sprout className="w-3 h-3 text-primary" />
                    +{totalLessonSeeds} seeds
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {selectedAsset.lessons.map((lesson, idx) => (
                    <Card key={idx} className="border hover-elevate cursor-pointer" data-testid={`lesson-${idx}`}>
                      <CardContent className="p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <PlayCircle className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            <Badge variant="secondary" className="text-xs gap-0.5 px-1.5 py-0">
                              <Sprout className="w-2.5 h-2.5" />
                              {lesson.seeds}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2">About {selectedAsset.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{selectedAsset.details}</p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Risk Level</p>
                          <p className="text-xs font-medium">{selectedAsset.riskLevel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Tenure</p>
                          <p className="text-xs font-medium">{selectedAsset.tenure}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-5 pt-3 space-y-2 border-t bg-background">
                <Button className="w-full" size="lg" onClick={handleSkipOrComplete} data-testid="button-start-learning">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Start Learning
                </Button>
                <Button variant="outline" className="w-full gap-2" size="lg" onClick={handleSkipOrComplete} data-testid="button-skip-learning-invest">
                  <SkipForward className="w-4 h-4" />
                  Skip Learning
                </Button>
              </div>
            </div>
          )}

          {selectedAsset && sheetView === "completed" && (
            <div className="flex flex-col h-full">
              <div className="flex-1 flex items-center justify-center p-5">
                <div className="max-w-sm w-full text-center space-y-5">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <PartyPopper className="w-10 h-10 text-primary" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-1.5">Module Complete!</h2>
                    <p className="text-sm text-muted-foreground">
                      You've completed the <span className="font-semibold text-foreground">{selectedAsset.name}</span> module.
                      You're ready to start investing.
                    </p>
                  </div>

                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                            <BookOpen className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-base font-bold">{selectedAsset.lessons.length}</p>
                          <p className="text-xs text-muted-foreground">Lessons</p>
                        </div>
                        <div className="text-center">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                            <Sprout className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-base font-bold">+{totalLessonSeeds}</p>
                          <p className="text-xs text-muted-foreground">Seeds</p>
                        </div>
                        <div className="text-center">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                            <Trophy className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-base font-bold">1</p>
                          <p className="text-xs text-muted-foreground">Badge</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {selectedAsset.name} unlocked
                  </Badge>
                </div>
              </div>

              <div className="p-5 pt-3 space-y-2 border-t bg-background">
                <Button className="w-full" size="lg" onClick={handleStartInvesting} data-testid="button-proceed-invest">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Start Investing in {selectedAsset.name}
                </Button>
                <Button variant="outline" className="w-full" size="lg" onClick={handleCloseSheet} data-testid="button-back-to-assets">
                  Back to Assets
                </Button>
              </div>
            </div>
          )}

        </SheetContent>
      </Sheet>
    </div>
  );
}
