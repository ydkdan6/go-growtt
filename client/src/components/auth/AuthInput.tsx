import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="flex flex-col gap-2 w-full">
        <label className="text-brand-dark text-lg leading-[150%]">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full px-3 py-2 rounded border-2 border-[rgba(13,3,0,0.15)] bg-brand-light",
              "text-base leading-[150%] text-[rgba(13,3,0,0.6)]",
              "focus:outline-none focus:border-brand-teal transition-colors",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(3,7,18,0.2)]"
            >
              {showPassword ? (
                <Eye className="w-6 h-6" />
              ) : (
                <EyeOff className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
