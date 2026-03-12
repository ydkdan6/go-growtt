import { useMutation } from "@tanstack/react-query";
import { signUpApi } from "../../api/general.api";
import { parseApiError } from "../../utils/parseApiError";
import type { SignUpPayload, SignUpResponse } from "../../types/general.types";

interface UseSignUpOptions {
  onSuccess?: (data: SignUpResponse) => void;
  onError?: (errorMessage: string) => void;
}

/**
 * Hook to handle user sign-up.
 *
 * Usage:
 *   const { mutate: signUp, isPending, error } = useSignUp({
 *     onSuccess: (data) => navigate("/verify"),
 *     onError: (msg) => toast.error(msg),
 *   });
 *
 *   signUp({ email, password, confirm_password });
 */
export const useSignUp = ({ onSuccess, onError }: UseSignUpOptions = {}) => {
  return useMutation<SignUpResponse, string, SignUpPayload>({
    mutationFn: signUpApi,

    onSuccess: (data) => {
      onSuccess?.(data);
    },

    onError: (rawError) => {
      // rawError is already the parsed string because of throwOnError transform below
      onError?.(rawError);
    },

    // Transform AxiosError → readable string before it hits onError / error state
    throwOnError: false,

    // Custom meta so we can parse inside the mutation itself
    meta: { parseError: true },
  });
};

/**
 * Wrapper that ensures the error is parsed before being thrown.
 * Use this variant if you want the mutation's `error` state to be a string.
 */
export const useSignUpWithParsedError = (options: UseSignUpOptions = {}) => {
  const mutation = useMutation<SignUpResponse, string, SignUpPayload>({
    mutationFn: async (payload: SignUpPayload) => {
      try {
        return await signUpApi(payload);
      } catch (err) {
        throw parseApiError(err); // always throws a string
      }
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  });

  return mutation;
};