import { useQuery } from "@tanstack/react-query";
import { getInvestmentAssetsApi, getInvestmentAssetByIdApi } from "../../api/general.api";
import { adaptInvestmentAsset } from "../../types/general.types";
import type { InvestmentAsset } from "../../types/general.types";
import { parseApiError } from "../../utils/parseApiError";

export const investmentKeys = {
  all:        ["investment-assets"] as const,
  list:       () => [...investmentKeys.all, "list"] as const,
  detail:     (id: string) => [...investmentKeys.all, "detail", id] as const,
  byCategory: (cat: string) => [...investmentKeys.all, "category", cat] as const,
};

/**
 * Fetches all investment assets from GET /investment-asset/investment-asset/
 *
 * Usage:
 *   const { data: assets = [], isLoading } = useInvestmentAssets();
 *
 * Filter by category:
 *   const stocks = assets.filter(a => a.category === "Stocks");
 */
export const useInvestmentAssets = () => {
  return useQuery<InvestmentAsset[], string>({
    queryKey: investmentKeys.list(),
    queryFn: async () => {
      try {
        const raw = await getInvestmentAssetsApi();
        return raw.map(adaptInvestmentAsset);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    staleTime: 1000 * 60 * 5,   // 5 min — prices change
    gcTime:    1000 * 60 * 15,
  });
};

/**
 * Returns assets filtered to a specific category.
 * Same cache as useInvestmentAssets() — no extra request.
 *
 * Usage:
 *   const { data: assets } = useInvestmentAssetsByCategory("Crypto");
 */
export const useInvestmentAssetsByCategory = (category: string) => {
  const query = useInvestmentAssets();
  return {
    ...query,
    data: (query.data ?? []).filter(
      (a) => a.category.toLowerCase() === category.toLowerCase()
    ),
  };
};

/**
 * Fetches a single investment asset by ID.
 *
 * Usage:
 *   const { data: asset, isLoading } = useInvestmentAssetById("7cf280c0-...");
 */
export const useInvestmentAssetById = (id: string) => {
  return useQuery<InvestmentAsset, string>({
    queryKey: investmentKeys.detail(id),
    queryFn: async () => {
      try {
        const raw = await getInvestmentAssetByIdApi(id);
        return adaptInvestmentAsset(raw);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    enabled:   Boolean(id),
    staleTime: 1000 * 60 * 5,
    gcTime:    1000 * 60 * 15,
  });
};