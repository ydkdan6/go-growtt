/**
 * Centralised React Query key factory for auth.
 * Keeps cache keys consistent and easy to invalidate.
 */
export const authKeys = {
  all: ["auth"] as const,

  signUp: () => [...authKeys.all, "sign-up"] as const,

  signIn: () => [...authKeys.all, "sign-in"] as const,

  verify: (email?: string) =>
    [...authKeys.all, "verify", email ?? ""] as const,

  googleAuth: () => [...authKeys.all, "google-auth"] as const,
};

export const onboardingKeys = {
  all: ["onboarding"] as const,
  user: (userId: string | number) =>
    [...onboardingKeys.all, String(userId)] as const,
};

export const userKeys = {
  all: ["user"] as const,
  detail: (userId: string | number) =>
    [...userKeys.all, "detail", String(userId)] as const,
};