import React from 'react';
import { Shield, Info, Scale } from 'lucide-react';
import { DotGrid } from './CivicDecorations';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-[#DDD4C4] bg-[#FAF7F2] text-[#1E2522] text-xs mt-14 pt-10 pb-14 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Columnar Disclosures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-[#EAE3D5]">
          {/* Col 1: Data Provenance */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#3A543E] text-[11px]">
              <Info className="w-3.5 h-3.5 text-[#BF532C]" />
              Data Provenance &amp; Disclosures
            </div>
            <p className="text-[#556259] leading-relaxed text-xs">
              <strong>Flagship projects</strong> (e.g. Nairobi Western Bypass, Dongo Kundu Bypass, Nairobi–Mombasa Expressway, Kampala–Entebbe Expressway, Lagos–Ibadan Expressway) reflect publicly verified procurement figures, parliamentary audit reports, and statutory agency disclosures.
            </p>
            <p className="text-[#556259] leading-relaxed text-xs">
              Local and rural road entries are calibrated against standard ministerial unit cost schedules to demonstrate statutory jurisdiction and benchmark classification.
            </p>
          </div>

          {/* Col 2: Universal Benchmarks & FX Notes */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#3A543E] text-[11px]">
              <Shield className="w-3.5 h-3.5 text-[#BF532C]" />
              Benchmark Methodology
            </div>
            <p className="text-[#556259] leading-relaxed text-xs">
              Universal cost-per-kilometer comparison corridors are adapted from comparative multilateral development bank databases (World Bank, AfDB):
            </p>
            <ul className="text-[11px] font-mono text-[#556259] space-y-1 list-disc pl-4">
              <li>National / Federal Carriageways: $0.5M – $7.0M / km</li>
              <li>Urban Arterial Corridors: $0.12M – $0.47M / km</li>
              <li>Rural Feeder Links: $0.03M – $0.11M / km</li>
              <li>Local / County / LGA Roads: $0.08M – $0.35M / km</li>
            </ul>
            <p className="text-[10px] font-mono text-[#66726A] italic pt-1">
              Indicative FX rates: 1 USD ≈ 129 KES | 3,700 UGX | 1,550 NGN.
            </p>
          </div>

          {/* Col 3: Civic Redress & Ombudsman Access */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#3A543E] text-[11px]">
              <Scale className="w-3.5 h-3.5 text-[#BF532C]" />
              Constitutional Redress &amp; Public Oversight
            </div>
            <p className="text-[#556259] leading-relaxed text-xs">
              Directly connects citizen observations with constitutional oversight bodies: the Commission on Administrative Justice (Kenya), the Inspectorate of Government (Uganda), and the Public Complaints Commission (Nigeria).
            </p>
            <p className="text-[#556259] leading-relaxed text-xs">
              Empowers residents with verified statutory agency mandates, procurement transparency benchmarks, and structured public grievance dockets.
            </p>
          </div>
        </div>

        {/* Bottom copyright and legal statement */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#66726A] pt-2">
          <div>
            <strong className="text-[#1E2522]">Civic Ledger</strong> — Public Infrastructure &amp; Capital Works Accountability Engine
            <span className="block text-[10px] text-[#66726A] mt-0.5">
              Auditing national &amp; local roads with statutory oversight and citizen verification
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white px-3 py-1 border border-[#DDD4C4] rounded-full text-[#3A543E] font-bold">
              Free &amp; Open Public Utility
            </span>
            <span>•</span>
            <span className="text-[#556259]">Zero Tracking or Commercial Ads</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
