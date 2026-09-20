import React from 'react';
import { CountryCode } from '../types';
import { Landmark, ArrowRight } from 'lucide-react';

interface StructuralContextCardProps {
  currentCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
}

export const StructuralContextCard: React.FC<StructuralContextCardProps> = ({
  currentCountry,
  onSelectCountry,
}) => {
  return (
    <section className="border-2 border-[#DDD4C4] bg-white p-5 sm:p-7 mb-8 text-xs font-mono shadow-xs rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-start justify-between border-b-2 border-[#EAE3D5] pb-4 mb-6 gap-2">
        <div className="flex items-center gap-2.5">
          <Landmark className="w-6 h-6 text-[#3A543E]" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#E09F3E] block">
              Comparative Institutional Governance Matrix
            </span>
            <h3 className="font-display uppercase text-2xl sm:text-3xl text-[#3A543E]">
              Three Divergent Roads Governance Archetypes
            </h3>
          </div>
        </div>
        <span className="text-[11px] text-[#3A543E] bg-[#F4EFE6] px-3 py-1 border border-[#DDD4C4] rounded-full font-bold">
          Statutory Powers &amp; Public Oversight
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model 1: Kenya */}
        <div
          className={`p-5 border-2 transition-all flex flex-col justify-between rounded-2xl ${
            currentCountry === 'KE'
              ? 'bg-white border-[#3A543E] ring-2 ring-[#E09F3E] shadow-sm'
              : 'bg-[#FAF7F2] border-[#EAE3D5] hover:bg-white'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xl text-[#1E2522]">Kenya</span>
              <span className="text-[10px] uppercase font-bold bg-[#E8F0EA] text-[#2E663B] px-2.5 py-0.5 border border-[#BBD7C2] rounded-full">
                KRB Unified Fund
              </span>
            </div>
            <div className="text-[#3A543E] font-bold text-[11px] mb-2 uppercase tracking-wide">
              Consolidated Statutory Clearinghouse
            </div>
            <p className="text-[#4A554E] text-xs leading-relaxed">
              Four specialized agencies (KeNHA trunk highways, KURA urban streets, KeRRA rural feeders, and County Works Departments) are financed through a single dedicated entity: the <strong>Kenya Roads Board (KRB)</strong>.
            </p>
            <div className="mt-3.5 p-3 bg-[#F4EFE6] border border-[#DDD4C4] rounded-xl text-[11px] text-[#556259]">
              <strong className="text-[#1E2522]">2025 Statutory Reform:</strong> The KRB Act (2025) compels every road agency to publish an annual public work programme and submit to forensic value-for-money technical audits.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE3D5]">
            {currentCountry !== 'KE' ? (
              <button
                type="button"
                onClick={() => onSelectCountry('KE')}
                className="text-[11px] text-[#3A543E] font-bold underline flex items-center gap-1 hover:text-[#BF532C] cursor-pointer"
              >
                Inspect Kenya Case Files <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[11px] text-[#2E663B] font-bold">✓ Currently Inspecting Kenya</span>
            )}
          </div>
        </div>

        {/* Model 2: Uganda */}
        <div
          className={`p-5 border-2 transition-all flex flex-col justify-between rounded-2xl ${
            currentCountry === 'UG'
              ? 'bg-white border-[#3A543E] ring-2 ring-[#E09F3E] shadow-sm'
              : 'bg-[#FAF7F2] border-[#EAE3D5] hover:bg-white'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xl text-[#1E2522]">Uganda</span>
              <span className="text-[10px] uppercase font-bold bg-[#FDF0EC] text-[#BF532C] px-2.5 py-0.5 border border-[#F2C7BB] rounded-full">
                Post-RAPEX Ministry
              </span>
            </div>
            <div className="text-[#BF532C] font-bold text-[11px] mb-2 uppercase tracking-wide">
              Dissolved Arms-Length Agency
            </div>
            <p className="text-[#4A554E] text-xs leading-relaxed">
              In December 2024, <strong>UNRA was dissolved</strong> under the Rationalisation of Government Agencies and Public Expenditure (RAPEX) and absorbed directly into the Ministry of Works and Transport.
            </p>
            <div className="mt-3.5 p-3 bg-[#F4EFE6] border border-[#DDD4C4] rounded-xl text-[11px] text-[#556259]">
              <strong className="text-[#8C5E1E]">Supervisory Void:</strong> Ugandan MPs have expressed serious concerns over who conducts independent technical oversight now that the separate authority no longer exists. External petitioning via the IGG ombudsman is vital.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE3D5]">
            {currentCountry !== 'UG' ? (
              <button
                type="button"
                onClick={() => onSelectCountry('UG')}
                className="text-[11px] text-[#3A543E] font-bold underline flex items-center gap-1 hover:text-[#BF532C] cursor-pointer"
              >
                Inspect Uganda Case Files <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[11px] text-[#2E663B] font-bold">✓ Currently Inspecting Uganda</span>
            )}
          </div>
        </div>

        {/* Model 3: Nigeria */}
        <div
          className={`p-5 border-2 transition-all flex flex-col justify-between rounded-2xl ${
            currentCountry === 'NG'
              ? 'bg-white border-[#3A543E] ring-2 ring-[#E09F3E] shadow-sm'
              : 'bg-[#FAF7F2] border-[#EAE3D5] hover:bg-white'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xl text-[#1E2522]">Nigeria</span>
              <span className="text-[10px] uppercase font-bold bg-[#FDF4E7] text-[#8C5E1E] px-2.5 py-0.5 border border-[#F4DCBE] rounded-full">
                Fragmented Silos
              </span>
            </div>
            <div className="text-[#8C5E1E] font-bold text-[11px] mb-2 uppercase tracking-wide">
              No Unified Cross-Tier Fund
            </div>
            <p className="text-[#4A554E] text-xs leading-relaxed">
              Federal roads (FERMA / Ministry of Works), State highways (State Ministries), and Local Government roads operate under isolated budgets with no overarching cross-tier clearinghouse.
            </p>
            <div className="mt-3.5 p-3 bg-[#F4EFE6] border border-[#DDD4C4] rounded-xl text-[11px] text-[#556259]">
              <strong className="text-[#1E2522]">Scale Paradox:</strong> LGA roads span ~134,000 km (over 67% of Nigeria's total network, vs ~35k federal and ~32k state) yet receive negligible capital maintenance allocations and virtually zero public audit scrutiny.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE3D5]">
            {currentCountry !== 'NG' ? (
              <button
                type="button"
                onClick={() => onSelectCountry('NG')}
                className="text-[11px] text-[#3A543E] font-bold underline flex items-center gap-1 hover:text-[#BF532C] cursor-pointer"
              >
                Inspect Nigeria Case Files <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[11px] text-[#2E663B] font-bold">✓ Currently Inspecting Nigeria</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
