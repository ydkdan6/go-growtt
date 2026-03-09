import { useState } from "react";
import { useLocation } from "wouter";
import AppHeader from "../../components/AppHeader";
import { useOnboardingContext } from "@/context/OnboardingContext";

export default function OnboardingStep9() {
  const { saveStep, answers } = useOnboardingContext();
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<string>(
  answers.investment_management_method ?? ""   // ← each step uses its own field name
);

  const options = [
    "Self-directed",
    "Broker/Asset Manager",
    "Online Platforms/Apps",
    "Hybrid Mix"
  ];

  const handleNext = () => {
  if (!selected) return;
  saveStep({ investment_management_method: selected }); // ← each step uses its own field
  navigate("/onboarding/step10");
};

  const handleBack = () => {
    navigate("/onboarding/step8");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFE2B9] to-[#FFF]">
      <AppHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="h-2 bg-[#D1E8E8] rounded-full overflow-hidden">
                <div className="h-full w-full bg-[#1AE5CF] rounded-full"></div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl md:text-[28px] font-bold text-[#0D1C1C] leading-tight mb-6">
                How do you primarily manage your investment?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelected(option)}
                  className={`h-11 px-4 rounded-lg border-2 transition-all ${
                    selected === option
                      ? "border-[#008080] bg-[#F0F0F0]"
                      : "border-[rgba(3,7,18,0.2)] hover:border-[#008080]"
                  } text-sm md:text-base text-[#030712] font-medium`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={handleBack}
                className="flex-1 h-10 border-2 border-[rgba(3,7,18,0.1)] text-[#030712] rounded-lg font-medium transition-all hover:border-[#008080]"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selected}
                className="flex-1 h-10 bg-[#008080] text-white rounded-lg font-medium transition-opacity disabled:opacity-50 hover:opacity-90"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
