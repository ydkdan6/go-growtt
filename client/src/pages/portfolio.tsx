import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import {
  ArrowLeft,
  PieChart,
  TrendingUp,
  Bitcoin,
  Building2,
  Landmark,
  FileText,
  Sprout,
  BarChart3,
  Gem,
  DollarSign,
  Banknote,
  Users,
  Heart,
  Rocket,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Lock,
  TrendingDown,
  CheckCircle2,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { usePortfolio } from "@/hooks/general/usePortfolio";
import { useInvestmentSell } from "@/hooks/general/useInvestmentSell";
import type { PortfolioInvestment } from "@/types/general.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getCategoryIcon = (category: string | null): { icon: LucideIcon; color: string } => {
  const c = (category ?? "").toLowerCase();
  if (c.includes("stock"))   return { icon: TrendingUp,  color: "bg-blue-500" };
  if (c.includes("crypto"))  return { icon: Bitcoin,     color: "bg-orange-500" };
  if (c.includes("real") || c.includes("property")) return { icon: Building2, color: "bg-emerald-500" };
  if (c.includes("treasury"))  return { icon: Landmark,  color: "bg-sky-500" };
  if (c.includes("bond") || c.includes("fgn")) return { icon: Landmark, color: "bg-teal-600" };
  if (c.includes("commercial") || c.includes("paper")) return { icon: FileText, color: "bg-slate-600" };
  if (c.includes("gold"))    return { icon: Gem,       color: "bg-yellow-500" };
  if (c.includes("agri") || c.includes("farm")) return { icon: Sprout, color: "bg-lime-600" };
  if (c.includes("club"))    return { icon: Users,     color: "bg-rose-500" };
  if (c.includes("dollar"))  return { icon: DollarSign, color: "bg-green-600" };
  if (c.includes("naira"))   return { icon: Banknote,  color: "bg-primary" };
  if (c.includes("female") || c.includes("women")) return { icon: Heart, color: "bg-pink-500" };
  if (c.includes("angel"))   return { icon: Rocket,   color: "bg-purple-600" };
  return { icon: BarChart3, color: "bg-primary" };
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

const assetLabel = (inv: PortfolioInvestment): string =>
  inv.company ?? inv.category ?? inv.investment_type ?? "Unknown Asset";

const fmtNGN = (n: number) =>
  `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const logoUrl = (s: string | null | undefined): string | null =>
  s && s.trim() !== "" ? s.trim() : null;

// ─── Treasury-bill maturity helpers ──────────────────────────────────────────
// Extracts 91 | 182 | 364 from the asset name, returns null if not a T-bill.
const extractTbillTenure = (name: string | null): 91 | 182 | 364 | null => {
  if (!name) return null;
  if (/364/.test(name)) return 364;
  if (/182/.test(name)) return 182;
  if (/91/.test(name))  return 91;
  return null;
};

// Days elapsed since pub_date (floored).
const daysSince = (pubDate: string): number => {
  const ms = Date.now() - new Date(pubDate).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

interface MaturityInfo {
  isTbill: boolean;
  tenure: 91 | 182 | 364 | null;
  daysElapsed: number;
  daysRemaining: number;
  isMature: boolean;
}

const getMaturityInfo = (inv: PortfolioInvestment): MaturityInfo => {
  const isTbill = (inv.category ?? "").toLowerCase().includes("treasury");
  const tenure = isTbill ? extractTbillTenure(inv.company) : null;
  const daysElapsed = daysSince(inv.pub_date);
  const daysRemaining = tenure ? Math.max(0, tenure - daysElapsed) : 0;
  const isMature = !isTbill || tenure === null || daysElapsed >= tenure;
  return { isTbill, tenure, daysElapsed, daysRemaining, isMature };
};

// Group investments by category
const groupByCategory = (investments: PortfolioInvestment[]) => {
  const map: Record<string, { count: number; invested: number; current: number }> = {};
  for (const inv of investments) {
    const key = inv.category ?? inv.investment_type ?? "Other";
    if (!map[key]) map[key] = { count: 0, invested: 0, current: 0 };
    map[key].count   += 1;
    map[key].invested += Number(inv.amount ?? 0);
    map[key].current  += Number(inv.final_amount ?? inv.amount ?? 0);
  }
  return Object.entries(map).map(([name, v]) => ({ name, ...v }));
};

// ─── Component ────────────────────────────────────────────────────────────────
type SellStep = "confirm" | "success" | "error";

export default function Portfolio() {
  const [, setLocation] = useLocation();
  const { data: portfolio, isLoading, isError, refetch } = usePortfolio();
  const { mutate: sell, isPending: selling } = useInvestmentSell();

  const [sellInv, setSellInv]       = useState<PortfolioInvestment | null>(null);
  const [sellStep, setSellStep]     = useState<SellStep>("confirm");
  const [sellError, setSellError]   = useState("");
  const [sheetOpen, setSheetOpen]   = useState(false);

  const investments    = portfolio?.investments ?? [];
  const portfolioValue = portfolio?.portfolio_value ?? 0;
  const totalInvested  = investments.reduce((sum, i) => sum + Number(i.amount ?? 0), 0);
  const totalPnL       = portfolioValue - totalInvested;
  const totalPnLPct    = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const activeCount    = investments.filter((i) => i.amount !== null).length;
  const breakdown      = groupByCategory(investments.filter((i) => i.amount !== null));

  const openSellSheet = (inv: PortfolioInvestment, e: React.MouseEvent) => {
    e.stopPropagation();
    setSellInv(inv);
    setSellStep("confirm");
    setSellError("");
    setSheetOpen(true);
  };

  const closeSellSheet = () => {
    setSheetOpen(false);
    setSellInv(null);
    setSellError("");
  };

  const handleConfirmSell = () => {
    if (!sellInv) return;
    const invested     = Number(sellInv.amount ?? 0);
    const currentVal   = Number(sellInv.final_amount ?? sellInv.amount ?? 0);
    const earningsPct  = invested > 0 ? ((currentVal - invested) / invested) * 100 : 0;
    const rateUsed     = Number(sellInv.return_rate ?? 0);

    sell(
      { investment: sellInv, earningsPct, rateUsed },
      {
        onSuccess: () => setSellStep("success"),
        onError: (err) => {
          setSellError(typeof err === "string" ? err : "Something went wrong. Please try again.");
          setSellStep("error");
        },
      }
    );
  };

  // ── Sell sheet data ──────────────────────────────────────────────────────
  const sellInvested   = sellInv ? Number(sellInv.amount ?? 0) : 0;
  const sellCurrent    = sellInv ? Number(sellInv.final_amount ?? sellInv.amount ?? 0) : 0;
  const sellEarnings   = sellCurrent - sellInvested;
  const sellLabel      = sellInv ? assetLabel(sellInv) : "";
  const sellMaturity   = sellInv ? getMaturityInfo(sellInv) : null;

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/invest")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg">Portfolio</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 space-y-6">

        {/* Value summary */}
        <Card className="border bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-1">Current Portfolio Value</p>
            {isLoading ? (
              <div className="h-10 w-48 bg-muted animate-pulse rounded" />
            ) : (
              <h1 className="text-4xl font-bold">{fmtNGN(portfolioValue)}</h1>
            )}
            {!isLoading && (
              <div className="flex flex-wrap gap-4 mt-3">
                <div>
                  <p className="text-[10px] text-muted-foreground">Total Invested</p>
                  <p className="text-sm font-semibold">{fmtNGN(totalInvested)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Total Earnings</p>
                  <p className={`text-sm font-semibold ${totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                    {totalPnL >= 0 ? "+" : ""}{fmtNGN(totalPnL)}
                    <span className="text-[10px] ml-1 font-normal">
                      ({totalPnLPct >= 0 ? "+" : ""}{totalPnLPct.toFixed(2)}%)
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Holdings</p>
                  <p className="text-sm font-semibold">{activeCount} asset{activeCount !== 1 ? "s" : ""}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <p className="text-sm text-muted-foreground">Failed to load portfolio.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* Category breakdown */}
        {!isLoading && !isError && breakdown.length > 0 && (
          <section>
            <h2 className="font-semibold text-base mb-3">Breakdown</h2>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {breakdown.map(({ name, count, invested, current }) => {
                const { icon: Icon, color } = getCategoryIcon(name);
                const pnl    = current - invested;
                const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
                return (
                  <Card key={name} className="border">
                    <CardContent className="p-4">
                      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xs font-semibold leading-tight">{name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{count} holding{count !== 1 ? "s" : ""}</p>
                      {current > 0 && (
                        <p className="text-xs font-bold text-primary mt-1">{fmtNGN(current)}</p>
                      )}
                      {invested > 0 && (
                        <p className={`text-[10px] mt-0.5 font-medium ${pnl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                          {pnl >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Holdings list */}
        <section>
          <h2 className="font-semibold text-base mb-3">Holdings</h2>

          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border">
                  <CardContent className="p-4 flex gap-3">
                    <div className="w-11 h-11 rounded-xl bg-muted animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !isError && investments.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <PieChart className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No holdings yet.</p>
              <Button size="sm" onClick={() => setLocation("/invest")}>
                Start Investing
              </Button>
            </div>
          )}

          {!isLoading && !isError && investments.length > 0 && (
            <div className="space-y-3">
              {investments.map((inv) => {
                const { icon: Icon, color } = getCategoryIcon(inv.category);
                const label     = assetLabel(inv);
                const invested  = inv.amount !== null ? Number(inv.amount) : null;
                const current   = inv.final_amount != null ? Number(inv.final_amount) : invested;
                const pnl       = invested !== null && current !== null ? current - invested : null;
                const pnlPct    = pnl !== null && invested && invested > 0 ? (pnl / invested) * 100 : null;
                const maturity  = getMaturityInfo(inv);

                return (
                  <Card
                    key={inv.id}
                    className="border hover-elevate cursor-pointer"
                    onClick={() => setLocation(`/portfolio/${inv.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Logo / icon */}
                        <div className={`w-11 h-11 rounded-xl ${logoUrl(inv.investment_icon) ? "bg-white border" : color} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                          {logoUrl(inv.investment_icon) ? (
                            <img src={logoUrl(inv.investment_icon)!} alt={label} className="w-full h-full object-contain p-1" />
                          ) : (
                            <Icon className="w-5 h-5 text-white" />
                          )}
                        </div>

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-sm leading-tight truncate">{label}</p>
                              {inv.investment_type && (
                                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                  {inv.investment_type}
                                </p>
                              )}
                            </div>
                            {/* Current value + P&L */}
                            <div className="text-right flex-shrink-0">
                              {current !== null ? (
                                <p className="text-sm font-bold text-primary">{fmtNGN(current)}</p>
                              ) : (
                                <Badge variant="outline" className="text-[10px]">Pending</Badge>
                              )}
                              {pnl !== null && (
                                <p className={`text-[10px] font-semibold mt-0.5 ${pnl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                                  {pnl >= 0 ? "+" : ""}{fmtNGN(pnl)}
                                  {pnlPct !== null && ` (${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(1)}%)`}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Bottom row: invested · date · status */}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {invested !== null && (
                              <span className="text-[10px] text-muted-foreground">
                                Invested {fmtNGN(invested)}
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(inv.pub_date)}
                            </span>
                            <Badge
                              variant={inv.status ? "default" : "secondary"}
                              className="text-[10px] px-1.5 py-0"
                            >
                              {inv.status ? "Active" : "Processing"}
                            </Badge>
                            {/* T-bill lock badge */}
                            {maturity.isTbill && !maturity.isMature && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5">
                                <Lock className="w-2.5 h-2.5" />
                                {maturity.daysRemaining}d left
                              </Badge>
                            )}
                          </div>

                          {/* Sell button row */}
                          <div className="mt-2.5 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {maturity.isMature ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 text-xs px-3"
                                onClick={(e) => openSellSheet(inv, e)}
                              >
                                <TrendingDown className="w-3 h-3 mr-1" />
                                Sell
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-3 opacity-50 cursor-not-allowed"
                                disabled
                                title={`Matures in ${maturity.daysRemaining} days`}
                              >
                                <Lock className="w-3 h-3 mr-1" />
                                Sell in {maturity.daysRemaining}d
                              </Button>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ─── Sell Confirmation Sheet ─────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={(o) => { if (!o) closeSellSheet(); }}>
        <SheetContent side="bottom" className="rounded-t-2xl p-0 max-h-[80vh] overflow-y-auto">
          {sellInv && (() => {
            const { icon: Icon, color } = getCategoryIcon(sellInv.category);

            // ── Confirm ────────────────────────────────────────────────
            if (sellStep === "confirm") return (
              <div className="p-5 space-y-5">
                <SheetHeader>
                  <SheetTitle className="text-left">Sell Investment</SheetTitle>
                </SheetHeader>

                {/* Asset summary */}
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <div className={`w-12 h-12 rounded-xl ${logoUrl(sellInv.investment_icon) ? "bg-white border" : color} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                    {logoUrl(sellInv.investment_icon) ? (
                      <img src={logoUrl(sellInv.investment_icon)!} alt={sellLabel} className="w-full h-full object-contain p-1.5" />
                    ) : (
                      <Icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{sellLabel}</p>
                    <p className="text-xs text-muted-foreground">{sellInv.category}</p>
                  </div>
                </div>

                {/* Breakdown */}
                <Card className="border">
                  <CardContent className="p-4 space-y-3">
                    {[
                      ["Amount Invested",  fmtNGN(sellInvested)],
                      ["Current Value",    fmtNGN(sellCurrent)],
                    ].map(([lbl, val]) => (
                      <div key={lbl} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{lbl}</span>
                        <span className="text-sm font-semibold">{val}</span>
                      </div>
                    ))}
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Earnings</span>
                      <span className={`text-sm font-bold ${sellEarnings >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                        {sellEarnings >= 0 ? "+" : ""}{fmtNGN(sellEarnings)}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold">You will receive</span>
                      <span className="text-lg font-bold text-primary">{fmtNGN(sellCurrent)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-black dark:text-black">
                      Selling this asset will close your position. This action cannot be undone.
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-2 pb-2">
                  <Button
                    className="w-full"
                    variant="destructive"
                    size="lg"
                    disabled={selling}
                    onClick={handleConfirmSell}
                  >
                    {selling ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing…</>
                    ) : (
                      <>Confirm Sell · {fmtNGN(sellCurrent)}</>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={closeSellSheet} disabled={selling}>
                    Cancel
                  </Button>
                </div>
              </div>
            );

            // ── Success ────────────────────────────────────────────────
            if (sellStep === "success") return (
              <div className="p-8 flex flex-col items-center text-center gap-5">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Sale Successful!</h2>
                  <p className="text-muted-foreground text-sm">Your position in <span className="font-semibold">{sellLabel}</span> has been closed.</p>
                  <p className="text-2xl font-bold text-primary mt-3">{fmtNGN(sellCurrent)}</p>
                  <p className="text-xs text-muted-foreground mt-1">credited to your wallet</p>
                </div>
                <Button className="w-full max-w-xs" onClick={closeSellSheet}>
                  Done
                </Button>
              </div>
            );

            // ── Error ──────────────────────────────────────────────────
            if (sellStep === "error") return (
              <div className="p-8 flex flex-col items-center text-center gap-5">
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Sale Failed</h2>
                  <p className="text-muted-foreground text-sm">{sellError || "Something went wrong. Please try again."}</p>
                </div>
                <div className="w-full max-w-xs space-y-2">
                  <Button className="w-full" onClick={() => setSellStep("confirm")}>
                    Try Again
                  </Button>
                  <Button variant="outline" className="w-full" onClick={closeSellSheet}>
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
