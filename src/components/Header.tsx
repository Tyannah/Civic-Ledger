import React from 'react';
import { CountryCode } from '../types';

interface HeaderProps {
  currentCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
  activeRoadName?: string;
  activeRoadClass?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentCountry,
  onSelectCountry,
}) => {
  const countryOptions: { code: CountryCode; label: string }[] = [
    { code: 'KE', label: 'Kenya' },
    { code: 'UG', label: 'Uganda' },
    { code: 'NG', label: 'Nigeria' },
  ];

  return (
    <header id="step-01-jurisdiction" className="bg-[#F4EFE6] border-b border-[#DDD4C4] text-[#1E2522]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Top Eyebrow & Jurisdiction Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2D8C6]">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 bg-[#3A543E] text-white font-mono text-[11px] font-bold uppercase tracking-wider rounded-md">
              Module 01 • Roads
            </span>
            <span className="text-xs font-mono uppercase font-semibold text-[#556259]">
              Public Infrastructure Accountability
            </span>
          </div>

          {/* Clean Jurisdiction Switcher */}
          <div className="flex items-center gap-1.5 bg-[#EAE3D5] p-1 rounded-full border border-[#DDD4C4] self-start sm:self-auto">
            <span className="text-[10px] font-mono font-bold uppercase text-[#556259] px-2.5">
              Country:
            </span>
            {countryOptions.map(({ code, label }) => {
              const isSelected = currentCountry === code;
              return (
                <button
                  key={code}
                  type="button"
                  id={`country-pill-${code.toLowerCase()}`}
                  onClick={() => onSelectCountry(code)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#3A543E] text-white shadow-2xs'
                      : 'text-[#4A554E] hover:text-[#1E2522] hover:bg-white/60'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Headline & Concise Mission Statement */}
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-[#1E2522] leading-none">
            Civic Ledger
          </h1>
          <p className="mt-2 text-lg sm:text-xl font-medium text-[#BF532C] tracking-tight">
            Understanding Government Body Roles &amp; Responsibilities
          </p>
          <p className="mt-2.5 text-sm sm:text-base text-[#4A554E] leading-relaxed">
            Understand who's responsible for a public project, what it was budgeted to cost, whether it was actually delivered — and where to take it if it wasn't.
          </p>
        </div>
      </div>
    </header>
  );
};
