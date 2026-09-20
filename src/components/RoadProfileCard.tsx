import React, { useState } from 'react';
import { CountryInfo, RoadProject } from '../types';
import {
  Building2,
  ShieldCheck,
  Banknote,
  Clock,
  MapPin,
  AlertTriangle,
  Scale,
  Info,
  Copy,
  Check,
  FileCheck,
} from 'lucide-react';
import { formatCurrency } from '../utils/calculator';

interface RoadProfileCardProps {
  project: RoadProject;
  country: CountryInfo;
}

export const RoadProfileCard: React.FC<RoadProfileCardProps> = ({ project, country }) => {
  const [copied, setCopied] = useState(false);
  const authority = country.authorities[project.roadClass];

  const statusColorMap = {
    completed: 'bg-[#E8EFE9] text-[#1E6E38] border-[#B9D7C0]',
    under_construction: 'bg-[#FFF6E5] text-[#856404] border-[#FFE0A3]',
    delayed: 'bg-rose-50 text-rose-700 border-rose-200',
    stalled: 'bg-[#F7EBEB] text-[#9E2A2B] border-[#E8B4B5]',
  };

  const statusLabelMap = {
    completed: 'Substantially Completed / Open to Traffic',
    under_construction: 'Active Construction / Execution Phase',
    delayed: 'Civil Works Delayed Past Contract Schedule',
    stalled: 'Halted / Deserted Operations on Ground',
  };

  const handleCopyFacts = () => {
    const summaryText = `CIVIC ROAD PROFILE: ${project.name}
Country: ${country.name}
Classification: ${project.roadClass.toUpperCase()}
Responsible Authority: ${authority.name} (${authority.code})
Statutory Mandate: ${authority.mandate}
Oversight Body: ${authority.oversightBody}
Corridor Length: ${project.lengthKm} km
Reported Budget: ${project.budgetDisplay} (${formatCurrency(project.budgetLocal, country.currency)})
Funding Source: ${project.fundingSource}
Status: ${project.status.toUpperCase()}
Source: ${project.sourceCitation}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="step-03-authority-profile" className="bg-white border border-[#2C3034] p-5 sm:p-7 mb-7 shadow-xs rounded-2xl">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-gray-200 pb-4 mb-5 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase bg-[#1D4ED8] text-white px-2 py-0.5 rounded">
              Step 03
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-600 font-semibold">
              Statutory Jurisdiction & Capital Financing
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#16191B]">
            Who's Responsible, and Who Pays
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-gray-500">Case Record:</span>
          <span className="font-mono font-bold text-[#1E2022] bg-gray-100 px-2 py-0.5 border border-gray-300 rounded">
            {project.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Case Docket Profile Box */}
      <div className="border border-[#CBD5E1] bg-white shadow-xs rounded-xl overflow-hidden">
        {/* Top Header of the Docket */}
        <div className="bg-[#F8FAFC] border-b border-gray-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-500 mb-1">
              <span className="flex items-center gap-1 font-bold text-[#1E2022] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#1D4ED8]" />
                {country.name}
              </span>
              <span>•</span>
              <span className="uppercase tracking-wider font-semibold">{project.roadClass} corridor</span>
              <span>•</span>
              <span className="text-[#1D4ED8] font-semibold">Authority: {authority.code}</span>
            </div>

            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#16191B] tracking-tight">
              {project.name}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className={`text-xs font-mono px-3 py-1 border font-bold rounded-md ${statusColorMap[project.status]}`}>
              ● {statusLabelMap[project.status]}
            </span>

            {project.isFlagshipReal ? (
              <span className="text-[11px] font-mono px-2.5 py-1 bg-[#1E2022] text-white font-bold rounded-md">
                Public Record
              </span>
            ) : (
              <span className="text-[11px] font-mono px-2.5 py-1 bg-gray-100 text-gray-600 border border-gray-300 font-semibold italic rounded-md">
                Illustrative Demo Entry
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Grid: Authority Details & Financial Particulars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x-2 divide-[#2C3034]">
          {/* Column A: Responsible Road Agency & Mandate */}
          <div className="p-5 sm:p-6 space-y-4.5 bg-white">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#1D4ED8] font-bold mb-1.5">
                <Building2 className="w-4 h-4" />
                Designated Statutory Road Authority
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-sm px-2 py-1 bg-[#1E2022] text-white font-bold shrink-0 mt-0.5 rounded">
                  {authority.code}
                </span>
                <div>
                  <h4 className="font-serif font-bold text-xl text-[#16191B] leading-tight">
                    {authority.name}
                  </h4>
                  <span className="text-xs font-mono text-[#6A7075] mt-0.5 block">
                    Statutory body responsible for this road classification
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF8F3] p-3.5 border-l-3 border-[#1D4ED8] border-y border-r border-[#E8E2D4] rounded-lg">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-[#6A7075] font-bold mb-1">
                Statutory Mandate Under Law:
              </span>
              <p className="text-xs text-[#2A2E33] leading-relaxed font-serif italic text-sm">
                "{authority.mandate}"
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#4A4F54] font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-[#3A6B48]" />
                Oversight & Audit Authority
              </div>
              <p className="text-xs text-[#1E2022] font-mono font-bold bg-[#F4F1E8] p-2 border border-[#D5CCBA] rounded-md">
                {authority.oversightBody}
              </p>
            </div>

            {/* Structural Institutional Callout (KRB vs RAPEX vs LGA) */}
            <div className="bg-[#F5EFE6] border-2 border-[#DDCFBE] p-3.5 text-xs rounded-lg">
              <div className="flex items-center gap-1.5 font-mono font-bold uppercase text-[#1D4ED8] mb-1.5 text-[11px]">
                <Info className="w-4 h-4" />
                Structural Institutional Governance Note
              </div>
              <p className="text-[#3E4246] leading-relaxed font-serif">
                {authority.structuralNote || country.governanceInsight.oversightStructure}
              </p>
            </div>
          </div>

          {/* Column B: Budget, Funding Source, Delivery Status */}
          <div className="p-5 sm:p-6 space-y-4.5 bg-[#FAF9F5]">
            {/* Primary Metrics Row */}
            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-[#D8D0BF]">
              <div className="bg-white p-3 border border-[#DCD4C3] rounded-lg">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6A7075] flex items-center gap-1 font-bold">
                  <Banknote className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  Reported Budget
                </span>
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#16191B] block mt-1">
                  {project.budgetDisplay}
                </span>
                <span className="text-[11px] font-mono text-[#7A8187] block mt-0.5">
                  {formatCurrency(project.budgetLocal, country.currency)}
                </span>
              </div>

              <div className="bg-white p-3 border border-[#DCD4C3] rounded-lg">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6A7075] flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  Length of Works
                </span>
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#16191B] block mt-1">
                  {project.lengthKm} Kilometers
                </span>
                <span className="text-[11px] font-mono text-[#7A8187] block mt-0.5">
                  Classified corridor segment
                </span>
              </div>
            </div>

            {/* Funding Channel */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6A7075] font-bold block mb-1">
                Financing Mechanism & Development Partners
              </span>
              <p className="text-xs font-mono font-semibold text-[#1E2022] bg-white p-2.5 border border-[#DCD4C3] rounded-lg">
                {project.fundingSource}
              </p>
              {project.contractorOrPartner && (
                <div className="mt-1 text-[11px] font-mono text-[#5A6065]">
                  Contractor / Partner: <strong className="text-[#1E2022]">{project.contractorOrPartner}</strong>
                </div>
              )}
            </div>

            {/* Delivery Timeline and Notes */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6A7075] font-bold block mb-1">
                Reported Delivery Progress & Official Timeline
              </span>
              <p className="text-xs text-[#3E4348] font-serif leading-relaxed bg-white p-2.5 border border-[#DCD4C3] rounded-lg">
                {project.statusNotes}
              </p>
              {project.awardYear && (
                <div className="mt-2 text-[11px] font-mono text-[#6A7075]">
                  Award / Contract Year: <strong className="text-[#1E2022]">{project.awardYear}</strong>
                  {project.targetCompletionYear && (
                    <> • Target Year: <strong className="text-[#1E2022]">{project.targetCompletionYear}</strong></>
                  )}
                </div>
              )}
            </div>

            {/* Delivery Alert if present */}
            {project.delayAlert && (
              <div className="bg-rose-50 border-2 border-rose-200 p-3 text-xs font-mono text-rose-800 flex items-start gap-2.5 rounded-lg">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <strong className="block font-bold uppercase tracking-wider text-[11px]">
                    Delivery Delay Signal Flagged
                  </strong>
                  <span className="text-xs leading-normal">{project.delayAlert}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Toolbar */}
        <div className="border-t-2 border-[#2C3034] bg-[#EFEAE0] p-3.5 px-5 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-[#555A5F]">
            <strong>Data Source:</strong> {project.sourceCitation}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyFacts}
              className="px-3 py-1.5 bg-white border border-[#2C3034] hover:bg-[#FAF9F5] text-xs font-mono uppercase font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#1E6E38]" /> : <Copy className="w-3.5 h-3.5 text-[#1D4ED8]" />}
              {copied ? 'Facts Copied' : 'Copy Case Facts'}
            </button>
            <a
              href="#step-04-budget-comparison"
              className="px-3 py-1.5 bg-[#1D4ED8] text-white hover:bg-[#1E40AF] text-xs font-mono uppercase font-bold flex items-center gap-1 rounded-lg"
            >
              Analyze Cost / km ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
