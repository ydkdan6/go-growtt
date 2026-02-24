import { ReactNode } from "react";
import BrandedSidebar from "./BrandedSidebar";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-9 md:p-0">
      <div className="w-full max-w-[1280px] h-[890px] flex">
        <div className="hidden lg:flex lg:w-[624px] border border-[rgba(255,255,255,0.2)]">
          <BrandedSidebar />
        </div>
        <div className="flex-1 lg:w-[656px] border border-[rgba(255,255,255,0.2)] bg-brand-light">
          {children}
        </div>
      </div>
    </div>
  );
}
