import { apiClient } from "../lib/axios";
import { ApiBook } from "../types/general.types";
import { ApiLesson } from "../types/general.types";
import { ApiModule } from "../types/general.types";
import { ApiBlog } from "../types/general.types";
import { ApiInvestmentAsset } from "../types/general.types";
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
} from "../types/general.types";

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
  try {
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

} catch (err: any) {
    console.log("verify error response:", err.response?.data); 
    throw err;
  }
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

// Get Learning Content (GET)
export const getLessonsApi = async (): Promise<ApiLesson[]> => {
  const { data } = await apiClient.get<ApiLesson[]>("/learn/lessons/");
  return data;
};

//Get Lessons Modules

export const getModulesApi = async (): Promise<ApiModule[]> => {
  const { data } = await apiClient.get<ApiModule[]>("/learn/modules/");
  return data;
};


//Blog ApI

export const getBlogsApi = async (): Promise<ApiBlog[]> => {
  const { data } = await apiClient.get<ApiBlog[]>("/blog/blog/");
  return data;
};

export const getBlogByIdApi = async (id: string): Promise<ApiBlog> => {
  const { data } = await apiClient.get<ApiBlog>(`/blog/blog/${id}/`);
  return data;
};

//get investment assets

export const getInvestmentAssetsApi = async (): Promise<ApiInvestmentAsset[]> => {
  const { data } = await apiClient.get<ApiInvestmentAsset[]>("/investment-asset/investment-asset/");
  return data;
};

export const getInvestmentAssetByIdApi = async (id: string): Promise<ApiInvestmentAsset> => {
  const { data } = await apiClient.get<ApiInvestmentAsset>(`/investment-asset/investment-asset/${id}/`);
  return data;
};