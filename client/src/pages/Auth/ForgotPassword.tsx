import { useState } from "react";
import { useLocation } from "wouter";
import AuthLayout from "./../../components/auth/AuthLayout";
import AuthInput from "./../../components/auth/AuthInput";
import AuthButton from "./../../components/auth/AuthButton";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { forgotPasswordApi } from "@/api/general.api";

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [email, setEmail]       = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }

    setIsPending(true);
    try {
      await forgotPasswordApi(email);
      toast({ title: "Code sent!", description: "Check your email for the reset code." });
      sessionStorage.setItem("reset_email", email);
      window.history.pushState({ email }, "", "/reset-password");
      navigate("/reset-password");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.detail || "Something went wrong. Please try again.";
      toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="h-full flex flex-col p-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-8 w-6 h-6 text-[rgba(3,7,18,0.8)] hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-[rgba(3,7,18,0.8)] text-[32px] leading-[130%] tracking-[-0.32px]">
            Forgot Password?
          </h2>
          <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <AuthButton
            variant="primary"
            fullWidth
            className="text-white mt-4"
            type="submit"
            disabled={isPending || !email}
          >
            {isPending ? "Sending code…" : "Send Reset Code"}
          </AuthButton>
        </form>

        <div className="mt-auto text-center">
          <p className="text-[rgba(13,3,0,0.6)] text-base leading-[150%]">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-brand-teal hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}