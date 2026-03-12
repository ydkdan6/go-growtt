import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyApi } from "../../api/general.api";
import { parseApiError } from "../../utils/parseApiError";
import { authKeys } from "@/config/queryKeys";
import type { VerifyPayload, VerifyResponse } from "../../types/general.types";

interface UseVerifyOptions {
  onSuccess?: (data: VerifyResponse) => void;
  onError?: (errorMessage: string) => void;
}

/**
 * Hook to handle email verification after sign-up.
 * Payload: { otp: "12345", email: "user@example.com" }
 */
export const useVerify = ({ onSuccess, onError }: UseVerifyOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<VerifyResponse, string, VerifyPayload>({
    mutationFn: async (payload: VerifyPayload) => {
      try {
        return await verifyApi(payload);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      onSuccess?.(data);
    },
    onError: (errorMessage) => {
      onError?.(errorMessage);
    },
  });
};