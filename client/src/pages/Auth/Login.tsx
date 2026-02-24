import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from './../../components/auth/AuthLayout';
import AuthInput from "./../../components/auth/AuthInput";
import AuthButton from "./../../components/auth/AuthButton";
// import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin= () => {
    navigate('/onboarding');
  }

  return (
    <AuthLayout>
      <div className="h-full flex flex-col p-10">
        <div className="flex gap-7 mb-8">
          <Link to="/login" className="flex-1">
            <AuthButton variant="primary" fullWidth>
              Login
            </AuthButton>
          </Link>
          <Link to="/signup" className="flex-1">
            <AuthButton variant="secondary" fullWidth>
              Sign Up
            </AuthButton>
          </Link>
        </div>

        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-brand-dark text-xl leading-[130%] tracking-[-0.32px]">
            Welcome Back!
          </h2>
          <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
            Login to continue your journey with Growtt.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="flex flex-col gap-8 mb-8">
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="bizzoji@gmail.com"
          />
          
          <div className="flex flex-col gap-2">
            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="****************"
            />
            <Link 
              to="/forgot-password" 
              className="text-[rgba(0,128,128,0.6)] text-base text-right leading-[150%] hover:text-brand-teal transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        <AuthButton variant="primary" fullWidth className="mb-10 text-white">
          Login
        </AuthButton>
      </form>

        <div className="flex flex-col items-center gap-6">
          <div className="w-full flex flex-col gap-4 items-center">
            <div className="w-full h-[1px] bg-[rgba(13,3,0,0.2)]" />
            <p className="text-[rgba(3,7,18,0.8)] text-center text-base leading-[150%]">
              Or continue with
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20.5371 8.10369L14.6671 7.88016C14.1624 7.86096 14.1259 8.02094 14.5363 8.31532C15.7737 9.20254 17.7986 11.3719 15.3015 15.0406L11.6927 21.439C11.4445 21.8787 11.653 22.2682 12.1576 22.254C18.1903 22.0853 24.096 16.1796 21.7662 8.99593C21.6103 8.51553 21.0417 8.12288 20.5371 8.10369ZM3.87915 7.15384C3.62089 6.72006 3.17293 6.70223 2.93022 7.1451C0.524982 11.5341 1.38021 18.8362 8.30977 21.5747C8.77921 21.7603 9.43743 21.5701 9.76608 21.1871L13.5924 16.7226C13.9211 16.3391 13.8191 16.2139 13.3332 16.3505C12.0214 16.7203 9.49091 16.9251 7.84993 13.8251L3.87915 7.15384ZM19.6956 6.57973C20.197 6.52168 20.3908 6.12401 20.0777 5.7277C16.9768 1.79806 9.78207 -0.311896 4.86556 4.6261C4.50948 4.98401 4.41852 5.67102 4.62924 6.12995L7.06967 11.4355C7.28085 11.8939 7.40564 11.8555 7.46003 11.3536C7.60447 10.0189 8.41216 7.66761 12.2824 7.43587L19.6956 6.57973Z" fill="black"/>
              </svg>
              <span className="text-brand-dark text-center text-base leading-[150%]">
                Sign in with Google
              </span>
            </button>
            
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16.5708 12.7513C16.5433 9.7149 19.0529 8.25601 19.166 8.18431C17.754 6.1187 15.5587 5.8374 14.7755 5.8043C12.9085 5.61401 11.1297 6.90468 10.181 6.90468C9.23227 6.90468 7.77062 5.83188 6.22073 5.86222C4.18269 5.89256 2.30461 7.04533 1.25388 8.87101C-0.861369 12.5389 0.713349 17.9801 2.7762 20.9613C3.78557 22.4174 4.98522 24.0583 6.56545 23.9977C8.08777 23.937 8.6614 23.0131 10.4981 23.0131C12.3348 23.0131 12.8533 23.9977 14.4584 23.9673C16.0937 23.9342 17.1307 22.4781 18.1318 21.0165C19.2873 19.3259 19.7644 17.6878 19.792 17.6023C19.7561 17.5885 16.6039 16.3806 16.5708 12.7513Z" fill="#0D0300"/>
                <path d="M13.5511 3.83338C14.3894 2.8185 14.9548 1.40649 14.8004 0C13.5924 0.0496408 12.1308 0.805285 11.2648 1.82016C10.4899 2.71646 9.8087 4.15328 9.99347 5.5322C11.3365 5.63699 12.7127 4.8455 13.5511 3.83338Z" fill="#0D0300"/>
              </svg>
              <span className="text-brand-dark text-center text-base leading-[150%]">
                Sign in with Apple
              </span>
            </button>
          </div>
        </div>

        <div className="mt-2 pt-2 text-center">
          <p className="text-[rgba(3,7,18,0.6)] text-base leading-[150%]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand-teal hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
