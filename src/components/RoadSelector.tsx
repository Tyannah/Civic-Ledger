import React, { useState } from 'react';
import { CountryCode, RoadClass, RoadProject } from '../types';
import { COUNTRIES, SEED_PROJECTS, BENCHMARK_BANDS } from '../data/roadsData';
import {
  Search,
  PlusCircle,
  Compass,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import { DotGrid } from './CivicDecorations';

interface RoadSelectorProps {
  countryCode: CountryCode;
  selectedProject: RoadProject | null;
  onSelectProject: (project: RoadProject) => void;
}

export const RoadSelector: React.FC<RoadSelectorProps> = ({
  countryCode,
  selectedProject,
  onSelectProject,
}) => {
  const country = COUNTRIES[countryCode];
  const [tab, setTab] = useState<'seed' | 'custom'>('seed');
  const [filterClass, setFilterClass] = useState<RoadClass | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom road form state
  const [customName, setCustomName] = useState('');
  const [customClass, setCustomClass] = useState<RoadClass>('urban');
  const [customLength, setCustomLength] = useState('12.5');
  const [customBudget, setCustomBudget] = useState('850000000');
  const [customFunding, setCustomFunding] = useState('Public Works Allocation / Local Exchequer');
  const [customStatusNotes, setCustomStatusNotes] = useState('Observed by resident; status unverified in official registry.');

  const countryProjects = SEED_PROJECTS.filter((p) => p.countryCode === countryCode);

  const filteredProjects = countryProjects.filter((p) => {
    const matchesClass = filterClass === 'all' || p.roadClass === filterClass;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesClass;

    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.fundingSource.toLowerCase().includes(query) ||
      (p.contractorOrPartner && p.contractorOrPartner.toLowerCase().includes(query)) ||
      p.roadClass.toLowerCase().includes(query) ||
      p.statusNotes.toLowerCase().includes(query);

    return matchesClass && matchesSearch;
  });

  const handleApplyPresetEstimate = (roadClass: RoadClass) => {
    const band = BENCHMARK_BANDS[roadClass];
    const midUsdPerKm = (band.minUsdPerKm + band.maxUsdPerKm) / 2;
    const lengthNum = parseFloat(customLength) || 10;
    const estimatedTotalLocal = Math.round(midUsdPerKm * lengthNum * country.fxRateToUsd);
    setCustomBudget(estimatedTotalLocal.toString());
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const lengthNum = parseFloat(customLength) || 10;
    const budgetNum = parseFloat(customBudget) || 500_000_000;

    const newCustomProject: RoadProject = {
      id: `custom-${Date.now()}`,
      countryCode,
      name: customName.trim(),
      roadClass: customClass,
      lengthKm: lengthNum,
      budgetLocal: budgetNum,
      budgetDisplay: formatCurrency(budgetNum, country.currency),
      fundingSource: customFunding.trim() || 'Direct Public Exchequer Allocation',
      status: 'under_construction',
      statusNotes: customStatusNotes.trim(),
      isFlagshipReal: false,
      sourceCitation: 'Citizen custom entry: classified in real-time via statutory road agency jurisdiction matrix.',
    };

    onSelectProject(newCustomProject);

    // Scroll to Step 03 smoothly
    setTimeout(() => {
      const step3 = document.getElementById('step-03-authority-profile');
      if (step3) step3.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <section id="step-02-road-selector" className="relative bg-white border-2 border-[#DDD4C4] p-5 sm:p-7 mb-8 rounded-2xl shadow-xs overflow-hidden scroll-mt-16">
      {/* Decorative Dot Matrix in corner */}
      <div className="absolute top-4 right-4 opacity-30 pointer-events-none hidden sm:block">
        <DotGrid rows={3} cols={4} color="#3A543E" />
      </div>

      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-2 border-[#EAE3D5] pb-4 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold uppercase bg-[#E09F3E] text-[#1E2522] px-3 py-0.5 rounded-full shadow-xs">
              Step 02
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#3A543E] font-bold">
              Road Identification &amp; Statutory Classification
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-wide text-[#3A543E]">
            Find or Describe Your Road
          </h2>
        </div>
        <div className="text-xs font-mono text-[#3A543E] bg-[#F4EFE6] px-3.5 py-1.5 border border-[#DDD4C4] rounded-full font-bold">
          Active Jurisdiction: <strong className="text-[#1E2522]">{country.name}</strong> ({country.currency})
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          id="tab-seed-projects"
          onClick={() => setTab('seed')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer font-bold ${
            tab === 'seed'
              ? 'bg-[#3A543E] text-white shadow-xs'
              : 'bg-[#F4EFE6] text-[#4A554E] hover:bg-[#EAE3D5]'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-[#E09F3E]" />
          Browse Seed Projects ({countryProjects.length})
        </button>
        <button
          type="button"
          id="tab-describe-road"
          onClick={() => setTab('custom')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer font-bold ${
            tab === 'custom'
              ? 'bg-[#3A543E] text-white shadow-xs'
              : 'bg-[#F4EFE6] text-[#4A554E] hover:bg-[#EAE3D5]'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#E09F3E]" />
          Describe Any Unlisted Road (Instant Classifier)
        </button>
      </div>

      {/* TAB 1: Seed list of projects */}
      {tab === 'seed' && (
        <div>
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 bg-[#F4EFE6] p-4 border border-[#DDD4C4] rounded-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#66726A] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search roads in ${country.name} by name, funder, or contractor...`}
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-[#DDD4C4] text-xs font-mono text-[#1E2522] focus:border-[#3A543E] focus:outline-none rounded-xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#66726A] hover:text-[#1E2522]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Class Filter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="text-[#3A543E] font-bold text-[11px] uppercase mr-1">Class:</span>
              {[
                { id: 'all', label: 'All Roads' },
                { id: 'national', label: 'National/Federal' },
                { id: 'urban', label: 'Urban Streets' },
                { id: 'rural', label: 'Rural Feeder' },
                { id: 'local', label: 'Local/County' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterClass(f.id as any)}
                  className={`px-3 py-1.5 border transition-all cursor-pointer text-[11px] rounded-full font-bold ${
                    filterClass === f.id
                      ? 'bg-[#E09F3E] text-[#1E2522] border-[#E09F3E] shadow-xs'
                      : 'bg-white text-[#4A554E] border-[#DDD4C4] hover:bg-[#EAE3D5]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project List Cards - Full-Width Horizontal Cards */}
          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-[#DDD4C4] bg-[#FAF7F2] text-xs font-mono text-[#66726A] rounded-2xl">
              No road projects match your filter. Try clearing the search query or switch to "Describe Any Unlisted Road".
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {filteredProjects.map((p) => {
                const isSelected = selectedProject?.id === p.id;
                const authority = country.authorities[p.roadClass];

                return (
                  <div
                    key={p.id}
                    id={`project-card-${p.id}`}
                    onClick={() => {
                      onSelectProject(p);
                      const detailsSection = document.getElementById('step-03-authority-profile');
                      if (detailsSection) {
                        detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`cursor-pointer w-full p-4 sm:p-5 border-2 text-left transition-all relative rounded-2xl ${
                      isSelected
                        ? 'bg-white border-[#3A543E] ring-2 ring-[#E09F3E] shadow-sm'
                        : 'bg-[#FAF7F2] border-[#E2D8C6] hover:bg-white hover:border-[#3A543E]'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                      {/* Left: Metadata, Title, Description, Funder */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Top Badges Row */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 bg-[#3A543E] text-white font-bold tracking-wider rounded-full">
                            {authority.code}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#EAE3D5] text-[#3A543E] font-bold rounded-full">
                            {p.roadClass}
                          </span>

                          {p.isFlagshipReal ? (
                            <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#E8F0EA] text-[#2E663B] border border-[#BBD7C2] font-bold flex items-center gap-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-[#2E663B]" /> Verified Public Record
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#FDF4E7] text-[#BF532C] border border-[#F4DCBE] font-semibold italic rounded-full">
                              Illustrative Case Entry
                            </span>
                          )}

                          {p.delayAlert && (
                            <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#FDF0EC] text-[#BF532C] border border-[#F2C7BB] font-bold flex items-center gap-1 rounded-full">
                              <AlertCircle className="w-3 h-3 text-[#BF532C]" /> Schedule Anomaly
                            </span>
                          )}
                        </div>

                        {/* Project Title */}
                        <h3 className="font-bold text-lg sm:text-xl text-[#1E2522] leading-snug tracking-tight">
                          {p.name}
                        </h3>

                        {/* Project Notes */}
                        <p className="text-xs sm:text-sm text-[#525E56] leading-relaxed">
                          {p.statusNotes}
                        </p>

                        {/* Delivery Delay Alert if applicable */}
                        {p.delayAlert && (
                          <div className="text-[11px] font-mono text-[#7A2E12] bg-[#FDF0EC] p-2.5 border border-[#F2C7BB] flex items-start gap-2 rounded-xl">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#BF532C]" />
                            <span>{p.delayAlert}</span>
                          </div>
                        )}

                        {/* Funder & Contractor Info */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#66726A] pt-1">
                          <span>
                            <strong className="text-[#3A543E]">Funder:</strong> {p.fundingSource}
                          </span>
                          {p.contractorOrPartner && (
                            <span>
                              <strong className="text-[#3A543E]">Contractor:</strong> {p.contractorOrPartner}
                            </span>
                          )}
                          {p.awardYear && (
                            <span>
                              <strong className="text-[#3A543E]">Award:</strong> {p.awardYear}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Key Specs & Inspection Action */}
                      <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-end xl:items-center gap-3 lg:gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#EAE3D5] lg:pl-6">
                        {/* Specs Columns */}
                        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono min-w-[210px]">
                          <div className="bg-white/80 border border-[#DDD4C4] p-2.5 rounded-xl">
                            <span className="text-[#66726A] block text-[10px] uppercase font-bold tracking-wider">
                              Reported Budget
                            </span>
                            <span className="font-bold text-[#1E2522] text-sm block mt-0.5">
                              {p.budgetDisplay}
                            </span>
                          </div>
                          <div className="bg-white/80 border border-[#DDD4C4] p-2.5 rounded-xl">
                            <span className="text-[#66726A] block text-[10px] uppercase font-bold tracking-wider">
                              Corridor Specs
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-bold text-[#1E2522] text-sm">
                                {p.lengthKm} km
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                  p.status === 'completed'
                                    ? 'bg-[#E8F0EA] text-[#2E663B]'
                                    : p.status === 'delayed' || p.status === 'stalled'
                                    ? 'bg-[#FDF0EC] text-[#BF532C]'
                                    : 'bg-[#FDF4E7] text-[#8C5E1E]'
                                }`}
                              >
                                {p.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action CTA Button */}
                        <div className="flex items-center justify-end">
                          {isSelected ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectProject(p);
                                const detailsSection = document.getElementById('step-03-authority-profile');
                                if (detailsSection) {
                                  detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className="w-full sm:w-auto px-4 py-2 bg-[#3A543E] hover:bg-[#2F4432] text-white text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer transition-colors"
                            >
                              <span className="w-2 h-2 bg-[#E09F3E] rounded-full animate-pulse" />
                              <span>View Details ↓</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectProject(p);
                                const detailsSection = document.getElementById('step-03-authority-profile');
                                if (detailsSection) {
                                  detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-[#3A543E] text-[#3A543E] hover:text-white border border-[#3A543E]/40 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1 transition-colors whitespace-nowrap cursor-pointer"
                            >
                              <span>Inspect Details</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Describe an unlisted road */} 
       
       
    </section>
  );
};
