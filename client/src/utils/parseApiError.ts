import { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/auth.types";

/**
 * Extracts a human-readable error message from an Axios error.
 * Handles Django REST Framework error shapes gracefully.
 */
export const parseApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data) {
      // DRF non-field errors
      if (data.non_field_errors?.length) {
        return data.non_field_errors[0];
      }

      // Generic detail / message
      if (data.detail) return data.detail;
      if (data.message) return data.message;

      // Field-level errors — return first one found
      const fieldErrors = Object.entries(data).find(
        ([, value]) => Array.isArray(value) && value.length > 0
      );
      if (fieldErrors) {
        const [field, messages] = fieldErrors;
        return `${field}: ${(messages as string[])[0]}`;
      }
    }

    // HTTP-level fallback
    if (error.response?.status === 400) return "Invalid request. Please check your inputs.";
    if (error.response?.status === 401) return "Unauthorized. Please sign in again.";
    if (error.response?.status === 403) return "You do not have permission to perform this action.";
    if (error.response?.status === 404) return "Resource not found.";
    if (error.response?.status === 409) return "An account with this email already exists.";
    if (error.response?.status && error.response.status >= 500)
      return "Server error. Please try again later.";

    if (error.code === "ECONNABORTED") return "Request timed out. Check your connection.";
    if (!error.response) return "Network error. Please check your internet connection.";
  }

  return "An unexpected error occurred. Please try again.";
};