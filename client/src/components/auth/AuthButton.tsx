import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ variant = "primary", fullWidth = false, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-6 py-2.5 rounded-lg text-base leading-[150%] font-normal transition-all",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          variant === "primary"
            ? "bg-[#006666] text-brand-light border border-[rgba(255,255,255,0.2)] hover:bg-[#006666]"
            : "bg-transparent text-brand-dark border border-[rgba(3,7,18,0.2)] hover:bg-gray-50",
          fullWidth && "w-full",
          props.disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AuthButton.displayName = "AuthButton";

export default AuthButton;
