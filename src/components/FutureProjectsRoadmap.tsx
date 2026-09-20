import React, { useState, useEffect } from 'react';
import {
  Droplets,
  HeartPulse,
  GraduationCap,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Building2,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Milestone
} from 'lucide-react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/roadsData';

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

const NOMINATION_STORAGE_KEY = 'civic_ledger_user_nominations_v1';

export const FutureProjectsRoadmap: React.FC<FutureProjectsRoadmapProps> = ({ currentCountry }) => {
  const country = COUNTRIES[currentCountry];
  const [activeTab, setActiveTab] = useState<string>('transport');
  const [nominations, setNominations] = useState<Array<{
    id: string;
    sector: string;
    projectTitle: string;
    location: string;
    notes: string;
    country: string;
    date: string;
  }>>([]);
  const [formSector, setFormSector] = useState<string>('water');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOMINATION_STORAGE_KEY);
      if (stored) {
        setNominations(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleNominate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newNomination = {
      id: `nom-${Date.now()}`,
      sector: formSector,
      projectTitle: formTitle.trim(),
      location: formLocation.trim() || `${country.name}`,
      notes: formNotes.trim(),
      country: country.name,
      date: new Date().toLocaleDateString('en-GB'),
    };

    const updated = [newNomination, ...nominations];
    setNominations(updated);
    try {
      localStorage.setItem(NOMINATION_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setFormTitle('');
    setFormLocation('');
    setFormNotes('');
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const selectedSector = SECTORS.find((s) => s.id === activeTab) || SECTORS[0];
  const SectorIcon = selectedSector.icon;

  return (
    <section
      id="expansion-roadmap"
      className="mt-8 bg-white border border-[#CBD5E1] rounded-2xl overflow-hidden shadow-xs"
    >
      {/* Top Banner Header */}
      <div className="bg-[#F8FAFC] border-b border-[#CBD5E1] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[#1D4ED8] text-white px-2 py-0.5 rounded">
                Scope & Roadmap
              </span>
              <span className="text-xs font-mono font-bold text-[#1D4ED8] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Civic Ledger Platform Architecture
              </span>
            </div>
            <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#16191B] tracking-tight">
              From Roads to Universal Public Project Scrutiny
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] max-w-3xl leading-relaxed">
              <strong>Civic Ledger</strong> starts by auditing roads and highways because transport accounts for 20–35% of public capital budgets in East and West Africa. Our open civic verification methodology is engineered to expand across all key public infrastructure domains.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-xl text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
            <div>
              <span className="text-[10px] uppercase text-gray-500 block font-bold">Current Status</span>
              <span className="text-xs font-bold text-[#16191B]">Roads Active • 4 Sectors In Pipeline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sector Tabs */}
      <div className="border-b border-[#E2E8F0] bg-white px-4 sm:px-6 pt-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {SECTORS.map((sector) => {
            const Icon = sector.icon;
            const isActive = activeTab === sector.id;
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => setActiveTab(sector.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white font-bold shadow-xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#1E293B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sector.name}</span>
                {sector.status === 'active' ? (
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Live
                  </span>
                ) : (
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
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
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white">
        {/* Left Column: Sector Blueprint */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center border border-blue-100">
                <SectorIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block">
                  {selectedSector.phase} • {selectedSector.timeline}
                </span>
                <h4 className="font-serif font-bold text-lg text-[#16191B]">
                  {selectedSector.name}
                </h4>
              </div>
            </div>

            {selectedSector.status === 'active' ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fully Auditable Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-bold">
                <Clock className="w-3.5 h-3.5" /> Target Horizon
              </span>
            )}
          </div>

          {/* Core Mandate in current country */}
          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#1D4ED8]" />
                Designated Statutory Bodies in {country.name}:
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Jurisdictional Frame</span>
            </div>
            <p className="text-xs font-mono font-bold text-[#1E293B]">
              {selectedSector.keyAgencies[currentCountry]}
            </p>
          </div>

          {/* Forensic Cost Metric */}
          <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E8E2D4] space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-[#736555] block">
              Universal Benchmark Baseline To Be Enforced:
            </span>
            <p className="text-xs text-[#2A2E33] font-serif leading-relaxed">
              {selectedSector.forensicMetric}
            </p>
          </div>

          {/* Citizen Verification Scope */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-[#1D4ED8] block">
              Ground-Truth Forensic Verification Points:
            </span>
            <p className="text-xs text-[#1E3A8A] font-serif leading-relaxed">
              {selectedSector.citizenFocus}
            </p>
          </div>
        </div>

        {/* Right Column: Citizen Project Nomination Form */}
        <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#1D4ED8]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16191B]">
                Nominate a Public Project
              </span>
            </div>
            <p className="text-xs text-[#64748B] mb-3">
              Know of a stalled hospital, dry municipal water project, or neglected public facility in {country.name}? Nominate it for prioritization in Civic Ledger’s rollout.
            </p>

            <form onSubmit={handleNominate} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-gray-600 mb-1">
                  Public Infrastructure Sector
                </label>
                <select
                  value={formSector}
                  onChange={(e) => setFormSector(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-gray-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1D4ED8]"
                >
                  <option value="water">Municipal Water & Dams</option>
                  <option value="health">Public Hospitals & Clinics</option>
                  <option value="schools">Public Schools & Technical Colleges</option>
                  <option value="energy">Rural Power Grids & Solar Microgrids</option>
                  <option value="transport">Roads & Urban Flyovers</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-gray-600 mb-1">
                  Project Name / Facility Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Itare Dam Water Supply / Malindi Sub-County Hospital Wing"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-gray-600 mb-1">
                  County / District / LGA Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nakuru County / Gulu District / Kaduna South LGA"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-gray-600 mb-1">
                  Observed Delivery Issue / Status
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Contractor abandoned site 14 months ago; residents have zero piped water despite KES 450M expenditure."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Sector Nomination
              </button>

              {formSubmitted && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2 rounded text-center font-mono">
                  ✓ Project nomination recorded into Civic Ledger local docket.
                </div>
              )}
            </form>
          </div>

          {/* Recent Nominations Count */}
          {nominations.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] font-mono text-gray-500 flex items-center justify-between">
              <span>{nominations.length} citizen nomination{nominations.length === 1 ? '' : 's'} logged</span>
              <span className="text-[#1D4ED8] font-bold">Stored in local docket</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
