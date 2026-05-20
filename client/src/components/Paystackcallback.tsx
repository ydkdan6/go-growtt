import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sprout,
  Zap,
  Home,
  XCircle,
  Clock,
} from "lucide-react";
import {
  useVerifyPurchase,
  useFundDemoBalance,
  useFundSeedBalance,
  useInvalidateUserAfterVerify,
} from "@/hooks/general/useSeedBalance";
import { useUserDetail } from "@/hooks/general/useUserDetails";
import type { PendingPurchaseMeta } from "./BuySeedsheet";
import { PENDING_PURCHASE_KEY } from "./BuySeedsheet";

type VerifyStep =
  | "verifying"
  | "funding_seed"
  | "funding_demo"
  | "success"
  | "payment_failed"
  | "verify_error"
  | "seed_error"
  | "demo_error"
  | "no_reference";

export default function PaymentCallback() {
  const [, setLocation] = useLocation();
  const [verifyStep, setVerifyStep] = useState<VerifyStep>("verifying");
  const [stepError, setStepError] = useState("");
  const [hasStartedChain, setHasStartedChain] = useState(false);

  // ── URL params ─────────────────────────────────────────────────────────
  const params = new URLSearchParams(window.location.search);
  const reference = params.get("reference") ?? params.get("trxref") ?? "";

  // ── Meta from sessionStorage ───────────────────────────────────────────
  const rawMeta = sessionStorage.getItem(PENDING_PURCHASE_KEY);
  const meta: PendingPurchaseMeta | null = rawMeta
    ? (() => {
        try {
          return JSON.parse(rawMeta);
        } catch {
          return null;
        }
      })()
    : null;

  // ── Get userId: prefer meta, fall back to localStorage ────────────────
  const storedUserId = localStorage.getItem("user_id") ?? "";
  const userId = meta?.userId ? String(meta.userId) : storedUserId;

  // ── Hooks ──────────────────────────────────────────────────────────────
  const { data: user } = useUserDetail();
  const invalidateUser = useInvalidateUserAfterVerify(userId);
  const { mutate: fundSeed } = useFundSeedBalance(userId);
  const { mutate: fundDemo } = useFundDemoBalance(userId);

  const {
    data: verifyData,
    isLoading: verifying,
    isError: verifyFailed,
    error: verifyError,
  } = useVerifyPurchase(reference, userId);

  const currentSeeds = Number(user?.seed_balance) || 0;
  const currentDemoBalance = Number(user?.demo_balance) || 0;

  // ── Guards ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!reference) setVerifyStep("no_reference");
  }, [reference]);

  useEffect(() => {
    if (verifyFailed) setVerifyStep("verify_error");
  }, [verifyFailed]);

  // ── Main chain ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!verifyData || hasStartedChain) return;

    // status is boolean true from your backend
    const statusVal = verifyData.status as unknown;
    const isSuccess =
      statusVal === true ||
      (typeof statusVal === "string" && statusVal.toLowerCase() === "success");

    if (!isSuccess) {
      setVerifyStep("payment_failed");
      return;
    }

    // Guard: if no meta or userId, just refresh and succeed
    if (!meta || !userId) {
      console.warn(
        "PaymentCallback: meta or userId missing, skipping fund calls",
        { meta, userId },
      );
      invalidateUser();
      sessionStorage.removeItem(PENDING_PURCHASE_KEY);
      setVerifyStep("success");
      return;
    }

    console.log("PaymentCallback: starting fund chain", {
      userId,
      naira: meta.naira,
      seeds: meta.seeds,
    });

    setHasStartedChain(true);

    // Step 1: fund-seed-balance — pass seeds count (not naira)
    setVerifyStep("funding_seed");
    fundSeed(
      { amount: String(meta.seeds), custom_user_id: userId },
      {
        onSuccess: (seedRes) => {
          console.log("fundSeed success:", seedRes);

          // Step 2: fund-demo-balance — pass naira amount
          setVerifyStep("funding_demo");
          fundDemo(
            { amount: String(meta.naira), custom_user_id: userId },
            {
              onSuccess: (demoRes) => {
                console.log("fundDemo success:", demoRes);
                sessionStorage.removeItem(PENDING_PURCHASE_KEY);

                // Wait for cache refetch to complete before showing success screen
                invalidateUser();
                setTimeout(() => {
                  setVerifyStep("success");
                }, 1200);
              },
              onError: (err) => {
                console.error("fundDemo error:", err);
                sessionStorage.removeItem(PENDING_PURCHASE_KEY);
                invalidateUser();
                setStepError(
                  typeof err === "string"
                    ? err
                    : "Seeds were credited but demo balance top-up failed. Please contact support.",
                );
                setVerifyStep("demo_error");
              },
            },
          );
        },
        onError: (err) => {
          console.error("fundSeed error:", err);
          sessionStorage.removeItem(PENDING_PURCHASE_KEY);
          invalidateUser();
          setStepError(
            typeof err === "string"
              ? err
              : "Payment verified but seed balance crediting failed. Please contact support with your reference.",
          );
          setVerifyStep("seed_error");
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyData]);

  // ── Loading ────────────────────────────────────────────────────────────
  const isLoading =
    verifyStep === "verifying" ||
    verifyStep === "funding_seed" ||
    verifyStep === "funding_demo" ||
    verifying;

  const STEP_LABELS: Record<string, { title: string; sub: string }> = {
    verifying: {
      title: "Verifying payment…",
      sub: "Confirming with Paystack. Do not close this tab.",
    },
    funding_seed: {
      title: "Crediting seeds…",
      sub: "Payment confirmed. Adding seeds to your balance.",
    },
    funding_demo: {
      title: "Topping up demo balance…",
      sub: "Almost done. Funding your practice account.",
    },
  };

  const activeLabel = STEP_LABELS[verifyStep] ?? STEP_LABELS.verifying;
  const STEPS = ["verifying", "funding_seed", "funding_demo"] as const;
  const stepIndex = STEPS.indexOf(verifyStep as (typeof STEPS)[number]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">{activeLabel.title}</h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            {activeLabel.sub}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < stepIndex
                    ? "bg-primary scale-100"
                    : i === stepIndex
                      ? "bg-primary animate-pulse scale-110"
                      : "bg-muted"
                }`}
              />
              {i < STEPS.length - 1 && (
                <div
                  className={`w-8 h-0.5 transition-all duration-300 ${
                    i < stepIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        {reference && (
          <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-1.5 rounded-full">
            Ref: {reference}
          </p>
        )}
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────
  if (verifyStep === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-6">
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">Payment Successful! 🎉</h2>
          <p className="text-sm text-muted-foreground">
            Your seeds and demo balance have been updated.
          </p>
        </div>
        <Card className="border w-full max-w-xs">
          <CardContent className="p-4 space-y-3">
            {meta && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Package</span>
                  <Badge variant="secondary">{meta.label}</Badge>
                </div>
                <div className="border-t" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Seeds purchased
                  </span>
                  <span className="font-bold text-primary">
                    +{meta.seeds} seeds
                  </span>
                </div>
                <div className="border-t" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Demo top-up
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    +₦{meta.naira.toLocaleString()}
                  </span>
                </div>
                <div className="border-t" />
              </>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Seed balance
                </span>
              </div>
              <span className="font-bold">{currentSeeds} seeds</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-muted-foreground">
                  Demo balance
                </span>
              </div>
              <span className="font-bold">
                ₦{currentDemoBalance.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
        <Button
          className="w-full max-w-xs"
          size="lg"
          onClick={() => setLocation("/dashboard")}
          data-testid="button-go-home"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  // ── Demo error ─────────────────────────────────────────────────────────
  if (verifyStep === "demo_error") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-6">
        <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">Seeds Credited ✓</h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Your payment succeeded and seeds were added. Demo balance top-up
            didn't complete — it may appear shortly or contact support.
          </p>
        </div>
        <Card className="border w-full max-w-xs">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Seed balance
                </span>
              </div>
              <span className="font-bold">{currentSeeds} seeds</span>
            </div>
            {stepError && (
              <>
                <div className="border-t" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stepError}
                </p>
              </>
            )}
            {reference && (
              <>
                <div className="border-t" />
                <div>
                  <p className="text-xs text-muted-foreground">Reference</p>
                  <p className="text-xs font-mono font-semibold break-all mt-0.5">
                    {reference}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Button
          className="w-full max-w-xs"
          size="lg"
          onClick={() => setLocation("/")}
          data-testid="button-go-home-demo-error"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  // ── Seed error ─────────────────────────────────────────────────────────
  if (verifyStep === "seed_error") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-6">
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">Credit Failed</h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            {stepError ||
              "Payment verified but we couldn't credit your seed balance. No further charge will occur — please contact support."}
          </p>
        </div>
        {reference && (
          <Card className="border w-full max-w-xs">
            <CardContent className="p-4 text-left space-y-1">
              <p className="text-xs text-muted-foreground">
                Save this reference for support
              </p>
              <p className="text-sm font-mono font-semibold break-all">
                {reference}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Email{" "}
                <a
                  href="mailto:support@growtt.com"
                  className="text-primary underline"
                >
                  support@growtt.com
                </a>
              </p>
            </CardContent>
          </Card>
        )}
        <div className="w-full max-w-xs space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={() => window.location.reload()}
            data-testid="button-retry-seed"
          >
            Retry
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setLocation("/")}
            data-testid="button-go-home-seed-error"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // ── Payment failed ─────────────────────────────────────────────────────
  if (verifyStep === "payment_failed") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-6">
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle className="w-12 h-12 text-destructive" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">Payment Failed</h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Payment could not be completed. No charges were made. Please try
            again.
          </p>
        </div>
        {reference && (
          <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-1.5 rounded-full">
            Ref: {reference}
          </p>
        )}
        <Button
          className="w-full max-w-xs"
          size="lg"
          onClick={() => setLocation("/")}
          data-testid="button-back-home-failed"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  // ── Verify error ───────────────────────────────────────────────────────
  if (verifyStep === "verify_error") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-6">
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">Verification Failed</h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            {typeof verifyError === "string"
              ? verifyError
              : "We couldn't verify your payment right now. Save your reference and contact support if money was deducted."}
          </p>
        </div>
        {reference && (
          <Card className="border w-full max-w-xs">
            <CardContent className="p-4 text-left space-y-1">
              <p className="text-xs text-muted-foreground">Payment Reference</p>
              <p className="text-sm font-mono font-semibold break-all">
                {reference}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Email{" "}
                <a
                  href="mailto:support@growtt.com"
                  className="text-primary underline"
                >
                  support@growtt.com
                </a>
              </p>
            </CardContent>
          </Card>
        )}
        <div className="w-full max-w-xs space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={() => window.location.reload()}
            data-testid="button-retry-verify"
          >
            Retry Verification
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setLocation("/")}
            data-testid="button-go-home-error"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // ── No reference ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-6">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-1">Invalid Page</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          This page is only accessible after completing a Paystack payment.
        </p>
      </div>
      <Button
        onClick={() => setLocation("/")}
        data-testid="button-go-home-invalid"
      >
        <Home className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
    </div>
  );
}
