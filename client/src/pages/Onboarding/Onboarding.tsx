import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import AuthButton from "../../components/auth/AuthButton";

export default function OnboardingInitial() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  useEffect(() => {
    if (selectedMode) {
      const timer = setTimeout(() => {
        navigate("/onboarding/step1", { state: { mode: selectedMode } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedMode, navigate]);

  const handleModeContinue = (mode: string) => {
    setSelectedMode(mode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFD580] via-[#FFDB8D] to-[#FFFAF0]">
      {/* Navigation Header */}
      <AppHeader />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-12">
          <div className="flex flex-col items-center gap-8">
            {/* Heading */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[#030712] leading-tight mb-4">
                Your Growtt account is ready!
              </h1>
              <p className="text-base md:text-lg text-[#030712] leading-relaxed max-w-lg">
                With Growtt you can either choose beginner to practice & learn, or professional to use live investments.
              </p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              <AuthButton
                variant="primary"
                fullWidth
                onClick={() => handleModeContinue("beginner")}
                disabled={selectedMode !== null}
                className="disabled:opacity-50 text-white"
              >
                Continue as Beginner
              </AuthButton>
              <button
                onClick={() => handleModeContinue("professional")}
                disabled={selectedMode !== null}
                className="h-11 border-2 border-[rgba(0,128,128,0.2)] text-[#030712] rounded-lg font-medium transition-all hover:border-[#008080] disabled:opacity-50 text-base"
              >
                Start as Professional
              </button>
            </div>

            {/* Info Text */}
            <p className="text-sm text-[#008080] text-center max-w-md font-medium">
              You can upgrade to Professional after meeting the <span className="font-bold">required thresholds</span>.
            </p>

            {/* Loading State */}
            {selectedMode && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#008080] rounded-full animate-pulse"></div>
                <p className="text-sm text-[rgba(3,7,18,0.5)]">
                  {selectedMode === "beginner" ? "Continuing as Beginner..." : "Starting as Professional..."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
