import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInApi } from "../../api/auth.api";
import { parseApiError } from "../../utils/parseApiError";
import { authKeys } from "@/config/queryKeys";
import type { SignInPayload, SignInResponse } from "../../types/auth.types";

interface UseSignInOptions {
  onSuccess?: (data: SignInResponse) => void;
  onError?: (errorMessage: string) => void;
}

/**
 * Hook to handle user sign-in.
 *
 * On success:
 *   - Stores tokens in localStorage (handled inside signInApi)
 *   - Invalidates any stale auth-related cache
 *
 * Usage:
 *   const { mutate: signIn, isPending } = useSignIn({
 *     onSuccess: () => navigate("/dashboard"),
 *     onError: (msg) => toast.error(msg),
 *   });
 *
 *   signIn({ email, password });
 */
export const useSignIn = ({ onSuccess, onError }: UseSignInOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<SignInResponse, string, SignInPayload>({
    mutationFn: async (payload: SignInPayload) => {
      try {
        return await signInApi(payload);
      } catch (err) {
        throw parseApiError(err);
      }
    },

    onSuccess: (data) => {
      // Invalidate any cached user/auth data so next fetch is fresh
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      onSuccess?.(data);
    },

    onError: (errorMessage) => {
      onError?.(errorMessage);
    },
  });
};