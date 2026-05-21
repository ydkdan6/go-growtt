import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sellInvestmentApi } from "../../api/general.api";
import { portfolioKeys } from "./usePortfolio";
import { getStoredUserId } from "./useUserDetails";
import { parseApiError } from "@/utils/parseApiError";
import type { PortfolioInvestment } from "../../types/general.types";

export interface SellInput {
  investment: PortfolioInvestment;
  earningsPct: number;
  rateUsed: number;
}

export const useInvestmentSell = () => {
  const queryClient = useQueryClient();
  const userId = getStoredUserId();

  return useMutation<void, string, SellInput>({
    mutationFn: async ({ investment, earningsPct, rateUsed }) => {
      const payload = {
        custom_user_id:      String(userId),
        investment_asset_id: investment.id,
        initial_amount:      Number(investment.amount ?? 0),
        last_change_percent: earningsPct,
        last_rate_used:      rateUsed,
        status:              true,
        pub_date:            new Date().toISOString(),
      };
      try {
        await sellInvestmentApi(payload);
      } catch (err) {
        throw parseApiError(err);
      }
    },

    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: portfolioKeys.detail(userId) });
    },
  });
};
