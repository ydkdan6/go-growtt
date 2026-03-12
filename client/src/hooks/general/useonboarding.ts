import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardUserApi } from "../../api/general.api";
import { parseApiError } from "../../utils/parseApiError";
import { onboardingKeys, authKeys } from "@/config/queryKeys";
import type { OnboardingStepPayload, OnboardingResponse } from "../../types/general.types";

interface UseOnboardingOptions {
  userId: string | number;
  onSuccess?: (data: OnboardingResponse) => void;
  onError?: (errorMessage: string) => void;
}

/**
 * Hook to submit onboarding data for a user (PUT).
 *
 * Design:
 *   - Each onboarding step calls mutate() with only its own fields (partial payload).
 *   - The final step sends the full accumulated payload.
 *   - userId comes from the signed-in user in localStorage or auth state.
 *
 * Usage:
 *   const { mutate: submitStep, isPending } = useOnboarding({
 *     userId: user.id,
 *     onSuccess: () => navigate("/Onboarding/step2"),
 *     onError: (msg) => toast.error(msg),
 *   });
 *
 *   submitStep({ financial_literacy_level: "beginner" });
 *
 * Final step usage:
 *   submitStep({
 *     financial_literacy_level: "beginner",
 *     investment_goal_3_5_years: "wealth_building",
 *     ... all other fields
 *   });
 */
export const useOnboarding = ({ userId, onSuccess, onError }: UseOnboardingOptions) => {
  const queryClient = useQueryClient();

  return useMutation<OnboardingResponse, string, OnboardingStepPayload>({
    mutationFn: async (payload: OnboardingStepPayload) => {
      try {
        return await onboardUserApi({ userId, payload });
      } catch (err) {
        throw parseApiError(err);
      }
    },

    onSuccess: (data) => {
      // Invalidate onboarding cache for this user so profile reflects updates
      queryClient.invalidateQueries({
        queryKey: onboardingKeys.user(userId),
      });
      // Also refresh auth state since onboarding status may affect user object
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      onSuccess?.(data);
    },

    onError: (errorMessage) => {
      onError?.(errorMessage);
    },
  });
};