import React from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/roadsData';
import { BookmarkCheck, ArrowDown, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
  activeRoadName?: string;
  activeRoadClass?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentCountry,
  onSelectCountry,
  activeRoadName,
  activeRoadClass,
}) => {
  const country = COUNTRIES[currentCountry];

  const countryOptions: { code: CountryCode; label: string }[] = [
    { code: 'KE', label: 'Kenya' },
    { code: 'UG', label: 'Uganda' },
    { code: 'NG', label: 'Nigeria' },
  ];

  return (
    <header id="step-01-jurisdiction" className="bg-[#F4EFEA] border-b border-[#E3DACF] text-[#1E2022]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-7 sm:pb-9">
        {/* Eyebrow Label */}
        <div className="text-xs sm:text-sm font-mono uppercase font-bold tracking-[0.14em] text-[#9A5832]">
          CIVIC PROTOTYPE — OSF × ANDELA INVENTION SPRINT
        </div>

        {/* Brand Logo Title */}
        <div className="mt-3 sm:mt-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none">
            <span className="font-brand-serif font-black text-[#181B1E]">Civic</span>
            <span className="font-brand-serif italic font-bold text-[#A45731]">Ledger</span>
          </h1>
        </div>

        {/* Module Subtitle */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-baseline gap-1.5 text-xs sm:text-sm">
          <span className="font-mono font-bold tracking-wider text-[#181B1E] uppercase">
            MODULE 01 · ROADS
          </span>
          <span className="italic text-[#555C62] font-serif font-normal">
            — hospitals, schools & other public projects next
          </span>
        </div>

        {/* Mission Statement */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-[#2D3237] font-serif leading-relaxed max-w-3xl">
          Understand who's responsible for a public project, what it was budgeted to cost, whether it was actually delivered — and where to take it if it wasn't.
        </p>

        {/* Country Selection Pills */}
        <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
          {countryOptions.map(({ code, label }) => {
            const isSelected = currentCountry === code;
            return (
              <button
                key={code}
                type="button"
                id={`country-pill-${code.toLowerCase()}`}
                onClick={() => onSelectCountry(code)}
                className={`px-6 sm:px-7 py-2.5 rounded-full text-base sm:text-lg transition-all focus:outline-hidden ${
                  isSelected
                    ? 'border border-[#A45731] text-[#9E5732] bg-[#ECE3DA] font-semibold shadow-xs ring-1 ring-[#A45731]/30'
                    : 'border border-transparent bg-[#EAE2D8] text-[#1E2022] hover:bg-[#E2D9CE] font-normal'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Active Country Context Indicator */}
        <div className="mt-6 pt-4 border-t border-[#E3DACF]/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#5A6065]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span>
              Inspecting: <strong className="text-[#181B1E]">{country.name}</strong> ({country.currency})
            </span>
            <span className="hidden sm:inline text-[#CBD5E1]">|</span>
            <span>
              Primary Ombudsman: <strong className="text-[#181B1E]">{country.complaintsBody.shortName}</strong>
            </span>
            <span className="hidden md:inline text-[#CBD5E1]">|</span>
            <span className="hidden md:inline">
              Benchmark FX: <span className="text-[#181B1E]">{country.fxNote}</span>
            </span>
          </div>

          <a
            href="#expansion-roadmap"
            className="text-[#9E5732] hover:text-[#7A4022] font-semibold flex items-center gap-1 transition-colors"
          >
            <span>View Multi-Sector Roadmap</span>
            <ArrowDown className="w-3 h-3" />
          </a>
        </div>

        {/* Active Road Case Docket Ribbon (if selected) */}
        {activeRoadName && (
          <div className="mt-4 bg-white/80 backdrop-blur-xs border border-[#D5C9BA] p-3 px-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono rounded-xl shadow-xs">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-[#A45731]" />
              <span className="text-[#64748B] uppercase">Active Case Docket:</span>
              <span className="font-serif font-bold text-sm text-[#181B1E]">{activeRoadName}</span>
              {activeRoadClass && (
                <span className="text-[10px] uppercase px-2 py-0.5 bg-[#F4EFEA] border border-[#D5C9BA] text-[#555A5F] rounded-md font-bold">
                  {activeRoadClass}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#6A7075]">
              <a href="#step-02-road-selector" className="hover:text-[#9E5732] hover:underline flex items-center gap-0.5">
                Change Road <ArrowDown className="w-3 h-3" />
              </a>
              <span>•</span>
              <a href="#step-04-budget-comparison" className="hover:text-[#9E5732] hover:underline flex items-center gap-0.5">
                Cost Benchmarks <ArrowDown className="w-3 h-3" />
              </a>
              <span>•</span>
              <a href="#step-05-citizen-verification" className="text-[#9E5732] font-bold hover:underline flex items-center gap-0.5">
                File Complaint <ArrowDown className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
