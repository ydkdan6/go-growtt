import { apiClient } from "../lib/axios";
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
  Portfolio,
  ApiBook,
  ApiLesson,
  ApiModule,
  ApiBlog,
  ApiInvestmentAsset,
  UpdateInvestmentAssetPayload,
  SeedBalancePayload,
  BuySeedResponse,
  ConvertSeedFundResponse,
  FundDemoBalanceResponse,
  FundSeedBalanceResponse,
  VerifyPurchaseResponse,
} from "../types/general.types";

const AUTH_ENDPOINTS = {
  SIGN_UP:    "/custom-user/sign-up/",
  SIGN_IN:    "/custom-user/sign-in/",
  VERIFY:     "/custom-user/verify/",
  GOOGLE_AUTH:"/custom-user/auth/google/",
  ONBOARD:    (userId: string | number) => `/custom-user/onboard/${userId}/`,
  GET_USER:   (userId: string | number) => `/custom-user/get-user-detail/${userId}/`,
} as const;

//  ─ Sign Up                                  
export const signUpApi = async (payload: SignUpPayload): Promise<SignUpResponse> => {
  const { data } = await apiClient.post<SignUpResponse>(AUTH_ENDPOINTS.SIGN_UP, payload);
  return data;
};

//  ─ Sign In                                  
export const signInApi = async (payload: SignInPayload): Promise<SignInResponse> => {
  const { data } = await apiClient.post<SignInResponse>(AUTH_ENDPOINTS.SIGN_IN, payload);

  if (data.token) localStorage.setItem("access_token", data.token);
  if (data.id)    localStorage.setItem("user_id", String(data.id));

  return data;
};

//  ─ Forgotten Password                            ─
export const forgotPasswordApi = async (email: string): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/custom-user/forgot-password/", { email });
  return data;
};

export const resetPasswordApi = async (payload: {
  otp_code: string;
  password: string;
  email: string;
}): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/custom-user/reset-password/", payload);
  return data;
};

//  ─ Verify OTP                                ─
export const verifyApi = async (payload: VerifyPayload): Promise<VerifyResponse> => {
  try {
    const { data } = await apiClient.post<VerifyResponse>(AUTH_ENDPOINTS.VERIFY, payload);

    if ((data as any).user?.id)      localStorage.setItem("user_id",      String((data as any).user.id));
    if ((data as any).user_id)       localStorage.setItem("user_id",      String((data as any).user_id));
    if ((data as any).access_token)  localStorage.setItem("access_token", (data as any).access_token);

    return data;
  } catch (err: any) {
    console.log("verify error response:", err.response?.data);
    throw err;
  }
};

//  ─ Google Auth                                
export const googleAuthApi = async (payload: GoogleAuthPayload): Promise<GoogleAuthResponse> => {
  const { data } = await apiClient.post<GoogleAuthResponse>(AUTH_ENDPOINTS.GOOGLE_AUTH, payload);

  if (data.access_token)  localStorage.setItem("access_token",  data.access_token);
  if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
  if (data.user?.id)      localStorage.setItem("user_id",       String(data.user.id));

  return data;
};

//  ─ Onboarding (PUT)                             ─
export const onboardUserApi = async ({
  userId,
  payload,
}: {
  userId: string | number;
  payload: OnboardingStepPayload;
}): Promise<OnboardingResponse> => {
  const { data } = await apiClient.put<OnboardingResponse>(AUTH_ENDPOINTS.ONBOARD(userId), payload);
  return data;
};

//  ─ Get User Detail
export const getUserDetailApi = async (userId: string | number): Promise<UserDetail> => {
  const { data } = await apiClient.get<UserDetail>(AUTH_ENDPOINTS.GET_USER(userId));
  return data;
};

//  ─ Update User Profile
export const updateUserProfileApi = async (
  userId: string,
  payload: { full_name?: string; phone_number?: string; address?: string }
): Promise<UserDetail> => {
  const { data } = await apiClient.put<UserDetail>(`/custom-user/update/${userId}/`, payload);
  return data;
};

//  ─ Update User Profile Image
export const updateUserImageApi = async (
  userId: string,
  imageFile: File
): Promise<UserDetail> => {
  const form = new FormData();
  form.append("image", imageFile);
  form.append("user_id", userId);
  const { data } = await apiClient.put<UserDetail>(
    `/custom-user/update/user-image/${userId}/`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

//  ─ Books                                   
export const getBooksApi = async (): Promise<ApiBook[]> => {
  const { data } = await apiClient.get<ApiBook[]>("/book/book/");
  return data;
};

//  ─ Lessons                                  
export const getLessonsApi = async (): Promise<ApiLesson[]> => {
  const { data } = await apiClient.get<ApiLesson[]>("/learn/lessons/");
  return data;
};

export const getLessonByIdApi = async (id: string): Promise<ApiLesson> => {
  const { data } = await apiClient.get<ApiLesson>(`/learn/lessons/${id}/`);
  return data;
};

//  ─ Modules                                  
export const getModulesApi = async (): Promise<ApiModule[]> => {
  const { data } = await apiClient.get<ApiModule[]>("/learn/modules/");
  return data;
};

export const getModulesTrackApi = async (
  moduleId: string,
  customUserId: string | number
): Promise<ApiModule> => {
  const { data } = await apiClient.get<ApiModule>(`/learn/modules-track/${moduleId}/${customUserId}/`);
  return data;
};

export const getLessonsTrackApi = async (
  lessonId: string,
  customUserId: string | number
): Promise<ApiLesson> => {
  const { data } = await apiClient.get<ApiLesson>(`/learn/lessons-track/${lessonId}/${customUserId}/`);
  return data;
};

export const completeLessonApi = async (
  lessonId: string,
  customUserId: string | number,
  lesson: {
    title: string;
    track: string;
    content: string;
    duration: string;
    lesson_count: string;
    required_seed: string;
    pub_date: string;
  }
): Promise<void> => {
  await apiClient.put(`/learn/lessons-track/${lessonId}/${customUserId}/`, {
    ...lesson,
    status: true,
  });
};

//  ─ Blogs                                   
export const getBlogsApi = async (): Promise<ApiBlog[]> => {
  const { data } = await apiClient.get<ApiBlog[]>("/blog/blog/");
  return data;
};

export const getBlogByIdApi = async (id: string): Promise<ApiBlog> => {
  const { data } = await apiClient.get<ApiBlog>(`/blog/blog/${id}/`);
  return data;
};

//  ─ Portfolio                                 
export const getPortfolioApi = async (userId: string | number): Promise<Portfolio> => {
  const { data } = await apiClient.get<Portfolio>(`/custom-user/get-investments/${userId}/`);
  return data;
};

//  ─ Investment Assets                             
export const getInvestmentAssetsApi = async (): Promise<ApiInvestmentAsset[]> => {
  const { data } = await apiClient.get<ApiInvestmentAsset[]>("/investment-asset/investment-asset/");
  return data;
};

export const getInvestmentAssetByIdApi = async (id: string): Promise<ApiInvestmentAsset> => {
  const { data } = await apiClient.get<ApiInvestmentAsset>(`/investment-asset/investment-asset/${id}/`);
  return data;
};

export const updateInvestmentAssetApi = async (
  id: string,
  payload: UpdateInvestmentAssetPayload
): Promise<ApiInvestmentAsset> => {
  const { data } = await apiClient.put<ApiInvestmentAsset>(
    `/investment-asset/investment-asset/${id}/`,
    payload
  );
  return data;
};

//  ─ Seeds & Balances                             ─

/**
 * Buy seeds with real money.
 * POST /custom-user/buy-seed/
 *
 * Usage:
 *   await buySeedApi({ amount: "500", custom_user_id: userId });
 */
export const buySeedApi = async (payload: SeedBalancePayload): Promise<BuySeedResponse> => {
  const { data } = await apiClient.post<BuySeedResponse>("/custom-user/buy-seed/", payload);
  return data;
};

/**
 * Convert wallet funds into seeds.
 * POST /custom-user/convert-seed-fund/
 *
 * Usage:
 *   await convertSeedFundApi({ amount: "200", custom_user_id: userId });
 */
export const convertSeedFundApi = async (
  payload: SeedBalancePayload
): Promise<ConvertSeedFundResponse> => {
  const { data } = await apiClient.post<ConvertSeedFundResponse>(
    "/custom-user/convert-seed-fund/",
    payload
  );
  return data;
};

/**
 * Top up the user's demo (paper-trading) balance.
 * POST /custom-user/fund-demo-balance/
 *
 * Usage:
 *   await fundDemoBalanceApi({ amount: "10000", custom_user_id: userId });
 */
export const fundDemoBalanceApi = async (
  payload: SeedBalancePayload
): Promise<FundDemoBalanceResponse> => {
  const { data } = await apiClient.post<FundDemoBalanceResponse>(
    "/custom-user/fund-demo-balance/",
    payload
  );
  return data;
};

/**
 * Directly fund the user's seed balance (e.g. admin grant or promo).
 * POST /custom-user/fund-seed-balance/
 *
 * Usage:
 *   await fundSeedBalanceApi({ amount: "50", custom_user_id: userId });
 */
export const fundSeedBalanceApi = async (
  payload: SeedBalancePayload
): Promise<FundSeedBalanceResponse> => {
  const { data } = await apiClient.post<FundSeedBalanceResponse>(
    "/custom-user/fund-seed-balance/",
    payload
  );
  return data;
};

/**
 * Verify a Paystack/Flutterwave payment by reference and credit the user's seed balance.
 * GET /custom-user/verify-purchase/{reference}/
 *
 * Usage:
 *   const result = await verifyPurchaseApi("PAY_REF_abc123");
 *   if (result.status === "success") { ... }
 */
export const verifyPurchaseApi = async (reference: string): Promise<VerifyPurchaseResponse> => {
  const { data } = await apiClient.get<VerifyPurchaseResponse>(
    `/custom-user/verify-purchase/${reference}/`
  );
  return data;
};