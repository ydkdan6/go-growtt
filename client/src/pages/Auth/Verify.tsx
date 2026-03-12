import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import AuthLayout from "./../../components/auth/AuthLayout";
import AuthButton from "./../../components/auth/AuthButton";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVerify } from "@/hooks/general/useVerify";
import { getErrorMessage } from "@/utils/getErrorMessage";


// ✅ OTP is 5 digits — change this one constant if it ever changes
const OTP_LENGTH = 5;
const EMPTY_CODE = Array(OTP_LENGTH).fill("");

export default function Verify() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // ✅ Read email passed from SignUp via wouter history state
  const email = (window.history.state?.email as string) ?? "";

  const [code, setCode] = useState<string[]>(EMPTY_CODE);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => navigate("/onboarding"), 4000);
    return () => clearTimeout(timer);
  }, [showSuccess, navigate]);

  const { mutate: verify, isPending, error } = useVerify({
    onSuccess: () => {
      setShowSuccess(true);
    },
    onError: (msg) => {
      toast({ title: "Verification failed", description: getErrorMessage(msg), variant: "destructive" });
      // ✅ Correct reset — uses EMPTY_CODE constant, not hardcoded 6 slots
      setCode(EMPTY_CODE);
      inputRefs.current[0]?.focus();
    },
  });

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // ✅ Field is "otp_code" not "token" — matches what Django sends
    verify({ otp_code, email });
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimeLeft(40);
    setCanResend(false);
    setCode(EMPTY_CODE); // ✅ correct length
    inputRefs.current[0]?.focus();
    toast({ title: "Code resent", description: "A new verification code has been sent to your email." });
    // TODO: call resend endpoint when available
  };

  const isCodeComplete = code.every((d) => d !== "");

  return (
    <AuthLayout>
      <div className="h-full flex flex-col p-10 relative">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-8 w-6 h-6 text-brand-dark hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-brand-dark text-[32px] leading-[130%] tracking-[-0.32px]">
            Enter confirmation code
          </h2>
          {/* ✅ Correctly says 5-digit */}
          <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
            A 5-digit code has been sent to{" "}
            <span className="font-medium text-brand-dark">
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
            {/* ✅ Renders exactly 5 inputs — driven by OTP_LENGTH */}
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

            {error && <p className="text-red-500 text-sm">{getErrorMessage(error)}</p>}
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
          <AuthButton variant="primary" fullWidth disabled={!isCodeComplete || isPending} onClick={handleSubmit}>
            {isPending ? "Verifying…" : "Continue"}
          </AuthButton>
          <p className="text-[rgba(13,3,0,0.6)] text-center text-base leading-[150%]">
            Already have an account?{" "}
            <Link to="/" className="text-brand-teal hover:underline">Login</Link>
          </p>
        </div>

        {showSuccess && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-auto overflow-hidden">
              <div className="p-6 sm:p-8 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-3 w-full text-center">
                  <img src="/images/v.png" alt="Email verified" className="w-[90px] h-[90px] object-cover" />
                  <h3 className="text-brand-dark text-2xl sm:text-[32px] font-semibold leading-tight tracking-tight">
                    Email verified
                  </h3>
                  <p className="text-[rgba(3,7,18,0.8)] text-sm sm:text-base">Your investment journey awaits.</p>
                </div>
                <div className="w-full">
                  <AuthButton variant="primary" fullWidth onClick={() => navigate("/onboarding")}>
                    Continue
                  </AuthButton>
                </div>
                <p className="text-[rgba(3,7,18,0.5)] text-xs sm:text-sm">Redirecting in a few seconds...</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  );
}