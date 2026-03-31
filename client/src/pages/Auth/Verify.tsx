import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import AuthLayout from "./../../components/auth/AuthLayout";
import AuthButton from "./../../components/auth/AuthButton";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVerify } from "@/hooks/general/useVerify";
import { getErrorMessage } from "@/utils/getErrorMessage";

const OTP_LENGTH = 5;
const EMPTY_CODE = Array(OTP_LENGTH).fill("");
const RESEND_TIMEOUT = 40;

export default function Verify() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // ── Read source and email once on mount — never re-read mid-session ───────
  const email         = useRef<string>(
    (window.history.state?.email as string) || sessionStorage.getItem("signup_email") || ""
  ).current;
  const fromLogin     = useRef<boolean>(
    sessionStorage.getItem("verify_source") === "login"
  ).current;

  const [code, setCode]           = useState<string[]>(EMPTY_CODE);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft]   = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Focus first input on mount ────────────────────────────────────────────
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) { setCanResend(true); return; }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ── Redirect after success — destination depends on source ────────────────
  useEffect(() => {
    if (!showSuccess) return;
    const destination = fromLogin ? "/dashboard" : "/onboarding";
    const timer = setTimeout(() => {
      sessionStorage.removeItem("verify_source");
      sessionStorage.removeItem("signup_email");
      navigate(destination);
    }, 4000);
    return () => clearTimeout(timer);
  }, [showSuccess, fromLogin, navigate]);

  const { mutate: verify, isPending, error } = useVerify({
    onSuccess: () => setShowSuccess(true),
    onError: (msg) => {
      toast({
        title: "Verification failed",
        description: getErrorMessage(msg),
        variant: "destructive",
      });
      setCode(EMPTY_CODE);
      inputRefs.current[0]?.focus();
    },
  });

  // ── Input handlers ────────────────────────────────────────────────────────
  const handleChange = useCallback((index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      setCode((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [code]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const otp_code = code.join("");
    if (otp_code.length < OTP_LENGTH) {
      toast({
        title: "Incomplete code",
        description: `Please enter all ${OTP_LENGTH} digits.`,
        variant: "destructive",
      });
      return;
    }
    verify({ otp_code, email });
  }, [code, email, verify, toast]);

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setTimeLeft(RESEND_TIMEOUT);
    setCanResend(false);
    setCode(EMPTY_CODE);
    inputRefs.current[0]?.focus();
    toast({ title: "Code resent", description: "A new verification code has been sent to your email." });
    // TODO: call resend endpoint when available
  }, [canResend, toast]);

  // ── Success redirect handler (manual Continue button) ─────────────────────
  const handleSuccessContinue = useCallback(() => {
    const destination = fromLogin ? "/dashboard" : "/onboarding";
    sessionStorage.removeItem("verify_source");
    sessionStorage.removeItem("signup_email");
    navigate(destination);
  }, [fromLogin, navigate]);

  const isCodeComplete = code.every((d) => d !== "");

  return (
    <AuthLayout>
      <div className="h-full flex flex-col p-10 relative">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-8 w-6 h-6 text-[rgba(3,7,18,0.8)] hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-[rgba(3,7,18,0.8)] text-[32px] leading-[130%] tracking-[-0.32px]">
            Enter confirmation code
          </h2>
          <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
            {fromLogin
              ? "Your account is not yet verified. A new code has been sent to "
              : "A 5-digit code has been sent to "}
            <span className="font-medium text-[rgba(3,7,18,0.8)]">
              {email || "your email"}
            </span>
            . Please enter the code below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-auto md:mb-0">
          <div className="flex flex-col gap-4">
            <label className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
              Enter code
            </label>
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
            {error && (
              <p className="text-red-500 text-sm">{getErrorMessage(error)}</p>
            )}
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
                canResend
                  ? "text-brand-teal hover:underline cursor-pointer"
                  : "text-[rgba(0,128,128,0.3)] cursor-not-allowed"
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
            onClick={handleSubmit}
          >
            {isPending ? "Verifying…" : "Continue"}
          </AuthButton>
          <p className="text-[rgba(13,3,0,0.6)] text-center text-base leading-[150%]">
            Already have an account?{" "}
            <Link to="/" className="text-brand-teal hover:underline">Login</Link>
          </p>
        </div>

        {/* ── Success overlay ── */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-auto overflow-hidden">
              <div className="p-6 sm:p-8 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-3 w-full text-center">
                  <img
                    src="/images/v.png"
                    alt="Email verified"
                    className="w-[90px] h-[90px] object-cover"
                  />
                  <h3 className="text-[rgba(3,7,18,0.8)] text-2xl sm:text-[32px] font-semibold leading-tight tracking-tight">
                    Email verified
                  </h3>
                  <p className="text-[rgba(3,7,18,0.8)] text-sm sm:text-base">
                    {fromLogin
                      ? "Welcome back! Taking you to your dashboard."
                      : "Your investment journey awaits."}
                  </p>
                </div>
                <div className="w-full">
                  <AuthButton variant="primary" fullWidth onClick={handleSuccessContinue}>
                    Continue
                  </AuthButton>
                </div>
                <p className="text-[rgba(3,7,18,0.5)] text-xs sm:text-sm">
                  Redirecting in a few seconds...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}