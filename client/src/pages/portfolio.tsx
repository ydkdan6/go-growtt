import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
  type LucideIcon,
} from "lucide-react";
import { usePortfolio } from "@/hooks/general/usePortfolio";
import type { PortfolioInvestment } from "@/types/general.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getCategoryIcon = (category: string | null): { icon: LucideIcon; color: string } => {
  const c = (category ?? "").toLowerCase();
  if (c.includes("stock"))   return { icon: TrendingUp, color: "bg-blue-500" };
  if (c.includes("crypto"))  return { icon: Bitcoin,    color: "bg-orange-500" };
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

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
};

const assetLabel = (inv: PortfolioInvestment): string =>
  inv.company ?? inv.category ?? inv.investment_type ?? "Unknown Asset";

// Group investments by category for the breakdown chart
const groupByCategory = (investments: PortfolioInvestment[]) => {
  const map: Record<string, { count: number; total: number }> = {};
  for (const inv of investments) {
    const key = inv.category ?? inv.investment_type ?? "Other";
    if (!map[key]) map[key] = { count: 0, total: 0 };
    map[key].count += 1;
    map[key].total += Number(inv.amount ?? 0);
  }
  return Object.entries(map).map(([name, v]) => ({ name, ...v }));
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [, setLocation] = useLocation();
  const { data: portfolio, isLoading, isError, refetch } = usePortfolio();

  const investments = portfolio?.investments ?? [];
  const portfolioValue = portfolio?.portfolio_value ?? 0;
  const totalInvested = investments.reduce((sum, i) => sum + Number(i.amount ?? 0), 0);
  const activeCount = investments.filter((i) => i.amount !== null).length;
  const breakdown = groupByCategory(investments.filter((i) => i.amount !== null));

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
            <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
            {isLoading ? (
              <div className="h-10 w-48 bg-muted animate-pulse rounded" />
            ) : (
              <h1 className="text-4xl font-bold">
                ₦{portfolioValue.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
            )}
            {!isLoading && (
              <div className="flex gap-4 mt-3">
                <div>
                  <p className="text-[10px] text-muted-foreground">Total Invested</p>
                  <p className="text-sm font-semibold">₦{totalInvested.toLocaleString()}</p>
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
              {breakdown.map(({ name, count, total }) => {
                const { icon: Icon, color } = getCategoryIcon(name);
                return (
                  <Card key={name} className="border">
                    <CardContent className="p-4">
                      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xs font-semibold leading-tight">{name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{count} holding{count !== 1 ? "s" : ""}</p>
                      {total > 0 && (
                        <p className="text-xs font-bold text-primary mt-1">
                          ₦{total.toLocaleString()}
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
                const label = assetLabel(inv);
                const amount = inv.amount !== null ? Number(inv.amount) : null;
                return (
                  <Card key={inv.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>

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
                            {amount !== null ? (
                              <p className="text-sm font-bold flex-shrink-0 text-primary">
                                ₦{amount.toLocaleString()}
                              </p>
                            ) : (
                              <Badge variant="outline" className="text-[10px] flex-shrink-0">
                                Pending
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(inv.pub_date)} · {formatTime(inv.pub_date)}
                            </span>
                            <Badge
                              variant={inv.status ? "default" : "secondary"}
                              className="text-[10px] px-1.5 py-0"
                            >
                              {inv.status ? "Active" : "Processing"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
