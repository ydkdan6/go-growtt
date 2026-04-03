import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInvestmentAssetsApi, getInvestmentAssetByIdApi } from "../../api/general.api";
import type { UpdateInvestmentAssetPayload } from "../../types/general.types";
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

/**
 * Mutation to update an investment asset via PATCH /investment-asset/investment-asset/{id}/
 * Automatically invalidates the list and detail cache on success.
 *
 * Usage:
 *   const { mutate: updateAsset, isPending } = useUpdateInvestmentAsset();
 *   updateAsset({ id: "7cf280c0-...", payload: { price_per_unit: "1500" } });
 */
export const useUpdateInvestmentAsset = () => {
  const queryClient = useQueryClient();

  return useMutation<
    InvestmentAsset,
    string,
    { id: string; payload: UpdateInvestmentAssetPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      try {
        const { updateInvestmentAssetApi } = await import("../../api/general.api");
        const raw = await updateInvestmentAssetApi(id, payload);
        return adaptInvestmentAsset(raw);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    onSuccess: (updated) => {
      // Update the detail cache for this specific asset
      queryClient.setQueryData(investmentKeys.detail(updated.id), updated);
      // Invalidate the list so it refetches with the updated data
      queryClient.invalidateQueries({ queryKey: investmentKeys.list() });
    },
  });
};