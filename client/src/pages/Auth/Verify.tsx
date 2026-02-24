import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from './../../components/auth/AuthLayout';
import AuthButton from "./../../components/auth/AuthButton";
import { ArrowLeft, Check } from "lucide-react";

export default function Verify() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
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
    setShowSuccess(true);

    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 4000);

    return () => clearTimeout(timer);
  };

  const handleContinue = () => {
    navigate("/onboarding");
  };

  return (
    <AuthLayout>
      <div className="h-full flex flex-col p-10 relative">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 w-6 h-6 text-brand-dark hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-brand-dark text-[32px] leading-[130%] tracking-[-0.32px]">
            Enter confirmation code
          </h2>
          <p className="text-[rgba(3,7,18,0.8)] text-base leading-[150%]">
            A 6-digit code has been sent to your email. Please enter the code below.
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
                  className="w-12 h-12 text-center text-base text-[rgba(3,7,18,0.8)] border-2 border-[rgba(13,3,0,0.15)] rounded-lg focus:outline-none focus:border-brand-teal transition-colors"
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <p className="text-[rgba(3,7,18,0.2)] text-base leading-[150%]">
              Expires in {timeLeft}s
            </p>
            <div className="flex gap-[5px] mt-[2px]">
              <div className="w-[15px] h-[1px] bg-[rgba(0,0,0,0.2)]" />
              <div className="w-[68px] h-[1px] bg-[rgba(0,0,0,0.2)]" />
            </div>
          </div>
        </form>

        <div className="flex flex-col gap-12 mt-auto md:mt-4">
          <AuthButton 
            variant="primary" 
            fullWidth
            disabled={code.some(d => !d)}
            onClick={handleSubmit}
          >
            Continue
          </AuthButton>

          <p className="text-[rgba(13,3,0,0.6)] text-center text-base leading-[150%]">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-teal hover:underline">
              Login
            </Link>
          </p>
        </div>

        {showSuccess && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-auto overflow-hidden">
              <div className="p-6 sm:p-8 flex flex-col items-center gap-6">
                {/* <div className=" felw-full aspect-video rounded-lg overflow-hidden">
                  <img
                    src="/images/v.png"
                    alt="Email verified"
                    className="w-[90px] h-[90px] object-cover"
                  />
                </div> */}

                <div className="flex flex-col items-center gap-3 w-full text-center">
                  <img
                    src="/images/v.png"
                    alt="Email verified"
                    className="w-[90px] h-[90px] object-cover"
                  />
                  <h3 className="text-brand-dark text-2xl sm:text-[32px] font-semibold leading-tight tracking-tight">
                    Email verified
                  </h3>
                  <p className="text-[rgba(3,7,18,0.8)] text-sm sm:text-base">
                    Your investment journey awaits.
                  </p>
                </div>

                <div className="w-full">
                  <AuthButton
                    variant="primary"
                    fullWidth
                    onClick={handleContinue}
                  >
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