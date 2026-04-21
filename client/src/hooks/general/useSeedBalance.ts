import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  buySeedApi,
  convertSeedFundApi,
  fundDemoBalanceApi,
  fundSeedBalanceApi,
  verifyPurchaseApi,
} from "../../api/general.api";
import type {
  SeedBalancePayload,
  BuySeedResponse,
  ConvertSeedFundResponse,
  FundDemoBalanceResponse,
  FundSeedBalanceResponse,
  VerifyPurchaseResponse,
} from "../../types/general.types";
import { parseApiError } from "../../utils/parseApiError";

// ─── Query Keys ───────────────────────────────────────────────────────────────
// Reuse the user detail key so balance invalidations refresh the profile cache
export const userKeys = {
  all:    ["user"] as const,
  detail: (id: string | number) => ["user", "detail", id] as const,
};

export const purchaseKeys = {
  verify: (reference: string) => ["purchase", "verify", reference] as const,
};

// ─── useBuySeed ───────────────────────────────────────────────────────────────
/**
 * Buy seeds with real money.
 * Invalidates user detail on success so seed/wallet balances refresh.
 *
 * Usage:
 *   const { mutate: buySeed, isPending } = useBuySeed(userId);
 *   buySeed({ amount: "500", custom_user_id: userId });
 */
export const useBuySeed = (userId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<BuySeedResponse, string, SeedBalancePayload>({
    mutationFn: async (payload) => {
      try {
        return await buySeedApi(payload);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    onSuccess: () => {
      // Refresh user detail so seed_balance / wallet_balance are up to date
      if (userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      } else {
        queryClient.invalidateQueries({ queryKey: userKeys.all });
      }
    },
  });
};

// ─── useConvertSeedFund ───────────────────────────────────────────────────────
/**
 * Convert wallet funds into seeds.
 * Invalidates user detail on success so both balances refresh.
 *
 * Usage:
 *   const { mutate: convertFund, isPending } = useConvertSeedFund(userId);
 *   convertFund({ amount: "200", custom_user_id: userId });
 */
export const useConvertSeedFund = (userId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<ConvertSeedFundResponse, string, SeedBalancePayload>({
    mutationFn: async (payload) => {
      try {
        return await convertSeedFundApi(payload);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      } else {
        queryClient.invalidateQueries({ queryKey: userKeys.all });
      }
    },
  });
};

// ─── useFundDemoBalance ───────────────────────────────────────────────────────
/**
 * Top up the user's demo (paper-trading) balance.
 * Invalidates user detail on success so demo_balance refreshes.
 *
 * Usage:
 *   const { mutate: fundDemo, isPending } = useFundDemoBalance(userId);
 *   fundDemo({ amount: "10000", custom_user_id: userId });
 */
export const useFundDemoBalance = (userId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<FundDemoBalanceResponse, string, SeedBalancePayload>({
    mutationFn: async (payload) => {
      try {
        return await fundDemoBalanceApi(payload);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      } else {
        queryClient.invalidateQueries({ queryKey: userKeys.all });
      }
    },
  });
};

// ─── useFundSeedBalance ───────────────────────────────────────────────────────
/**
 * Directly fund the user's seed balance (e.g. promo or admin grant).
 * Invalidates user detail on success so seed_balance refreshes.
 *
 * Usage:
 *   const { mutate: fundSeed, isPending } = useFundSeedBalance(userId);
 *   fundSeed({ amount: "50", custom_user_id: userId });
 */
export const useFundSeedBalance = (userId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<FundSeedBalanceResponse, string, SeedBalancePayload>({
    mutationFn: async (payload) => {
      try {
        return await fundSeedBalanceApi(payload);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      } else {
        queryClient.invalidateQueries({ queryKey: userKeys.all });
      }
    },
  });
};

// ─── useVerifyPurchase ────────────────────────────────────────────────────────
/**
 * Verify a payment reference and credit the user's seed balance.
 * Runs automatically when a valid reference is provided (e.g. after
 * Paystack redirect back to your app via ?reference=xxx in the URL).
 *
 * Invalidates user detail on success so seed_balance refreshes.
 *
 * Usage:
 *   const reference = new URLSearchParams(location.search).get("reference") ?? "";
 *   const { data, isLoading, isError } = useVerifyPurchase(reference, userId);
 */
export const useVerifyPurchase = (
  reference: string,
  userId?: string | number
) => {
  const queryClient = useQueryClient();

  return useQuery<VerifyPurchaseResponse, string>({
    queryKey: purchaseKeys.verify(reference),
    queryFn: async () => {
      try {
        return await verifyPurchaseApi(reference);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    // Only fire when we actually have a reference string
    enabled: Boolean(reference),
    // Never re-fetch — a reference is a one-time token; re-verifying could
    // double-credit the balance if the backend isn't idempotent
    staleTime: Infinity,
    gcTime:    1000 * 60 * 30, // keep in cache for 30 min
    // Invalidate user detail as a side-effect after successful verification
    // (useQuery doesn't have onSuccess in v5 — we handle this via select + effect,
    //  but the cleanest approach is to call invalidate inside the queryFn after success)
  });
};

/**
 * Call this after useVerifyPurchase succeeds to refresh user balances.
 * Pair it with a useEffect in your component:
 *
 *   const { data: verification } = useVerifyPurchase(reference, userId);
 *   const invalidateUser = useInvalidateUserAfterVerify(userId);
 *
 *   useEffect(() => {
 *     if (verification?.status === "success") invalidateUser();
 *   }, [verification]);
 */
export const useInvalidateUserAfterVerify = (userId?: string | number) => {
  const queryClient = useQueryClient();
  return () => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    } else {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    }
  };
};