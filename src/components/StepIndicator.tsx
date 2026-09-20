import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { num: '01', id: 'step-01-jurisdiction', title: 'Jurisdiction', sub: 'Country context & FX' },
    { num: '02', id: 'step-02-road-selector', title: 'Find Road', sub: 'Seed list or describe' },
    { num: '03', id: 'step-03-authority-profile', title: 'Responsibility', sub: 'Authority & mandate' },
    { num: '04', id: 'step-04-budget-comparison', title: 'Cost Analysis', sub: 'Budget per km' },
    { num: '05', id: 'step-05-citizen-verification', title: 'Ground Truth', sub: 'Verify & petition' },
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
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-[#2C3034] py-2 px-4 shadow-xs"
    >
      <div className="max-w-6xl mx-auto">
        <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <li key={s.num}>
                <button
                  type="button"
                  onClick={() => handleScrollTo(s.id)}
                  className={`w-full text-left p-2 border transition-all flex flex-col justify-between cursor-pointer rounded-lg ${
                    isCurrent
                      ? 'bg-white border-[#1E2022] text-[#1E2022] ring-1 ring-[#1D4ED8] shadow-[1px_1px_0px_#1E2022]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:bg-white hover:border-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 border rounded ${
                        isCurrent
                          ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                          : 'bg-[#1E2022] text-white border-[#1E2022]'
                      }`}
                    >
                      {s.num}
                    </span>
                    <span className="text-[10px] text-[#7A8187] flex items-center gap-0.5 hover:text-[#1D4ED8]">
                      Jump <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div className="mt-1 font-serif font-bold text-sm tracking-tight truncate text-[#16191B]">
                    {s.title}
                  </div>
                  <div className="text-[10px] truncate text-[#6A7075]">{s.sub}</div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
