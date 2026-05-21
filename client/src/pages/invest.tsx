import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
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
  PlayCircle,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle2,
  PartyPopper,
  RefreshCw,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { useInvestmentAssets } from "@/hooks/general/useInvestmentsassets";
import { usePortfolio } from "@/hooks/general/usePortfolio";
import { useInvestmentPurchase } from "@/hooks/general/useInvestmentPurchase";
import type { InvestmentAsset } from "@/types/general.types";
import { useTheme } from "@/components/theme-provider";
import TradingViewWidget from "@/components/TradingViewWidget";

// ─── CoinGecko ────────────────────────────────────────────────────────────────
const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=ngn&include_24hr_change=true";

interface CryptoPrice {
  ngn: number;
  ngn_24h_change: number;
}
interface MarketPrices {
  bitcoin?: CryptoPrice;
  ethereum?: CryptoPrice;
  solana?: CryptoPrice;
}

const useMarketPrices = () => {
  const [prices, setPrices] = useState<MarketPrices>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(COINGECKO_URL);
      const data = await res.json();
      setPrices(data);
      setLastUpdated(new Date());
    } catch {
      /* keep previous */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, 60_000);
    return () => clearInterval(id);
  }, [fetch_]);

  return { prices, loading, lastUpdated, refresh: fetch_ };
};

const formatNGN = (val: number) => {
  if (val >= 1_000_000_000) return `₦${(val / 1_000_000_000).toFixed(2)}B`;
  if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `₦${(val / 1_000).toFixed(1)}K`;
  return `₦${val.toLocaleString()}`;
};

// ─── Icon/colour mapping ──────────────────────────────────────────────────────
const getCategoryStyle = (
  category: string,
): { icon: LucideIcon; color: string } => {
  const c = (category ?? "").toLowerCase();
  if (c.includes("stock")) return { icon: TrendingUp, color: "bg-blue-500" };
  if (c.includes("crypto")) return { icon: Bitcoin, color: "bg-orange-500" };
  if (c.includes("real") || c.includes("property"))
    return { icon: Building2, color: "bg-emerald-500" };
  if (c.includes("treasury")) return { icon: Landmark, color: "bg-sky-500" };
  if (c.includes("bond") || c.includes("fgn"))
    return { icon: Landmark, color: "bg-teal-600" };
  if (c.includes("commercial") || c.includes("paper"))
    return { icon: FileText, color: "bg-slate-600" };
  if (c.includes("gold")) return { icon: Gem, color: "bg-yellow-500" };
  if (c.includes("oil") || c.includes("crude"))
    return { icon: Gem, color: "bg-stone-700" };
  if (c.includes("agri") || c.includes("farm"))
    return { icon: Sprout, color: "bg-lime-600" };
  if (c.includes("club")) return { icon: Users, color: "bg-rose-500" };
  if (c.includes("dollar")) return { icon: DollarSign, color: "bg-green-600" };
  if (c.includes("naira")) return { icon: Banknote, color: "bg-primary" };
  if (c.includes("equity")) return { icon: BarChart3, color: "bg-indigo-500" };
  if (c.includes("female") || c.includes("women"))
    return { icon: Heart, color: "bg-pink-500" };
  if (c.includes("angel")) return { icon: Rocket, color: "bg-purple-600" };
  return { icon: BarChart3, color: "bg-primary" };
};

// Returns an absolute logo URL or null.
// Prepends the API base for relative paths so images load on any domain.
const logoUrl = (s: string | null | undefined): string | null => {
  if (!s || s.trim() === "") return null;
  const url = s.trim();
  if (url.startsWith("/")) return `https://api.growtt.com${url}`;
  return url;
};

// Resolve logo from asset — prefers logo field, falls back to investmentIcon
const assetLogo = (asset: InvestmentAsset): string | null =>
  logoUrl(asset.logo) ?? logoUrl(asset.investmentIcon);

// ─── Category-specific param rows ────────────────────────────────────────────
const isValidNum = (v: number | null | undefined): v is number =>
  v !== null && v !== undefined && !Number.isNaN(v);

const fmt = (val: number | null | undefined, prefix = "₦") =>
  isValidNum(val) ? `${prefix}${val.toLocaleString()}` : null;

// Strips NSE prefix and returns a TradingView-compatible symbol, or null if invalid.
// Silently rejects blank strings and the literal text "NaN" the API sometimes returns.
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

// Uses company (ticker), then assetNameCode, then assetName to find a usable NSE symbol.
const resolveStockSymbol = (asset: InvestmentAsset): string | null =>
  getNseSymbol(asset.company) ?? getNseSymbol(asset.assetNameCode) ?? getNseSymbol(asset.assetName) ?? null;

// Filters out "NaN" strings the API occasionally returns for string fields.
const safeStr = (s: string | null | undefined): string | null => {
  if (!s) return null;
  return /^nan$/i.test(s.trim()) ? null : s;
};

interface ParamRow {
  label: string;
  value: string;
  highlight?: "up" | "down";
}

const getCategoryParams = (asset: InvestmentAsset): ParamRow[] => {
  const c = asset.category?.toLowerCase() ?? "";
  const rows: ParamRow[] = [];

  if (c.includes("stock")) {
    if (isValidNum(asset.openPrice))  rows.push({ label: "Open",  value: fmt(asset.openPrice)  ?? "—" });
    if (isValidNum(asset.highPrice))  rows.push({ label: "High",  value: fmt(asset.highPrice)  ?? "—" });
    if (isValidNum(asset.lowPrice))   rows.push({ label: "Low",   value: fmt(asset.lowPrice)   ?? "—" });
    if (isValidNum(asset.closePrice)) rows.push({ label: "Close", value: fmt(asset.closePrice) ?? "—" });
    if (isValidNum(asset.changeNaira))
      rows.push({ label: "Chg ₦", value: fmt(asset.changeNaira) ?? "—",
        highlight: asset.changeNaira! >= 0 ? "up" : "down" });
    if (isValidNum(asset.changePercent))
      rows.push({ label: "Chg %",
        value: `${asset.changePercent! >= 0 ? "+" : ""}${asset.changePercent!.toFixed(2)}%`,
        highlight: asset.changePercent! >= 0 ? "up" : "down" });
    if (isValidNum(asset.numTrades))
      rows.push({ label: "Trades", value: asset.numTrades!.toLocaleString() });
    if (isValidNum(asset.dailyVolume))
      rows.push({ label: "Volume", value: fmt(asset.dailyVolume) ?? "—" });
    if (isValidNum(asset.marketCapitalization))
      rows.push({ label: "Mkt Cap", value: fmt(asset.marketCapitalization) ?? "—" });
  }
  if (c.includes("treasury")) {
    if (isValidNum(asset.discountRate))
      rows.push({ label: "Discount Rate", value: `${asset.discountRate}%` });
  }
  if (c.includes("gold")) {
    if (isValidNum(asset.openPrice))  rows.push({ label: "Open",  value: fmt(asset.openPrice)  ?? "—" });
    if (isValidNum(asset.highPrice))  rows.push({ label: "High",  value: fmt(asset.highPrice)  ?? "—" });
    if (isValidNum(asset.lowPrice))   rows.push({ label: "Low",   value: fmt(asset.lowPrice)   ?? "—" });
    if (isValidNum(asset.closePrice)) rows.push({ label: "Close", value: fmt(asset.closePrice) ?? "—" });
    if (isValidNum(asset.changePercent))
      rows.push({ label: "Chg %",
        value: `${asset.changePercent! >= 0 ? "+" : ""}${asset.changePercent!.toFixed(2)}%`,
        highlight: asset.changePercent! >= 0 ? "up" : "down" });
  }
  if (c.includes("dollar") || c.includes("mutual")) {
    if (isValidNum(asset.yearToDate))
      rows.push({ label: "YTD",
        value: `${asset.yearToDate! >= 0 ? "+" : ""}${asset.yearToDate!.toFixed(2)}%`,
        highlight: asset.yearToDate! >= 0 ? "up" : "down" });
  }
  if (c.includes("crypto")) {
    if (isValidNum(asset.changePercent))
      rows.push({ label: "24h %",
        value: `${asset.changePercent! >= 0 ? "+" : ""}${asset.changePercent!.toFixed(2)}%`,
        highlight: asset.changePercent! >= 0 ? "up" : "down" });
    if (isValidNum(asset.priceChangeInNaira))
      rows.push({ label: "24h ₦", value: fmt(asset.priceChangeInNaira) ?? "—",
        highlight: asset.priceChangeInNaira! >= 0 ? "up" : "down" });
  }
  return rows;
};

// ─── Build tabs WITHOUT "All" ─────────────────────────────────────────────────
const buildTabs = (assets: InvestmentAsset[]) => {
  const cats = Array.from(new Set(assets.map((a) => a.category).filter(Boolean)));
  return cats.map((c) => ({ id: c, label: c })); // ← no "All" entry
};

// ─── Component ────────────────────────────────────────────────────────────────
type SheetStep = "detail" | "invest" | "confirm" | "success" | "error";

export default function Invest() {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [selectedAsset, setSelectedAsset] = useState<InvestmentAsset | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [step, setStep] = useState<SheetStep>("detail");
  const [rawAmount, setRawAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [purchaseError, setPurchaseError] = useState("");

  const {
    data: assets = [],
    isLoading,
    isError,
    refetch,
  } = useInvestmentAssets();
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
  const {
    prices,
    loading: pricesLoading,
    lastUpdated,
    refresh,
  } = useMarketPrices();
  const { mutate: purchase, isPending: purchasing } = useInvestmentPurchase();

  const portfolioValue = portfolio?.portfolio_value ?? 0;
  const holdingsCount = portfolio?.investments?.length ?? 0;
  const tabs = buildTabs(assets);

  // ── Set first category as default once assets load ────────────────────
  useEffect(() => {
    if (assets.length > 0 && !activeCategory) {
      setActiveCategory(assets[0].category);
    }
  }, [assets, activeCategory]);

  // Reset search and page when category changes; reset page when search changes
  useEffect(() => {
    setCurrentPage(0);
    setSearch("");
  }, [activeCategory]);

  useEffect(() => {
    setCurrentPage(0);
  }, [search]);

  const searchLower = search.toLowerCase();
  const filteredAssets = assets.filter((a) => {
    if (a.category !== activeCategory) return false;
    if (!search) return true;
    return (
      safeStr(a.company)?.toLowerCase().includes(searchLower) ||
      safeStr(a.assetName)?.toLowerCase().includes(searchLower) ||
      safeStr(a.assetNameCode)?.toLowerCase().includes(searchLower) ||
      a.description?.toLowerCase().includes(searchLower) ||
      a.about?.toLowerCase().includes(searchLower)
    );
  });
  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const pagedAssets = filteredAssets.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const amount = parseFloat(rawAmount.replace(/,/g, "")) || 0;
  const priceUnit = selectedAsset?.pricePerUnit ?? 0;
  const units = priceUnit > 0 ? amount / priceUnit : 0;
  const minPayment = selectedAsset?.minPayment ?? 0;

  const marketRows = [
    {
      name: "BTC/NGN",
      value: prices.bitcoin ? formatNGN(prices.bitcoin.ngn) : "—",
      change: prices.bitcoin
        ? `${prices.bitcoin.ngn_24h_change >= 0 ? "+" : ""}${prices.bitcoin.ngn_24h_change.toFixed(2)}%`
        : "—",
      positive: (prices.bitcoin?.ngn_24h_change ?? 0) >= 0,
      live: true,
    },
    {
      name: "ETH/NGN",
      value: prices.ethereum ? formatNGN(prices.ethereum.ngn) : "—",
      change: prices.ethereum
        ? `${prices.ethereum.ngn_24h_change >= 0 ? "+" : ""}${prices.ethereum.ngn_24h_change.toFixed(2)}%`
        : "—",
      positive: (prices.ethereum?.ngn_24h_change ?? 0) >= 0,
      live: true,
    },
    {
      name: "SOL/NGN",
      value: prices.solana ? formatNGN(prices.solana.ngn) : "—",
      change: prices.solana
        ? `${prices.solana.ngn_24h_change >= 0 ? "+" : ""}${prices.solana.ngn_24h_change.toFixed(2)}%`
        : "—",
      positive: (prices.solana?.ngn_24h_change ?? 0) >= 0,
      live: true,
    },
    {
      name: "T-Bill Rate",
      value: "18.5%",
      change: "+0.2%",
      positive: true,
      live: false,
    },
  ];

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
    setPurchaseError("");
  };

  const handleAmountChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    const num = parseFloat(clean) || 0;
    setRawAmount(clean ? Number(clean).toLocaleString() : "");
    setAmountError(
      clean && num < minPayment
        ? `Minimum investment is ₦${minPayment.toLocaleString()}`
        : "",
    );
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
    setPurchaseError("");
    purchase(
      { asset: selectedAsset, amount, units },
      {
        onSuccess: () => setStep("success"),
        onError: (err) => {
          setPurchaseError(typeof err === "string" ? err : "Something went wrong. Please try again.");
          setStep("error");
        },
      },
    );
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
        {/* Portfolio Summary */}
        <Card className="border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                {portfolioLoading ? (
                  <div className="h-9 w-40 bg-muted animate-pulse rounded mt-1" />
                ) : (
                  <h2 className="text-3xl font-bold">
                    ₦
                    {portfolioValue.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h2>
                )}
                {!portfolioLoading && holdingsCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {holdingsCount} asset{holdingsCount > 1 ? "s" : ""} held
                  </p>
                )}
              </div>
              <button
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                onClick={() => setLocation("/portfolio")}
                aria-label="View portfolio"
              >
                <PieChart className="w-6 h-6 text-primary" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/portfolio")}
                data-testid="button-view-portfolio"
              >
                <PieChart className="w-4 h-4 mr-1.5" />
                View Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Market Overview */}
        <section>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">Market Overview</h3>
              {lastUpdated && (
                <span className="text-[10px] text-muted-foreground">
                  Updated{" "}
                  {lastUpdated.toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground text-xs gap-1"
              onClick={() => refresh()}
              disabled={pricesLoading}
              data-testid="button-refresh-markets"
            >
              <RefreshCw
                className={`w-3 h-3 ${pricesLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {marketRows.map((m, i) => (
              <Card key={i} className="border">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs text-muted-foreground">{m.name}</p>
                    {m.live && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </div>
                  {pricesLoading && m.live ? (
                    <div className="h-5 w-20 bg-muted animate-pulse rounded mb-1" />
                  ) : (
                    <p className="font-semibold text-sm">{m.value}</p>
                  )}
                  <div
                    className={`flex items-center gap-1 text-xs ${m.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {m.positive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {pricesLoading && m.live ? "—" : m.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Category Tabs — no "All" */}
        {!isLoading && tabs.length > 0 && (
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
                <span className="uppercase">{tab.label}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Asset Cards */}
        <section>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-semibold text-lg uppercase">{activeCategory}</h3>
            {!isLoading && (
              <Badge variant="secondary">
                {filteredAssets.length} asset
                {filteredAssets.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {/* Search bar */}
          {!isLoading && !isError && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder={`Search ${activeCategory}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-9 h-9 text-sm"
              />
              {search && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <AlertCircle className="w-10 h-10 text-destructive" />
              <p className="text-sm text-muted-foreground">
                Failed to load investment assets.
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          )}

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

          {!isLoading &&
            !isError &&
            (filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <BarChart3 className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {search
                    ? `No assets match "${search}"`
                    : "No assets in this category yet."}
                </p>
                {search && (
                  <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                {pagedAssets.map((asset) => {
                  const { icon: Icon, color } = getCategoryStyle(asset.category);

                  const displayName =
                    safeStr(asset.company) ??
                    safeStr(asset.assetName) ??
                    safeStr(asset.assetNameCode) ??
                    asset.category;

                  const subtitle = asset.description ?? asset.about ?? null;

                  const returns = isValidNum(asset.rate)
                    ? `${asset.rate}% p.a.`
                    : isValidNum(asset.interest)
                      ? `${asset.interest}% p.a.`
                      : isValidNum(asset.yearToDate)
                        ? `${asset.yearToDate! >= 0 ? "+" : ""}${asset.yearToDate}% YTD`
                        : isValidNum(asset.percentGrowth)
                          ? `${asset.percentGrowth! > 0 ? "+" : ""}${asset.percentGrowth}%`
                          : null;

                  const minAmt = isValidNum(asset.minPayment)
                    ? `Min ₦${asset.minPayment!.toLocaleString()}`
                    : null;
                  const tagList = asset.tags
                    ? asset.tags.split(",").map((t) => t.trim()).filter(Boolean)
                    : [];
                  const catParams = getCategoryParams(asset);

                  const priceDisplay = isValidNum(asset.pricePerUnit)
                    ? `₦${asset.pricePerUnit!.toLocaleString()}`
                    : null;

                  return (
                    <Card
                      key={asset.id}
                      className="border hover-elevate cursor-pointer"
                      onClick={() => handleAssetTap(asset)}
                      data-testid={`invest-option-${asset.id}`}
                    >
                      <CardContent className="p-4">
                        {/* Top row: icon + name + price + lock */}
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`w-11 h-11 rounded-xl ${assetLogo(asset) ? "bg-white border" : color} flex items-center justify-center relative flex-shrink-0 overflow-hidden`}
                          >
                            {assetLogo(asset) ? (
                              <img src={assetLogo(asset)!} alt={displayName} className="w-full h-full object-contain p-1" />
                            ) : (
                              <Icon className="w-5 h-5 text-white" />
                            )}
                            {asset.locked && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-card border flex items-center justify-center">
                                <Lock className="w-3 h-3 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                {/* Company / asset name — primary label */}
                                <p className="font-semibold text-sm leading-tight truncate">
                                  {displayName}
                                </p>
                                {/* Asset code badge — guard against "NaN" strings */}
                                {safeStr(asset.assetNameCode) && (
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {safeStr(asset.assetNameCode)}
                                  </span>
                                )}
                              </div>
                              {/* Price on the right */}
                              {priceDisplay && (
                                <span className="text-sm font-bold flex-shrink-0">
                                  {priceDisplay}
                                </span>
                              )}
                            </div>

                            {/* Subtitle */}
                            {subtitle && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-snug">
                                {subtitle}
                              </p>
                            )}

                            {/* Returns + min + risk badges */}
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              {returns && (
                                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                  {returns}
                                </span>
                              )}
                              {minAmt && (
                                <span className="text-[10px] text-muted-foreground">
                                  {minAmt}
                                </span>
                              )}
                              {asset.riskLevel && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {asset.riskLevel}
                                </Badge>
                              )}
                              {asset.tenure && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {asset.tenure}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        </div>

                        {/* Category-specific market data params */}
                        {catParams.length > 0 && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-3 border-t">
                            {catParams.map(({ label, value, highlight }) => (
                              <div
                                key={label}
                                className="flex items-center justify-between gap-1"
                              >
                                <span className="text-[10px] text-muted-foreground">
                                  {label}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold tabular-nums ${
                                    highlight === "up"
                                      ? "text-green-600 dark:text-green-400"
                                      : highlight === "down"
                                        ? "text-red-600 dark:text-red-400"
                                        : ""
                                  }`}
                                >
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tags */}
                        {tagList.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap mt-2.5 pt-2.5 border-t">
                            {tagList.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ← Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next →
              </Button>
            </div>
          )}
        </section>

        {/* Unlock CTA */}
        <Card className="border bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <LineChart className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Unlock All Assets</p>
              <p className="text-xs text-muted-foreground">
                Complete learning courses to access all investment options
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setLocation("/learn")}
              data-testid="button-go-learn"
            >
              Learn
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav currentPage="invest" />

      {/* Asset Detail / Invest Sheet */}
      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseSheet();
          else setSheetOpen(true);
        }}
      >
        <SheetContent
          side="bottom"
          className="h-[92vh] overflow-y-auto rounded-t-2xl p-0"
        >
          {selectedAsset &&
            (() => {
              const { icon: Icon, color } = getCategoryStyle(
                selectedAsset.category,
              );
              const displayName =
                safeStr(selectedAsset.company) ??
                safeStr(selectedAsset.assetName) ??
                safeStr(selectedAsset.assetNameCode) ??
                selectedAsset.category;
              const displayCode = safeStr(selectedAsset.assetNameCode);
              const subtitle =
                selectedAsset.description ?? selectedAsset.about ?? null;
              const tagList = selectedAsset.tags
                ? selectedAsset.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [];
              const catParams = getCategoryParams(selectedAsset);

              // ── Detail ────────────────────────────────────────────────────
              if (step === "detail")
                return (
                  <div className="flex flex-col h-full">
                    <SheetHeader className="p-5 pb-0">
                      <div className="flex items-center gap-3 mb-1">
                        <div
                          className={`w-12 h-12 rounded-xl ${assetLogo(selectedAsset) ? "bg-white border" : color} flex items-center justify-center flex-shrink-0 overflow-hidden`}
                        >
                          {assetLogo(selectedAsset) ? (
                            <img src={assetLogo(selectedAsset)!} alt={displayName} className="w-full h-full object-contain p-1.5" />
                          ) : (
                            <Icon className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <SheetTitle className="text-left text-lg leading-tight truncate">
                            {displayName}
                          </SheetTitle>
                          {/* Category badge + code on same line */}
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">
                              {selectedAsset.category}
                            </span>
                            {displayCode && (
                              <span className="text-xs text-muted-foreground font-mono">
                                · {displayCode}
                              </span>
                            )}
                          </div>
                          {/* Price — only when valid */}
                          {isValidNum(selectedAsset.pricePerUnit) && (
                            <p className="text-sm font-bold mt-0.5">
                              ₦{selectedAsset.pricePerUnit!.toLocaleString()}
                              {selectedAsset.perUnitName && (
                                <span className="text-xs font-normal text-muted-foreground ml-1">
                                  / {selectedAsset.perUnitName}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-4">
                      {/* TradingView chart — stocks only, shown before About */}
                      {(() => {
                        const isStock = selectedAsset.category?.toLowerCase().includes("stock");
                        const nseSymbol = isStock ? resolveStockSymbol(selectedAsset) : null;
                        if (!nseSymbol) return null;
                        return (
                          <div className="h-72 w-full rounded-xl overflow-hidden border">
                            <TradingViewWidget
                              symbol={nseSymbol}
                              theme={theme === "dark" ? "dark" : "light"}
                            />
                          </div>
                        );
                      })()}

                      {/* About / description */}
                      {subtitle && (
                        <Card className="border">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-sm mb-1.5">
                              About
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {subtitle}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Category market data */}
                      {catParams.length > 0 && (
                        <Card className="border">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-sm mb-3">
                              Market Data
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {catParams.map(({ label, value, highlight }) => (
                                <div
                                  key={label}
                                  className="flex flex-col gap-0.5"
                                >
                                  <span className="text-xs text-muted-foreground">
                                    {label}
                                  </span>
                                  <span
                                    className={`text-sm font-semibold tabular-nums ${
                                      highlight === "up"
                                        ? "text-green-600 dark:text-green-400"
                                        : highlight === "down"
                                          ? "text-red-600 dark:text-red-400"
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

                      {/* Tags */}
                      {(tagList.length > 0 || selectedAsset.investmentType) && (
                        <div className="flex gap-2 flex-wrap">
                          {selectedAsset.investmentType && (
                            <Badge variant="secondary" className="text-xs">
                              {selectedAsset.investmentType}
                            </Badge>
                          )}
                          {tagList.map((t) => (
                            <Badge
                              key={t}
                              variant="secondary"
                              className="text-xs"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}


                      {/* Trust badges */}
                      <div className="space-y-2.5">
                        {[
                          {
                            icon: Shield,
                            title: "SEC Regulated",
                            sub: "Fully compliant with Nigerian regulations",
                          },
                          {
                            icon: Clock,
                            title: "Real-time Tracking",
                            sub: "Monitor performance live",
                          },
                        ].map(({ icon: Ico, title, sub }) => (
                          <div key={title} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Ico className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{title}</p>
                              <p className="text-xs text-muted-foreground">
                                {sub}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 pt-3 space-y-2 border-t bg-background">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setStep("invest")}
                        data-testid="button-go-invest"
                      >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        {`Invest in ${displayName}`}
                      </Button>
                    </div>
                  </div>
                );

              // ── Invest ────────────────────────────────────────────────────
              if (step === "invest")
                return (
                  <div className="flex flex-col h-full">
                    <SheetHeader className="p-5 pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setStep("detail")}
                        >
                          <ChevronRight className="w-5 h-5 rotate-180" />
                        </Button>
                        <SheetTitle className="text-left">
                          Invest in {displayName}
                        </SheetTitle>
                      </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Enter Amount (₦)
                        </p>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                            ₦
                          </span>
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder={`Min. ₦${minPayment.toLocaleString()}`}
                            value={rawAmount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="pl-7 text-lg font-semibold h-14"
                            data-testid="input-invest-amount"
                          />
                        </div>
                        {amountError && (
                          <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {amountError}
                          </p>
                        )}
                        {minPayment > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Minimum investment: ₦{minPayment.toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          minPayment || 5000,
                          (minPayment || 5000) * 2,
                          (minPayment || 5000) * 5,
                        ].map((amt) => (
                          <Button
                            key={amt}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleAmountChange(String(amt))}
                            data-testid={`quick-amount-${amt}`}
                          >
                            ₦{amt.toLocaleString()}
                          </Button>
                        ))}
                      </div>

                      {amount > 0 && priceUnit > 0 && (
                        <Card className="border bg-primary/5">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Amount
                              </span>
                              <span className="text-sm font-semibold">
                                ₦{amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Price per {selectedAsset.perUnitName ?? "unit"}
                              </span>
                              <span className="text-sm font-semibold">
                                ₦{priceUnit.toLocaleString()}
                              </span>
                            </div>
                            <div className="border-t pt-3 flex items-center justify-between">
                              <span className="text-sm font-medium">
                                You will receive
                              </span>
                              <span className="text-lg font-bold text-primary">
                                {units < 1
                                  ? units.toFixed(6)
                                  : units.toFixed(4)}{" "}
                                {selectedAsset.perUnitName ?? "units"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {amount > 0 && priceUnit === 0 && (
                        <Card className="border bg-primary/5">
                          <CardContent className="p-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Investment Amount
                            </span>
                            <span className="text-lg font-bold text-primary">
                              ₦{amount.toLocaleString()}
                            </span>
                          </CardContent>
                        </Card>
                      )}

                      <Card className="border">
                        <CardContent className="p-3 flex items-start gap-2">
                          <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Your investment is protected under Nigerian SEC
                            regulations. Transaction fees are zero.
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-5 pt-3 border-t bg-background">
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={!amount || !!amountError}
                        onClick={handleProceedToConfirm}
                        data-testid="button-proceed-confirm"
                      >
                        Continue — ₦{amount ? amount.toLocaleString() : "0"}
                      </Button>
                    </div>
                  </div>
                );

              // ── Confirm ───────────────────────────────────────────────────
              if (step === "confirm")
                return (
                  <div className="flex flex-col h-full">
                    <SheetHeader className="p-5 pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setStep("invest")}
                        >
                          <ChevronRight className="w-5 h-5 rotate-180" />
                        </Button>
                        <SheetTitle className="text-left">
                          Confirm Investment
                        </SheetTitle>
                      </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                      <div className="text-center py-2">
                        <div
                          className={`w-16 h-16 rounded-2xl ${assetLogo(selectedAsset) ? "bg-white border" : color} flex items-center justify-center mx-auto mb-4 overflow-hidden`}
                        >
                          {assetLogo(selectedAsset) ? (
                            <img src={assetLogo(selectedAsset)!} alt={displayName} className="w-full h-full object-contain p-2" />
                          ) : (
                            <Icon className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          You are investing
                        </p>
                        <p className="text-4xl font-bold mb-1">
                          ₦{amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          in {displayName}
                        </p>
                      </div>

                      <Card className="border">
                        <CardContent className="p-4 space-y-3">
                          {[
                            ["Asset", displayName],
                            ["Amount", `₦${amount.toLocaleString()}`],
                            ...(priceUnit > 0
                              ? [
                                  [
                                    "Price per unit",
                                    `₦${priceUnit.toLocaleString()}`,
                                  ],
                                  [
                                    "Units",
                                    units < 1
                                      ? units.toFixed(6)
                                      : units.toFixed(4),
                                  ],
                                ]
                              : []),
                            ["Transaction Fee", "Free"],
                            ["Payment Method", "Wallet Balance"],
                          ].map(([label, val], i, arr) => (
                            <div key={label}>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  {label}
                                </span>
                                <span
                                  className={`text-sm font-medium ${label === "Transaction Fee" ? "text-green-600 dark:text-green-400" : ""}`}
                                >
                                  {val}
                                </span>
                              </div>
                              {i < arr.length - 1 && (
                                <div className="border-t mt-3" />
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="border bg-primary/5">
                        <CardContent className="p-3 flex items-start gap-2">
                          <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            By confirming, you agree to Growtt's terms. Your
                            portfolio will update immediately after purchase.
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-5 pt-3 space-y-2 border-t bg-background">
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={purchasing}
                        onClick={handleConfirmPurchase}
                        data-testid="button-confirm-purchase"
                      >
                        {purchasing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Processing…
                          </>
                        ) : (
                          <>Process — ₦{amount.toLocaleString()}</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setStep("invest")}
                        disabled={purchasing}
                        data-testid="button-cancel-confirm"
                      >
                        Edit Amount
                      </Button>
                    </div>
                  </div>
                );

              // ── Success ───────────────────────────────────────────────────
              if (step === "success")
                return (
                  <div className="flex flex-col h-full items-center justify-center p-8 text-center gap-5">
                    <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <PartyPopper className="w-8 h-8 text-yellow-500" />
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        Investment Successful!
                      </h2>
                      <p className="text-muted-foreground">You just invested</p>
                      <p className="text-4xl font-bold my-2">
                        ₦{amount.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground">in {displayName}</p>
                      {priceUnit > 0 && (
                        <p className="text-sm text-primary font-semibold mt-2">
                          {units < 1 ? units.toFixed(6) : units.toFixed(4)}{" "}
                          {selectedAsset.perUnitName ?? "units"} added to
                          portfolio
                        </p>
                      )}
                    </div>
                    <Card className="border w-full max-w-xs">
                      <CardContent className="p-4 space-y-2">
                        {[
                          ["Asset", displayName],
                          ["Amount", `₦${amount.toLocaleString()}`],
                          ...(priceUnit > 0
                            ? [
                                [
                                  "Units",
                                  units < 1
                                    ? units.toFixed(6)
                                    : units.toFixed(4),
                                ],
                              ]
                            : []),
                        ].map(([label, val]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between"
                          >
                            <span className="text-xs text-muted-foreground">
                              {label}
                            </span>
                            <span className="text-xs font-medium">{val}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Status
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          >
                            Completed
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="w-full max-w-xs space-y-2">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => {
                          setStep("invest");
                          setRawAmount("");
                        }}
                        data-testid="button-invest-more"
                      >
                        Invest More
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleCloseSheet}
                        data-testid="button-back-to-assets"
                      >
                        Back to Assets
                      </Button>
                    </div>
                  </div>
                );

              // ── Error ─────────────────────────────────────────────────────
              if (step === "error")
                return (
                  <div className="flex flex-col h-full items-center justify-center p-8 text-center gap-5">
                    <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
                      <AlertCircle className="w-12 h-12 text-destructive" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Purchase Failed
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {purchaseError || "Something went wrong processing your investment. Please try again."}
                      </p>
                    </div>
                    <div className="w-full max-w-xs space-y-2">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setStep("confirm")}
                        data-testid="button-retry-purchase"
                      >
                        Try Again
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleCloseSheet}
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
