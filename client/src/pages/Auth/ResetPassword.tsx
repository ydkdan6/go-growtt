import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import AuthLayout from "./../../components/auth/AuthLayout";
import AuthButton from "./../../components/auth/AuthButton";
import AuthInput from "./../../components/auth/AuthInput";
import { ArrowLeft, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordApi } from "@/api/general.api";

const OTP_LENGTH = 5;
const EMPTY_CODE = Array(OTP_LENGTH).fill("");
const RESEND_TIMEOUT = 40;

const PASSWORD_RULES = [
  { id: "length",    label: "At least 8 characters",          test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "At least one uppercase letter",  test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "At least one lowercase letter",  test: (p: string) => /[a-z]/.test(p) },
  { id: "number",    label: "At least one number",            test: (p: string) => /\d/.test(p) },
  { id: "special",   label: "At least one special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

type Step = "otp" | "password" | "success";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const { toast }    = useToast();

  const email = useRef<string>(
    (window.history.state?.email as string) || sessionStorage.getItem("reset_email") || ""
  ).current;

  const [step, setStep]               = useState<Step>("otp");
  const [code, setCode]               = useState<string[]>(EMPTY_CODE);
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [isPending, setIsPending]     = useState(false);
  const [timeLeft, setTimeLeft]       = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend]     = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Verified OTP stored for password step ─────────────────────────────────
  const verifiedOtp = useRef("");

  // ── Focus first OTP input ─────────────────────────────────────────────────
  useEffect(() => {
    if (step === "otp") inputRefs.current[0]?.focus();
  }, [step]);

  // ── Countdown ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) { setCanResend(true); return; }
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const allRulesPassed  = PASSWORD_RULES.every((r) => r.test(password));
  const passwordsMatch  = password === confirm;
  const isCodeComplete  = code.every((d) => d !== "");
  const canSubmitPass   = allRulesPassed && passwordsMatch && !isPending;

  // ── OTP input handlers ────────────────────────────────────────────────────
  const handleChange = useCallback((index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      setCode((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
      if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [code]);

  // ── Submit OTP step — just validate length, move to password step ─────────
  const handleOtpSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const otp = code.join("");
    if (otp.length < OTP_LENGTH) {
      toast({ title: "Incomplete code", description: `Please enter all ${OTP_LENGTH} digits.`, variant: "destructive" });
      return;
    }
    verifiedOtp.current = otp;
    setStep("password");
  }, [code, toast]);

  // ── Submit new password ───────────────────────────────────────────────────
  const handlePasswordSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRulesPassed) {
      toast({ title: "Weak password", description: "Please meet all password requirements.", variant: "destructive" });
      return;
    }
    if (!passwordsMatch) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords are the same.", variant: "destructive" });
      return;
    }

    setIsPending(true);
    try {
      await resetPasswordApi({ otp_code: verifiedOtp.current, password, email });
      sessionStorage.removeItem("reset_email");
      setStep("success");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.detail || "Reset failed. Your code may have expired.";
      toast({ title: "Reset failed", description: msg, variant: "destructive" });
      // If OTP was wrong/expired, send back to OTP step
      if (msg.toLowerCase().includes("otp") || msg.toLowerCase().includes("code") || msg.toLowerCase().includes("expired")) {
        setCode(EMPTY_CODE);
        verifiedOtp.current = "";
        setStep("otp");
      }
    } finally {
      setIsPending(false);
    }
  }, [allRulesPassed, passwordsMatch, password, email, toast]);

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setTimeLeft(RESEND_TIMEOUT);
    setCanResend(false);
    setCode(EMPTY_CODE);
    inputRefs.current[0]?.focus();
    toast({ title: "Code resent", description: "A new reset code has been sent to your email." });
    // TODO: call forgotPasswordApi(email) again when resend is needed
  }, [canResend, toast]);

  // ── Success screen ─────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <AuthLayout>
        <div className="h-full flex flex-col p-10 items-center justify-center gap-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
          </div>
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-[rgba(3,7,18,0.8)] text-[32px] leading-[130%] tracking-[-0.32px]">
              Password Reset!
            </h2>
            <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>
          <AuthButton variant="primary" fullWidth className="text-white" onClick={() => navigate("/")}>
            Back to Login
          </AuthButton>
        </div>
      </AuthLayout>
    );
  }

  // ── Password step ──────────────────────────────────────────────────────────
  if (step === "password") {
    return (
      <AuthLayout>
        <div className="h-full flex flex-col p-10">
          <button
            type="button"
            onClick={() => setStep("otp")}
            className="mb-8 w-6 h-6 text-[rgba(3,7,18,0.8)] hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex flex-col gap-4 mb-12">
            <h2 className="text-[rgba(3,7,18,0.8)] text-[32px] leading-[130%] tracking-[-0.32px]">
              New Password
            </h2>
            <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
              Create a strong new password for your account.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <AuthInput
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }}
                placeholder="••••••••••••••••"
                required
              />
              {passwordTouched && password.length > 0 && (
                <ul className="space-y-1 mt-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <li key={rule.id} className={`flex items-center gap-1.5 text-xs ${passed ? "text-green-600" : "text-[rgba(0,0,0,0.45)]"}`}>
                        {passed
                          ? <Check className="w-3 h-3 text-green-500 flex-shrink-0" strokeWidth={3} />
                          : <X    className="w-3 h-3 text-gray-300 flex-shrink-0" strokeWidth={3} />
                        }
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <AuthInput
                label="Confirm New Password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••••••••••"
                required
              />
              {confirm.length > 0 && (
                <p className={`text-xs flex items-center gap-1 ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                  {passwordsMatch
                    ? <><Check className="w-3 h-3" strokeWidth={3} /> Passwords match</>
                    : <><X     className="w-3 h-3" strokeWidth={3} /> Passwords do not match</>
                  }
                </p>
              )}
            </div>

            <AuthButton
              variant="primary"
              fullWidth
              className="text-white mt-4"
              type="submit"
              disabled={!canSubmitPass}
            >
              {isPending ? "Resetting…" : "Reset Password"}
            </AuthButton>
          </form>
        </div>
      </AuthLayout>
    );
  }

  // ── OTP step (default) ────────────────────────────────────────────────────
  return (
    <AuthLayout>
      <div className="h-full flex flex-col p-10 relative">
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="mb-8 w-6 h-6 text-[rgba(3,7,18,0.8)] hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-[rgba(3,7,18,0.8)] text-[32px] leading-[130%] tracking-[-0.32px]">
            Enter reset code
          </h2>
          <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
            A 5-digit code has been sent to{" "}
            <span className="font-medium">{email || "your email"}</span>.
            Please enter the code below.
          </p>
        </div>

        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6 mb-auto md:mb-0">
          <div className="flex flex-col gap-4">
            <label className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">Enter code</label>
            <div className="flex gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isPending}
                  className="w-12 h-12 text-center text-base text-[rgba(3,7,18,0.8)] border-2 border-[rgba(13,3,0,0.15)] rounded-lg focus:outline-none focus:border-brand-teal transition-colors disabled:opacity-50"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {!canResend ? (
                <p className="text-[rgba(3,7,18,0.2)] text-base leading-[150%]">Expires in {timeLeft}s</p>
              ) : (
                <p className="text-[rgba(3,7,18,0.4)] text-base leading-[150%]">Code expired</p>
              )}
              <div className="flex gap-[5px] mt-[2px]">
                <div className="w-[15px] h-[1px] bg-[rgba(0,0,0,0.2)]" />
                <div className="w-[68px] h-[1px] bg-[rgba(0,0,0,0.2)]" />
              </div>
            </div>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`text-sm font-medium transition-colors ${
                canResend ? "text-brand-teal hover:underline cursor-pointer" : "text-[rgba(0,128,128,0.3)] cursor-not-allowed"
              }`}
            >
              Resend code
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-12 mt-auto md:mt-4">
          <AuthButton
            variant="primary"
            fullWidth
            disabled={!isCodeComplete || isPending}
            onClick={handleOtpSubmit}
          >
            Continue
          </AuthButton>
        </div>
      </div>
    </AuthLayout>
  );
}