import { useState } from "react";
import { useLocation } from "wouter"; //  wouter
import AppHeader from "../../components/AppHeader";
import { useOnboardingContext } from "@/context/OnboardingContext"; //  context

export default function OnboardingStep1() {
  const [, navigate] = useLocation();
  const { saveStep, answers } = useOnboardingContext();

  // Pre-select if user came back to this step
  const [selected, setSelected] = useState<string>(
    answers.financial_literacy_level ?? ""
  );

  const options = [
    "I have zero knowledge about investments",
    "I have little knowledge on financial planning",
    "I'm an expert in investing",
  ];

  const handleNext = () => {
    if (!selected) return;

    //  Save this step's answer into shared context — no API call yet
    saveStep({ financial_literacy_level: selected });

    navigate("/Onboarding/step2");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFE1B4] to-[#FFF]">
      <AppHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col gap-6">

            {/* Progress bar — step 1 of 13 */}
            <div className="h-2 bg-[#D1E8E8] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#1AE5CF] transition-all" style={{ width: "7.7%" }} />
            </div>

            <div className="text-center">
              <h2 className="text-2xl md:text-[28px] font-bold text-[#0D1C1C] leading-tight mb-6">
                How conversant are you with investing and finance management?
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelected(option)}
                  className={`w-full h-10 md:h-14 px-4 rounded-lg border-2 transition-all ${
                    selected === option
                      ? "border-[#008080] bg-[#F0F0F0]"
                      : "border-[rgba(3,7,18,0.2)] hover:border-[#008080]"
                  } text-sm md:text-base text-[#030712] font-medium`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleNext}
                disabled={!selected}
                className="w-32 h-10 bg-[#008080] text-white rounded-lg font-medium transition-opacity disabled:opacity-50 hover:opacity-90"
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