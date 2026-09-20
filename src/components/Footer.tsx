import React from 'react';
import { Shield, Info, Scale } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#CBD5E1] bg-white text-[#2C3034] text-xs mt-12 pt-8 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Columnar Disclosures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-200">
          {/* Col 1: Data Provenance */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#1D4ED8] text-[11px]">
              <Info className="w-3.5 h-3.5" />
              Data Provenance & Disclosures
            </div>
            <p className="text-gray-600 leading-relaxed text-xs">
              <strong>Flagship projects</strong> (e.g. Nairobi Western Bypass, Dongo Kundu Bypass, Nairobi–Mombasa Expressway, Kampala–Entebbe Expressway, Lagos–Ibadan Expressway) reflect publicly verified procurement figures, parliamentary audit reports, and statutory agency disclosures.
            </p>
            <p className="text-gray-600 leading-relaxed text-xs">
              Local and rural road entries are calibrated against standard ministerial unit cost schedules to demonstrate statutory jurisdiction and benchmark classification.
            </p>
          </div>

          {/* Col 2: Universal Benchmarks & FX Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#1D4ED8] text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              Benchmark Methodology
            </div>
            <p className="text-gray-600 leading-relaxed text-xs">
              Universal cost-per-kilometer comparison corridors are adapted from comparative multilateral development bank databases (World Bank, AfDB):
            </p>
            <ul className="text-[11px] text-gray-600 space-y-0.5 list-disc pl-4">
              <li>National / Federal Carriageways: $0.5M – $7.0M / km</li>
              <li>Urban Arterial Corridors: $0.12M – $0.47M / km</li>
              <li>Rural Feeder Links: $0.03M – $0.11M / km</li>
              <li>Local / County / LGA Roads: $0.08M – $0.35M / km</li>
            </ul>
            <p className="text-[10px] text-gray-500 italic pt-1">
              Indicative FX rates: 1 USD ≈ 129 KES | 3,700 UGX | 1,550 NGN.
            </p>
          </div>

          {/* Col 3: Civic Redress & Ombudsman Access */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#1D4ED8] text-[11px]">
              <Scale className="w-3.5 h-3.5" />
              Constitutional Redress & Public Oversight
            </div>
            <p className="text-gray-600 leading-relaxed text-xs">
              Directly connects citizen observations with constitutional oversight bodies: the Commission on Administrative Justice (Kenya), the Inspectorate of Government (Uganda), and the Public Complaints Commission (Nigeria).
            </p>
            <p className="text-gray-600 leading-relaxed text-xs">
              Empowers residents with verified statutory agency mandates, procurement transparency benchmarks, and structured public grievance dockets.
            </p>
          </div>
        </div>

        {/* Bottom copyright and legal statement */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500 pt-2">
          <div>
            <strong className="text-gray-800">Civic Ledger</strong> — Public Infrastructure & Capital Works Accountability Engine
            <span className="block text-[10px] text-gray-400 mt-0.5">
              Auditing national & local roads today • Multi-sector expansion roadmap active for water, healthcare, schools, and rural energy
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Free & Open Public Utility</span>
            <span>•</span>
            <span>Zero Tracking or Commercial Ads</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
