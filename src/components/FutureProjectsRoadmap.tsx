import React, { useState } from 'react';
import {
  Droplets,
  HeartPulse,
  GraduationCap,
  Zap,
  CheckCircle2,
  Clock,
  Building2,
  Layers,
  ShieldCheck,
  Milestone,
  Compass,
  FileCheck2,
} from 'lucide-react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/roadsData';
import { DotGrid } from './CivicDecorations';

interface FutureProjectsRoadmapProps {
  currentCountry: CountryCode;
}

interface SectorRoadmapItem {
  id: string;
  name: string;
  phase: string;
  timeline: string;
  status: 'active' | 'upcoming';
  icon: React.ComponentType<{ className?: string }>;
  keyAgencies: { [key in CountryCode]: string };
  forensicMetric: string;
  citizenFocus: string;
}

const SECTORS: SectorRoadmapItem[] = [
  {
    id: 'transport',
    name: 'Roads & Highways Infrastructure',
    phase: 'Phase 1',
    timeline: 'Live & Operational',
    status: 'active',
    icon: Milestone,
    keyAgencies: {
      KE: 'KeNHA, KURA, KeRRA (KRB Fund)',
      UG: 'UNRA, KCCA, MoWT (Road Fund)',
      NG: 'Federal Ministry of Works, FERMA, State MoW',
    },
    forensicMetric: 'Cost-per-kilometer ($/km) vs World Bank & AfDB empirical corridors',
    citizenFocus: 'Ghost roads, asphalt washouts, missing storm drainage, uncompleted contractor milestones',
  },
  {
    id: 'water',
    name: 'Municipal Water & Irrigation Schemes',
    phase: 'Phase 2',
    timeline: 'In Design • Q3 2026',
    status: 'upcoming',
    icon: Droplets,
    keyAgencies: {
      KE: 'Water Works Development Agencies, NWHSA, County Water Companies',
      UG: 'NWSC (National Water & Sewerage Corp), MoWE Rural Water',
      NG: 'Federal Ministry of Water Resources, State Water Boards',
    },
    forensicMetric: 'Capital cost per cubic meter capacity & borehole linear meter drilling rates',
    citizenFocus: 'Dry taps on commissioned lines, stalled dam earthworks, abandoned community water kiosks',
  },
  {
    id: 'health',
    name: 'Public Hospitals & Health Facilities',
    phase: 'Phase 3',
    timeline: 'In Design • Q4 2026',
    status: 'upcoming',
    icon: HeartPulse,
    keyAgencies: {
      KE: 'Ministry of Health, County Health Departments (Level 4/5)',
      UG: 'Ministry of Health, District Health Services (HC-IV)',
      NG: 'National Primary Health Care Dev. Agency (NPHCDA), State MoH',
    },
    forensicMetric: 'Construction and fit-out expenditure per functional hospital bed / theater',
    citizenFocus: 'Stalled maternity wings, ghost clinic awards, budgeted equipment never delivered to ward',
  },
  {
    id: 'schools',
    name: 'Public Education & Technical Colleges',
    phase: 'Phase 4',
    timeline: 'Planned • 2027',
    status: 'upcoming',
    icon: GraduationCap,
    keyAgencies: {
      KE: 'NG-CDF (Constituency Fund), Ministry of Education, TVET',
      UG: 'MoES Education Infrastructure, Local District Councils',
      NG: 'Universal Basic Education Commission (UBEC), State SUBEBs',
    },
    forensicMetric: 'Audited cost per standard classroom block and laboratory square meter',
    citizenFocus: 'Unroofed classroom shells, sub-standard cracked foundations, ghost CDF allocations',
  },
  {
    id: 'energy',
    name: 'Rural Electrification & Power Grids',
    phase: 'Phase 5',
    timeline: 'Planned • 2027',
    status: 'upcoming',
    icon: Zap,
    keyAgencies: {
      KE: 'Rural Electrification & Renewable Energy Corp (REREC), Kenya Power',
      UG: 'Rural Electrification Agency (REA / MEMD), Umeme / UEDCL',
      NG: 'Rural Electrification Agency (REA Nigeria), DisCos',
    },
    forensicMetric: 'Capital cost per household last-mile connection & solar mini-grid kilowatt-peak',
    citizenFocus: 'Unconnected poles standing for years, phantom grid expansion budgets, broken solar micro-grids',
  },
];

export const FutureProjectsRoadmap: React.FC<FutureProjectsRoadmapProps> = ({ currentCountry }) => {
  const country = COUNTRIES[currentCountry];
  const [activeTab, setActiveTab] = useState<string>('transport');

  const selectedSector = SECTORS.find((s) => s.id === activeTab) || SECTORS[0];
  const SectorIcon = selectedSector.icon;

  return (
    <section
      id="expansion-roadmap"
      className="mt-8 bg-white border-2 border-[#DDD4C4] rounded-2xl overflow-hidden shadow-xs relative"
    >
      {/* Top Banner Header */}
      <div className="bg-[#FAF7F2] border-b-2 border-[#EAE3D5] p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none hidden sm:block">
          <DotGrid rows={3} cols={6} color="#3A543E" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[#E09F3E] text-[#1E2522] px-3 py-0.5 rounded-full">
                Scope &amp; Roadmap
              </span>
              <span className="text-xs font-mono font-bold text-[#3A543E] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Civic Ledger Platform Architecture
              </span>
            </div>
            <h3 className="font-display uppercase text-2xl sm:text-3xl text-[#3A543E] tracking-wide">
              From Roads to Universal Public Project Scrutiny
            </h3>
            <p className="text-xs sm:text-sm text-[#556259] max-w-3xl leading-relaxed">
              <strong>Civic Ledger</strong> starts by auditing roads and highways because transport accounts for 20–35% of public capital budgets in East and West Africa. Our open civic verification methodology is engineered to expand across all key public infrastructure domains.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2.5 bg-white border border-[#DDD4C4] px-4 py-2.5 rounded-2xl text-xs font-mono shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#3A543E]" />
            <div>
              <span className="text-[10px] uppercase text-[#66726A] block font-bold">Current Status</span>
              <span className="text-xs font-bold text-[#1E2522]">Roads Active • 4 Sectors In Pipeline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sector Tabs */}
      <div className="border-b border-[#EAE3D5] bg-[#F4EFE6] px-4 sm:px-6 pt-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-3">
          {SECTORS.map((sector) => {
            const Icon = sector.icon;
            const isActive = activeTab === sector.id;
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => setActiveTab(sector.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer font-bold ${
                  isActive
                    ? 'bg-[#3A543E] text-white shadow-xs'
                    : 'bg-white text-[#4A554E] hover:bg-[#EAE3D5] border border-[#DDD4C4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#E09F3E]" />
                <span>{sector.name}</span>
                {sector.status === 'active' ? (
                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#E09F3E] text-[#1E2522]' : 'bg-[#E8F0EA] text-[#2E663B]'
                  }`}>
                    Live
                  </span>
                ) : (
                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#8C5E1E]'
                  }`}>
                    {sector.phase}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Sector Deep Dive & Comparison */}
      <div className="p-5 sm:p-7 bg-white space-y-5">
        {/* Sector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE3D5] gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#3A543E] flex items-center justify-center border border-[#DDD4C4] shadow-2xs">
              <SectorIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#66726A] font-bold block">
                {selectedSector.phase} • {selectedSector.timeline}
              </span>
              <h4 className="font-bold text-lg text-[#1E2522]">
                {selectedSector.name}
              </h4>
            </div>
          </div>

          {selectedSector.status === 'active' ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2E663B] bg-[#E8F0EA] px-3.5 py-1.5 rounded-full border border-[#BBD7C2] font-bold self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fully Auditable Now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8C5E1E] bg-[#FDF4E7] px-3.5 py-1.5 rounded-full border border-[#F4DCBE] font-bold self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5" /> Target Horizon
            </span>
          )}
        </div>

        {/* 3-Column Institutional & Audit Framework */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Card 1: Statutory Bodies */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#DDD4C4] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#3A543E] mb-2">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#BF532C]" />
                  Statutory Bodies ({country.name})
                </span>
                <span className="text-[#66726A]">Mandate</span>
              </div>
              <p className="text-xs font-bold text-[#1E2522] leading-relaxed">
                {selectedSector.keyAgencies[currentCountry]}
              </p>
            </div>
            <p className="text-[11px] text-[#66726A] pt-2 border-t border-[#EAE3D5] leading-normal font-sans">
              Statutory entities legally responsible for public capital allocation, tender award notices, and project commissioning.
            </p>
          </div>

          {/* Card 2: Universal Cost Metric */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#DDD4C4] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#66726A] mb-2">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#3A543E]" />
                  Cost Baseline Standard
                </span>
                <span className="text-[#66726A]">Empirical</span>
              </div>
              <p className="text-xs text-[#2A332C] leading-relaxed">
                {selectedSector.forensicMetric}
              </p>
            </div>
            <p className="text-[11px] text-[#66726A] pt-2 border-t border-[#EAE3D5] leading-normal font-sans">
              Universal benchmark applied against gazetted bills of quantities to identify inflated line items.
            </p>
          </div>

          {/* Card 3: Citizen Field Audit */}
          <div className="bg-[#FDF0EC] p-4 sm:p-5 rounded-2xl border border-[#F2C7BB] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#BF532C] mb-2">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#BF532C]" />
                  Citizen Ground Checkpoints
                </span>
                <span className="text-[#BF532C]">Field Truth</span>
              </div>
              <p className="text-xs text-[#7A2E12] leading-relaxed font-sans font-medium">
                {selectedSector.citizenFocus}
              </p>
            </div>
            <p className="text-[11px] text-[#8C381B] pt-2 border-t border-[#F2C7BB] leading-normal font-sans">
              Specific physical indicators residents verify directly on the ground to detect stalled or abandoned infrastructure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
