import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ThemeToggle } from "../components/theme-toggle";
import { BottomNav } from "../components/bottom-nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import {
  ArrowLeft, TrendingUp, Bitcoin, Building2, Rocket, Sprout,
  ArrowUpRight, ArrowDownRight, Landmark, FileText, Users, DollarSign,
  Banknote, Heart, BarChart3, Gem, Shield, Clock, PlayCircle,
  CheckCircle2, PartyPopper, AlertCircle, Lock, ChevronRight,
  RefreshCw, type LucideIcon,
} from "lucide-react";
import { useInvestmentAssetsByCategory, useInvestmentAssets } from "@/hooks/general/useInvestmentsassets";
import { useInvestmentPurchase } from "@/hooks/general/useInvestmentPurchase";
import type { InvestmentAsset } from "@/types/general.types";

// ─── Category style mapping ───────────────────────────────────────────────────
const getCategoryStyle = (category: string): {
  icon: LucideIcon; color: string; bgColor: string; iconColor: string;
} => {
  const c = category?.toLowerCase() ?? "";
  if (c.includes("stock"))                                    return { icon: TrendingUp, color: "bg-blue-500",    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",       iconColor: "text-blue-600 dark:text-blue-400"    };
  if (c.includes("crypto"))                                   return { icon: Bitcoin,    color: "bg-orange-500",  bgColor: "bg-orange-500/10 dark:bg-orange-500/20",   iconColor: "text-orange-600 dark:text-orange-400" };
  if (c.includes("real") || c.includes("property"))           return { icon: Building2,  color: "bg-emerald-500", bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20", iconColor: "text-emerald-600 dark:text-emerald-400" };
  if (c.includes("treasury"))                                 return { icon: Landmark,   color: "bg-sky-500",     bgColor: "bg-sky-500/10 dark:bg-sky-500/20",         iconColor: "text-sky-600 dark:text-sky-400"       };
  if (c.includes("bond") || c.includes("fgn"))                return { icon: Landmark,   color: "bg-teal-600",    bgColor: "bg-teal-600/10 dark:bg-teal-600/20",       iconColor: "text-teal-600 dark:text-teal-400"     };
  if (c.includes("commercial") || c.includes("paper"))        return { icon: FileText,   color: "bg-slate-600",   bgColor: "bg-slate-600/10",                          iconColor: "text-slate-600 dark:text-slate-400"   };
  if (c.includes("gold"))                                     return { icon: Gem,        color: "bg-yellow-500",  bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20",   iconColor: "text-yellow-600 dark:text-yellow-400" };
  if (c.includes("oil") || c.includes("crude"))               return { icon: Gem,        color: "bg-stone-700",   bgColor: "bg-stone-700/10",                          iconColor: "text-stone-600 dark:text-stone-400"   };
  if (c.includes("agri") || c.includes("farm"))               return { icon: Sprout,     color: "bg-lime-600",    bgColor: "bg-lime-600/10",                           iconColor: "text-lime-600 dark:text-lime-400"     };
  if (c.includes("club"))                                     return { icon: Users,      color: "bg-rose-500",    bgColor: "bg-rose-500/10 dark:bg-rose-500/20",       iconColor: "text-rose-600 dark:text-rose-400"     };
  if (c.includes("dollar"))                                   return { icon: DollarSign, color: "bg-green-600",   bgColor: "bg-green-600/10 dark:bg-green-600/20",     iconColor: "text-green-600 dark:text-green-400"   };
  if (c.includes("naira") || c.includes("mutual"))            return { icon: Banknote,   color: "bg-primary",     bgColor: "bg-primary/10",                            iconColor: "text-primary"                         };
  if (c.includes("equity"))                                   return { icon: BarChart3,  color: "bg-indigo-500",  bgColor: "bg-indigo-500/10 dark:bg-indigo-500/20",   iconColor: "text-indigo-600 dark:text-indigo-400" };
  if (c.includes("female") || c.includes("women"))            return { icon: Heart,      color: "bg-pink-500",    bgColor: "bg-pink-500/10 dark:bg-pink-500/20",       iconColor: "text-pink-600 dark:text-pink-400"     };
  if (c.includes("angel"))                                    return { icon: Rocket,     color: "bg-purple-600",  bgColor: "bg-purple-600/10 dark:bg-purple-600/20",   iconColor: "text-purple-600 dark:text-purple-400" };
  return { icon: BarChart3, color: "bg-primary", bgColor: "bg-primary/10", iconColor: "text-primary" };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val: number | null, prefix = "₦") =>
  val !== null ? `${prefix}${val.toLocaleString()}` : null;

const formatGrowth = (val: number | null) => {
  if (val === null) return null;
  return { text: `${val >= 0 ? "+" : ""}${val.toFixed(2)}%`, positive: val >= 0 };
};

// ─── Category params ──────────────────────────────────────────────────────────
interface ParamRow { label: string; value: string; highlight?: "up" | "down"; }

const getCategoryParams = (asset: InvestmentAsset): ParamRow[] => {
  const c    = asset.category?.toLowerCase() ?? "";
  const rows: ParamRow[] = [];

  if (c.includes("stock")) {
    if (asset.openPrice  !== null) rows.push({ label: "Open",    value: fmt(asset.openPrice)  ?? "—" });
    if (asset.highPrice  !== null) rows.push({ label: "High",    value: fmt(asset.highPrice)  ?? "—" });
    if (asset.lowPrice   !== null) rows.push({ label: "Low",     value: fmt(asset.lowPrice)   ?? "—" });
    if (asset.closePrice !== null) rows.push({ label: "Close",   value: fmt(asset.closePrice) ?? "—" });
    if (asset.changeNaira !== null)
      rows.push({ label: "Chg ₦", value: fmt(asset.changeNaira) ?? "—",
        highlight: (asset.changeNaira ?? 0) >= 0 ? "up" : "down" });
    if (asset.changePercent !== null)
      rows.push({ label: "Chg %",
        value: `${(asset.changePercent ?? 0) >= 0 ? "+" : ""}${asset.changePercent?.toFixed(2)}%`,
        highlight: (asset.changePercent ?? 0) >= 0 ? "up" : "down" });
    if (asset.numTrades !== null)
      rows.push({ label: "Trades", value: Number(asset.numTrades).toLocaleString() });
    if (asset.marketCapitalization !== null)
      rows.push({ label: "Mkt Cap", value: fmt(asset.marketCapitalization) ?? "—" });
  }
  if (c.includes("treasury")) {
    if (asset.discountRate !== null)
      rows.push({ label: "Discount Rate", value: `${asset.discountRate}%` });
  }
  if (c.includes("gold")) {
    if (asset.openPrice  !== null) rows.push({ label: "Open",  value: fmt(asset.openPrice)  ?? "—" });
    if (asset.highPrice  !== null) rows.push({ label: "High",  value: fmt(asset.highPrice)  ?? "—" });
    if (asset.lowPrice   !== null) rows.push({ label: "Low",   value: fmt(asset.lowPrice)   ?? "—" });
    if (asset.closePrice !== null) rows.push({ label: "Close", value: fmt(asset.closePrice) ?? "—" });
    if (asset.changePercent !== null)
      rows.push({ label: "Chg %",
        value: `${(asset.changePercent ?? 0) >= 0 ? "+" : ""}${asset.changePercent?.toFixed(2)}%`,
        highlight: (asset.changePercent ?? 0) >= 0 ? "up" : "down" });
  }
  if (c.includes("dollar") || c.includes("mutual")) {
    if (asset.yearToDate !== null)
      rows.push({ label: "YTD",
        value: `${(asset.yearToDate ?? 0) >= 0 ? "+" : ""}${asset.yearToDate?.toFixed(2)}%`,
        highlight: (asset.yearToDate ?? 0) >= 0 ? "up" : "down" });
    if (asset.rate !== null)
      rows.push({ label: "Rate",
        value: `${asset.rate}% p.a.`,
        highlight: "up" });
  }
  if (c.includes("crypto")) {
    if (asset.changePercent !== null)
      rows.push({ label: "24h %",
        value: `${(asset.changePercent ?? 0) >= 0 ? "+" : ""}${asset.changePercent?.toFixed(2)}%`,
        highlight: (asset.changePercent ?? 0) >= 0 ? "up" : "down" });
    if (asset.priceChangeInNaira !== null)
      rows.push({ label: "24h ₦", value: fmt(asset.priceChangeInNaira) ?? "—",
        highlight: (asset.priceChangeInNaira ?? 0) >= 0 ? "up" : "down" });
  }
  return rows;
};

// ─── Step type ────────────────────────────────────────────────────────────────
type SheetStep = "detail" | "invest" | "confirm" | "success" | "error";

// ─── Component ────────────────────────────────────────────────────────────────
export default function AssetListing({ params }: { params?: { category?: string } }) {
  const [, setLocation] = useLocation();
  const [selectedAsset, setSelectedAsset] = useState<InvestmentAsset | null>(null);
  const [sheetOpen, setSheetOpen]         = useState(false);
  const [step, setStep]                   = useState<SheetStep>("detail");
  const [rawAmount, setRawAmount]         = useState("");
  const [amountError, setAmountError]     = useState("");

  const categoryParam = params?.category ?? "";

  const { data: allAssets = [], isLoading: allLoading } = useInvestmentAssets();
  const { mutate: purchase, isPending: purchasing }     = useInvestmentPurchase();

  const matchCategory = (cat: string) =>
    cat.toLowerCase().replace(/[\s_]+/g, "-") === categoryParam.toLowerCase();

  const categoryName = allAssets.find((a) => matchCategory(a.category))?.category ?? categoryParam;
  const { data: assets = [], isLoading, isError, refetch } = useInvestmentAssetsByCategory(categoryName);

  const style = getCategoryStyle(categoryName);
  const Icon  = style.icon;

  // ── Investment calcs ───────────────────────────────────────────────────
  const amount     = parseFloat(rawAmount.replace(/,/g, "")) || 0;
  const priceUnit  = selectedAsset?.pricePerUnit ?? 0;
  const units      = priceUnit > 0 ? amount / priceUnit : 0;
  const minPayment = selectedAsset?.minPayment ?? 0;

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleAssetTap = (asset: InvestmentAsset) => {
    setSelectedAsset(asset);
    setStep("detail");
    setRawAmount("");
    setAmountError("");
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setSelectedAsset(null);
    setStep("detail");
    setRawAmount("");
    setAmountError("");
  };

  const handleAmountChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    const num   = parseFloat(clean) || 0;
    setRawAmount(clean ? Number(clean).toLocaleString() : "");
    setAmountError(clean && num < minPayment
      ? `Minimum investment is ₦${minPayment.toLocaleString()}` : "");
  };

  const handleProceedToConfirm = () => {
    if (!amount || amount < minPayment) {
      setAmountError(`Minimum investment is ₦${minPayment.toLocaleString()}`);
      return;
    }
    setStep("confirm");
  };

  const handleConfirmPurchase = () => {
    if (!selectedAsset) return;
    purchase(
      { asset: selectedAsset, amount, units },
      { onSuccess: () => setStep("success"), onError: () => setStep("error") }
    );
  };

  const pageTitle = categoryName || categoryParam || "Assets";

  // ── Loading ────────────────────────────────────────────────────────────
  if (isLoading || allLoading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/invest")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          </div>
        </header>
        <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border">
              <CardContent className="p-4 flex gap-3">
                <div className="w-11 h-11 rounded-xl bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/invest")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
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

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/invest")} data-testid="button-back-invest">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`w-8 h-8 rounded-lg ${style.bgColor} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${style.iconColor}`} />
            </div>
            <span className="font-semibold truncate">{pageTitle}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-5">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold mb-0.5">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {assets.length} asset{assets.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Empty state */}
        {assets.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <BarChart3 className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No assets available in this category yet.</p>
            <Button variant="outline" size="sm" onClick={() => setLocation("/invest")}>
              Back to Invest
            </Button>
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {assets.map((asset) => {
              // Primary display name
              const name = asset.company ?? asset.assetName ?? asset.assetNameCode ?? asset.category;
              const code = asset.assetNameCode;
              const subtitle = asset.description ?? asset.about ?? null;

              // Returns — rate → interest → yearToDate → percentGrowth
              const returns = asset.rate
                ? `${asset.rate}% p.a.`
                : asset.interest
                ? `${asset.interest}% p.a.`
                : asset.yearToDate !== null
                ? `${(asset.yearToDate ?? 0) >= 0 ? "+" : ""}${asset.yearToDate}% YTD`
                : asset.percentGrowth !== null
                ? `${(asset.percentGrowth ?? 0) > 0 ? "+" : ""}${asset.percentGrowth}%`
                : null;

              const growth    = formatGrowth(asset.changePercent ?? asset.percentGrowth);
              const catParams = getCategoryParams(asset);
              const price     = asset.pricePerUnit
                ? `₦${Number(asset.pricePerUnit).toLocaleString()}`
                : null;

              return (
                <Card
                  key={asset.id}
                  className={`border hover-elevate cursor-pointer transition-all ${asset.locked ? "opacity-60" : ""}`}
                  onClick={() => !asset.locked && handleAssetTap(asset)}
                  data-testid={`asset-card-${asset.id}`}
                >
                  <CardContent className="p-4">
                    {/* Top row */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-xl ${style.bgColor} flex items-center justify-center relative flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${style.iconColor}`} />
                        {asset.locked && (
                          <div className="absolute inset-0 rounded-xl bg-background/70 flex items-center justify-center">
                            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            {/* Company name as primary label */}
                            <p className="font-semibold text-sm leading-tight truncate">{name}</p>
                            {code && (
                              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{code}</p>
                            )}
                          </div>
                          {/* Price top-right */}
                          {price && (
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-sm">{price}</p>
                              {growth ? (
                                <div className={`flex items-center justify-end gap-0.5 text-xs ${
                                  growth.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                }`}>
                                  {growth.positive
                                    ? <ArrowUpRight className="w-3 h-3" />
                                    : <ArrowDownRight className="w-3 h-3" />}
                                  {growth.text}
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>

                        {/* Subtitle */}
                        {subtitle && subtitle !== "Asset description not available" && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-snug">
                            {subtitle}
                          </p>
                        )}

                        {/* Returns + meta badges */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {returns && (
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                              {returns}
                            </span>
                          )}
                          {asset.riskLevel && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {asset.riskLevel}
                            </Badge>
                          )}
                          {asset.tenure && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {asset.tenure}
                            </Badge>
                          )}
                          {asset.minPayment && (
                            <span className="text-[10px] text-muted-foreground">
                              Min ₦{Number(asset.minPayment).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    </div>

                    {/* Category-specific market params */}
                    {catParams.length > 0 && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-3 border-t">
                        {catParams.map(({ label, value, highlight }) => (
                          <div key={label} className="flex items-center justify-between gap-1">
                            <span className="text-[10px] text-muted-foreground">{label}</span>
                            <span className={`text-[10px] font-semibold tabular-nums ${
                              highlight === "up"   ? "text-green-600 dark:text-green-400" :
                              highlight === "down" ? "text-red-600 dark:text-red-400"    : ""
                            }`}>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav currentPage="invest" />

      {/* ── Asset Sheet ─────────────────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={(open) => { if (!open) handleCloseSheet(); else setSheetOpen(true); }}>
        <SheetContent side="bottom" className="h-[94vh] overflow-y-auto rounded-t-2xl p-0">
          {selectedAsset && (() => {
            const name      = selectedAsset.company ?? selectedAsset.assetName ?? selectedAsset.assetNameCode ?? selectedAsset.category;
            const code      = selectedAsset.assetNameCode;
            const subtitle  = selectedAsset.description ?? selectedAsset.about ?? null;
            const catParams = getCategoryParams(selectedAsset);
            const growth    = formatGrowth(selectedAsset.changePercent ?? selectedAsset.percentGrowth);

            const returns = selectedAsset.rate
              ? `${selectedAsset.rate}% p.a.`
              : selectedAsset.interest
              ? `${selectedAsset.interest}% p.a.`
              : selectedAsset.yearToDate !== null
              ? `${(selectedAsset.yearToDate ?? 0) >= 0 ? "+" : ""}${selectedAsset.yearToDate}% YTD`
              : selectedAsset.percentGrowth !== null
              ? `${(selectedAsset.percentGrowth ?? 0) >= 0 ? "+" : ""}${selectedAsset.percentGrowth}%`
              : null;

            // ── Detail ─────────────────────────────────────────────────────
            if (step === "detail") return (
              <div className="flex flex-col h-full">
                <SheetHeader className="p-5 pb-0 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${style.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${style.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <SheetTitle className="text-left text-lg leading-tight truncate">{name}</SheetTitle>
                      {code && <p className="text-xs text-muted-foreground font-mono mt-0.5">{code}</p>}
                      {/* Price inline in header */}
                      {selectedAsset.pricePerUnit && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-base font-bold">
                            ₦{Number(selectedAsset.pricePerUnit).toLocaleString()}
                          </span>
                          {selectedAsset.perUnitName && (
                            <span className="text-xs text-muted-foreground">/ {selectedAsset.perUnitName}</span>
                          )}
                          {growth && (
                            <span className={`text-xs font-semibold ${growth.positive ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                              {growth.text}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-4">
                  {/* About */}
                  {subtitle && subtitle !== "Asset description not available" && (
                    <Card className="border">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm mb-1.5">About</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Key metrics grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {returns && (
                      <Card className="border"><CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">Returns</p>
                        <p className="font-semibold text-sm text-green-600 dark:text-green-400">{returns}</p>
                      </CardContent></Card>
                    )}
                    {selectedAsset.minPayment && (
                      <Card className="border"><CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">Min. Amount</p>
                        <p className="font-semibold text-sm">₦{Number(selectedAsset.minPayment).toLocaleString()}</p>
                      </CardContent></Card>
                    )}
                    {selectedAsset.riskLevel && (
                      <Card className="border"><CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">Risk Level</p>
                        <p className="font-semibold text-sm">{selectedAsset.riskLevel}</p>
                      </CardContent></Card>
                    )}
                    {selectedAsset.tenure && (
                      <Card className="border"><CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">Tenure</p>
                        <p className="font-semibold text-sm">{selectedAsset.tenure}</p>
                      </CardContent></Card>
                    )}
                    {selectedAsset.yearToDate !== null && selectedAsset.yearToDate !== undefined && (
                      <Card className="border"><CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">YTD Return</p>
                        <p className={`font-semibold text-sm ${(selectedAsset.yearToDate ?? 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                          {(selectedAsset.yearToDate ?? 0) >= 0 ? "+" : ""}{selectedAsset.yearToDate}%
                        </p>
                      </CardContent></Card>
                    )}
                    {selectedAsset.marketCap && (
                      <Card className="border"><CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">Market Cap</p>
                        <p className="font-semibold text-sm">₦{Number(selectedAsset.marketCap).toLocaleString()}</p>
                      </CardContent></Card>
                    )}
                    {selectedAsset.dailyVolume && (
                      <Card className="border"><CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">Daily Volume</p>
                        <p className="font-semibold text-sm">₦{Number(selectedAsset.dailyVolume).toLocaleString()}</p>
                      </CardContent></Card>
                    )}
                  </div>

                  {/* Category market data */}
                  {catParams.length > 0 && (
                    <Card className="border">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm mb-3">Market Data</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {catParams.map(({ label, value, highlight }) => (
                            <div key={label} className="flex flex-col gap-0.5">
                              <span className="text-xs text-muted-foreground">{label}</span>
                              <span className={`text-sm font-semibold tabular-nums ${
                                highlight === "up"   ? "text-green-600 dark:text-green-400" :
                                highlight === "down" ? "text-red-600 dark:text-red-400"    : ""
                              }`}>{value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tags */}
                  {(selectedAsset.investmentType || selectedAsset.tags) && (
                    <div className="flex gap-2 flex-wrap">
                      {selectedAsset.investmentType && (
                        <Badge variant="secondary" className="text-xs">{selectedAsset.investmentType}</Badge>
                      )}
                      {selectedAsset.tags?.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  )}

                  {/* Locked */}
                  {selectedAsset.locked && (
                    <Card className="border border-amber-500/20 bg-amber-500/5">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Lock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Asset Locked</p>
                          <p className="text-xs text-muted-foreground">Complete learning modules to unlock this asset</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Trust badges */}
                  <div className="space-y-2.5">
                    {[
                      { icon: Shield, title: "SEC Regulated",      sub: "Fully compliant with Nigerian regulations" },
                      { icon: Clock,  title: "Real-time Tracking",  sub: "Monitor performance live"                 },
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

                <div className="p-5 pt-3 space-y-2 border-t bg-background flex-shrink-0">
                  <Button className="w-full" size="lg"
                    disabled={selectedAsset.locked}
                    onClick={() => setStep("invest")}
                    data-testid="button-go-invest"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    {selectedAsset.locked ? "Locked — Learn to Unlock" : `Invest in ${name}`}
                  </Button>
                  {selectedAsset.locked && (
                    <Button variant="ghost" className="w-full"
                      onClick={() => { handleCloseSheet(); setLocation("/learn"); }}
                      data-testid="button-go-learn-locked"
                    >
                      Go to Learn
                    </Button>
                  )}
                </div>
              </div>
            );

            // ── Invest ─────────────────────────────────────────────────────
            if (step === "invest") return (
              <div className="flex flex-col h-full">
                <SheetHeader className="p-5 pb-3 border-b flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setStep("detail")}>
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </Button>
                    <SheetTitle className="text-left">Invest in {name}</SheetTitle>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Amount input */}
                  <div>
                    <p className="text-sm font-medium mb-2">Enter Amount (₦)</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₦</span>
                      <Input
                        type="text" inputMode="numeric"
                        placeholder={`Min. ₦${minPayment.toLocaleString()}`}
                        value={rawAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="pl-7 text-lg font-semibold h-14"
                        data-testid="input-invest-amount"
                      />
                    </div>
                    {amountError && (
                      <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{amountError}
                      </p>
                    )}
                    {minPayment > 0 && !amountError && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum investment: ₦{minPayment.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Quick amounts */}
                  <div className="grid grid-cols-3 gap-2">
                    {[minPayment || 5_000, (minPayment || 5_000) * 2, (minPayment || 5_000) * 5].map((amt) => (
                      <Button key={amt} variant="outline" size="sm" className="text-xs"
                        onClick={() => handleAmountChange(String(amt))}
                        data-testid={`quick-amount-${amt}`}
                      >
                        ₦{amt.toLocaleString()}
                      </Button>
                    ))}
                  </div>

                  {/* Live calc */}
                  {amount > 0 && priceUnit > 0 && (
                    <Card className="border bg-primary/5">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Amount</span>
                          <span className="text-sm font-semibold">₦{amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Price per {selectedAsset.perUnitName ?? "unit"}</span>
                          <span className="text-sm font-semibold">₦{priceUnit.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-3 flex items-center justify-between">
                          <span className="text-sm font-medium">You will receive</span>
                          <span className="text-lg font-bold text-primary">
                            {units < 1 ? units.toFixed(6) : units.toFixed(4)} {selectedAsset.perUnitName ?? "units"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {amount > 0 && priceUnit === 0 && (
                    <Card className="border bg-primary/5">
                      <CardContent className="p-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Investment Amount</span>
                        <span className="text-lg font-bold text-primary">₦{amount.toLocaleString()}</span>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="border">
                    <CardContent className="p-3 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your investment is protected under Nigerian SEC regulations. Transaction fees are zero.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-5 pt-3 border-t bg-background flex-shrink-0">
                  <Button className="w-full" size="lg"
                    disabled={!amount || !!amountError}
                    onClick={handleProceedToConfirm}
                    data-testid="button-proceed-confirm"
                  >
                    Continue — ₦{amount ? amount.toLocaleString() : "0"}
                  </Button>
                </div>
              </div>
            );

            // ── Confirm ────────────────────────────────────────────────────
            if (step === "confirm") return (
              <div className="flex flex-col h-full">
                <SheetHeader className="p-5 pb-3 border-b flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setStep("invest")}>
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </Button>
                    <SheetTitle className="text-left">Confirm Investment</SheetTitle>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  <div className="text-center py-2">
                    <div className={`w-16 h-16 rounded-2xl ${style.color} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">You are investing</p>
                    <p className="text-4xl font-bold mb-1">₦{amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">in {name}</p>
                  </div>

                  <Card className="border">
                    <CardContent className="p-4 space-y-3">
                      {[
                        ["Asset",           name],
                        ["Amount",          `₦${amount.toLocaleString()}`],
                        ...(priceUnit > 0 ? [
                          ["Price per unit", `₦${priceUnit.toLocaleString()}`],
                          ["Units",          units < 1 ? units.toFixed(6) : units.toFixed(4)],
                        ] : []),
                        ["Transaction Fee",  "Free"],
                        ["Payment Method",   "Wallet Balance"],
                      ].map(([label, val], i, arr) => (
                        <div key={label}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{label}</span>
                            <span className={`text-sm font-medium ${
                              label === "Transaction Fee" ? "text-green-600 dark:text-green-400" : ""
                            }`}>{val}</span>
                          </div>
                          {i < arr.length - 1 && <div className="border-t mt-3" />}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border bg-primary/5">
                    <CardContent className="p-3 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        By confirming, you agree to Growtt's terms. Your portfolio will update immediately after purchase.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-5 pt-3 space-y-2 border-t bg-background flex-shrink-0">
                  <Button className="w-full" size="lg"
                    disabled={purchasing} onClick={handleConfirmPurchase}
                    data-testid="button-confirm-purchase"
                  >
                    {purchasing
                      ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Processing…</>
                      : <>Confirm — ₦{amount.toLocaleString()}</>
                    }
                  </Button>
                  <Button variant="outline" className="w-full"
                    onClick={() => setStep("invest")} disabled={purchasing}
                    data-testid="button-edit-amount"
                  >
                    Edit Amount
                  </Button>
                </div>
              </div>
            );

            // ── Success ────────────────────────────────────────────────────
            if (step === "success") return (
              <div className="flex flex-col h-full items-center justify-center p-8 text-center gap-5">
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <PartyPopper className="w-8 h-8 text-yellow-500" />
                <div>
                  <h2 className="text-2xl font-bold mb-1">Investment Successful!</h2>
                  <p className="text-muted-foreground">You just invested</p>
                  <p className="text-4xl font-bold my-2">₦{amount.toLocaleString()}</p>
                  <p className="text-muted-foreground">in {name}</p>
                  {priceUnit > 0 && (
                    <p className="text-sm text-primary font-semibold mt-2">
                      {units < 1 ? units.toFixed(6) : units.toFixed(4)} {selectedAsset.perUnitName ?? "units"} added to portfolio
                    </p>
                  )}
                </div>
                <Card className="border w-full max-w-xs">
                  <CardContent className="p-4 space-y-2">
                    {[
                      ["Asset",  name],
                      ["Amount", `₦${amount.toLocaleString()}`],
                      ...(priceUnit > 0 ? [["Units", units < 1 ? units.toFixed(6) : units.toFixed(4)]] : []),
                    ].map(([label, val]) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className="text-xs font-medium">{val}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        Completed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                <div className="w-full max-w-xs space-y-2">
                  <Button className="w-full" size="lg"
                    onClick={() => { setStep("invest"); setRawAmount(""); }}
                    data-testid="button-invest-more"
                  >
                    Invest More
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleCloseSheet}
                    data-testid="button-back-to-listing"
                  >
                    Back to {pageTitle}
                  </Button>
                </div>
              </div>
            );

            // ── Error ──────────────────────────────────────────────────────
            if (step === "error") return (
              <div className="flex flex-col h-full items-center justify-center p-8 text-center gap-5">
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-12 h-12 text-destructive" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Purchase Failed</h2>
                  <p className="text-muted-foreground text-sm">
                    Something went wrong processing your investment. Please try again.
                  </p>
                </div>
                <div className="w-full max-w-xs space-y-2">
                  <Button className="w-full" size="lg" onClick={() => setStep("confirm")}
                    data-testid="button-retry-purchase"
                  >
                    Try Again
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleCloseSheet}
                    data-testid="button-close-error"
                  >
                    Close
                  </Button>
                </div>
              </div>
            );

            return null;
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}