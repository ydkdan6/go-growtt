import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme-toggle";
import { BottomNav } from "../components/bottom-nav";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "../components/ui/sheet";
import {
  TrendingUp, Bitcoin, Building2, Rocket, Sprout, Lock, ChevronRight,
  Wallet, PieChart, ArrowUpRight, ArrowDownRight, LineChart, Landmark,
  FileText, Users, DollarSign, Banknote, Heart, BarChart3, Gem,
  PlayCircle, Shield, Clock, AlertCircle, type LucideIcon,
} from "lucide-react";
import { useInvestmentAssets } from "@/hooks/general/useInvestmentsassets";
import type { InvestmentAsset } from "@/types/general.types";

// ─── Static market ticker data (no market data endpoint yet) ──────────────────
const marketData = [
  { name: "NGX ASI",    value: "98,432",  change: "+1.24%", positive: true  },
  { name: "BTC/NGN",    value: "₦152.4M", change: "+2.87%", positive: true  },
  { name: "USD/NGN",    value: "₦1,520",  change: "-0.3%",  positive: false },
  { name: "T-Bill Rate",value: "18.5%",   change: "+0.2%",  positive: true  },
];

// ─── Icon/colour by category ──────────────────────────────────────────────────
const getCategoryStyle = (category: string): {
  icon: LucideIcon; color: string;
} => {
  const c = (category ?? "").toLowerCase();
  if (c.includes("stock"))                   return { icon: TrendingUp,  color: "bg-blue-500"    };
  if (c.includes("crypto"))                  return { icon: Bitcoin,     color: "bg-orange-500"  };
  if (c.includes("real") || c.includes("estate") || c.includes("property")) return { icon: Building2, color: "bg-emerald-500" };
  if (c.includes("treasury"))                return { icon: Landmark,    color: "bg-sky-500"     };
  if (c.includes("bond") || c.includes("fgn")) return { icon: Landmark,  color: "bg-teal-600"   };
  if (c.includes("commercial") || c.includes("paper")) return { icon: FileText, color: "bg-slate-600" };
  if (c.includes("gold"))                    return { icon: Gem,         color: "bg-yellow-500"  };
  if (c.includes("oil") || c.includes("crude")) return { icon: Gem,      color: "bg-stone-700"   };
  if (c.includes("agri") || c.includes("farm")) return { icon: Sprout,   color: "bg-lime-600"    };
  if (c.includes("club"))                    return { icon: Users,       color: "bg-rose-500"    };
  if (c.includes("dollar"))                  return { icon: DollarSign,  color: "bg-green-600"   };
  if (c.includes("naira"))                   return { icon: Banknote,    color: "bg-primary"     };
  if (c.includes("equity"))                  return { icon: BarChart3,   color: "bg-indigo-500"  };
  if (c.includes("female") || c.includes("women")) return { icon: Heart, color: "bg-pink-500"   };
  if (c.includes("angel"))                   return { icon: Rocket,      color: "bg-purple-600"  };
  return { icon: BarChart3, color: "bg-primary" };
};

// ─── Build filter tabs dynamically from unique categories in API ───────────────
const buildTabs = (assets: InvestmentAsset[]) => {
  const cats = [...new Set(assets.map((a) => a.category).filter(Boolean))];
  return [
    { id: "all", label: "All" },
    ...cats.map((c) => ({ id: c, label: c })),
  ];
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Invest() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedAsset, setSelectedAsset]   = useState<InvestmentAsset | null>(null);
  const [sheetOpen, setSheetOpen]           = useState(false);

  // ── API ───────────────────────────────────────────────────────────────────
  const { data: assets = [], isLoading, isError, refetch } = useInvestmentAssets();

  // ── Derived ───────────────────────────────────────────────────────────────
  const tabs = buildTabs(assets);

  const filteredAssets =
    activeCategory === "all"
      ? assets
      : assets.filter((a) => a.category === activeCategory);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAssetTap = (asset: InvestmentAsset) => {
    setSelectedAsset(asset);
    setSheetOpen(true);
  };

  const handleStartInvesting = () => {
    if (!selectedAsset) return;
    setSheetOpen(false);
    // Navigate using category slug so AssetListing can match it
    const slug = selectedAsset.category.toLowerCase().replace(/\s+/g, "-");
    setLocation(`/invest/${slug}`);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Invest</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-6">

        {/* ── Portfolio Summary ── */}
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
                <Wallet className="w-4 h-4 mr-1.5" />Deposit
              </Button>
              <Button variant="outline" className="flex-1" data-testid="button-withdraw-invest">
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Market Overview (static) ── */}
        <section>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-semibold text-lg">Market Overview</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs gap-1" data-testid="button-see-all-markets">
              See All <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {marketData.map((m, i) => (
              <Card key={i} className="border">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{m.name}</p>
                  <p className="font-semibold">{m.value}</p>
                  <div className={`flex items-center gap-1 text-xs ${m.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {m.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {m.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Category Filter — dynamic from API ── */}
        {!isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeCategory === tab.id ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0"
                onClick={() => setActiveCategory(tab.id)}
                data-testid={`invest-category-${tab.id}`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        )}

        {/* ── Investment Options ── */}
        <section>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-semibold text-lg">
              {activeCategory === "all" ? "All Investment Assets" : activeCategory}
            </h3>
            {!isLoading && (
              <Badge variant="secondary">{filteredAssets.length} assets</Badge>
            )}
          </div>

          {/* Error */}
          {isError && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <AlertCircle className="w-10 h-10 text-destructive" />
              <p className="text-sm text-muted-foreground">Failed to load investment assets.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>Try Again</Button>
            </div>
          )}

          {/* Skeletons */}
          {isLoading && (
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border">
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                      <div className="h-3 bg-muted animate-pulse rounded w-full" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Asset cards */}
          {!isLoading && !isError && (
            <>
              {filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <BarChart3 className="w-10 h-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No assets in this category yet.</p>
                </div>
              ) : (
                <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                  {filteredAssets.map((asset) => {
                    const { icon: Icon, color } = getCategoryStyle(asset.category);
                    const name    = asset.assetName ?? asset.category ?? "Asset";
                    const minAmt  = asset.minPayment ? `₦${Number(asset.minPayment).toLocaleString()}` : null;
                    const returns = asset.interest ? `${asset.interest}% p.a.` : asset.percentGrowth ? `${asset.percentGrowth > 0 ? "+" : ""}${asset.percentGrowth}%` : null;

                    // tags — split by comma if multiple
                    const tagList = asset.tags
                      ? asset.tags.split(",").map((t) => t.trim()).filter(Boolean)
                      : [];

                    // pub_date — format as readable date
                    const pubDate = asset.pubDate
                      ? new Date(asset.pubDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
                      : null;

                    return (
                      <Card
                        key={asset.id}
                        className="border hover-elevate cursor-pointer"
                        onClick={() => handleAssetTap(asset)}
                        data-testid={`invest-option-${asset.id}`}
                      >
                        <CardContent className="p-4">
                          {/* ── Top row: icon + name + chevron ── */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center relative flex-shrink-0`}>
                              {asset.investmentIcon
                                ? <img src={asset.investmentIcon} alt={name} className="w-8 h-8 rounded-lg object-cover" />
                                : <Icon className="w-6 h-6 text-white" />
                              }
                              {asset.locked && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-card border flex items-center justify-center">
                                  <Lock className="w-3 h-3 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{name}</p>
                              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                {returns && (
                                  <span className="text-xs font-medium text-green-600 dark:text-green-400">{returns}</span>
                                )}
                                {minAmt && (
                                  <span className="text-xs text-muted-foreground">Min: {minAmt}</span>
                                )}
                                {asset.riskLevel && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{asset.riskLevel}</Badge>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>

                          {/* ── About ── */}
                          {(asset.about ?? asset.description) && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {asset.about ?? asset.description}
                            </p>
                          )}

                          {/* ── Tags ── */}
                          {tagList.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap mb-2">
                              {tagList.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                              ))}
                            </div>
                          )}

                          {/* ── Market cap + pub date ── */}
                          <div className="flex items-center justify-between gap-2 mt-1">
                            {asset.marketCap ? (
                              <span className="text-[10px] text-muted-foreground">
                                MCap: ₦{Number(asset.marketCap).toLocaleString()}
                              </span>
                            ) : <span />}
                            {pubDate && (
                              <span className="text-[10px] text-muted-foreground">{pubDate}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>

        {/* ── Unlock CTA ── */}
        <Card className="border bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <LineChart className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Unlock All Assets</p>
              <p className="text-xs text-muted-foreground">Complete learning courses to access all investment options</p>
            </div>
            <Button size="sm" onClick={() => setLocation("/learn")} data-testid="button-go-learn">Learn</Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav currentPage="invest" />

      {/* ── Asset Detail Sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={(open) => { if (!open) handleCloseSheet(); else setSheetOpen(true); }}>
        <SheetContent side="bottom" className="h-[92vh] overflow-y-auto rounded-t-2xl p-0">
          {selectedAsset && (() => {
            const { icon: Icon, color } = getCategoryStyle(selectedAsset.category);
            const name = selectedAsset.assetName ?? selectedAsset.category ?? "Asset";
            return (
              <div className="flex flex-col h-full">
                <SheetHeader className="p-5 pb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                      {selectedAsset.investmentIcon
                        ? <img src={selectedAsset.investmentIcon} alt={name} className="w-8 h-8 rounded-lg object-cover" />
                        : <Icon className="w-6 h-6 text-white" />
                      }
                    </div>
                    <div className="flex-1">
                      <SheetTitle className="text-left text-lg">{name}</SheetTitle>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {selectedAsset.description ?? selectedAsset.about ?? selectedAsset.category}
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-4">
                  {/* Key metrics grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {selectedAsset.interest && (
                      <Card className="border">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">Returns</p>
                          <p className="font-semibold text-sm text-green-600 dark:text-green-400">{selectedAsset.interest}% p.a.</p>
                        </CardContent>
                      </Card>
                    )}
                    {selectedAsset.minPayment && (
                      <Card className="border">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">Min. Amount</p>
                          <p className="font-semibold text-sm">₦{Number(selectedAsset.minPayment).toLocaleString()}</p>
                        </CardContent>
                      </Card>
                    )}
                    {selectedAsset.riskLevel && (
                      <Card className="border">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">Risk Level</p>
                          <p className="font-semibold text-sm">{selectedAsset.riskLevel}</p>
                        </CardContent>
                      </Card>
                    )}
                    {selectedAsset.tenure && (
                      <Card className="border">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">Tenure</p>
                          <p className="font-semibold text-sm">{selectedAsset.tenure}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* About */}
                  {(selectedAsset.about || selectedAsset.description) && (
                    <Card className="border">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm mb-2">About {name}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {selectedAsset.about ?? selectedAsset.description}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tags / type */}
                  {(selectedAsset.tags || selectedAsset.investmentType) && (
                    <div className="flex gap-2 flex-wrap">
                      {selectedAsset.investmentType && (
                        <Badge variant="secondary" className="text-xs">{selectedAsset.investmentType}</Badge>
                      )}
                      {selectedAsset.tags && (
                        <Badge variant="secondary" className="text-xs">{selectedAsset.tags}</Badge>
                      )}
                    </div>
                  )}

                  {/* Locked notice */}
                  {selectedAsset.locked && (
                    <Card className="border border-amber-500/20 bg-amber-500/5">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Lock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Asset Locked</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedAsset.requiredSeed > 0
                              ? `Requires ${selectedAsset.requiredSeed} seeds to unlock`
                              : "Complete learning modules to unlock this asset"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Key info */}
                  <div className="space-y-2.5">
                    {[
                      { icon: Shield, title: "SEC Regulated",      sub: "Fully compliant with Nigerian regulations" },
                      { icon: Clock,  title: "Real-time Tracking", sub: "Monitor performance live"                  },
                    ].map(({ icon: Ico, title, sub }) => (
                      <div key={title} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Ico className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{title}</p>
                          <p className="text-xs text-muted-foreground">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 pt-3 space-y-2 border-t bg-background">
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={selectedAsset.locked}
                    onClick={handleStartInvesting}
                    data-testid="button-start-investing"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    {selectedAsset.locked ? "Locked — Learn to Unlock" : `Invest in ${name}`}
                  </Button>
                  {selectedAsset.locked && (
                    <Button variant="outline" className="w-full" size="lg" onClick={() => { handleCloseSheet(); setLocation("/learn"); }} data-testid="button-go-learn-sheet">
                      Go to Learn
                    </Button>
                  )}
                </div>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}