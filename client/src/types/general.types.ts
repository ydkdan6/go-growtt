// Sign Up

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

// Sign In

export interface SignInPayload {
  email: string;
  password: string;
}

// ✅ Sign-in returns ONLY token + id — fetch full user separately via useUserDetail
export interface SignInResponse {
  token: string;
  id: string;
}

// Verify 

export interface VerifyPayload {
  otp_code: string;    
  email: string;
}

export interface VerifyResponse {
  message: string;
  detail?: string;
}

// Google Auth

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

// Onboarding

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

// User Detail 

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
  seed_balance: string | null;
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

// Shared Error Shape

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  email?: string[];
  password?: string[];
  confirm_password?: string[];
  non_field_errors?: string[];
  [key: string]: unknown;
}

// API Response Shape — GET /book/book/ 

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

// UI Shape used in components 

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

// Adapter — maps API shape → UI shape 

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


// API Response Shape — GET /learn/lessons/
 
export interface ApiLesson {
  id: string;
  title: string;
  track: string;        // category / track name (e.g. "Stocks", "Crypto")
  content: string;      // lesson body / description
  duration: string;     // e.g. "10 mins"
  lesson_count: string; // number of sub-lessons
  required_seed: string;
  status: boolean;      // true = available
  pub_date: string;
}

// UI Shape 
 
export interface Lesson {
  status: boolean;
  id: string;
  title: string;
  track: string;
  content: string;
  duration: string;
  lessonCount: number;
  requiredSeed: number;
  locked: boolean;      // derived: !status
  pubDate: string;
}

// Adapter 
 
export const adaptLesson = (api: ApiLesson): Lesson => ({
  id: api.id,
  title: api.title,
  track: api.track,
  content: api.content,
  duration: api.duration,
  lessonCount: Number(api.lesson_count) || 0,
  requiredSeed: Number(api.required_seed) || 0,
  locked: !api.status,
  pubDate: api.pub_date,
  status: false
});

// Lesson Modules 

//  ─ API Response Shape — GET /learn/modules/                 ─
 
export interface ApiModule {
  id: string;
  lessons: ApiLesson[];  // nested lessons array (may be empty)
  title: string;
  description: string;
  track: string;
  duration: string;
  lesson_count: string;
  required_seed: string;
  status: boolean;
  pub_date: string;
}
 
//  ─ UI Shape                                 ─
 
export interface Module {
  id: string;
  lessons: Lesson[];     // adapted nested lessons
  title: string;
  description: string;
  track: string;
  duration: string;
  lessonCount: number;
  requiredSeed: number;
  locked: boolean;       // derived: !status
  pubDate: string;
}
 
//  ─ Adapter                                  
 
export const adaptModule = (api: ApiModule): Module => ({
  id: api.id,
  lessons: (api.lessons ?? []).map(adaptLesson),
  title: api.title,
  description: api.description,
  track: api.track,
  duration: api.duration,
  lessonCount: Number(api.lesson_count) || 0,
  requiredSeed: Number(api.required_seed) || 0,
  locked: !api.status,
  pubDate: api.pub_date,
});

//  ─ API Response Shape — GET /blog/blog/                   ─

export interface ApiBlog {
  id: string;
  image_url: string | null;
  title: string;
  authors: string;
  tag: string;
  required_seed: string;
  description: string;
  views: string;
  status: boolean;      // true = published / available
  pub_date: string;
}

//  ─ UI Shape                                 ─

export interface Blog {
  id: string;
  imageUrl: string | null;
  title: string;
  authors: string;
  tag: string;
  requiredSeed: number;
  description: string;
  views: number;
  locked: boolean;      // derived: !status
  pubDate: string;
}

//  ─ Adapter                                  

export const adaptBlog = (api: ApiBlog): Blog => ({
  id:           api.id,
  imageUrl:     api.image_url,
  title:        api.title,
  authors:      api.authors,
  tag:          api.tag,
  requiredSeed: Number(api.required_seed) || 0,
  description:  api.description,
  views:        Number(api.views) || 0,
  locked:       !api.status,
  pubDate:      api.pub_date,
});

//  ─ API Response Shape — GET /investment-asset/investment-asset/       ─

export interface ApiInvestmentAsset {
  id: string;
  company: string | null;       
  category: string;
  investment_icon: string | null;
  investment_type: string | null;
  about: string | null;
  description: string | null;
  risk_level: string | null;
  tenure: string | null;
  min_payment: string | null;
  interest: string | null;
  rate: string | null;          
  asset_name: string | null;     
  asset_name_code: string | null;
  tags: string | null;
  price_per_unit: string | null;
  per_unit_name: string | null;
  percent_growth: string | null;
  market_cap: string | null;
  daily_volume: string | null;
  open_price:             string | null;
  high_price:             string | null;
  low_price:              string | null;
  close_price:            string | null;
  change_naira:           string | null;
  change_percent:         string | null;
  num_trades:             string | null;
  market_capitalization:  string | null;
  discount_rate:          string | null;
  year_to_date:           string | null;
  price_change_in_naira:  string | null;
  status: boolean;
  pub_date: string;
}

export interface InvestmentAsset {
  id: string;
  company: string | null;        // ← was assetName
  category: string;
  investmentIcon: string | null;
  investmentType: string | null;
  about: string | null;
  description: string | null;
  riskLevel: string | null;
  tenure: string | null;
  minPayment: number | null;
  interest: number | null;
  rate: number | null;           // ← new
  assetName: string | null;      // keep for fallback
  assetNameCode: string | null;
  tags: string | null;
  pricePerUnit: number | null;
  perUnitName: string | null;
  percentGrowth: number | null;
  marketCap: number | null;
  dailyVolume: number | null;
  openPrice:            number | null;
  highPrice:            number | null;
  lowPrice:             number | null;
  closePrice:           number | null;
  changeNaira:          number | null;
  changePercent:        number | null;
  numTrades:            number | null;
  marketCapitalization: number | null;
  discountRate:         number | null;
  yearToDate:           number | null;
  priceChangeInNaira:   number | null;
  locked: boolean;
  pubDate: string;
}

//  ─ Adapter                                  

export const adaptInvestmentAsset = (api: ApiInvestmentAsset): InvestmentAsset => ({
  id:             api.id,
  company:        api.company,                                                    // ← new
  category:       api.category,
  investmentIcon: api.investment_icon,
  investmentType: api.investment_type,
  about:          api.about,
  description:    api.description,
  riskLevel:      api.risk_level,
  tenure:         api.tenure,
  minPayment:     api.min_payment    !== null ? Number(api.min_payment)    : null,
  interest:       api.interest       !== null ? Number(api.interest)       : null,
  rate:           api.rate           !== null ? Number(api.rate)           : null, // ← new
  assetName:      api.asset_name,
  assetNameCode:  api.asset_name_code,
  tags:           api.tags,
  pricePerUnit:   api.price_per_unit !== null ? Number(api.price_per_unit) : null,
  perUnitName:    api.per_unit_name,
  percentGrowth:  api.percent_growth !== null ? Number(api.percent_growth) : null,
  marketCap:      api.market_cap     !== null ? Number(api.market_cap)     : null,
  dailyVolume:    api.daily_volume   !== null ? Number(api.daily_volume)   : null,
  openPrice:            api.open_price            !== null ? Number(api.open_price)            : null,
  highPrice:            api.high_price            !== null ? Number(api.high_price)            : null,
  lowPrice:             api.low_price             !== null ? Number(api.low_price)             : null,
  closePrice:           api.close_price           !== null ? Number(api.close_price)           : null,
  changeNaira:          api.change_naira          !== null ? Number(api.change_naira)          : null,
  changePercent:        api.change_percent        !== null ? Number(api.change_percent)        : null,
  numTrades:            api.num_trades            !== null ? Number(api.num_trades)            : null,
  marketCapitalization: api.market_capitalization !== null ? Number(api.market_capitalization) : null,
  discountRate:         api.discount_rate         !== null ? Number(api.discount_rate)         : null,
  yearToDate:           api.year_to_date          !== null ? Number(api.year_to_date)          : null,
  priceChangeInNaira:   api.price_change_in_naira !== null ? Number(api.price_change_in_naira) : null,
  locked:         !api.status,
  pubDate:        api.pub_date,
});

//  ─ Update Payload — PATCH /investment-asset/investment-asset/{id}/      

export interface UpdateInvestmentAssetPayload {
  category?:        string;
  investment_icon?: string;
  investment_type?: string;
  about?:           string;
  description?:     string;
  risk_level?:      string;
  tenure?:          string;
  min_payment?:     string;
  interest?:        string;
  asset_name?:      string;
  asset_name_code?: string;
  tags?:            string;
  price_per_unit?:  string;
  per_unit_name?:   string;
  percent_growth?:  string;
  market_cap?:      string;
  daily_volume?:    string;
  status?:          boolean;
  pub_date?:        string;
}

//  ─ Seed & Balance Payloads                          

/** Shared payload shape used by buy-seed, convert-seed-fund,
 *  fund-demo-balance, and fund-seed-balance endpoints. */
export interface SeedBalancePayload {
  amount: string;
  custom_user_id: string;
}
 
// POST /custom-user/buy-seed/
// Returns a Paystack checkout URL — redirect the user to payment_url
export interface BuySeedResponse {
  payment_url: string; // Paystack checkout page URL
  reference: string;         // unique payment reference — store before redirecting
  access_code?: string;      // Paystack access code (optional, for inline popup)
  message?: string;
  detail?: string;
  [key: string]: unknown;
}
 
// POST /custom-user/convert-seed-fund/
export interface ConvertSeedFundResponse {
  message: string;
  detail?: string;
  seed_balance?: string;
  demo_balance?: string;
  [key: string]: unknown;
}
 
// POST /custom-user/fund-demo-balance/
export interface FundDemoBalanceResponse {
  message: string;
  detail?: string;
  demo_balance?: string;
  [key: string]: unknown;
}
 
// POST /custom-user/fund-seed-balance/
export interface FundSeedBalanceResponse {
  message: string;
  detail?: string;
  seed_balance?: string;
  [key: string]: unknown;
}
 
// GET /custom-user/verify-purchase/{reference}/
export interface VerifyPurchaseResponse {
  status: boolean;
  message: string;
  reference: string;
  amount: number;
  email: string;
  paid_at: string;
}