import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { BottomNav } from "@/components/bottom-nav";
import { 
  ArrowLeft,
  Trophy,
  Medal,
  Crown,
  Flame,
  TrendingUp,
  Star,
  Zap,
  Target,
  Award,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Swords,
  Bitcoin,
  Building2,
  BarChart3,
  PieChart
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const traderPortfolios: Record<number, { asset: string; allocation: number; profit: number; type: "stock" | "crypto" | "realestate" }[]> = {
  1: [
    { asset: "Nigerian Breweries", allocation: 25, profit: 45.2, type: "stock" },
    { asset: "Bitcoin (BTC)", allocation: 20, profit: 82.3, type: "crypto" },
    { asset: "Dangote Cement", allocation: 18, profit: 28.6, type: "stock" },
    { asset: "Lagos Property Fund", allocation: 15, profit: 35.1, type: "realestate" },
    { asset: "Ethereum (ETH)", allocation: 12, profit: 68.4, type: "crypto" },
    { asset: "MTN Nigeria", allocation: 10, profit: 22.8, type: "stock" },
  ],
  2: [
    { asset: "Solana (SOL)", allocation: 30, profit: 95.6, type: "crypto" },
    { asset: "GTBank", allocation: 25, profit: 42.1, type: "stock" },
    { asset: "Bitcoin (BTC)", allocation: 20, profit: 78.2, type: "crypto" },
    { asset: "Seplat Energy", allocation: 15, profit: 31.5, type: "stock" },
    { asset: "Abuja Commercial RE", allocation: 10, profit: 18.9, type: "realestate" },
  ],
  3: [
    { asset: "Zenith Bank", allocation: 22, profit: 38.4, type: "stock" },
    { asset: "Ethereum (ETH)", allocation: 20, profit: 72.1, type: "crypto" },
    { asset: "BUA Cement", allocation: 18, profit: 29.3, type: "stock" },
    { asset: "Victoria Island RE", allocation: 15, profit: 41.2, type: "realestate" },
    { asset: "Cardano (ADA)", allocation: 15, profit: 54.6, type: "crypto" },
    { asset: "Access Bank", allocation: 10, profit: 25.8, type: "stock" },
  ],
  4: [
    { asset: "Airtel Africa", allocation: 28, profit: 35.7, type: "stock" },
    { asset: "Bitcoin (BTC)", allocation: 25, profit: 65.3, type: "crypto" },
    { asset: "Nestle Nigeria", allocation: 20, profit: 28.9, type: "stock" },
    { asset: "Polygon (MATIC)", allocation: 15, profit: 48.2, type: "crypto" },
    { asset: "Lekki Residential", allocation: 12, profit: 22.4, type: "realestate" },
  ],
  5: [
    { asset: "First Bank", allocation: 30, profit: 32.6, type: "stock" },
    { asset: "Ripple (XRP)", allocation: 22, profit: 58.9, type: "crypto" },
    { asset: "Oando", allocation: 18, profit: 24.3, type: "stock" },
    { asset: "Ikoyi Apartments", allocation: 15, profit: 28.7, type: "realestate" },
    { asset: "Avalanche (AVAX)", allocation: 15, profit: 42.1, type: "crypto" },
  ],
  6: [
    { asset: "UBA", allocation: 28, profit: 29.4, type: "stock" },
    { asset: "Bitcoin (BTC)", allocation: 24, profit: 56.8, type: "crypto" },
    { asset: "Stanbic IBTC", allocation: 20, profit: 22.1, type: "stock" },
    { asset: "Chainlink (LINK)", allocation: 16, profit: 38.5, type: "crypto" },
    { asset: "Port Harcourt Commercial", allocation: 12, profit: 18.2, type: "realestate" },
  ],
};

const getDefaultPortfolio = (rank: number) => [
  { asset: "Nigerian Stocks", allocation: 35, profit: 18.5 + (20 - rank), type: "stock" as const },
  { asset: "Crypto Assets", allocation: 30, profit: 32.2 + (20 - rank), type: "crypto" as const },
  { asset: "Real Estate", allocation: 20, profit: 12.8 + (20 - rank) * 0.5, type: "realestate" as const },
  { asset: "Other Assets", allocation: 15, profit: 8.4 + (20 - rank) * 0.3, type: "stock" as const },
];

const topTraders = [
  { rank: 1, name: "Adaeze O.", profit: 2847500, returnPct: 156.3, streak: 12, badge: "Diamond" },
  { rank: 2, name: "Chukwuemeka A.", profit: 2156000, returnPct: 134.2, streak: 9, badge: "Diamond" },
  { rank: 3, name: "Folake B.", profit: 1892000, returnPct: 128.7, streak: 15, badge: "Platinum" },
  { rank: 4, name: "Oluwaseun D.", profit: 1654300, returnPct: 112.4, streak: 7, badge: "Platinum" },
  { rank: 5, name: "Ngozi E.", profit: 1423000, returnPct: 98.6, streak: 11, badge: "Gold" },
  { rank: 6, name: "Babatunde F.", profit: 1287500, returnPct: 89.3, streak: 5, badge: "Gold" },
  { rank: 7, name: "Amara G.", profit: 1156000, returnPct: 82.1, streak: 8, badge: "Gold" },
  { rank: 8, name: "Ikenna H.", profit: 1034200, returnPct: 76.5, streak: 4, badge: "Silver" },
  { rank: 9, name: "Chiamaka I.", profit: 956800, returnPct: 71.2, streak: 6, badge: "Silver" },
  { rank: 10, name: "Obinna J.", profit: 878400, returnPct: 65.8, streak: 3, badge: "Silver" },
  { rank: 11, name: "Yetunde K.", profit: 812000, returnPct: 61.4, streak: 5, badge: "Silver" },
  { rank: 12, name: "Emeka L.", profit: 754300, returnPct: 57.2, streak: 4, badge: "Bronze" },
  { rank: 13, name: "Funke M.", profit: 698700, returnPct: 53.8, streak: 2, badge: "Bronze" },
  { rank: 14, name: "Chidi N.", profit: 645200, returnPct: 49.6, streak: 3, badge: "Bronze" },
  { rank: 15, name: "Adeola O.", profit: 598400, returnPct: 46.1, streak: 1, badge: "Bronze" },
  { rank: 16, name: "Tochukwu P.", profit: 556700, returnPct: 42.8, streak: 2, badge: "Bronze" },
  { rank: 17, name: "Chisom Q.", profit: 512300, returnPct: 39.5, streak: 1, badge: "Bronze" },
  { rank: 18, name: "Olumide R.", profit: 478900, returnPct: 36.7, streak: 3, badge: "Bronze" },
  { rank: 19, name: "Adaobi S.", profit: 445600, returnPct: 33.2, streak: 2, badge: "Bronze" },
  { rank: 20, name: "Kunle T.", profit: 412800, returnPct: 30.1, streak: 1, badge: "Bronze" },
];

const weeklyTrader = {
  name: "Folake B.",
  title: "Trader of the Week",
  profit: 456000,
  returnPct: 38.2,
  trades: 23,
  winRate: 87,
  strategy: "Diversified growth stocks with crypto hedging",
  tip: "Always do your research before investing. I spend at least 2 hours daily learning about the markets.",
};

const monthlyTrader = {
  name: "Adaeze O.",
  title: "Trader of the Month",
  profit: 1247000,
  returnPct: 68.5,
  trades: 67,
  winRate: 82,
  strategy: "Long-term value investing with strategic rebalancing",
  tip: "Patience is key. Don't panic sell during market dips - that's when opportunities appear!",
};

const headToHead = {
  title: "Battle of the Week",
  trader1: {
    name: "Ngozi E.",
    profit: 342000,
    returnPct: 24.5,
    trades: 18,
    winRate: 78,
    badge: "Gold",
  },
  trader2: {
    name: "Babatunde F.",
    profit: 298000,
    returnPct: 21.2,
    trades: 22,
    winRate: 72,
    badge: "Gold",
  },
  endsIn: "2d 14h",
  totalVotes: 1247,
  trader1Votes: 687,
  trader2Votes: 560,
};

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case "Diamond": return "bg-gradient-to-r from-cyan-400 to-blue-500 text-white";
    case "Platinum": return "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800";
    case "Gold": return "bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900";
    case "Silver": return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700";
    case "Bronze": return "bg-gradient-to-r from-orange-300 to-orange-400 text-orange-800";
    default: return "bg-muted text-muted-foreground";
  }
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
  return null;
};

const getAvatarColor = (rank: number) => {
  if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-amber-500";
  if (rank === 2) return "bg-gradient-to-br from-slate-300 to-slate-400";
  if (rank === 3) return "bg-gradient-to-br from-orange-300 to-orange-400";
  return "bg-primary/10";
};

const getAssetTypeIcon = (type: "stock" | "crypto" | "realestate") => {
  switch (type) {
    case "crypto": return <Bitcoin className="w-3.5 h-3.5 text-orange-500" />;
    case "realestate": return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
    default: return <BarChart3 className="w-3.5 h-3.5 text-primary" />;
  }
};

const getAssetTypeColor = (type: "stock" | "crypto" | "realestate") => {
  switch (type) {
    case "crypto": return "bg-orange-500";
    case "realestate": return "bg-blue-500";
    default: return "bg-primary";
  }
};

export default function Leaderboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"all" | "weekly" | "monthly">("all");
  const [assetFilter, setAssetFilter] = useState<"all" | "stocks" | "crypto" | "realestate">("all");
  const [showAll, setShowAll] = useState(false);
  const [expandedTrader, setExpandedTrader] = useState<number | null>(null);
  const [sheetTrader, setSheetTrader] = useState<{ rank: number; name: string; returnPct: number; badge: string } | null>(null);
  
  const getTraderPrimaryAsset = (rank: number): "stocks" | "crypto" | "realestate" => {
    const portfolio = traderPortfolios[rank] || getDefaultPortfolio(rank);
    const totals = { stocks: 0, crypto: 0, realestate: 0 };
    portfolio.forEach(h => {
      if (h.type === "stock") totals.stocks += h.allocation;
      else if (h.type === "crypto") totals.crypto += h.allocation;
      else if (h.type === "realestate") totals.realestate += h.allocation;
    });
    if (totals.crypto >= totals.stocks && totals.crypto >= totals.realestate) return "crypto";
    if (totals.realestate >= totals.stocks) return "realestate";
    return "stocks";
  };
  
  const filteredTraders = assetFilter === "all" 
    ? topTraders 
    : topTraders.filter(t => getTraderPrimaryAsset(t.rank) === assetFilter);
  
  const displayedTraders = showAll ? filteredTraders : filteredTraders.slice(0, 10);
  
  const getTraderPortfolio = (rank: number) => {
    return traderPortfolios[rank] || getDefaultPortfolio(rank);
  };
  
  const handleTraderClick = (rank: number) => {
    setExpandedTrader(expandedTrader === rank ? null : rank);
  };
  
  const openTraderSheet = (rank: number, name: string, returnPct: number, badge: string) => {
    setSheetTrader({ rank, name, returnPct, badge });
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-semibold">Leaderboard</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-4 lg:pt-6 space-y-5 lg:space-y-6">
        {/* Hero Banner */}
        <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70 overflow-hidden">
          <CardContent className="p-5 relative">
            <div className="absolute top-2 right-2 opacity-20">
              <Trophy className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
                <span className="text-primary-foreground/80 text-xs font-medium uppercase tracking-wide">Top Performers</span>
              </div>
              <h2 className="text-2xl font-bold text-primary-foreground mb-1">Growtt Champions</h2>
              <p className="text-primary-foreground/70 text-sm">See who's leading the pack this month</p>
            </div>
          </CardContent>
        </Card>

        {/* Tab Selector */}
        <div className="flex gap-2 bg-muted/50 p-1 rounded-xl">
          <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("all")}
            data-testid="tab-all-time"
          >
            <Trophy className="w-4 h-4 mr-1.5" />
            All Time
          </Button>
          <Button
            variant={activeTab === "weekly" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("weekly")}
            data-testid="tab-weekly"
          >
            <Zap className="w-4 h-4 mr-1.5" />
            Weekly
          </Button>
          <Button
            variant={activeTab === "monthly" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("monthly")}
            data-testid="tab-monthly"
          >
            <Star className="w-4 h-4 mr-1.5" />
            Monthly
          </Button>
        </div>

        {/* Asset Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <Button
            variant={assetFilter === "all" ? "secondary" : "outline"}
            size="sm"
            className="flex-shrink-0 gap-1.5"
            onClick={() => setAssetFilter("all")}
            data-testid="filter-all-assets"
          >
            <PieChart className="w-4 h-4" />
            All Assets
          </Button>
          <Button
            variant={assetFilter === "stocks" ? "secondary" : "outline"}
            size="sm"
            className={`flex-shrink-0 gap-1.5 ${assetFilter === "stocks" ? "bg-primary/10 text-primary border-primary/30" : ""}`}
            onClick={() => setAssetFilter("stocks")}
            data-testid="filter-stocks"
          >
            <BarChart3 className="w-4 h-4" />
            Stock Traders
          </Button>
          <Button
            variant={assetFilter === "crypto" ? "secondary" : "outline"}
            size="sm"
            className={`flex-shrink-0 gap-1.5 ${assetFilter === "crypto" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30" : ""}`}
            onClick={() => setAssetFilter("crypto")}
            data-testid="filter-crypto"
          >
            <Bitcoin className="w-4 h-4" />
            Crypto Traders
          </Button>
          <Button
            variant={assetFilter === "realestate" ? "secondary" : "outline"}
            size="sm"
            className={`flex-shrink-0 gap-1.5 ${assetFilter === "realestate" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" : ""}`}
            onClick={() => setAssetFilter("realestate")}
            data-testid="filter-realestate"
          >
            <Building2 className="w-4 h-4" />
            Property Traders
          </Button>
        </div>

        {/* Featured Trader Spotlight */}
        {activeTab !== "all" && (
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">
                  {activeTab === "weekly" ? weeklyTrader.title : monthlyTrader.title}
                </span>
                <Flame className="w-4 h-4 text-orange-500 ml-auto" />
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16 border-2 border-primary">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-lg font-bold">
                    {(activeTab === "weekly" ? weeklyTrader.name : monthlyTrader.name).split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{activeTab === "weekly" ? weeklyTrader.name : monthlyTrader.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getBadgeColor("Diamond")}>
                      <Crown className="w-3 h-3 mr-1" />
                      Champion
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-background/60 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-primary">
                    ₦{((activeTab === "weekly" ? weeklyTrader.profit : monthlyTrader.profit) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-muted-foreground">Profit</p>
                </div>
                <div className="bg-background/60 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-green-600">
                    +{activeTab === "weekly" ? weeklyTrader.returnPct : monthlyTrader.returnPct}%
                  </p>
                  <p className="text-xs text-muted-foreground">Return</p>
                </div>
                <div className="bg-background/60 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold">
                    {activeTab === "weekly" ? weeklyTrader.winRate : monthlyTrader.winRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
              </div>

              {/* Strategy & Tip */}
              <div className="space-y-3">
                <div className="bg-background/60 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">Strategy</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "weekly" ? weeklyTrader.strategy : monthlyTrader.strategy}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">Pro Tip</span>
                  </div>
                  <p className="text-sm italic">
                    "{activeTab === "weekly" ? weeklyTrader.tip : monthlyTrader.tip}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top 3 Podium */}
        {activeTab === "all" && (
          <div className="flex items-end justify-center gap-2 py-4">
            {/* 2nd Place */}
            <div 
              className="flex flex-col items-center cursor-pointer hover-elevate rounded-lg p-2"
              onClick={() => openTraderSheet(2, topTraders[1].name, topTraders[1].returnPct, topTraders[1].badge)}
              data-testid="podium-trader-2"
            >
              <div className="relative">
                <Avatar className={`w-14 h-14 border-2 border-slate-400 mb-2 ${getAvatarColor(2)}`}>
                  <AvatarFallback className="text-slate-700 font-bold">
                    {topTraders[1].name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${getTraderPrimaryAsset(2) === "crypto" ? "bg-orange-500" : getTraderPrimaryAsset(2) === "realestate" ? "bg-blue-500" : "bg-primary"}`}>
                  {getTraderPrimaryAsset(2) === "crypto" ? <Bitcoin className="w-3.5 h-3.5 text-white" /> : getTraderPrimaryAsset(2) === "realestate" ? <Building2 className="w-3.5 h-3.5 text-white" /> : <BarChart3 className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
              <Medal className="w-6 h-6 text-slate-400 mb-1" />
              <p className="text-xs font-medium text-center truncate w-20">{topTraders[1].name}</p>
              <p className="text-xs text-green-600 font-semibold">+{topTraders[1].returnPct}%</p>
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-t-lg mt-2 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-500">2</span>
              </div>
            </div>
            
            {/* 1st Place */}
            <div 
              className="flex flex-col items-center -mt-4 cursor-pointer hover-elevate rounded-lg p-2"
              onClick={() => openTraderSheet(1, topTraders[0].name, topTraders[0].returnPct, topTraders[0].badge)}
              data-testid="podium-trader-1"
            >
              <div className="relative">
                <Avatar className={`w-18 h-18 border-4 border-yellow-400 mb-2 ${getAvatarColor(1)}`}>
                  <AvatarFallback className="text-amber-800 font-bold text-lg">
                    {topTraders[0].name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0 -right-1 w-7 h-7 rounded-full flex items-center justify-center ${getTraderPrimaryAsset(1) === "crypto" ? "bg-orange-500" : getTraderPrimaryAsset(1) === "realestate" ? "bg-blue-500" : "bg-primary"}`}>
                  {getTraderPrimaryAsset(1) === "crypto" ? <Bitcoin className="w-4 h-4 text-white" /> : getTraderPrimaryAsset(1) === "realestate" ? <Building2 className="w-4 h-4 text-white" /> : <BarChart3 className="w-4 h-4 text-white" />}
                </div>
              </div>
              <Crown className="w-8 h-8 text-yellow-500 mb-1" />
              <p className="text-sm font-semibold text-center truncate w-24">{topTraders[0].name}</p>
              <p className="text-sm text-green-600 font-bold">+{topTraders[0].returnPct}%</p>
              <div className="w-20 h-24 bg-yellow-400 dark:bg-yellow-500 rounded-t-lg mt-2 flex items-center justify-center">
                <span className="text-3xl font-bold text-yellow-800">1</span>
              </div>
            </div>
            
            {/* 3rd Place */}
            <div 
              className="flex flex-col items-center cursor-pointer hover-elevate rounded-lg p-2"
              onClick={() => openTraderSheet(3, topTraders[2].name, topTraders[2].returnPct, topTraders[2].badge)}
              data-testid="podium-trader-3"
            >
              <div className="relative">
                <Avatar className={`w-14 h-14 border-2 border-orange-400 mb-2 ${getAvatarColor(3)}`}>
                  <AvatarFallback className="text-orange-700 font-bold">
                    {topTraders[2].name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${getTraderPrimaryAsset(3) === "crypto" ? "bg-orange-500" : getTraderPrimaryAsset(3) === "realestate" ? "bg-blue-500" : "bg-primary"}`}>
                  {getTraderPrimaryAsset(3) === "crypto" ? <Bitcoin className="w-3.5 h-3.5 text-white" /> : getTraderPrimaryAsset(3) === "realestate" ? <Building2 className="w-3.5 h-3.5 text-white" /> : <BarChart3 className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
              <Medal className="w-6 h-6 text-orange-400 mb-1" />
              <p className="text-xs font-medium text-center truncate w-20">{topTraders[2].name}</p>
              <p className="text-xs text-green-600 font-semibold">+{topTraders[2].returnPct}%</p>
              <div className="w-16 h-12 bg-orange-300 dark:bg-orange-400 rounded-t-lg mt-2 flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-700">3</span>
              </div>
            </div>
          </div>
        )}

        {/* 1v1 Head to Head Battle */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Swords className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">{headToHead.title}</h3>
            <Badge variant="secondary" className="ml-auto text-xs">
              Ends in {headToHead.endsIn}
            </Badge>
          </div>
          
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {/* Trader 1 */}
                <div 
                  className="flex-1 text-center cursor-pointer hover-elevate rounded-lg p-2"
                  onClick={() => openTraderSheet(5, headToHead.trader1.name, headToHead.trader1.returnPct, headToHead.trader1.badge)}
                  data-testid="battle-trader-1"
                >
                  <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-red-400 bg-gradient-to-br from-red-400 to-red-500">
                    <AvatarFallback className="text-white font-bold text-lg">
                      {headToHead.trader1.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm">{headToHead.trader1.name}</p>
                  <Badge className={`text-[10px] mt-1 ${getBadgeColor(headToHead.trader1.badge)}`}>
                    {headToHead.trader1.badge}
                  </Badge>
                  <div className="mt-2 space-y-1">
                    <p className="text-lg font-bold text-green-600">+{headToHead.trader1.returnPct}%</p>
                    <p className="text-xs text-muted-foreground">₦{(headToHead.trader1.profit / 1000).toFixed(0)}K profit</p>
                    <p className="text-xs text-muted-foreground">{headToHead.trader1.winRate}% win rate</p>
                  </div>
                </div>
                
                {/* VS */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">VS</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{headToHead.totalVotes} votes</p>
                </div>
                
                {/* Trader 2 */}
                <div 
                  className="flex-1 text-center cursor-pointer hover-elevate rounded-lg p-2"
                  onClick={() => openTraderSheet(6, headToHead.trader2.name, headToHead.trader2.returnPct, headToHead.trader2.badge)}
                  data-testid="battle-trader-2"
                >
                  <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-blue-400 bg-gradient-to-br from-blue-400 to-blue-500">
                    <AvatarFallback className="text-white font-bold text-lg">
                      {headToHead.trader2.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm">{headToHead.trader2.name}</p>
                  <Badge className={`text-[10px] mt-1 ${getBadgeColor(headToHead.trader2.badge)}`}>
                    {headToHead.trader2.badge}
                  </Badge>
                  <div className="mt-2 space-y-1">
                    <p className="text-lg font-bold text-green-600">+{headToHead.trader2.returnPct}%</p>
                    <p className="text-xs text-muted-foreground">₦{(headToHead.trader2.profit / 1000).toFixed(0)}K profit</p>
                    <p className="text-xs text-muted-foreground">{headToHead.trader2.winRate}% win rate</p>
                  </div>
                </div>
              </div>
              
              {/* Vote Bar */}
              <div className="mt-4">
                <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-red-500 transition-all"
                    style={{ width: `${(headToHead.trader1Votes / headToHead.totalVotes) * 100}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-500 transition-all"
                    style={{ width: `${(headToHead.trader2Votes / headToHead.totalVotes) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-xs">
                  <span className="text-red-500 font-medium">{Math.round((headToHead.trader1Votes / headToHead.totalVotes) * 100)}%</span>
                  <span className="text-blue-500 font-medium">{Math.round((headToHead.trader2Votes / headToHead.totalVotes) * 100)}%</span>
                </div>
              </div>
              
              {/* Vote Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950" data-testid="button-vote-trader1">
                  Vote {headToHead.trader1.name.split(" ")[0]}
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950" data-testid="button-vote-trader2">
                  Vote {headToHead.trader2.name.split(" ")[0]}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Leaderboard Table */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Top Traders</h3>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="w-3 h-3" />
              Live Rankings
            </Badge>
          </div>
          
          <div className="space-y-2">
            {displayedTraders.map((trader) => {
              const isExpanded = expandedTrader === trader.rank;
              const portfolio = getTraderPortfolio(trader.rank);
              
              return (
                <Card 
                  key={trader.rank}
                  className={`border ${trader.rank <= 3 ? 'border-primary/30' : ''} ${isExpanded ? 'ring-2 ring-primary/20' : 'hover-elevate'}`}
                  data-testid={`trader-${trader.rank}`}
                >
                  <CardContent 
                    className="p-3 flex items-center gap-3 cursor-pointer"
                    onClick={() => handleTraderClick(trader.rank)}
                    data-testid={`trader-name-${trader.rank}`}
                  >
                    {/* Rank */}
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {getRankIcon(trader.rank) || (
                        <span className="text-sm font-bold text-muted-foreground">{trader.rank}</span>
                      )}
                    </div>
                    
                    {/* Avatar */}
                    <Avatar className={`w-10 h-10 ${trader.rank <= 3 ? getAvatarColor(trader.rank) : 'bg-muted'}`}>
                      <AvatarFallback className={trader.rank <= 3 ? "text-white font-semibold" : "font-medium"}>
                        {trader.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{trader.name}</p>
                        {trader.streak >= 5 && (
                          <div className="flex items-center gap-0.5 text-orange-500">
                            <Flame className="w-3 h-3" />
                            <span className="text-xs font-medium">{trader.streak}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`text-[10px] px-1.5 py-0 ${getBadgeColor(trader.badge)}`}>
                          {trader.badge}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] px-1.5 py-0 gap-0.5 ${
                            getTraderPrimaryAsset(trader.rank) === "crypto" 
                              ? "border-orange-300 text-orange-600 dark:text-orange-400" 
                              : getTraderPrimaryAsset(trader.rank) === "realestate" 
                                ? "border-blue-300 text-blue-600 dark:text-blue-400" 
                                : "border-primary/30 text-primary"
                          }`}
                        >
                          {getTraderPrimaryAsset(trader.rank) === "crypto" ? (
                            <><Bitcoin className="w-2.5 h-2.5" /> Crypto</>
                          ) : getTraderPrimaryAsset(trader.rank) === "realestate" ? (
                            <><Building2 className="w-2.5 h-2.5" /> Property</>
                          ) : (
                            <><BarChart3 className="w-2.5 h-2.5" /> Stocks</>
                          )}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ₦{(trader.profit / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                    
                    {/* Return */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">+{trader.returnPct}%</p>
                      <p className="text-xs text-muted-foreground">return</p>
                    </div>
                    
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </CardContent>
                  
                  {/* Expanded Portfolio Breakdown */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 border-t bg-muted/30">
                      <div className="pt-3">
                        <div className="flex items-center gap-2 mb-3">
                          <PieChart className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Portfolio Breakdown</span>
                        </div>
                        
                        {/* Allocation Bar */}
                        <div className="flex h-3 rounded-full overflow-hidden mb-3">
                          {portfolio.map((holding, idx) => (
                            <div
                              key={idx}
                              className={`${getAssetTypeColor(holding.type)} first:rounded-l-full last:rounded-r-full`}
                              style={{ width: `${holding.allocation}%` }}
                            />
                          ))}
                        </div>
                        
                        {/* Holdings List */}
                        <div className="space-y-2">
                          {portfolio.map((holding, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-center gap-3 py-2 px-2.5 bg-background rounded-lg"
                              data-testid={`portfolio-holding-${trader.rank}-${idx}`}
                            >
                              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted">
                                {getAssetTypeIcon(holding.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{holding.asset}</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={holding.allocation} className="h-1.5 w-16" />
                                  <span className="text-xs text-muted-foreground">{holding.allocation}%</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">+{holding.profit.toFixed(1)}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          
          {/* Show More Button */}
          {!showAll && (
            <Button 
              variant="outline" 
              className="w-full mt-3 gap-2"
              onClick={() => setShowAll(true)}
              data-testid="button-show-more"
            >
              Show More
              <ChevronDown className="w-4 h-4" />
            </Button>
          )}
          {showAll && (
            <Button 
              variant="ghost" 
              className="w-full mt-3 gap-2 text-muted-foreground"
              onClick={() => setShowAll(false)}
              data-testid="button-show-less"
            >
              Show Less
            </Button>
          )}
        </section>

        {/* Your Rank CTA */}
        <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">Start Your Journey</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Complete learning modules and start investing to join the leaderboard!
            </p>
            <Button data-testid="button-start-learning" onClick={() => setLocation("/learn")}>
              Start Learning
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Trader Portfolio Sheet */}
      <Sheet open={!!sheetTrader} onOpenChange={(open) => !open && setSheetTrader(null)}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
          {sheetTrader && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Avatar className={`w-12 h-12 ${sheetTrader.rank <= 3 ? getAvatarColor(sheetTrader.rank) : 'bg-muted'}`}>
                    <AvatarFallback className={sheetTrader.rank <= 3 ? "text-white font-semibold" : "font-medium"}>
                      {sheetTrader.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-left">{sheetTrader.name}</SheetTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-[10px] ${getBadgeColor(sheetTrader.badge)}`}>
                        {sheetTrader.badge}
                      </Badge>
                      <span className="text-sm font-semibold text-green-600">+{sheetTrader.returnPct}%</span>
                    </div>
                  </div>
                </div>
              </SheetHeader>
              
              <div className="space-y-4 overflow-y-auto pb-6">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-primary" />
                  <span className="font-medium">Portfolio Breakdown</span>
                </div>
                
                {/* Allocation Bar */}
                <div className="flex h-4 rounded-full overflow-hidden">
                  {getTraderPortfolio(sheetTrader.rank).map((holding, idx) => (
                    <div
                      key={idx}
                      className={`${getAssetTypeColor(holding.type)} first:rounded-l-full last:rounded-r-full`}
                      style={{ width: `${holding.allocation}%` }}
                    />
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>Stocks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Crypto</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Real Estate</span>
                  </div>
                </div>
                
                {/* Holdings List */}
                <div className="space-y-2">
                  {getTraderPortfolio(sheetTrader.rank).map((holding, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 py-3 px-3 bg-muted/50 rounded-xl"
                      data-testid={`sheet-holding-${idx}`}
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-background">
                        {getAssetTypeIcon(holding.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{holding.asset}</p>
                        <div className="flex items-center gap-2">
                          <Progress value={holding.allocation} className="h-1.5 w-20" />
                          <span className="text-xs text-muted-foreground">{holding.allocation}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+{holding.profit.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">return</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <BottomNav currentPage="home" />
    </div>
  );
}
