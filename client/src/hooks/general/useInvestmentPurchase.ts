import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInvestmentAssetApi } from "../../api/general.api";
import { adaptInvestmentAsset } from "../../types/general.types";
import { investmentKeys } from "./useInvestmentassets";
import { portfolioKeys } from "./usePortfolio";
import { parseApiError } from "../../utils/parseApiError";
import type { InvestmentAsset } from "../../types/general.types";

export interface PurchaseInput {
  asset: InvestmentAsset; // full asset object so we have the id
  amount: number;         // naira amount user entered
  units: number;          // calculated: amount / price_per_unit
}

/**
 * Executes a purchase by PATCHing the asset via:
 *   PATCH /investment-asset/investment-asset/{id}/
 *
 * Sends the relevant fields back so the backend can record the transaction.
 * On success: updates the asset detail cache + invalidates portfolio cache.
 *
 * Usage:
 *   const { mutate: purchase, isPending } = useInvestmentPurchase();
 *   purchase({ asset, amount: 10000, units: 6.67 });
 */
export const useInvestmentPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation<InvestmentAsset, string, PurchaseInput>({
    mutationFn: async ({ asset, amount, units }) => {
      try {
        const raw = await updateInvestmentAssetApi(asset.id, {
          // Send back the fields the backend needs to record the purchase.
          // price_per_unit, percent_growth, status are re-sent as-is to
          // preserve existing values while the backend logs the transaction.
          price_per_unit:  asset.pricePerUnit !== null ? String(asset.pricePerUnit) : undefined,
          percent_growth:  asset.percentGrowth !== null ? String(asset.percentGrowth) : undefined,
          status:          true, // asset remains active after purchase
          // Pass purchase context in tags field until backend adds a
          // dedicated purchase endpoint — amount & units for the backend to parse
          tags: asset.tags
            ? `${asset.tags}, amount:${amount}, units:${units}`
            : `amount:${amount}, units:${units}`,
        });
        return adaptInvestmentAsset(raw);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    onSuccess: (updated) => {
      // Update this asset in the detail cache
      queryClient.setQueryData(investmentKeys.detail(updated.id), updated);
      // Invalidate list cache so asset cards reflect any changes
      queryClient.invalidateQueries({ queryKey: investmentKeys.list() });
      // Refresh portfolio value
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
};