import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import AuthLayout from "./../../components/auth/AuthLayout";
import AuthInput from "./../../components/auth/AuthInput";
import AuthButton from "./../../components/auth/AuthButton";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSignUpWithParsedError } from "@/hooks/general/useSignUp";
import { getErrorMessage } from "@/utils/getErrorMessage";

// ─── Password criteria definitions ───────────────────────────────────────────
const PASSWORD_RULES = [
  { id: "length",    label: "At least 8 characters",          test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "At least one uppercase letter",  test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "At least one lowercase letter",  test: (p: string) => /[a-z]/.test(p) },
  { id: "number",    label: "At least one number",            test: (p: string) => /\d/.test(p) },
  { id: "special",   label: "At least one special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
  if (password.length === 0) return { score: 0, label: "", color: "" };
  if (passed <= 2) return { score: 1, label: "Weak",   color: "bg-red-500" };
  if (passed === 3) return { score: 2, label: "Fair",   color: "bg-orange-400" };
  if (passed === 4) return { score: 3, label: "Good",   color: "bg-yellow-400" };
  return              { score: 4, label: "Strong", color: "bg-green-500" };
};

export default function SignUp() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed]                   = useState(false);
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched]   = useState(false);
  const [emailError, setEmailError]           = useState("");

  const { mutate: signUp, isPending, error } = useSignUpWithParsedError({
    onSuccess: (data) => {
      // ✅ Store email in sessionStorage — wouter doesn't support navigate state
      sessionStorage.setItem("signup_email", email);
      toast({ title: "Account created!", description: data.message });
      navigate("/verify");
    },
    onError: (msg) => {
      const message = getErrorMessage(msg);
      const lower = message.toLowerCase();
      // ✅ Surface any email-related error inline on the email field
      // parseApiError prefixes field errors with "email: ..."
      // Also catches: already exists, registered, taken, in use
      // Backend uses "username" internally for the email field
      const isEmailError =
        lower.startsWith("email:") ||
        lower.includes("username is already taken") ||
        lower.includes("username already") ||
        (lower.includes("email") && (
          lower.includes("exist") ||
          lower.includes("already") ||
          lower.includes("registered") ||
          lower.includes("taken") ||
          lower.includes("use") ||
          lower.includes("found")
        ));

      if (isEmailError) {
        // Normalise backend message — replace "username" with "email" for the user
        const cleaned = message
          .replace(/^email:\s*/i, "")
          .replace(/username/gi, "email");
        setEmailError(cleaned);
      } else {
        toast({ title: "Sign up failed", description: message, variant: "destructive" });
      }
    },
  });

  // ─── Derived state ──────────────────────────────────────────────────────────
  const passwordStrength  = getPasswordStrength(password);
  const allRulesPassed    = PASSWORD_RULES.every(r => r.test(password));
  const passwordsMatch    = password === confirmPassword;
  const confirmMismatch   = confirmTouched && confirmPassword.length > 0 && !passwordsMatch;
  const canSubmit         = allRulesPassed && passwordsMatch && agreed && email.length > 0 && !isPending;

  // Clear email error when user edits the email field
  useEffect(() => { setEmailError(""); }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast({ title: "Terms required", description: "Please agree to the terms before continuing.", variant: "destructive" });
      return;
    }
    if (!allRulesPassed) {
      toast({ title: "Weak password", description: "Please meet all password requirements.", variant: "destructive" });
      return;
    }
    if (!passwordsMatch) {
      toast({ title: "Passwords do not match", description: "Please make sure both passwords are the same.", variant: "destructive" });
      return;
    }

    signUp({ email, password, confirm_password: confirmPassword });
  };

  return (
    <AuthLayout>
      <div className="h-full flex flex-col p-10">

        {/* ── Tab switcher ── */}
        <div className="flex gap-7 mb-8">
          <Link to="/" className="flex-1">
            <AuthButton variant="secondary" fullWidth>Login</AuthButton>
          </Link>
          <Link to="/signup" className="flex-1">
            <AuthButton variant="primary" fullWidth>Sign Up</AuthButton>
          </Link>
        </div>

        {/* ── Heading ── */}
        <div className="flex flex-col gap-4 mb-8">
          <h2 className="text-brand-dark text-xl leading-[130%] tracking-[-0.32px]">Get Started Today</h2>
          <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">Enter your details to get started.</p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-8">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {/* ✅ Already-registered error surfaced inline on the field */}
            {emailError && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <X className="w-3 h-3" /> {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <AuthInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }}
                placeholder="••••••••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-[38px] text-[rgba(0,0,0,0.4)] hover:text-black transition-colors"
                tabIndex={-1}
              >
                {/* {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} */}
              </button>
            </div>

            {/* ── Strength bar — shows once user starts typing ── */}
            {passwordTouched && password.length > 0 && (
              <div className="space-y-2">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map((segment) => (
                    <div
                      key={segment}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength.score >= segment
                          ? passwordStrength.color
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength.label && (
                  <p className={`text-xs font-medium ${
                    passwordStrength.score === 1 ? "text-red-500" :
                    passwordStrength.score === 2 ? "text-orange-400" :
                    passwordStrength.score === 3 ? "text-yellow-500" :
                    "text-green-500"
                  }`}>
                    {passwordStrength.label}
                  </p>
                )}

                {/* ── Per-rule checklist ── */}
                <ul className="space-y-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <li key={rule.id} className={`flex items-center gap-1.5 text-xs transition-colors ${passed ? "text-green-600" : "text-[rgba(0,0,0,0.45)]"}`}>
                        {passed
                          ? <Check className="w-3 h-3 text-green-500 flex-shrink-0" strokeWidth={3} />
                          : <X    className="w-3 h-3 text-gray-300 flex-shrink-0" strokeWidth={3} />
                        }
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <AuthInput
                label="Confirm your password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setConfirmTouched(true); }}
                placeholder="••••••••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3 top-[38px] text-[rgba(0,0,0,0.4)] hover:text-black transition-colors"
                tabIndex={-1}
              >
                {/* {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} */}
              </button>
            </div>

            {/* ✅ Real-time match feedback */}
            {confirmTouched && confirmPassword.length > 0 && (
              <p className={`text-xs flex items-center gap-1 ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                {passwordsMatch
                  ? <><Check className="w-3 h-3" strokeWidth={3} /> Passwords match</>
                  : <><X     className="w-3 h-3" strokeWidth={3} /> Passwords do not match</>
                }
              </p>
            )}
          </div>

          {/* General API error (non-email errors) */}
          {error && !emailError && (
            <p className="text-red-500 text-sm">{getErrorMessage(error)}</p>
          )}

          {/* ── Terms checkbox ── */}
          <div className="flex flex-row gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className="w-[18px] h-[18px] border border-brand-dark flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: agreed ? "#0D0300" : "transparent" }}
                aria-checked={agreed}
                role="checkbox"
              >
                {agreed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </button>
            </div>
            <p className="text-brand-dark text-base leading-[150%]">
              I have read, understood, and agree to and all other terms & Customer Agreement.
            </p>
          </div>

          <AuthButton
            variant="primary"
            fullWidth
            className="text-white"
            type="submit"
            disabled={!canSubmit}
          >
            {isPending ? "Creating account…" : "Continue"}
          </AuthButton>
        </form>

        {/* ── Footer ── */}
        <div className="mt-auto text-center">
          <p className="text-[rgba(13,3,0,0.6)] text-base leading-[150%]">
            Already have an account?{" "}
            <Link to="/" className="text-brand-teal hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}