import { useQuery } from "@tanstack/react-query";
import { getPortfolioApi } from "../../api/general.api";
import { getStoredUserId } from "./useUserDetails";
import { parseApiError } from "../../utils/parseApiError";
import type { Portfolio } from "../../types/general.types";

export const portfolioKeys = {
  all:    ["portfolio"] as const,
  detail: (userId: string | number) => [...portfolioKeys.all, String(userId)] as const,
};

/**
 * Fetches the user's portfolio from GET /custom-user/get-investments/{user_id}/
 *
 * Returns:
 *   - portfolio_value: total value of all holdings (number)
 *   - investments: array of held assets (shape TBD when backend populates)
 *
 * Usage:
 *   const { data: portfolio, isLoading } = usePortfolio();
 *   portfolio?.portfolio_value  // total ₦ value
 *   portfolio?.investments      // array of positions
 */
export const usePortfolio = (userId?: string | number) => {
  const id = userId ?? getStoredUserId();

  return useQuery<Portfolio, string>({
    queryKey: portfolioKeys.detail(id),
    queryFn: async () => {
      try {
        return await getPortfolioApi(id);
      } catch (err) {
        const { parseApiError: parse } = await import("../../utils/parseApiError");
        throw parse(err);
      }
    },
    enabled:   Boolean(id),
    staleTime: 1000 * 60 * 2,   // 2 min — portfolio value changes with market
    gcTime:    1000 * 60 * 10,
  });
};