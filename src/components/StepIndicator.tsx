import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { num: '01', id: 'step-01-jurisdiction', title: 'Jurisdiction' },
    { num: '02', id: 'step-02-road-selector', title: 'Corridor' },
    { num: '03', id: 'step-03-authority-profile', title: 'Responsibility & Audio' },
    { num: '04', id: 'step-04-budget-comparison', title: 'Cost / km' },
    { num: '05', id: 'step-05-citizen-verification', title: 'Ground Truth' },
  ];

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="Step progress"
      className="sticky top-0 z-30 bg-[#F4EFE6]/90 backdrop-blur-md border-b border-[#DDD4C4] py-2 px-4 shadow-2xs"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isCurrent = currentStep === stepNum;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => handleScrollTo(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#3A543E] text-white shadow-2xs'
                    : 'bg-[#EAE3D5] text-[#4A554E] hover:bg-white hover:text-[#1E2522]'
                }`}
              >
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isCurrent ? 'bg-[#E09F3E] text-[#1E2522]' : 'bg-[#DDD4C4] text-[#333]'
                  }`}
                >
                  {s.num}
                </span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        <span className="hidden md:inline text-[11px] font-mono text-[#66726A] shrink-0">
          Scroll to audit steps
        </span>
      </div>
    </nav>
  );
};

