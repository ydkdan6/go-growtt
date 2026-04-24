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

//  ─ Query Keys                                ─
export const userKeys = {
  all:    ["user"] as const,
  detail: (id: string | number) => ["user", "detail", id] as const,
};

export const purchaseKeys = {
  verify: (reference: string) => ["purchase", "verify", reference] as const,
};

//  ─ useBuySeed                                ─
/**
 * Initiates a seed purchase via Paystack.
 * The API returns { payment_url, reference } — the component
 * redirects the user to payment_url for Paystack checkout.
 * Cache invalidation happens AFTER verify-purchase succeeds on return.
 */
export const useBuySeed = () => {
  return useMutation<BuySeedResponse, string, SeedBalancePayload>({
    mutationFn: async (payload) => {
      try {
        return await buySeedApi(payload);
      } catch (err) {
        throw parseApiError(err);
      }
    },
  });
};

//  ─ useConvertSeedFund                            ─
/**
 * Convert wallet funds into seeds.
 * Invalidates user detail on success so both balances refresh.
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

//  ─ useFundDemoBalance                            ─
/**
 * Top up the user's demo (paper-trading) balance.
 * Called after verify-purchase succeeds in the PaymentCallback page.
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

//  ─ useFundSeedBalance                            ─
/**
 * Directly fund the user's seed balance (e.g. promo or admin grant).
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

//  ─ useVerifyPurchase                             
export const useVerifyPurchase = (
  reference: string,
  userId?: string | number
) => {
  const queryClient = useQueryClient();

  return useQuery<VerifyPurchaseResponse, string>({
    queryKey: purchaseKeys.verify(reference),
    queryFn: async () => {
      try {
        const result = await verifyPurchaseApi(reference);
        if (userId) {
          queryClient.refetchQueries({ queryKey: userKeys.detail(userId) }); // ← refetch not invalidate
        } else {
          queryClient.refetchQueries({ queryKey: userKeys.all });
        }
        return result;
      } catch (err) {
        throw parseApiError(err);
      }
    },
    enabled:   Boolean(reference),
    staleTime: Infinity,
    gcTime:    1000 * 60 * 30,
    retry:     1,
  });
};

//  ─ useInvalidateUserAfterVerify                       ─
/**
 * Returns a stable function that force-refreshes the user detail cache.
 * Call after fundDemoBalance resolves in PaymentCallback to ensure
 * the home screen shows updated balances immediately.
 */
export const useInvalidateUserAfterVerify = (userId?: string | number) => {
  const queryClient = useQueryClient();
  return () => {
    if (userId) {
      // refetchQueries forces an immediate re-fetch, not just a stale mark
      queryClient.refetchQueries({ queryKey: userKeys.detail(userId) });
    } else {
      queryClient.refetchQueries({ queryKey: userKeys.all });
    }
  };
};