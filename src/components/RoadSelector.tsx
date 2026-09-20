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
    <section id="step-02-road-selector" className="relative bg-white border-2 border-[#DDD4C4] p-5 sm:p-7 mb-8 rounded-2xl shadow-xs overflow-hidden">
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

          {/* Project List Cards */}
          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-[#DDD4C4] bg-[#FAF7F2] text-xs font-mono text-[#66726A] rounded-2xl">
              No road projects match your filter. Try clearing the search query or switch to "Describe Any Unlisted Road".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((p) => {
                const isSelected = selectedProject?.id === p.id;
                const authority = country.authorities[p.roadClass];

                return (
                  <div
                    key={p.id}
                    id={`project-card-${p.id}`}
                    onClick={() => onSelectProject(p)}
                    className={`cursor-pointer p-5 border-2 text-left transition-all relative flex flex-col justify-between rounded-2xl ${
                      isSelected
                        ? 'bg-white border-[#3A543E] ring-2 ring-[#E09F3E] shadow-md'
                        : 'bg-[#FAF7F2] border-[#E2D8C6] hover:bg-white hover:border-[#3A543E]'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 bg-[#3A543E] text-white font-bold tracking-wider rounded-full">
                            {authority.code}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#EAE3D5] text-[#3A543E] font-bold rounded-full">
                            {p.roadClass}
                          </span>
                        </div>

                        {p.isFlagshipReal ? (
                          <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#E8F0EA] text-[#2E663B] border border-[#BBD7C2] font-bold flex items-center gap-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-[#2E663B]" /> Verified Public Record
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#FDF4E7] text-[#BF532C] border border-[#F4DCBE] font-semibold italic rounded-full">
                            Illustrative Case Entry
                          </span>
                        )}
                      </div>

                      {/* Project Title */}
                      <h3 className="font-bold text-lg sm:text-xl text-[#1E2522] leading-snug">
                        {p.name}
                      </h3>

                      <p className="text-xs text-[#525E56] line-clamp-2 mt-2 leading-relaxed">
                        {p.statusNotes}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE3D5]">
                      {/* Budget and Specs Row */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-2">
                        <div>
                          <span className="text-[#66726A] block text-[10px] uppercase font-bold">Reported Budget:</span>
                          <span className="font-bold text-[#1E2522] text-sm">{p.budgetDisplay}</span>
                        </div>
                        <div>
                          <span className="text-[#66726A] block text-[10px] uppercase font-bold">Corridor Length:</span>
                          <span className="font-bold text-[#1E2522] text-sm">
                            {p.lengthKm} km •{' '}
                            <span
                              className={
                                p.status === 'completed'
                                  ? 'text-[#2E663B]'
                                  : p.status === 'delayed' || p.status === 'stalled'
                                  ? 'text-[#BF532C]'
                                  : 'text-[#D08E2E]'
                              }
                            >
                              {p.status.replace('_', ' ')}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Delivery Delay Alert if applicable */}
                      {p.delayAlert && (
                        <div className="text-[11px] font-mono text-[#7A2E12] bg-[#FDF0EC] p-2.5 border border-[#F2C7BB] flex items-start gap-2 mb-2 rounded-xl">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#BF532C]" />
                          <span>{p.delayAlert}</span>
                        </div>
                      )}

                      {/* Active Status Footer */}
                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="text-[#66726A] text-[11px] truncate max-w-[200px]">
                          Funder: {p.fundingSource.split('(')[0]}
                        </span>

                        {isSelected ? (
                          <span className="text-[#3A543E] font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-[#E09F3E] rounded-full animate-pulse" /> Docket Loaded ↓
                          </span>
                        ) : (
                          <span className="text-[#3A543E] hover:text-[#BF532C] font-bold flex items-center gap-1">
                            Inspect Corridor <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
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
      {tab === 'custom' && (
        <form onSubmit={handleCreateCustom} className="bg-[#FAF7F2] border-2 border-[#DDD4C4] p-5 sm:p-7 rounded-2xl">
          <div className="mb-5 pb-4 border-b border-[#EAE3D5]">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-2xl font-display uppercase tracking-wide text-[#3A543E] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#BF532C]" />
                Civic Classifier: Describe Any Road in {country.name}
              </h3>
              <span className="text-xs font-mono uppercase bg-[#E09F3E] text-[#1E2522] px-2.5 py-1 rounded-full font-bold">
                Zero Pre-existing Record Required
              </span>
            </div>
            <p className="text-xs text-[#525E56] mt-1 leading-relaxed">
              If your neighborhood street, rural feeder link, or town avenue does not appear in national databases, enter it here. This civic engine immediately identifies the statutory road agency, legal mandate, oversight office, and benchmark cost corridor.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Road Name */}
            <div>
              <label className="block font-bold text-[#1E2522] uppercase tracking-wider mb-1.5">
                Road Name or Corridor Description *
              </label>
              <input
                type="text"
                id="custom-road-name"
                required
                placeholder={
                  countryCode === 'KE'
                    ? 'e.g. Mirema Drive, Thika–Magumu Link, Ruai Bypass, Nakuru West Link'
                    : countryCode === 'UG'
                    ? 'e.g. Mukono–Kayunga Bypass, Salaama Road, Jinja Feeder, Hoima Link'
                    : 'e.g. Ikorodu Inner Ring, Kaduna–Zaria Spur, Nsukka Feeder, Aba Commercial Way'
                }
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full p-3 border border-[#DDD4C4] bg-white text-[#1E2522] focus:border-[#3A543E] focus:outline-none text-sm rounded-xl"
              />
            </div>

            {/* Road Class Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-[#1E2522] uppercase tracking-wider">
                  Where does this road sit? (Statutory Classification) *
                </label>
                <span className="text-[11px] text-[#66726A]">Selects statutory agency automatically</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    id: 'national',
                    title: 'National / Federal Highway',
                    desc:
                      countryCode === 'KE'
                        ? 'Inter-county trunk corridor (KeNHA)'
                        : countryCode === 'UG'
                        ? 'Primary national arterial (MoWT National Roads Dept)'
                        : 'Federal highway linking states/ports (FERMA / Fed Ministry)',
                  },
                  {
                    id: 'urban',
                    title: 'Urban Street / City Arterial',
                    desc:
                      countryCode === 'KE'
                        ? 'City / municipality paved street (KURA)'
                        : countryCode === 'UG'
                        ? 'Urban council roads office'
                        : 'State capital avenue or flyover (State Ministry of Works)',
                  },
                  {
                    id: 'rural',
                    title: 'Rural / Village Access Road',
                    desc:
                      countryCode === 'KE'
                        ? 'Constituency agricultural link (KeRRA)'
                        : countryCode === 'UG'
                        ? 'District local government feeder (District LG)'
                        : 'LGA agricultural feeder road (LGA Works Dept)',
                  },
                  {
                    id: 'local',
                    title: 'Other Local / Ward Road',
                    desc:
                      countryCode === 'KE'
                        ? 'County neighborhood / ward road'
                        : countryCode === 'UG'
                        ? 'City authority (KCCA) or town council way'
                        : 'LGA residential street & market canal',
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`border-2 p-3.5 cursor-pointer flex flex-col justify-between transition-all rounded-xl ${
                      customClass === item.id
                        ? 'bg-white border-[#3A543E] text-[#1E2522] ring-1 ring-[#E09F3E]'
                        : 'bg-[#F4EFE6] border-[#DDD4C4] text-[#4A554E] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="road_class"
                        value={item.id}
                        checked={customClass === item.id}
                        onChange={() => setCustomClass(item.id as RoadClass)}
                        className="accent-[#3A543E]"
                      />
                      <span className="font-bold text-base text-[#1E2522]">{item.title}</span>
                    </div>
                    <span className="text-[11px] text-[#556259] mt-2 pl-6 leading-tight">
                      {item.desc}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Approximate Length & Budget with Benchmark Estimator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white p-4 border border-[#DDD4C4] rounded-xl">
              <div>
                <label className="block font-bold text-[#1E2522] uppercase tracking-wider mb-1.5">
                  Corridor Length (Kilometers)
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    id="custom-road-length"
                    value={customLength}
                    onChange={(e) => setCustomLength(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#DDD4C4] text-[#1E2522] focus:border-[#3A543E] focus:outline-none font-bold rounded-l-xl"
                  />
                  <span className="bg-[#EAE3D5] px-4 py-2.5 border border-l-0 border-[#DDD4C4] text-[#3A543E] font-bold rounded-r-xl">
                    km
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-[#1E2522] uppercase tracking-wider">
                    Budget ({country.currency})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetEstimate(customClass)}
                    className="text-[10px] text-[#BF532C] font-bold underline flex items-center gap-1 hover:text-[#A64522]"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Estimate Band
                  </button>
                </div>
                <input
                  type="number"
                  step="1000000"
                  id="custom-road-budget"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#DDD4C4] text-[#1E2522] focus:border-[#3A543E] focus:outline-none font-bold rounded-xl"
                />
                <span className="text-[11px] text-[#66726A] mt-1 block">
                  ≈ {formatCurrency(parseFloat(customBudget) || 0, country.currency)}
                </span>
              </div>
            </div>

            {/* Resident Observations */}
            <div>
              <label className="block font-bold text-[#1E2522] uppercase tracking-wider mb-1.5">
                Resident Observations / Reported Condition (Optional)
              </label>
              <input
                type="text"
                id="custom-road-notes"
                placeholder="e.g. Graded last year, abandoned after rain washed out culvert; no signpost installed."
                value={customStatusNotes}
                onChange={(e) => setCustomStatusNotes(e.target.value)}
                className="w-full p-3 border border-[#DDD4C4] bg-white text-[#1E2522] focus:border-[#3A543E] focus:outline-none rounded-xl"
              />
            </div>
          </div>

          {/* Classification Outcome Preview */}
          <div className="mt-6 pt-4 border-t border-[#EAE3D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-mono text-[#4A554E]">
              <span>Responsible Agency: </span>
              <strong className="text-[#3A543E] font-bold">
                {country.authorities[customClass].name} ({country.authorities[customClass].code})
              </strong>
            </div>

            <button
              type="submit"
              id="btn-classify-road"
              className="px-6 py-3 bg-[#3A543E] text-white font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#2B402E] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm rounded-xl"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#E09F3E]" />
              Classify &amp; Open Case Docket
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
