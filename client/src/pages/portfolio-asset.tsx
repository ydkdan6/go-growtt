import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
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
  Calendar,
  Activity,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { usePortfolio } from "@/hooks/general/usePortfolio";
import { useInvestmentAssets } from "@/hooks/general/useInvestmentsassets";
import type { PortfolioInvestment } from "@/types/general.types";
import { useTheme } from "@/components/theme-provider";
import TradingViewWidget from "@/components/TradingViewWidget";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCategoryIcon = (category: string | null): { icon: LucideIcon; color: string } => {
  const c = (category ?? "").toLowerCase();
  if (c.includes("stock"))   return { icon: TrendingUp,  color: "bg-blue-500" };
  if (c.includes("crypto"))  return { icon: Bitcoin,     color: "bg-orange-500" };
  if (c.includes("real") || c.includes("property")) return { icon: Building2, color: "bg-emerald-500" };
  if (c.includes("treasury"))  return { icon: Landmark,  color: "bg-sky-500" };
  if (c.includes("bond") || c.includes("fgn")) return { icon: Landmark, color: "bg-teal-600" };
  if (c.includes("commercial") || c.includes("paper")) return { icon: FileText, color: "bg-slate-600" };
  if (c.includes("gold"))  return { icon: Gem,       color: "bg-yellow-500" };
  if (c.includes("agri") || c.includes("farm")) return { icon: Sprout, color: "bg-lime-600" };
  if (c.includes("club"))  return { icon: Users,     color: "bg-rose-500" };
  if (c.includes("dollar")) return { icon: DollarSign, color: "bg-green-600" };
  if (c.includes("naira"))  return { icon: Banknote,  color: "bg-primary" };
  if (c.includes("female") || c.includes("women")) return { icon: Heart, color: "bg-pink-500" };
  if (c.includes("angel"))  return { icon: Rocket,   color: "bg-purple-600" };
  return { icon: BarChart3, color: "bg-primary" };
};

const fmtNGN = (n: number) =>
  `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const logoUrl = (s: string | null | undefined): string | null =>
  s && s.trim() !== "" ? s.trim() : null;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });


const safeStr = (s: string | null | undefined): string | null => {
  if (!s) return null;
  return /^nan$/i.test(s.trim()) ? null : s;
};

// Strips NSE prefix and returns a TradingView-compatible symbol, or null if invalid.
const getNseSymbol = (code: string | null | undefined): string | null => {
  if (!code) return null;
  const clean = code.trim();
  if (!clean || /^nan$/i.test(clean)) return null;
  if (/^NSE[-:]/i.test(clean)) {
    const ticker = clean.replace(/^NSE[-:]/i, "").trim().toUpperCase();
    return ticker && !/^nan$/i.test(ticker) ? `NSENG:${ticker}` : null;
  }
  return `NSENG:${clean.toUpperCase()}`;
};

// Maps common crypto names to TradingView symbols
const getCryptoSymbol = (company: string | null): string | null => {
  if (!company) return null;
  const c = company.toLowerCase();
  if (c.includes("bitcoin") || c === "btc") return "BINANCE:BTCUSDT";
  if (c.includes("ethereum") || c === "eth") return "BINANCE:ETHUSDT";
  if (c.includes("solana") || c === "sol") return "BINANCE:SOLUSDT";
  if (c.includes("bnb")) return "BINANCE:BNBUSDT";
  if (c.includes("cardano") || c === "ada") return "BINANCE:ADAUSDT";
  if (c.includes("xrp") || c.includes("ripple")) return "BINANCE:XRPUSDT";
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function PortfolioAsset({ params }: { params?: { investmentId?: string } }) {
  const [location, setLocation] = useLocation();
  const { theme } = useTheme();

  // Extract investmentId from params or parse from path
  const investmentId = params?.investmentId ?? location.replace("/portfolio/", "");

  const { data: portfolio, isLoading, isError, refetch } = usePortfolio();
  const { data: allAssets = [] } = useInvestmentAssets();

  const investment: PortfolioInvestment | undefined =
    portfolio?.investments.find((i) => i.id === investmentId);

  // Try to match with an InvestmentAsset for richer data (chart, market data)
  const matchedAsset = allAssets.find((a) => {
    if (!investment) return false;
    if (investment.asset_id && a.id === investment.asset_id) return true;
    const companyLower = (investment.company ?? "").toLowerCase();
    const catLower = (investment.category ?? "").toLowerCase();
    return (
      (safeStr(a.company)?.toLowerCase() === companyLower && companyLower !== "") ||
      (safeStr(a.assetName)?.toLowerCase() === companyLower && companyLower !== "") ||
      (safeStr(a.assetNameCode)?.toLowerCase() === companyLower && companyLower !== "") ||
      (a.category.toLowerCase() === catLower && catLower !== "" && allAssets.filter(x => x.category.toLowerCase() === catLower).length === 1)
    );
  });

  // ── Chart resolution ──────────────────────────────────────────────────────
  const resolveChart = (): string | null => {
    if (!investment) return null;
    const cat = (investment.category ?? "").toLowerCase();
    if (cat.includes("stock")) {
      return (
        getNseSymbol(investment.company) ??
        getNseSymbol(matchedAsset?.company ?? null) ??
        getNseSymbol(matchedAsset?.assetNameCode ?? null) ??
        getNseSymbol(matchedAsset?.assetName ?? null) ??
        null
      );
    }
    if (cat.includes("crypto")) {
      return getCryptoSymbol(investment.company) ?? getCryptoSymbol(matchedAsset?.company ?? null) ?? null;
    }
    return null;
  };

  const chartSymbol = resolveChart();

  // ── Loading / error states ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/portfolio")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">
          <div className="h-28 bg-muted animate-pulse rounded-xl" />
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
          <div className="h-40 bg-muted animate-pulse rounded-xl" />
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground text-sm text-center">Failed to load portfolio.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setLocation("/portfolio")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
        </Button>
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <BarChart3 className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground text-sm text-center">Investment not found.</p>
        <Button variant="outline" size="sm" onClick={() => setLocation("/portfolio")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
        </Button>
      </div>
    );
  }

  const { icon: Icon, color } = getCategoryIcon(investment.category);
  const label = investment.company ?? investment.category ?? investment.investment_type ?? "Unknown Asset";

  // amount  = initial investment (what was paid in)
  // final_amount = current value  (invested + earnings)
  const invested     = investment.amount != null      ? Number(investment.amount)       : null;
  const currentValue = investment.final_amount != null ? Number(investment.final_amount) : invested;
  const earnings     = invested !== null && currentValue !== null ? currentValue - invested : null;
  const earningsPct  = earnings !== null && invested && invested > 0 ? (earnings / invested) * 100 : null;

  const pricePerUnit = investment.price_per_unit ? parseFloat(investment.price_per_unit) : null;
  const unitsHeld    = investment.units
    ? parseFloat(investment.units)
    : invested && pricePerUnit && pricePerUnit > 0 ? invested / pricePerUnit : null;

  // Activity rows — only show fields that have values
  type Highlight = "up" | "down" | "neutral";
  const activityRows: { label: string; value: string; highlight?: Highlight }[] = [];

  if (invested     !== null) activityRows.push({ label: "Amount Invested",  value: fmtNGN(invested) });
  if (currentValue !== null) activityRows.push({ label: "Current Value",    value: fmtNGN(currentValue), highlight: earnings !== null ? (earnings >= 0 ? "up" : "down") : undefined });
  if (earnings     !== null) activityRows.push({ label: "Total Earnings",   value: `${earnings >= 0 ? "+" : ""}${fmtNGN(earnings)}`, highlight: earnings >= 0 ? "up" : "down" });
  if (earningsPct  !== null) activityRows.push({ label: "Return",           value: `${earningsPct >= 0 ? "+" : ""}${earningsPct.toFixed(2)}%`, highlight: earningsPct >= 0 ? "up" : "down" });
  if (pricePerUnit !== null) activityRows.push({ label: `Price per ${investment.per_unit_name ?? "unit"}`, value: fmtNGN(pricePerUnit) });
  if (unitsHeld    !== null) activityRows.push({ label: `${investment.per_unit_name ?? "Units"} held`, value: unitsHeld < 1 ? unitsHeld.toFixed(6) : unitsHeld.toFixed(4) });
  if (investment.return_rate)   activityRows.push({ label: "Return Rate",    value: `${investment.return_rate}% p.a.` });
  if (investment.maturity_date) activityRows.push({ label: "Maturity Date",  value: formatDate(investment.maturity_date) });

  // Use richer data from matched asset if available
  const about = matchedAsset?.description ?? matchedAsset?.about ?? null;
  const riskLevel = matchedAsset?.riskLevel ?? null;
  const tenure = matchedAsset?.tenure ?? null;

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/portfolio")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-7 h-7 rounded-lg ${logoUrl(investment.investment_icon) ? "bg-white border" : color} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
              {logoUrl(investment.investment_icon) ? (
                <img src={logoUrl(investment.investment_icon)!} alt={label} className="w-full h-full object-contain p-0.5" />
              ) : (
                <Icon className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="font-bold text-base truncate">{label}</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg lg:max-w-2xl mx-auto px-4 pt-5 space-y-5">

        {/* Summary card */}
        <Card className="border bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-5">
            {/* Top row: icon + name + badges */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl ${logoUrl(investment.investment_icon) ? "bg-white border" : color} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                {logoUrl(investment.investment_icon) ? (
                  <img src={logoUrl(investment.investment_icon)!} alt={label} className="w-full h-full object-contain p-1.5" />
                ) : (
                  <Icon className="w-7 h-7 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-lg leading-tight">{label}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {investment.category && (
                    <span className="text-xs text-muted-foreground">{investment.category}</span>
                  )}
                  {investment.investment_type && investment.investment_type !== investment.category && (
                    <span className="text-xs text-muted-foreground">· {investment.investment_type}</span>
                  )}
                  {riskLevel && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{riskLevel}</Badge>}
                  {tenure    && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{tenure}</Badge>}
                  <Badge variant={investment.status ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                    {investment.status ? "Active" : "Processing"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Amounts: current value (big), then invested + earnings row */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5">Current Value</p>
              <p className="text-3xl font-bold">
                {currentValue !== null ? fmtNGN(currentValue) : "—"}
              </p>
              {earnings !== null && (
                <p className={`text-sm font-semibold mt-1 ${earnings >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {earnings >= 0 ? "+" : ""}{fmtNGN(earnings)}
                  {earningsPct !== null && (
                    <span className="font-normal text-xs ml-1.5 opacity-80">
                      ({earningsPct >= 0 ? "+" : ""}{earningsPct.toFixed(2)}%)
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Invested amount sub-row */}
            {invested !== null && (
              <div className="mt-3 pt-3 border-t border-primary/20">
                <p className="text-[11px] text-muted-foreground">Amount Invested</p>
                <p className="text-base font-semibold">{fmtNGN(invested)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart */}
        {chartSymbol && (
          <section>
            <h2 className="font-semibold text-sm mb-2">Price Chart</h2>
            <div className="h-72 w-full rounded-xl overflow-hidden border">
              <TradingViewWidget
                symbol={chartSymbol}
                theme={theme === "dark" ? "dark" : "light"}
              />
            </div>
          </section>
        )}

        {/* Activity / investment details */}
        {activityRows.length > 0 && (
          <Card className="border">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">Investment Details</h2>
              </div>
              <div className="space-y-3">
                {activityRows.map(({ label: rowLabel, value, highlight }) => (
                  <div key={rowLabel} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground">{rowLabel}</span>
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        highlight === "up"
                          ? "text-green-600 dark:text-green-400"
                          : highlight === "down"
                            ? "text-red-500 dark:text-red-400"
                            : ""
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction history */}
        <Card className="border">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-sm">Transaction</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Investment Purchase</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(investment.pub_date)} · {formatTime(investment.pub_date)}
                    </div>
                  </div>
                  {investment.investment_type && (
                    <p className="text-xs text-muted-foreground mt-0.5">{investment.investment_type}</p>
                  )}
                </div>
                {invested !== null && (
                  <p className="text-sm font-bold text-primary flex-shrink-0">
                    {fmtNGN(invested)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About — from matched InvestmentAsset */}
        {about && (
          <Card className="border">
            <CardContent className="p-5">
              <h2 className="font-semibold text-sm mb-2">About</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{about}</p>
            </CardContent>
          </Card>
        )}

        {/* Invest more CTA */}
        <Button
          className="w-full"
          size="lg"
          onClick={() => setLocation("/invest")}
        >
          Invest More
        </Button>
      </main>
    </div>
  );
}
