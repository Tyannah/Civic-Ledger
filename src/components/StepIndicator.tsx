import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { num: '01', id: 'step-01-jurisdiction', title: 'Jurisdiction', sub: 'Country & legal context' },
    { num: '02', id: 'step-02-road-selector', title: 'Road Corridor', sub: 'Classification & tenure' },
    { num: '03', id: 'step-03-authority-profile', title: 'Responsibility', sub: 'Authority & mandate' },
    { num: '04', id: 'step-04-budget-comparison', title: 'Cost Analysis', sub: 'Budget per km' },
    { num: '05', id: 'step-05-citizen-verification', title: 'Ground Truth', sub: 'Citizen verification' },
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
      className="sticky top-0 z-30 bg-[#F4EFE6]/95 backdrop-blur-md border-b-2 border-[#DDD4C4] py-2.5 px-4 shadow-xs"
    >
      <div className="max-w-6xl mx-auto">
        <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-sans">
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isCurrent = currentStep === stepNum;

            return (
              <li key={s.num}>
                <button
                  type="button"
                  onClick={() => handleScrollTo(s.id)}
                  className={`w-full text-left p-2.5 border-2 transition-all flex flex-col justify-between cursor-pointer rounded-xl ${
                    isCurrent
                      ? 'bg-white border-[#3A543E] text-[#1E2522] shadow-sm'
                      : 'bg-[#EFE9DD] border-transparent text-[#4A554E] hover:bg-white hover:border-[#DDD4C4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isCurrent
                          ? 'bg-[#E09F3E] text-[#1E2522]'
                          : 'bg-[#3A543E] text-white'
                      }`}
                    >
                      {s.num}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-[#66726A] flex items-center gap-0.5 hover:text-[#BF532C]">
                      Jump <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div className="mt-1 font-bold text-xs sm:text-sm tracking-tight truncate text-[#1E2522]">
                    {s.title}
                  </div>
                  <div className="text-[10px] truncate text-[#66726A]">{s.sub}</div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
