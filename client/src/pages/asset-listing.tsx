import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme-toggle";
import { BottomNav } from "../components/bottom-nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import {
  ArrowLeft, TrendingUp, Bitcoin, Building2, Rocket, Sprout,
  ArrowUpRight, ArrowDownRight, Landmark, FileText, Users, DollarSign,
  Banknote, Heart, BarChart3, Gem, Star, Wallet, Info, Shield,
  Minus, Plus, CheckCircle2, PartyPopper, AlertCircle, Lock,
  type LucideIcon,
} from "lucide-react";
import { useInvestmentAssetsByCategory, useInvestmentAssets } from "@/hooks/general/useInvestmentsassets";
import type { InvestmentAsset } from "@/types/general.types";

// ─── Category style mapping ───────────────────────────────────────────────────
const getCategoryStyle = (category: string): {
  icon: LucideIcon; color: string; bgColor: string; iconColor: string;
} => {
  const c = category?.toLowerCase() ?? "";
  if (c.includes("stock"))       return { icon: TrendingUp,  color: "bg-blue-500",    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",    iconColor: "text-blue-600 dark:text-blue-400"    };
  if (c.includes("crypto"))      return { icon: Bitcoin,     color: "bg-orange-500",  bgColor: "bg-orange-500/10 dark:bg-orange-500/20", iconColor: "text-orange-600 dark:text-orange-400" };
  if (c.includes("real") || c.includes("estate") || c.includes("property")) return { icon: Building2, color: "bg-emerald-500", bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20", iconColor: "text-emerald-600 dark:text-emerald-400" };
  if (c.includes("treasury"))    return { icon: Landmark,    color: "bg-sky-500",     bgColor: "bg-sky-500/10 dark:bg-sky-500/20",       iconColor: "text-sky-600 dark:text-sky-400"       };
  if (c.includes("bond") || c.includes("fgn")) return { icon: Landmark, color: "bg-teal-600", bgColor: "bg-teal-600/10 dark:bg-teal-600/20", iconColor: "text-teal-600 dark:text-teal-400" };
  if (c.includes("commercial") || c.includes("paper")) return { icon: FileText, color: "bg-slate-600", bgColor: "bg-slate-600/10", iconColor: "text-slate-600 dark:text-slate-400" };
  if (c.includes("gold"))        return { icon: Gem,         color: "bg-yellow-500",  bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20", iconColor: "text-yellow-600 dark:text-yellow-400" };
  if (c.includes("oil") || c.includes("crude")) return { icon: Gem, color: "bg-stone-700", bgColor: "bg-stone-700/10", iconColor: "text-stone-600 dark:text-stone-400" };
  if (c.includes("agri") || c.includes("farm")) return { icon: Sprout, color: "bg-lime-600", bgColor: "bg-lime-600/10", iconColor: "text-lime-600 dark:text-lime-400" };
  if (c.includes("club"))        return { icon: Users,       color: "bg-rose-500",    bgColor: "bg-rose-500/10 dark:bg-rose-500/20",     iconColor: "text-rose-600 dark:text-rose-400"     };
  if (c.includes("dollar"))      return { icon: DollarSign,  color: "bg-green-600",   bgColor: "bg-green-600/10 dark:bg-green-600/20",   iconColor: "text-green-600 dark:text-green-400"   };
  if (c.includes("naira") || c.includes("mutual")) return { icon: Banknote, color: "bg-primary", bgColor: "bg-primary/10", iconColor: "text-primary" };
  if (c.includes("equity"))      return { icon: BarChart3,   color: "bg-indigo-500",  bgColor: "bg-indigo-500/10 dark:bg-indigo-500/20", iconColor: "text-indigo-600 dark:text-indigo-400" };
  if (c.includes("female") || c.includes("women")) return { icon: Heart, color: "bg-pink-500", bgColor: "bg-pink-500/10 dark:bg-pink-500/20", iconColor: "text-pink-600 dark:text-pink-400" };
  if (c.includes("angel"))       return { icon: Rocket, color: "bg-purple-600", bgColor: "bg-purple-600/10 dark:bg-purple-600/20", iconColor: "text-purple-600 dark:text-purple-400" };
  return { icon: BarChart3, color: "bg-primary", bgColor: "bg-primary/10", iconColor: "text-primary" };
};

const formatPrice = (val: number | null, code: string | null) => {
  if (val === null) return "—";
  const prefix = code?.startsWith("$") ? "$" : "₦";
  return `${prefix}${val.toLocaleString()}`;
};

const formatGrowth = (val: number | null) => {
  if (val === null) return null;
  return { text: `${val > 0 ? "+" : ""}${val.toFixed(2)}%`, positive: val >= 0 };
};

const fmt = (val: number | null, prefix = "₦") =>
  val !== null ? `${prefix}${val.toLocaleString()}` : null;

// ─── Category-specific parameter rows ────────────────────────────────────────
// Returns label/value pairs relevant to each asset category
const getCategoryParams = (asset: InvestmentAsset): { label: string; value: string; highlight?: "up" | "down" }[] => {
  const c = asset.category?.toLowerCase() ?? "";
  const rows: { label: string; value: string; highlight?: "up" | "down" }[] = [];

  if (c.includes("stock")) {
    if (asset.openPrice  !== null) rows.push({ label: "Open",   value: fmt(asset.openPrice)  ?? "—" });
    if (asset.highPrice  !== null) rows.push({ label: "High",   value: fmt(asset.highPrice)  ?? "—" });
    if (asset.lowPrice   !== null) rows.push({ label: "Low",    value: fmt(asset.lowPrice)   ?? "—" });
    if (asset.closePrice !== null) rows.push({ label: "Close",  value: fmt(asset.closePrice) ?? "—" });
    if (asset.changeNaira !== null) rows.push({ label: "Chg ₦", value: fmt(asset.changeNaira) ?? "—", highlight: (asset.changeNaira ?? 0) >= 0 ? "up" : "down" });
    if (asset.changePercent !== null) rows.push({ label: "Chg %", value: `${(asset.changePercent ?? 0) >= 0 ? "+" : ""}${asset.changePercent?.toFixed(2)}%`, highlight: (asset.changePercent ?? 0) >= 0 ? "up" : "down" });
    if (asset.numTrades  !== null) rows.push({ label: "Trades", value: Number(asset.numTrades).toLocaleString() });
    if (asset.marketCapitalization !== null) rows.push({ label: "Mkt Cap", value: fmt(asset.marketCapitalization) ?? "—" });
  }

  if (c.includes("treasury")) {
    if (asset.discountRate !== null) rows.push({ label: "Discount Rate", value: `${asset.discountRate}%` });
  }

  if (c.includes("gold")) {
    if (asset.openPrice  !== null) rows.push({ label: "Open",   value: fmt(asset.openPrice)  ?? "—" });
    if (asset.highPrice  !== null) rows.push({ label: "High",   value: fmt(asset.highPrice)  ?? "—" });
    if (asset.lowPrice   !== null) rows.push({ label: "Low",    value: fmt(asset.lowPrice)   ?? "—" });
    if (asset.closePrice !== null) rows.push({ label: "Close",  value: fmt(asset.closePrice) ?? "—" });
    if (asset.changePercent !== null) rows.push({ label: "Chg %", value: `${(asset.changePercent ?? 0) >= 0 ? "+" : ""}${asset.changePercent?.toFixed(2)}%`, highlight: (asset.changePercent ?? 0) >= 0 ? "up" : "down" });
  }

  if (c.includes("dollar") || c.includes("mutual")) {
    if (asset.yearToDate !== null) rows.push({ label: "YTD", value: `${(asset.yearToDate ?? 0) >= 0 ? "+" : ""}${asset.yearToDate?.toFixed(2)}%`, highlight: (asset.yearToDate ?? 0) >= 0 ? "up" : "down" });
  }

  if (c.includes("crypto")) {
    if (asset.changePercent !== null) rows.push({ label: "24h %", value: `${(asset.changePercent ?? 0) >= 0 ? "+" : ""}${asset.changePercent?.toFixed(2)}%`, highlight: (asset.changePercent ?? 0) >= 0 ? "up" : "down" });
    if (asset.priceChangeInNaira !== null) rows.push({ label: "24h ₦", value: fmt(asset.priceChangeInNaira) ?? "—", highlight: (asset.priceChangeInNaira ?? 0) >= 0 ? "up" : "down" });
  }

  return rows;
};

function MiniChart({ positive }: { positive: boolean }) {
  const color = positive ? "hsl(var(--chart-2))" : "hsl(0,70%,50%)";
  return (
    <svg width={80} height={36} viewBox="0 0 80 36" className="flex-shrink-0 opacity-60">
      <polyline points="0,18 20,14 40,20 60,12 80,16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AssetListing({ params }: { params?: { category?: string } }) {
  const [, setLocation] = useLocation();
  const [selectedAsset, setSelectedAsset]     = useState<InvestmentAsset | null>(null);
  const [sheetOpen, setSheetOpen]             = useState(false);
  const [investAmount, setInvestAmount]       = useState("10,000");
  const [timeRange, setTimeRange]             = useState("1M");
  const [buyStep, setBuyStep]                 = useState<"details" | "confirm" | "success">("details");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount]       = useState("");

  const categoryParam = params?.category ?? "";
  const { data: allAssets = [], isLoading: allLoading } = useInvestmentAssets();

  const matchCategory = (cat: string) =>
    cat.toLowerCase().replace(/[\s_]+/g, "-") === categoryParam.toLowerCase();

  const categoryName = allAssets.find((a) => matchCategory(a.category))?.category ?? categoryParam;
  const { data: assets = [], isLoading, isError, refetch } = useInvestmentAssetsByCategory(categoryName);

  const style = getCategoryStyle(categoryName);
  const Icon  = style.icon;

  const handleAssetTap = (asset: InvestmentAsset) => {
    setSelectedAsset(asset);
    setInvestAmount("10,000");
    setBuyStep("details");
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setSelectedAsset(null);
    setBuyStep("details");
  };

  if (isLoading || allLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 lg:pb-8">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/invest")}><ArrowLeft className="w-5 h-5" /></Button>
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          </div>
        </header>
        <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border"><CardContent className="p-4 flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
              </div>
            </CardContent></Card>
          ))}
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/invest")}><ArrowLeft className="w-5 h-5" /></Button>
            <span className="font-semibold">Assets</span>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-sm text-muted-foreground">Failed to load assets.</p>
          <Button variant="outline" onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const displayName = categoryName || categoryParam || "Assets";

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/invest")} data-testid="button-back-invest"><ArrowLeft className="w-5 h-5" /></Button>
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-lg ${style.bgColor} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${style.iconColor}`} />
            </div>
            <span className="font-semibold">{displayName}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold mb-1">{displayName}</h1>
          <p className="text-sm text-muted-foreground">{assets.length} assets available</p>
        </div>

        {assets.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <BarChart3 className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No assets available in this category yet.</p>
            <Button variant="outline" size="sm" onClick={() => setLocation("/invest")}>Back to Invest</Button>
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {assets.map((asset) => {
              const growth    = formatGrowth(asset.changePercent ?? asset.percentGrowth);
              const ticker    = asset.assetNameCode ?? asset.assetName ?? "—";
              const price     = formatPrice(asset.pricePerUnit, asset.assetNameCode);
              const catParams = getCategoryParams(asset);

              return (
                <Card
                  key={asset.id}
                  className={`border hover-elevate cursor-pointer ${asset.locked ? "opacity-70" : ""}`}
                  onClick={() => !asset.locked && handleAssetTap(asset)}
                  data-testid={`asset-card-${asset.id}`}
                >
                  <CardContent className="p-4">
                    {/* ── Top row ── */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${style.bgColor} flex items-center justify-center flex-shrink-0 relative`}>
                        <span className={`text-xs font-bold ${style.iconColor}`}>{ticker.slice(0, 3)}</span>
                        {asset.locked && (
                          <div className="absolute inset-0 rounded-xl bg-background/60 flex items-center justify-center">
                            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{asset.assetName ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{ticker}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm">{price}</p>
                        {growth ? (
                          <div className={`flex items-center justify-end gap-0.5 text-xs ${growth.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            {growth.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {growth.text}
                          </div>
                        ) : <p className="text-xs text-muted-foreground">—</p>}
                      </div>
                    </div>

                    {/* ── Category-specific parameters ── */}
                    {catParams.length > 0 && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 pt-2 border-t">
                        {catParams.map(({ label, value, highlight }) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{label}</span>
                            <span className={`text-[10px] font-medium ${
                              highlight === "up"   ? "text-green-600 dark:text-green-400" :
                              highlight === "down" ? "text-red-600 dark:text-red-400"    : ""
                            }`}>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Tags + chart ── */}
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {asset.riskLevel && <Badge variant="secondary" className="text-xs px-2 py-0">{asset.riskLevel} Risk</Badge>}
                        {asset.tenure    && <Badge variant="secondary" className="text-xs px-2 py-0">{asset.tenure}</Badge>}
                      </div>
                      <MiniChart positive={growth?.positive ?? true} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav currentPage="invest" />

      {/* ── Asset Detail Sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={(open) => { if (!open) handleCloseSheet(); else setSheetOpen(true); }}>
        <SheetContent side="bottom" className="h-[94vh] overflow-y-auto rounded-t-2xl p-0">
          {selectedAsset && buyStep === "details" && (() => {
            const catParams = getCategoryParams(selectedAsset);
            return (
              <div className="flex flex-col h-full">
                <SheetHeader className="p-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${style.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-sm font-bold ${style.iconColor}`}>
                        {(selectedAsset.assetNameCode ?? selectedAsset.assetName ?? "—").slice(0, 3)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <SheetTitle className="text-left text-lg">{selectedAsset.assetName ?? "Asset"}</SheetTitle>
                      <p className="text-sm text-muted-foreground">{selectedAsset.assetNameCode ?? selectedAsset.category}</p>
                    </div>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-5 space-y-4 pb-4">
                  {/* Price */}
                  <div>
                    <h2 className="text-3xl font-bold mb-1">
                      {formatPrice(selectedAsset.pricePerUnit, selectedAsset.assetNameCode)}
                      {selectedAsset.perUnitName && (
                        <span className="text-base text-muted-foreground font-normal ml-1">/ {selectedAsset.perUnitName}</span>
                      )}
                    </h2>
                    {formatGrowth(selectedAsset.changePercent ?? selectedAsset.percentGrowth) && (
                      <div className={`flex items-center gap-1 text-sm ${formatGrowth(selectedAsset.changePercent ?? selectedAsset.percentGrowth)!.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {formatGrowth(selectedAsset.changePercent ?? selectedAsset.percentGrowth)!.positive
                          ? <ArrowUpRight className="w-4 h-4" />
                          : <ArrowDownRight className="w-4 h-4" />}
                        <span className="font-medium">{formatGrowth(selectedAsset.changePercent ?? selectedAsset.percentGrowth)!.text}</span>
                      </div>
                    )}
                  </div>

                  {/* Time range */}
                  <div className="flex gap-1.5">
                    {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((range) => (
                      <Button key={range} variant={timeRange === range ? "default" : "ghost"} size="sm" className="flex-1 text-xs" onClick={() => setTimeRange(range)}>{range}</Button>
                    ))}
                  </div>

                  {/* Category-specific params in grid */}
                  {catParams.length > 0 && (
                    <Card className="border">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm mb-3">Market Data</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {catParams.map(({ label, value, highlight }) => (
                            <div key={label} className="flex flex-col">
                              <span className="text-xs text-muted-foreground mb-0.5">{label}</span>
                              <span className={`text-sm font-semibold ${
                                highlight === "up"   ? "text-green-600 dark:text-green-400" :
                                highlight === "down" ? "text-red-600 dark:text-red-400"    : ""
                              }`}>{value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Standard stats */}
                  {(selectedAsset.marketCap || selectedAsset.dailyVolume || selectedAsset.interest || selectedAsset.minPayment) && (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedAsset.marketCap && <Card className="border"><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground mb-0.5">Market Cap</p><p className="font-semibold text-sm">₦{Number(selectedAsset.marketCap).toLocaleString()}</p></CardContent></Card>}
                      {selectedAsset.dailyVolume && <Card className="border"><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground mb-0.5">Daily Volume</p><p className="font-semibold text-sm">₦{Number(selectedAsset.dailyVolume).toLocaleString()}</p></CardContent></Card>}
                      {selectedAsset.interest && <Card className="border"><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground mb-0.5">Interest</p><p className="font-semibold text-sm text-green-600 dark:text-green-400">{selectedAsset.interest}% p.a.</p></CardContent></Card>}
                      {selectedAsset.minPayment && <Card className="border"><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground mb-0.5">Min. Investment</p><p className="font-semibold text-sm">₦{Number(selectedAsset.minPayment).toLocaleString()}</p></CardContent></Card>}
                    </div>
                  )}

                  {/* About */}
                  {(selectedAsset.about || selectedAsset.description) && (
                    <section>
                      <h4 className="font-semibold text-sm mb-2">About {selectedAsset.assetName}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedAsset.about ?? selectedAsset.description}</p>
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {selectedAsset.riskLevel    && <Badge variant="secondary" className="text-xs">{selectedAsset.riskLevel} Risk</Badge>}
                        {selectedAsset.tenure       && <Badge variant="secondary" className="text-xs">{selectedAsset.tenure}</Badge>}
                        {selectedAsset.investmentType && <Badge variant="secondary" className="text-xs">{selectedAsset.investmentType}</Badge>}
                      </div>
                    </section>
                  )}

                  {/* Investment amount */}
                  <section>
                    <h4 className="font-semibold text-sm mb-3">Investment Amount</h4>
                    <Card className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <Button variant="outline" size="icon" onClick={() => { const n = parseInt(investAmount.replace(/,/g, "")); if (n > 1000) setInvestAmount((n - 1000).toLocaleString()); }} data-testid="button-decrease-amount"><Minus className="w-4 h-4" /></Button>
                          <div className="text-center flex-1">
                            <p className="text-2xl font-bold">₦{investAmount}</p>
                            {selectedAsset.pricePerUnit && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                ≈ {(parseInt(investAmount.replace(/,/g, "")) / selectedAsset.pricePerUnit).toFixed(selectedAsset.pricePerUnit > 10000 ? 6 : 2)} {selectedAsset.perUnitName ?? "units"}
                              </p>
                            )}
                          </div>
                          <Button variant="outline" size="icon" onClick={() => { const n = parseInt(investAmount.replace(/,/g, "")); setInvestAmount((n + 1000).toLocaleString()); }} data-testid="button-increase-amount"><Plus className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {["5,000", "10,000", "50,000"].map((amt) => (
                            <Button key={amt} variant="outline" size="sm" className="flex-1 text-xs" onClick={() => { setInvestAmount(amt); setShowCustomInput(false); }}>₦{amt}</Button>
                          ))}
                          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setShowCustomInput(!showCustomInput)}>Custom</Button>
                        </div>
                        {showCustomInput && (
                          <div className="flex gap-2 mt-3 items-center">
                            <span className="text-sm font-medium">₦</span>
                            <input type="text" inputMode="numeric" placeholder="Enter amount" value={customAmount}
                              onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ""); setCustomAmount(raw); if (raw && parseInt(raw) > 0) setInvestAmount(parseInt(raw).toLocaleString()); }}
                              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </section>

                  {/* Key info */}
                  <section>
                    <h4 className="font-semibold text-sm mb-3">Key Information</h4>
                    <div className="space-y-2.5">
                      {[
                        { icon: Shield, title: "SEC Regulated",      sub: "Fully compliant with Nigerian regulations" },
                        { icon: Star,   title: "Auto-Invest",         sub: "Set up recurring investments"              },
                        { icon: Info,   title: "Real-time Tracking",  sub: "Monitor performance live"                  },
                      ].map(({ icon: Ico, title, sub }) => (
                        <div key={title} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Ico className="w-4 h-4 text-primary" /></div>
                          <div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="p-5 pt-3 space-y-2 border-t bg-background">
                  <Button className="w-full" size="lg" onClick={() => setBuyStep("confirm")} data-testid="button-buy-asset">
                    <Wallet className="w-5 h-5 mr-2" />
                    Buy ₦{investAmount} of {selectedAsset.assetNameCode ?? selectedAsset.assetName}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">By investing, you agree to the terms and conditions</p>
                </div>
              </div>
            );
          })()}

          {selectedAsset && buyStep === "confirm" && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-5 pb-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setBuyStep("details")}><ArrowLeft className="w-5 h-5" /></Button>
                  <SheetTitle className="text-left">Confirm Purchase</SheetTitle>
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 pt-2 space-y-5">
                <div className="text-center py-4">
                  <div className={`w-16 h-16 rounded-2xl ${style.color} flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white text-lg font-bold">{(selectedAsset.assetNameCode ?? "—").slice(0, 3)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">You are buying</p>
                  <p className="text-3xl font-bold mb-1">₦{investAmount}</p>
                  <p className="text-sm text-muted-foreground">of {selectedAsset.assetName} ({selectedAsset.assetNameCode ?? "—"})</p>
                </div>
                <Card className="border">
                  <CardContent className="p-4 space-y-3">
                    {[
                      ["Asset",          selectedAsset.assetName ?? "—"],
                      ["Current Price",  formatPrice(selectedAsset.pricePerUnit, selectedAsset.assetNameCode)],
                      ["Amount",         `₦${investAmount}`],
                      ["Est. Units",     selectedAsset.pricePerUnit ? `${(parseInt(investAmount.replace(/,/g, "")) / selectedAsset.pricePerUnit).toFixed(selectedAsset.pricePerUnit > 10000 ? 6 : 2)}` : "—"],
                      ["Transaction Fee","Free"],
                      ["Payment Method", "Wallet Balance"],
                    ].map(([label, val], i, arr) => (
                      <div key={label}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{label}</span>
                          <span className={`text-sm font-medium ${label === "Transaction Fee" ? "text-green-600 dark:text-green-400" : ""}`}>{val}</span>
                        </div>
                        {i < arr.length - 1 && <div className="border-t mt-3" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border bg-primary/5"><CardContent className="p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">Your investment is protected under Nigerian SEC regulations.</p>
                </CardContent></Card>
              </div>
              <div className="p-5 pt-3 space-y-2 border-t bg-background">
                <Button className="w-full" size="lg" onClick={() => setBuyStep("success")}>Confirm Purchase</Button>
                <Button variant="outline" className="w-full" onClick={() => setBuyStep("details")}>Cancel</Button>
              </div>
            </div>
          )}

          {selectedAsset && buyStep === "success" && (
            <div className="flex flex-col h-full items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <PartyPopper className="w-8 h-8 text-yellow-500 mb-3" />
              <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
              <p className="text-muted-foreground mb-1">You just invested</p>
              <p className="text-3xl font-bold mb-1">₦{investAmount}</p>
              <p className="text-muted-foreground mb-6">in {selectedAsset.assetName}</p>
              <div className="w-full max-w-xs space-y-2">
                <Button className="w-full" size="lg" onClick={() => setBuyStep("details")}>Buy More {selectedAsset.assetNameCode ?? ""}</Button>
                <Button variant="outline" className="w-full" onClick={handleCloseSheet}>Back to {displayName}</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}