// ─── Sign Up ────────────────────────────────────────────────────────────────

export interface SignUpPayload {
  email: string;
  password: string;
  confirm_password: string;
}

export interface SignUpResponse {
  message: string;
  email?: string;
  detail?: string;
}

// ─── Sign In ────────────────────────────────────────────────────────────────

export interface SignInPayload {
  email: string;
  password: string;
}

// ✅ Sign-in returns ONLY token + id — fetch full user separately via useUserDetail
export interface SignInResponse {
  token: string;
  id: string;
}

// ─── Verify ─────────────────────────────────────────────────────────────────

export interface VerifyPayload {
  otp_code: string;    
  email: string;
}

export interface VerifyResponse {
  message: string;
  detail?: string;
}

// ─── Google Auth ─────────────────────────────────────────────────────────────

export interface GoogleAuthPayload {
  id_token: string; // Google ID token from Google Sign-In SDK
}

export interface GoogleAuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string | number;
    email: string;
    is_verified?: boolean;
    is_new_user?: boolean; // flag to redirect to onboarding if first sign-in
    [key: string]: unknown;
  };
  detail?: string;
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export interface OnboardingPayload {
  financial_literacy_level: string;
  investment_goal_3_5_years: string;
  investment_strategy: string;
  investment_risk_response: string;
  initial_investment_amount: string;
  typical_investment_ticket_size: string;
  starting_investment_amount: string;
  current_investment_method: string;
  investment_management_method: string;
  preferred_learning_content: string;
  liquidity_preference: string;
  platform_engagement_level: string;
  age_group: string;
}

// Onboarding is submitted step by step — all fields are optional per step
export type OnboardingStepPayload = Partial<OnboardingPayload>;

export interface OnboardingResponse {
  message: string;
  user_id?: string | number;
  detail?: string;
}

// ─── User Detail ─────────────────────────────────────────────────────────────

export interface UserDetail {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
  full_name: string | null;
  phone_number: string | null;
  address: string | null;
  wallet_balance: string | null;
  demo_balance: string | null;
  otp_code: string | null;
  account_type: string | null;
  // Onboarding fields
  financial_literacy_level: string | null;
  investment_goal_3_5_years: string | null;
  investment_strategy: string | null;
  investment_risk_response: string | null;
  initial_investment_amount: string | null;
  typical_investment_ticket_size: string | null;
  starting_investment_amount: string | null;
  current_investment_method: string | null;
  investment_management_method: string | null;
  preferred_learning_content: string | null;
  liquidity_preference: string | null;
  platform_engagement_level: string | null;
  age_group: string | null;
  // Progress fields
  learn_progress: string | null;
  module_progress: string | null;
  lesson_progress: string | null;
  duration_progress: string | null;
  // Status flags
  bookwarm_status: boolean | null;
  onfire_status: boolean | null;
  champion_status: boolean | null;
  status: boolean | null;
  // Avatar
  image: string; // read-only URI
}

// ─── Shared Error Shape ─────────────────────────────────────────────────────

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  email?: string[];
  password?: string[];
  confirm_password?: string[];
  non_field_errors?: string[];
  [key: string]: unknown;
}

// ─── API Response Shape — GET /book/book/ ────────────────────────────────────

export interface ApiBook {
  id: string;
  title: string;
  authors: string;       // note: "authors" not "author"
  tag: string;           // maps to category
  required_seed: string; // seeds needed to unlock
  description: string;
  views: string;
  downloads: string;
  status: boolean;       // true = available
  pub_date: string;
}

// ─── UI Shape used in components ─────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  author: string;
  seeds: number;
  category: string;
  description: string;
  views: number;
  downloads: number;
  locked: boolean;       // derived from status
  pub_date: string;
}

// ─── Adapter — maps API shape → UI shape ─────────────────────────────────────

export const adaptBook = (apiBook: ApiBook): Book => ({
  id: apiBook.id,
  title: apiBook.title,
  author: apiBook.authors,
  seeds: Number(apiBook.required_seed) || 0,
  category: apiBook.tag,
  description: apiBook.description,
  views: Number(apiBook.views) || 0,
  downloads: Number(apiBook.downloads) || 0,
  locked: !apiBook.status,   // status: true = available, false = locked
  pub_date: apiBook.pub_date,
});