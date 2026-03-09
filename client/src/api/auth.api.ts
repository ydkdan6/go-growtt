import { apiClient } from "../lib/axios";
import { ApiBook } from "../types/auth.types";
import type {
  SignUpPayload,
  SignUpResponse,
  SignInPayload,
  SignInResponse,
  VerifyPayload,
  VerifyResponse,
  GoogleAuthPayload,
  GoogleAuthResponse,
  OnboardingStepPayload,
  OnboardingResponse,
  UserDetail,
} from "../types/auth.types";

const AUTH_ENDPOINTS = {
  SIGN_UP: "/custom-user/sign-up/",
  SIGN_IN: "/custom-user/sign-in/",
  VERIFY: "/custom-user/verify/",
  GOOGLE_AUTH: "/custom-user/auth/google/",
  ONBOARD: (userId: string | number) => `/custom-user/onboard/${userId}/`,
  GET_USER: (userId: string | number) => `/custom-user/get-user-detail/${userId}/`,
} as const;

// ─── Sign Up ────────────────────────────────────────────────────────────────
export const signUpApi = async (payload: SignUpPayload): Promise<SignUpResponse> => {
  const { data } = await apiClient.post<SignUpResponse>(
    AUTH_ENDPOINTS.SIGN_UP,
    payload
  );
  return data;
};

// ─── Sign In ─────────────────────────────────────────────────────────────────
export const signInApi = async (payload: SignInPayload): Promise<SignInResponse> => {
  const { data } = await apiClient.post<SignInResponse>(
    AUTH_ENDPOINTS.SIGN_IN,
    payload
  );

  // ✅ Real response: { token, id } — store both
  if (data.token) {
    localStorage.setItem("access_token", data.token);
  }
  if (data.id) {
    localStorage.setItem("user_id", String(data.id));
  }

  return data;
};

// ─── Verify ──────────────────────────────────────────────────────────────────
export const verifyApi = async (payload: VerifyPayload): Promise<VerifyResponse> => {
  const { data } = await apiClient.post<VerifyResponse>(
    AUTH_ENDPOINTS.VERIFY,
    payload
  );

  // ✅ Some backends return user_id or tokens on verify — store if present
  if ((data as any).user?.id) {
    localStorage.setItem("user_id", String((data as any).user.id));
  }
  if ((data as any).user_id) {
    localStorage.setItem("user_id", String((data as any).user_id));
  }
  if ((data as any).access_token) {
    localStorage.setItem("access_token", (data as any).access_token);
  }

  return data;
};

// ─── Google Auth ──────────────────────────────────────────────────────────────
export const googleAuthApi = async (
  payload: GoogleAuthPayload
): Promise<GoogleAuthResponse> => {
  const { data } = await apiClient.post<GoogleAuthResponse>(
    AUTH_ENDPOINTS.GOOGLE_AUTH,
    payload
  );

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }
  // ✅ Store user_id
  if (data.user?.id) {
    localStorage.setItem("user_id", String(data.user.id));
  }

  return data;
};

// ─── Onboarding (PUT) ─────────────────────────────────────────────────────────
export const onboardUserApi = async ({
  userId,
  payload,
}: {
  userId: string | number;
  payload: OnboardingStepPayload;
}): Promise<OnboardingResponse> => {
  const { data } = await apiClient.put<OnboardingResponse>(
    AUTH_ENDPOINTS.ONBOARD(userId),
    payload
  );
  return data;
};

// ─── Get User Detail (GET) ────────────────────────────────────────────────────
export const getUserDetailApi = async (
  userId: string | number
): Promise<UserDetail> => {
  const { data } = await apiClient.get<UserDetail>(
    AUTH_ENDPOINTS.GET_USER(userId)
  );
  return data;
};

// Get Books (GET)
export const getBooksApi = async (): Promise<ApiBook[]> => {
  const { data } = await apiClient.get<ApiBook[]>("/book/book/");
  return data;
};