import { useMutation, useQueryClient } from "@tanstack/react-query";
import { googleAuthApi } from "../../api/general.api";
import { parseApiError } from "../../utils/parseApiError";
import { authKeys } from "@/config/queryKeys";
import type { GoogleAuthPayload, GoogleAuthResponse } from "../../types/general.types";

interface UseGoogleAuthOptions {
  onSuccess?: (data: GoogleAuthResponse) => void;
  onError?: (errorMessage: string) => void;
}

/**
 * Hook to handle Google OAuth sign-in.
 *
 * Flow:
 *   1. User clicks "Sign in with Google"
 *   2. Google SDK returns an id_token
 *   3. Pass id_token to this hook → backend validates and returns app tokens
 *
 * Usage:
 *   const { mutate: googleSignIn, isPending } = useGoogleAuth({
 *     onSuccess: (data) => {
 *       if (data.user.is_new_user) navigate("/onboarding");
 *       else navigate("/dashboard");
 *     },
 *     onError: (msg) => toast.error(msg),
 *   });
 *
 *   // Call after getting id_token from Google SDK:
 *   googleSignIn({ id_token });
 */
export const useGoogleAuth = ({ onSuccess, onError }: UseGoogleAuthOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<GoogleAuthResponse, string, GoogleAuthPayload>({
    mutationFn: async (payload: GoogleAuthPayload) => {
      try {
        return await googleAuthApi(payload);
      } catch (err) {
        throw parseApiError(err);
      }
    },

    onSuccess: (data) => {
      // Invalidate any stale auth cache
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      onSuccess?.(data);
    },

    onError: (errorMessage) => {
      onError?.(errorMessage);
    },
  });
};