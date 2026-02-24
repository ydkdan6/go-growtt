import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from './../../components/auth/AuthLayout';
import AuthInput from "./../../components/auth/AuthInput";
import AuthButton from "./../../components/auth/AuthButton";
import { Check } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("bizzoji@gmail.com");
  const [password, setPassword] = useState("****************");
  const [confirmPassword, setConfirmPassword] = useState("****************");
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/verify");
  };

  return (
    <AuthLayout>
      <div className="h-full flex flex-col p-10">
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

        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-brand-dark text-xl leading-[130%] tracking-[-0.32px]">
            Get Started Today
          </h2>
          <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
            Enter your details to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 mb-8">
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="bizzoji@gmail.com"
          />
          
          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="****************"
          />

          <AuthInput
            label="Confirm your password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="****************"
          />

          <div className="flex flex-row gap-2">
            {/* <p className="text-brand-dark text-base leading-[150%]">
              I have read, understood, and agree to and all other terms, disclosures and disclaimers applicable to me as referenced in the Customer Agreement.
            </p> */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className="w-[18px] h-[18px] border border-brand-dark flex items-center justify-center"
                style={{ backgroundColor: agreed ? '#0D0300' : 'transparent' }}
              >
                {agreed && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </button>
              {/* <span className="text-[rgba(13,3,0,0.2)] text-base leading-[150%]">
                Checkbox
              </span> */} {}
            </div>
            <p className="text-brand-dark text-base leading-[150%]">
              I have read, understood, and agree to and all other terms, disclosures and disclaimers applicable to me as referenced in the Customer Agreement.
            </p>
          </div>

          <AuthButton variant="primary" fullWidth className="mb-12 text-white" type="submit">
            Continue
          </AuthButton>
        </form>

        <div className="mt-auto text-center">
          <p className="text-[rgba(13,3,0,0.6)] text-base leading-[150%]">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-teal hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}