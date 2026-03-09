import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { OnboardingPayload, OnboardingStepPayload } from "@/types/auth.types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OnboardingContextValue {
  /** All accumulated answers so far */
  answers: OnboardingStepPayload;
  /** Merge new fields from the current step into answers */
  saveStep: (stepData: OnboardingStepPayload) => void;
  /** True when all 13 required fields are filled */
  isComplete: boolean;
  /** Reset answers (e.g. after successful submission) */
  reset: () => void;
}

// ─── Required fields — all 13 onboarding fields ──────────────────────────────

const REQUIRED_FIELDS: (keyof OnboardingPayload)[] = [
  "financial_literacy_level",
  "investment_goal_3_5_years",
  "investment_strategy",
  "investment_risk_response",
  "initial_investment_amount",
  "typical_investment_ticket_size",
  "starting_investment_amount",
  "current_investment_method",
  "investment_management_method",
  "preferred_learning_content",
  "liquidity_preference",
  "platform_engagement_level",
  "age_group",
];

// ─── Context ─────────────────────────────────────────────────────────────────

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<OnboardingStepPayload>({});

  const saveStep = useCallback((stepData: OnboardingStepPayload) => {
    setAnswers((prev) => ({ ...prev, ...stepData }));
  }, []);

  const reset = useCallback(() => {
    setAnswers({});
  }, []);

  const isComplete = REQUIRED_FIELDS.every(
    (field) => answers[field] !== undefined && answers[field] !== ""
  );

  return (
    <OnboardingContext.Provider value={{ answers, saveStep, isComplete, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useOnboardingContext() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboardingContext must be used inside <OnboardingProvider>");
  }
  return ctx;
}