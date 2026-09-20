import React, { useState } from 'react';
import { CountryInfo, RoadProject } from '../types';
import {
  Building2,
  ShieldCheck,
  Banknote,
  Clock,
  MapPin,
  AlertTriangle,
  Info,
  Copy,
  Check,
  Headphones,
} from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import { DotGrid } from './CivicDecorations';
import { RoadAudioModule } from './RoadAudioModule';

interface RoadProfileCardProps {
  project: RoadProject;
  country: CountryInfo;
}

export const RoadProfileCard: React.FC<RoadProfileCardProps> = ({ project, country }) => {
  const [copied, setCopied] = useState(false);
  const authority = country.authorities[project.roadClass];

  const effectiveCountryCode = project.countryCode || country.code;
  const audioBadgeText =
    effectiveCountryCode === 'KE'
      ? 'Audio (Kiswahili 🇰🇪)'
      : effectiveCountryCode === 'UG'
      ? 'Audio (English / Luganda 🇺🇬)'
      : 'Audio (Overview 🇳🇬)';
  const audioBadgeTooltip =
    effectiveCountryCode === 'KE'
      ? 'Listen to Kenya road overview in Kiswahili'
      : effectiveCountryCode === 'UG'
      ? 'Listen to English overview for the Luganda corridor'
      : 'Listen to road overview in English';

  const statusColorMap = {
    completed: 'bg-[#E8F0EA] text-[#2E663B] border-[#BBD7C2]',
    under_construction: 'bg-[#FDF4E7] text-[#8C5E1E] border-[#F4DCBE]',
    delayed: 'bg-[#FDF0EC] text-[#BF532C] border-[#F2C7BB]',
    stalled: 'bg-[#FDF0EC] text-[#9E2A2B] border-[#E8B4B5]',
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
    <section id="step-03-authority-profile" className="relative bg-white border-2 border-[#DDD4C4] p-5 sm:p-7 mb-8 rounded-2xl shadow-xs overflow-hidden">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-2 border-[#EAE3D5] pb-4 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold uppercase bg-[#E09F3E] text-[#1E2522] px-3 py-0.5 rounded-full shadow-xs">
              Step 03
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#3A543E] font-bold">
              Statutory Jurisdiction &amp; Capital Financing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-wide text-[#3A543E]">
            Who's Responsible, and Who Pays
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#66726A]">Case Record:</span>
          <span className="font-mono font-bold text-[#1E2522] bg-[#F4EFE6] px-3 py-1 border border-[#DDD4C4] rounded-full">
            {project.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Case Docket Profile Box */}
      <div className="border-2 border-[#DDD4C4] bg-white rounded-2xl overflow-hidden shadow-xs">
        {/* Top Header of the Docket (Slide 2 Style Forest Green banner) */}
        <div className="bg-[#3A543E] text-[#F4EFE6] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none hidden md:block">
            <DotGrid rows={3} cols={6} color="#F4EFE6" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#F4EFE6]/80 mb-1.5">
              <span className="flex items-center gap-1 font-bold text-[#E09F3E] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                {country.name}
              </span>
              <span>•</span>
              <span className="uppercase tracking-wider font-semibold">{project.roadClass} corridor</span>
              <span>•</span>
              <span className="text-[#F4EFE6] font-semibold">Authority: {authority.code}</span>
            </div>

            <h3 className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {project.name}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 relative z-10">
            <a
              href="#road-audio-module"
              className="text-xs font-mono px-3.5 py-1.5 bg-[#F4EFE6] hover:bg-white text-[#1E2522] border border-[#DDD4C4] font-bold rounded-full flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title={audioBadgeTooltip}
            >
              <Headphones className="w-3.5 h-3.5 text-[#BF532C]" />
              <span>{audioBadgeText}</span>
            </a>

            <span className={`text-xs font-mono px-3.5 py-1.5 border font-bold rounded-full ${statusColorMap[project.status]}`}>
              ● {statusLabelMap[project.status]}
            </span>

            {project.isFlagshipReal ? (
              <span className="text-[11px] font-mono px-3 py-1.5 bg-[#E09F3E] text-[#1E2522] font-bold rounded-full">
                Public Record
              </span>
            ) : (
              <span className="text-[11px] font-mono px-3 py-1.5 bg-white/15 text-[#F4EFE6] border border-white/20 font-semibold italic rounded-full">
                Illustrative Case Entry
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Grid: Authority Details & Financial Particulars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x-2 divide-[#EAE3D5]">
          {/* Column A: Responsible Road Agency & Mandate */}
          <div className="p-6 space-y-4 bg-white">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#3A543E] font-bold mb-2">
                <Building2 className="w-4 h-4 text-[#BF532C]" />
                Designated Statutory Road Authority
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono text-sm px-2.5 py-1 bg-[#3A543E] text-white font-bold shrink-0 mt-0.5 rounded-lg">
                  {authority.code}
                </span>
                <div>
                  <h4 className="font-bold text-xl text-[#1E2522] leading-tight">
                    {authority.name}
                  </h4>
                  <span className="text-xs font-mono text-[#66726A] mt-1 block">
                    Statutory body responsible for this road classification
                  </span>
                </div>
              </div>
            </div>

            {/* Mandate Card (Slide Card Style) */}
            <div className="bg-[#FAF7F2] p-4 border-l-4 border-[#E09F3E] border-y border-r border-[#EAE3D5] rounded-xl">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-[#66726A] font-bold mb-1.5">
                Statutory Mandate Under Law:
              </span>
              <p className="text-xs text-[#2A332C] leading-relaxed italic text-sm">
                "{authority.mandate}"
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#3A543E] font-bold mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2E663B]" />
                Oversight &amp; Audit Authority
              </div>
              <p className="text-xs text-[#1E2522] font-mono font-bold bg-[#F4EFE6] p-2.5 border border-[#DDD4C4] rounded-xl">
                {authority.oversightBody}
              </p>
            </div>

            {/* Structural Institutional Callout */}
            <div className="bg-[#F4EFE6] border border-[#DDD4C4] p-4 text-xs rounded-xl">
              <div className="flex items-center gap-1.5 font-mono font-bold uppercase text-[#BF532C] mb-1.5 text-[11px]">
                <Info className="w-4 h-4" />
                Structural Institutional Governance Note
              </div>
              <p className="text-[#3E4741] leading-relaxed">
                {authority.structuralNote || country.governanceInsight.oversightStructure}
              </p>
            </div>
          </div>

          {/* Column B: Budget, Funding Source, Delivery Status */}
          <div className="p-6 space-y-4 bg-[#FAF7F2]">
            {/* Primary Metrics Row */}
            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-[#EAE3D5]">
              <div className="bg-white p-4 border border-[#DDD4C4] rounded-xl shadow-2xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#66726A] flex items-center gap-1 font-bold">
                  <Banknote className="w-3.5 h-3.5 text-[#3A543E]" />
                  Reported Budget
                </span>
                <span className="font-bold text-xl sm:text-2xl text-[#1E2522] block mt-1">
                  {project.budgetDisplay}
                </span>
                <span className="text-[11px] font-mono text-[#66726A] block mt-0.5">
                  {formatCurrency(project.budgetLocal, country.currency)}
                </span>
              </div>

              <div className="bg-white p-4 border border-[#DDD4C4] rounded-xl shadow-2xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#66726A] flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#3A543E]" />
                  Length of Works
                </span>
                <span className="font-bold text-xl sm:text-2xl text-[#1E2522] block mt-1">
                  {project.lengthKm} Kilometers
                </span>
                <span className="text-[11px] font-mono text-[#66726A] block mt-0.5">
                  Classified corridor segment
                </span>
              </div>
            </div>

            {/* Funding Channel */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#66726A] font-bold block mb-1.5">
                Financing Mechanism &amp; Development Partners
              </span>
              <p className="text-xs font-mono font-bold text-[#1E2522] bg-white p-3 border border-[#DDD4C4] rounded-xl">
                {project.fundingSource}
              </p>
              {project.contractorOrPartner && (
                <div className="mt-1.5 text-[11px] font-mono text-[#556259]">
                  Contractor / Partner: <strong className="text-[#1E2522]">{project.contractorOrPartner}</strong>
                </div>
              )}
            </div>

            {/* Delivery Timeline and Notes */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#66726A] font-bold block mb-1.5">
                Reported Delivery Progress &amp; Official Timeline
              </span>
              <p className="text-xs text-[#3E4741] leading-relaxed bg-white p-3 border border-[#DDD4C4] rounded-xl">
                {project.statusNotes}
              </p>
              {project.awardYear && (
                <div className="mt-2 text-[11px] font-mono text-[#66726A]">
                  Award / Contract Year: <strong className="text-[#1E2522]">{project.awardYear}</strong>
                  {project.targetCompletionYear && (
                    <> • Target Year: <strong className="text-[#1E2522]">{project.targetCompletionYear}</strong></>
                  )}
                </div>
              )}
            </div>

            {/* Delivery Alert if present */}
            {project.delayAlert && (
              <div className="bg-[#FDF0EC] border border-[#F2C7BB] p-3 text-xs font-mono text-[#7A2E12] flex items-start gap-2.5 rounded-xl">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#BF532C]" />
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

        {/* Integrated Civic Audio Desk: Luganda & Kiswahili Briefing */}
        <div className="border-t-2 border-[#EAE3D5] p-5 sm:p-7 bg-[#FAF7F2]">
          <RoadAudioModule project={project} country={country} />
        </div>

        {/* Bottom Toolbar */}
        <div className="border-t-2 border-[#EAE3D5] bg-[#F4EFE6] p-4 px-6 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-[#556259]">
            <strong>Data Source:</strong> {project.sourceCitation}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="#road-audio-module"
              className="px-3.5 py-2 bg-white border border-[#DDD4C4] hover:bg-[#FAF7F2] text-xs font-mono uppercase font-bold flex items-center gap-1.5 cursor-pointer rounded-xl transition-colors text-[#1E2522]"
            >
              <Headphones className="w-3.5 h-3.5 text-[#BF532C]" />
              <span>Audio Overview</span>
            </a>
            <button
              type="button"
              onClick={handleCopyFacts}
              className="px-4 py-2 bg-white border border-[#DDD4C4] hover:bg-[#FAF7F2] text-xs font-mono uppercase font-bold flex items-center gap-1.5 cursor-pointer rounded-xl transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2E663B]" /> : <Copy className="w-3.5 h-3.5 text-[#3A543E]" />}
              {copied ? 'Facts Copied' : 'Copy Case Facts'}
            </button>
            <a
              href="#step-04-budget-comparison"
              className="px-4 py-2 bg-[#3A543E] text-white hover:bg-[#2B402E] text-xs font-mono uppercase font-bold flex items-center gap-1 rounded-xl transition-colors shadow-xs"
            >
              Analyze Cost / km ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
