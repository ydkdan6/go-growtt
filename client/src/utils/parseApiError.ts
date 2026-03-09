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
      // ── DRF non_field_errors ──────────────────────────────────────────────
      if (data.non_field_errors?.length) {
        return data.non_field_errors[0];
      }

      // ── Generic detail / message ──────────────────────────────────────────
      if (data.detail) return data.detail;
      if (data.message) return data.message;

      // ── Field-level errors — check email first for duplicate detection ────
      // DRF returns: { "email": ["user with this email address already exists."] }
      if (Array.isArray(data.email) && data.email.length > 0) {
        return `email: ${data.email[0]}`;
      }
      if (Array.isArray(data.password) && data.password.length > 0) {
        return `password: ${data.password[0]}`;
      }
      if (Array.isArray(data.confirm_password) && data.confirm_password.length > 0) {
        return `confirm_password: ${data.confirm_password[0]}`;
      }

      // ── Any other field-level error ───────────────────────────────────────
      const fieldErrors = Object.entries(data).find(
        ([, value]) => Array.isArray(value) && (value as unknown[]).length > 0
      );
      if (fieldErrors) {
        const [field, messages] = fieldErrors;
        return `${field}: ${(messages as string[])[0]}`;
      }

      // ── { "error": "..." } — Django commonly uses this key ─────
      if (typeof (data as any).error === "string" && (data as any).error.length > 0) {
        return (data as any).error;
      }

      // ── Any other flat string value ─────────────────────────────────
      const stringEntry = Object.entries(data).find(
        ([, value]) => typeof value === "string" && (value as string).length > 0
      );
      if (stringEntry) {
        return stringEntry[1] as string;
      }
    }

    // ── HTTP status fallbacks ─────────────────────────────────────────────
    if (error.response?.status === 400) {
      // 400 with unreadable body — try to stringify whatever came back
      if (data) {
        try {
          const raw = JSON.stringify(data);
          if (raw !== "{}") return `Request failed: ${raw}`;
        } catch {}
      }
      return "Invalid request. Please check your inputs.";
    }
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