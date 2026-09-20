import React from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/roadsData';
import { Landmark, ArrowRight, ShieldAlert, BookOpen, AlertCircle, Layers } from 'lucide-react';

interface StructuralContextCardProps {
  currentCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
}

export const StructuralContextCard: React.FC<StructuralContextCardProps> = ({
  currentCountry,
  onSelectCountry,
}) => {
  return (
    <section className="border-2 border-[#2C3034] bg-[#F2EDE2] p-5 sm:p-7 mb-8 text-xs font-mono shadow-xs rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-[#D8D0BF] pb-3.5 mb-5 gap-2">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-[#1D4ED8]" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1D4ED8] block">
              Comparative Institutional Governance Matrix
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#16191B]">
              Three Divergent Roads Governance Archetypes
            </h3>
          </div>
        </div>
        <span className="text-[11px] text-[#6A7075] bg-[#E5DFD1] px-2.5 py-1 border border-[#D5CCBA] rounded-md">
          Statutory Powers & Public Oversight
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model 1: Kenya */}
        <div
          className={`p-4.5 border-2 transition-all flex flex-col justify-between rounded-xl ${
            currentCountry === 'KE'
              ? 'bg-white border-[#1D4ED8] shadow-[3px_3px_0px_#1D4ED8]'
              : 'bg-[#EAE4D7] border-[#D5CCBA]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-lg text-[#16191B]">Kenya</span>
              <span className="text-[10px] uppercase font-bold bg-[#E7E2D5] px-2 py-0.5 border border-[#CFBEAA] rounded-md">
                KRB Unified Fund
              </span>
            </div>
            <div className="text-[#1D4ED8] font-semibold text-[11px] mb-2 uppercase tracking-wide">
              Consolidated Statutory Clearinghouse
            </div>
            <p className="text-[#3A3E42] font-serif text-xs leading-relaxed">
              Four specialized agencies (KeNHA trunk highways, KURA urban streets, KeRRA rural feeders, and County Works Departments) are financed through a single dedicated entity: the <strong>Kenya Roads Board (KRB)</strong>.
            </p>
            <div className="mt-3 p-2.5 bg-black/5 rounded-lg text-[11px] text-[#555A5F]">
              <strong className="text-[#1E2022]">2025 Statutory Reform:</strong> The KRB Act (2025) compels every road agency to publish an annual public work programme and submit to forensic value-for-money technical audits.
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#EAE3D3]">
            {currentCountry !== 'KE' ? (
              <button
                type="button"
                onClick={() => onSelectCountry('KE')}
                className="text-[11px] text-[#1D4ED8] font-bold underline flex items-center gap-1 hover:text-[#1E40AF] cursor-pointer"
              >
                Inspect Kenya Case Files <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[10px] text-[#1E6E38] font-bold">Currently Inspecting Kenya</span>
            )}
          </div>
        </div>

        {/* Model 2: Uganda */}
        <div
          className={`p-4.5 border-2 transition-all flex flex-col justify-between rounded-xl ${
            currentCountry === 'UG'
              ? 'bg-white border-[#1D4ED8] shadow-[3px_3px_0px_#1D4ED8]'
              : 'bg-[#EAE4D7] border-[#D5CCBA]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-lg text-[#16191B]">Uganda</span>
              <span className="text-[10px] uppercase font-bold bg-[#EFF6FF] text-[#1D4ED8] px-2 py-0.5 border border-[#BFDBFE] rounded-md">
                Post-RAPEX Ministry
              </span>
            </div>
            <div className="text-[#1D4ED8] font-semibold text-[11px] mb-2 uppercase tracking-wide">
              Dissolved Arms-Length Agency
            </div>
            <p className="text-[#3A3E42] font-serif text-xs leading-relaxed">
              In December 2024, <strong>UNRA was dissolved</strong> under the Rationalisation of Government Agencies and Public Expenditure (RAPEX) and absorbed directly into the Ministry of Works and Transport.
            </p>
            <div className="mt-3 p-2.5 bg-black/5 rounded-lg text-[11px] text-[#555A5F]">
              <strong className="text-amber-800">Supervisory Void:</strong> Ugandan MPs have expressed serious concerns over who conducts independent technical oversight now that the separate authority no longer exists. External petitioning via the IGG ombudsman is vital.
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#EAE3D3]">
            {currentCountry !== 'UG' ? (
              <button
                type="button"
                onClick={() => onSelectCountry('UG')}
                className="text-[11px] text-[#1D4ED8] font-bold underline flex items-center gap-1 hover:text-[#1E40AF] cursor-pointer"
              >
                Inspect Uganda Case Files <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[10px] text-[#1E6E38] font-bold">Currently Inspecting Uganda</span>
            )}
          </div>
        </div>

        {/* Model 3: Nigeria */}
        <div
          className={`p-4.5 border-2 transition-all flex flex-col justify-between rounded-xl ${
            currentCountry === 'NG'
              ? 'bg-white border-[#1D4ED8] shadow-[3px_3px_0px_#1D4ED8]'
              : 'bg-[#EAE4D7] border-[#D5CCBA]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-lg text-[#16191B]">Nigeria</span>
              <span className="text-[10px] uppercase font-bold bg-[#E7E2D5] px-2 py-0.5 border border-[#CFBEAA] rounded-md">
                Fragmented Silos
              </span>
            </div>
            <div className="text-[#1D4ED8] font-semibold text-[11px] mb-2 uppercase tracking-wide">
              No Unified Cross-Tier Fund
            </div>
            <p className="text-[#3A3E42] font-serif text-xs leading-relaxed">
              Federal roads (FERMA / Ministry of Works), State highways (State Ministries), and Local Government roads operate under isolated budgets with no overarching cross-tier clearinghouse.
            </p>
            <div className="mt-3 p-2.5 bg-black/5 rounded-lg text-[11px] text-[#555A5F]">
              <strong className="text-[#1E2022]">Scale Paradox:</strong> LGA roads span ~134,000 km (over 67% of Nigeria's total network, vs ~35k federal and ~32k state) yet receive negligible capital maintenance allocations and virtually zero public audit scrutiny.
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#EAE3D3]">
            {currentCountry !== 'NG' ? (
              <button
                type="button"
                onClick={() => onSelectCountry('NG')}
                className="text-[11px] text-[#1D4ED8] font-bold underline flex items-center gap-1 hover:text-[#1E40AF] cursor-pointer"
              >
                Inspect Nigeria Case Files <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[10px] text-[#1E6E38] font-bold">Currently Inspecting Nigeria</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
