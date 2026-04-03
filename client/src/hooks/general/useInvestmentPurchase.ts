import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import { investmentKeys } from "./useInvestmentassets";
import { portfolioKeys } from "./usePortfolio";
import { getStoredUserId } from "./useUserDetails";
import { parseApiError } from "@/utils/parseApiError";
import type { InvestmentAsset } from "../../types/general.types";

export interface PurchaseInput {
  asset: InvestmentAsset;
  amount: number;
  units: number;
}

/**
 * Purchase an asset via POST /custom-user/add-investment/
 * Then refetch portfolio from GET /custom-user/get-investments/{user_id}/
 */
export const useInvestmentPurchase = () => {
  const queryClient = useQueryClient();
  const userId = getStoredUserId();

  return useMutation<void, string, PurchaseInput>({
    mutationFn: async ({ asset, amount }) => {
      try {
        await apiClient.put("/custom-user/add-investment/", {
          custom_user_id:      userId,
          investment_asset_id: asset.id,
          initial_amount:      String(amount),
          status:              true,
          pub_date:            new Date().toISOString(),
        });
      } catch (err) {
        throw parseApiError(err);
      }
    },

    onSuccess: () => {
      // Refetch portfolio so portfolio_value reflects the real server value
      queryClient.refetchQueries({ queryKey: portfolioKeys.detail(userId) });
      // Invalidate asset list in case status changed
      queryClient.invalidateQueries({ queryKey: investmentKeys.list() });
    },
  });
};