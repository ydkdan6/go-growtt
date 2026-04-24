import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Sprout, Zap, Star, Crown, Flame, Gem, ArrowLeft,
  Loader2, ExternalLink, AlertCircle, Info,
} from "lucide-react";
import { useBuySeed } from "@/hooks/general/useSeedBalance";

//  ─ Seed packages                               
export interface SeedPackage {
  id: string;
  naira: number;
  seeds: number;
  label: string;
  icon: React.ElementType;
  highlight: boolean;
  badge?: string;
  gradient: string;
  iconColor: string;
}

export const SEED_PACKAGES: SeedPackage[] = [
  {
    id: "starter",
    naira: 500,
    seeds: 10,
    label: "Starter",
    icon: Sprout,
    highlight: false,
    gradient: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-500",
  },
  {
    id: "basic",
    naira: 1000,
    seeds: 25,
    label: "Basic",
    icon: Zap,
    highlight: false,
    gradient: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-500",
  },
  {
    id: "growth",
    naira: 1750,
    seeds: 50,
    label: "Growth",
    icon: Flame,
    highlight: true,
    badge: "Most Popular",
    gradient: "from-orange-500/15 to-amber-500/10",
    iconColor: "text-orange-500",
  },
  {
    id: "pro",
    naira: 3000,
    seeds: 100,
    label: "Pro",
    icon: Star,
    highlight: false,
    badge: "Best Value",
    gradient: "from-purple-500/10 to-violet-600/5",
    iconColor: "text-purple-500",
  },
  {
    id: "elite",
    naira: 5000,
    seeds: 200,
    label: "Elite",
    icon: Crown,
    highlight: false,
    gradient: "from-yellow-500/15 to-amber-600/5",
    iconColor: "text-yellow-500",
  },
];

//  ─ Pending purchase stored in sessionStorage before Paystack redirect    ─
export interface PendingPurchaseMeta {
  naira: number;
  seeds: number;
  label: string;
  userId: string;
  reference: string;
}

export const PENDING_PURCHASE_KEY = "growtt_pending_seed_purchase";

//  ─ Props                                   
interface BuySeedsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentSeeds: number;
}

type Step = "select" | "confirm" | "redirecting" | "error";

export function BuySeedsSheet({
  open,
  onOpenChange,
  userId,
  currentSeeds,
}: BuySeedsSheetProps) {
  const [step, setStep]         = useState<Step>("select");
  const [selected, setSelected] = useState<SeedPackage | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: buySeed, isPending } = useBuySeed();

  //  ─ Handlers                               
  const handleSelect = (pkg: SeedPackage) => {
    setSelected(pkg);
    setStep("confirm");
  };

  const handleConfirm = () => {
    if (!selected) return;
    setErrorMessage("");

    buySeed(
      { amount: String(selected.naira), custom_user_id: userId },
      {
        onSuccess: (res) => {
          if (!res.payment_url) {
            setErrorMessage(
              "Payment gateway did not return a checkout URL. Please try again or contact support."
            );
            setStep("error");
            return;
          }

          // Store meta so the callback page knows what was purchased
          const meta: PendingPurchaseMeta = {
            naira:     selected.naira,
            seeds:     selected.seeds,
            label:     selected.label,
            userId,
            reference: res.reference,
          };
          sessionStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(meta));

          // Show brief "redirecting" state before hard navigation
          setStep("redirecting");
          setTimeout(() => {
            window.location.href = res.payment_url;
          }, 800);
        },
        onError: (err) => {
          setErrorMessage(
            typeof err === "string"
              ? err
              : "Could not initiate payment. Please check your connection and try again."
          );
          setStep("error");
        },
      }
    );
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("select");
      setSelected(null);
      setErrorMessage("");
    }, 300);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <SheetContent
        side="bottom"
        className="h-[88vh] rounded-t-2xl p-0 flex flex-col overflow-hidden"
      >
        {/*   Step: Select package   */}
        {step === "select" && (
          <>
            <SheetHeader className="p-5 pb-3 border-b flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-left text-lg">Buy Seeds</SheetTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Current balance:{" "}
                    <span className="font-semibold text-foreground">{currentSeeds} seeds</span>
                  </p>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Info banner */}
              <Card className="border bg-primary/5">
                <CardContent className="p-4 flex items-start gap-3">
                  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Seeds unlock learning modules and features. Each purchase also tops up your
                    demo balance with the equivalent naira amount for risk-free practice trading.
                    You'll be taken to Paystack to complete payment securely.
                  </p>
                </CardContent>
              </Card>

              {/* Package cards */}
              <div className="space-y-3">
                {SEED_PACKAGES.map((pkg) => {
                  const Icon = pkg.icon;
                  const ratePerSeed = (pkg.naira / pkg.seeds).toFixed(0);
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => handleSelect(pkg)}
                      className={`w-full text-left rounded-2xl border-2 transition-all duration-200
                        hover:scale-[1.01] hover:shadow-md active:scale-[0.99]
                        ${pkg.highlight
                          ? "border-primary bg-gradient-to-r " + pkg.gradient
                          : "border-border bg-gradient-to-r " + pkg.gradient + " hover:border-primary/40"
                        }`}
                      data-testid={`seed-package-${pkg.id}`}
                    >
                      <div className="p-4 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                          ${pkg.highlight ? "bg-primary/15" : "bg-background/60"}`}>
                          <Icon className={`w-6 h-6 ${pkg.iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm">{pkg.label}</span>
                            {pkg.badge && (
                              <Badge
                                className={`text-[10px] px-2 py-0 ${
                                  pkg.badge === "Most Popular"
                                    ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20"
                                    : "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                }`}
                                variant="outline"
                              >
                                {pkg.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Sprout className="w-3 h-3 text-primary" />
                            <span className="font-bold text-base">{pkg.seeds} seeds</span>
                            <span className="text-xs text-muted-foreground">
                              · ₦{ratePerSeed}/seed
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            + ₦{pkg.naira.toLocaleString()} demo balance top-up
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-lg">₦{pkg.naira.toLocaleString()}</p>
                          {pkg.highlight && (
                            <p className="text-[10px] text-primary font-medium">Best deal</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/*   Step: Confirm   */}
        {step === "confirm" && selected && (
          <>
            <SheetHeader className="p-5 pb-3 border-b flex-shrink-0">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("select")} disabled={isPending}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <SheetTitle className="text-left">Confirm Purchase</SheetTitle>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Summary */}
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <selected.icon className={`w-10 h-10 ${selected.iconColor}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">You are purchasing</p>
                <p className="text-4xl font-bold mb-1">
                  {selected.seeds} <span className="text-primary">seeds</span>
                </p>
                <p className="text-sm text-muted-foreground">{selected.label} package</p>
              </div>

              {/* Breakdown */}
              <Card className="border">
                <CardContent className="p-4 space-y-3">
                  {[
                    ["Package",              selected.label],
                    ["Seeds you'll get",     `${selected.seeds} seeds`],
                    ["Demo balance top-up",  `₦${selected.naira.toLocaleString()}`],
                    ["Total cost",           `₦${selected.naira.toLocaleString()}`],
                    ["Payment via",          "Paystack (secure)"],
                  ].map(([label, value], i, arr) => (
                    <div key={label}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className={`text-sm font-medium ${
                          label === "Seeds you'll get"     ? "text-primary"                        :
                          label === "Demo balance top-up"  ? "text-green-600 dark:text-green-400"  :
                          label === "Payment via"          ? "text-muted-foreground"               : ""
                        }`}>{value}</span>
                      </div>
                      {i < arr.length - 1 && <div className="border-t mt-3" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* What you get */}
              <Card className="border bg-green-500/5 border-green-500/20">
                <CardContent className="p-4 space-y-2">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                    After payment you'll receive:
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Sprout className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>{selected.seeds} seeds added to your balance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>₦{selected.naira.toLocaleString()} added to demo balance</span>
                  </div>
                </CardContent>
              </Card>

              {/* Paystack notice */}
              <Card className="border bg-muted/40">
                <CardContent className="p-3 flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You'll be redirected to Paystack's secure checkout to complete payment.
                    Do not close the browser tab. You'll return here automatically after payment.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="p-5 pt-3 border-t bg-background space-y-2 flex-shrink-0">
              <Button
                className="w-full"
                size="lg"
                disabled={isPending}
                onClick={handleConfirm}
                data-testid="button-confirm-seed-purchase"
              >
                {isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Preparing checkout…</>
                ) : (
                  <><ExternalLink className="w-4 h-4 mr-2" />Pay ₦{selected.naira.toLocaleString()} via Paystack</>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep("select")}
                disabled={isPending}
              >
                Change Package
              </Button>
            </div>
          </>
        )}

        {/*   Step: Redirecting   */}
        {step === "redirecting" && (
          <div className="flex flex-col h-full items-center justify-center p-8 text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Redirecting to Paystack…</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                You're being taken to Paystack's secure checkout. Please do not close this tab.
              </p>
            </div>
          </div>
        )}

        {/*   Step: Error   */}
        {step === "error" && (
          <div className="flex flex-col h-full items-center justify-center p-8 text-center gap-5">
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {errorMessage || "Something went wrong. Please try again or contact support if the issue persists."}
              </p>
            </div>

            <div className="w-full max-w-xs space-y-2">
              <Button
                className="w-full"
                size="lg"
                onClick={() => { setStep("confirm"); setErrorMessage(""); }}
                data-testid="button-seed-retry"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleClose}
                data-testid="button-seed-error-close"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}