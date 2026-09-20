import React from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/roadsData';
import { BookmarkCheck, ArrowDown, ShieldCheck, MapPin, Scale } from 'lucide-react';
import { ConcentricArcs, DotGrid } from './CivicDecorations';

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
    <header id="step-01-jurisdiction" className="relative bg-[#F4EFE6] border-b-2 border-[#DDD4C4] text-[#1E2522] overflow-hidden">
      {/* Top right Terracotta block from slide motif */}
      <div className="absolute top-0 right-0 w-36 sm:w-56 h-12 sm:h-16 bg-[#BF532C] rounded-bl-3xl hidden xs:block" />

      {/* Top right Concentric Arcs */}
      <div className="absolute top-2 right-4 sm:right-8 opacity-75 hidden sm:block">
        <ConcentricArcs size={140} color="#1E2522" orientation="top-right" />
      </div>

      {/* Top Left Dot Grid */}
      <div className="absolute top-6 left-6 opacity-60 hidden md:block">
        <DotGrid rows={3} cols={6} color="#3A543E" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 sm:pb-10 relative z-10">
        {/* Module Badge & Sprint Eyebrow */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 bg-[#E09F3E] text-[#1E2522] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full shadow-xs">
            MODULE 01 · ROADS
          </span>
          <span className="text-xs font-mono uppercase font-semibold tracking-wider text-[#3A543E]">
            CIVIC PARTICIPATION &amp; ACCOUNTABILITY LEDGER
          </span>
        </div>

        {/* Main Display Headline in Bold Condensed Typography matching slide theme */}
        <div className="mt-4 sm:mt-5">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display uppercase tracking-tight leading-none text-[#3A543E]">
            CIVIC LEDGER
          </h1>
          <p className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#BF532C] tracking-tight">
            Understanding Community, Government &amp; Public Infrastructure
          </p>
        </div>

        {/* Educational Mission Lead */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#2D3530] leading-relaxed max-w-3xl">
          Track who is legally responsible for each road corridor, how much taxpayer money was budgeted per kilometer, whether the ground truth matches public tenders, and where to petition for constitutional redress.
        </p>

        {/* Country Jurisdiction Selector (Styled as organic friendly pills) */}
        <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#3A543E] mr-1">
            SELECT JURISDICTION:
          </span>
          {countryOptions.map(({ code, label }) => {
            const isSelected = currentCountry === code;
            return (
              <button
                key={code}
                type="button"
                id={`country-pill-${code.toLowerCase()}`}
                onClick={() => onSelectCountry(code)}
                className={`px-6 sm:px-8 py-2.5 rounded-full text-base sm:text-lg font-bold transition-all focus:outline-hidden ${
                  isSelected
                    ? 'bg-[#E09F3E] text-[#1E2522] shadow-sm ring-2 ring-[#3A543E]/30 scale-105'
                    : 'bg-[#E5DDCF] text-[#3A543E] hover:bg-[#D9D0BF]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Civic Quick Facts Strip */}
        <div className="mt-7 pt-4 border-t border-[#DDD4C4] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#4A554E]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#BF532C]" />
              Auditing: <strong className="text-[#1E2522]">{country.name}</strong> ({country.currency})
            </span>
            <span className="hidden sm:inline text-[#C0B7A6]">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3A543E]" />
              Ombudsman: <strong className="text-[#1E2522]">{country.complaintsBody.shortName}</strong>
            </span>
            <span className="hidden md:inline text-[#C0B7A6]">|</span>
            <span className="hidden md:inline flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#E09F3E]" />
              FX Benchmark: <span className="text-[#1E2522]">{country.fxNote}</span>
            </span>
          </div>

          <a
            href="#expansion-roadmap"
            className="text-[#3A543E] hover:text-[#BF532C] font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Multi-Sector Civic Roadmap</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Active Road Case Docket Card (Styled like Slide Card) */}
        {activeRoadName && (
          <div className="mt-5 bg-white border-2 border-[#DDD4C4] p-4 sm:p-5 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#3A543E] text-[#F4EFE6] rounded-xl">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#BF532C] font-bold">
                  Active Civic Docket
                </div>
                <div className="text-lg sm:text-xl font-bold text-[#1E2522] leading-tight flex items-center gap-2">
                  <span>{activeRoadName}</span>
                  {activeRoadClass && (
                    <span className="text-xs uppercase px-2.5 py-0.5 bg-[#F4EFE6] border border-[#DDD4C4] text-[#3A543E] rounded-md font-mono font-bold">
                      {activeRoadClass}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono font-semibold">
              <a
                href="#step-02-road-selector"
                className="px-3 py-1.5 rounded-lg bg-[#F4EFE6] text-[#3A543E] hover:bg-[#EAE3D5] flex items-center gap-1 transition-colors"
              >
                Change Road <ArrowDown className="w-3 h-3" />
              </a>
              <a
                href="#step-04-budget-comparison"
                className="px-3 py-1.5 rounded-lg bg-[#F4EFE6] text-[#3A543E] hover:bg-[#EAE3D5] flex items-center gap-1 transition-colors"
              >
                Cost per km <ArrowDown className="w-3 h-3" />
              </a>
              <a
                href="#step-05-citizen-verification"
                className="px-3.5 py-1.5 rounded-lg bg-[#BF532C] text-white hover:bg-[#A64522] flex items-center gap-1 transition-colors shadow-xs"
              >
                File Petition <ArrowDown className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
