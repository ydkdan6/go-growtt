import { useState } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import AuthLayout from "./../../components/auth/AuthLayout";
import AuthInput from "./../../components/auth/AuthInput";
import AuthButton from "./../../components/auth/AuthButton";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSignUpWithParsedError } from "@/hooks/auth/useSignUp";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function SignUp() {
  const [, navigate] = useLocation(); //  wouter — not react-router-dom
  const { toast } = useToast();       //  properly imported toast

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  //  React Query mutation — fully wired
  const { mutate: signUp, isPending, error } = useSignUpWithParsedError({
    onSuccess: (data) => {
      toast({ title: "Account created!", description: data.message });
      navigate("/verify", { state: { email } });
    },
    onError: (msg) => {
      toast({ title: "Sign up failed", description: getErrorMessage(msg), variant: "destructive" });
    },
  });

  // handleSubmit now actually calls the API
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side guards before hitting the API
    if (!agreed) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
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
            <AuthButton variant="secondary" fullWidth>
              Login
            </AuthButton>
          </Link>
          <Link to="/signup" className="flex-1">
            <AuthButton variant="primary" fullWidth>
              Sign Up
            </AuthButton>
          </Link>
        </div>

        {/* ── Heading ── */}
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-brand-dark text-xl leading-[130%] tracking-[-0.32px]">
            Get Started Today
          </h2>
          <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
            Enter your details to get started.
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 mb-8">
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••••••"
            required
          />

          <AuthInput
            label="Confirm your password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••••••"
            required
          />

          {/* Inline API error display */}
          {error && <p className="text-red-500 text-sm">{getErrorMessage(error)}</p>}

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
              I have read, understood, and agree to and all other terms, disclosures
              and disclaimers applicable to me as referenced in the Customer Agreement.
            </p>
          </div>

          {/* isPending disables button and shows loading text */}
          <AuthButton
            variant="primary"
            fullWidth
            className="mb-12 text-white"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Creating account…" : "Continue"}
          </AuthButton>
        </form>

        {/* ── Footer ── */}
        <div className="mt-auto text-center">
          <p className="text-[rgba(13,3,0,0.6)] text-base leading-[150%]">
            Already have an account?{" "}
            <Link to="/" className="text-brand-teal hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}