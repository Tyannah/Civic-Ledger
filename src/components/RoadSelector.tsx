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
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency, formatUsd } from '../utils/calculator';

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
    <section id="step-02-road-selector" className="bg-white border border-[#2C3034] p-5 sm:p-7 mb-7 shadow-xs rounded-2xl">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-gray-200 pb-4 mb-5 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase bg-[#1D4ED8] text-white px-2 py-0.5 rounded">
              Step 02
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-600 font-semibold">
              Road Identification & Statutory Classification
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#16191B]">
            Find or Describe Your Road
          </h2>
        </div>
        <p className="text-xs font-mono text-gray-600 bg-gray-100 px-2.5 py-1 border border-gray-300 rounded-md">
          Active Jurisdiction: <strong className="text-[#1E2022]">{country.name}</strong> ({country.currency})
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-[#2C3034] mb-5 gap-1">
        <button
          type="button"
          id="tab-seed-projects"
          onClick={() => setTab('seed')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-wider border-t border-l border-r -mb-[1px] transition-all cursor-pointer rounded-t-lg ${
            tab === 'seed'
              ? 'bg-white border-[#2C3034] text-[#1E2022] font-bold border-b-white shadow-xs'
              : 'bg-gray-100 border-transparent text-gray-500 hover:text-[#1E2022] hover:bg-gray-200'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-[#1D4ED8]" />
          Browse Seed Projects ({countryProjects.length})
        </button>
        <button
          type="button"
          id="tab-describe-road"
          onClick={() => setTab('custom')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-wider border-t border-l border-r -mb-[1px] transition-all cursor-pointer rounded-t-lg ${
            tab === 'custom'
              ? 'bg-white border-[#2C3034] text-[#1E2022] font-bold border-b-white shadow-xs'
              : 'bg-gray-100 border-transparent text-gray-500 hover:text-[#1E2022] hover:bg-gray-200'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#1D4ED8]" />
          Describe Any Unlisted Road (Instant Classifier)
        </button>
      </div>

      {/* TAB 1: Seed list of projects */}
      {tab === 'seed' && (
        <div>
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 bg-[#F2EDE2] p-3.5 border border-[#D5CCBA] rounded-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7A8187] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search roads in ${country.name} by name, funder, or contractor...`}
                className="w-full pl-9 pr-8 py-2 bg-white border border-[#C5BCA8] text-xs font-mono text-[#1E2022] focus:border-[#1D4ED8] focus:outline-none rounded-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[#7A8187] hover:text-[#1E2022]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Class Filter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="text-[#5A6065] text-[11px] uppercase mr-1">Class:</span>
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
                  className={`px-2.5 py-1 border transition-colors cursor-pointer text-[11px] rounded-md ${
                    filterClass === f.id
                      ? 'bg-[#1E2022] text-white border-[#1E2022] font-semibold'
                      : 'bg-white text-[#52575C] border-[#D1C9B7] hover:bg-[#EAE5DA]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project List Cards */}
          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#C5BBA7] bg-white text-xs font-mono text-[#6A7075] rounded-xl">
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
                    className={`cursor-pointer p-4.5 border text-left transition-all relative flex flex-col justify-between rounded-xl ${
                      isSelected
                        ? 'bg-white border-[#1D4ED8] ring-2 ring-[#1D4ED8] shadow-[3px_3px_0px_#1D4ED8]'
                        : 'bg-[#F4F1E9] border-[#DCD5C5] hover:bg-white hover:border-[#A89F8B] hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#1E2022] text-white font-bold tracking-wider rounded">
                            {authority.code}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#E8E2D3] text-[#4F555A] border border-[#D5CCBC] rounded">
                            {p.roadClass}
                          </span>
                        </div>

                        {p.isFlagshipReal ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#E8EFE9] text-[#1E6E38] border border-[#B9D7C0] font-bold flex items-center gap-1 rounded">
                            <CheckCircle2 className="w-3 h-3" /> Flagship Public Record
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F6F0E6] text-[#8E582C] border border-[#E2D2BC] italic rounded">
                            Illustrative Demo Entry
                          </span>
                        )}
                      </div>

                      {/* Project Title */}
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-[#16191B] leading-snug">
                        {p.name}
                      </h3>

                      <p className="text-xs text-[#52575C] font-serif line-clamp-2 mt-1.5 leading-relaxed">
                        {p.statusNotes}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-[#E8E2D4]">
                      {/* Budget and Specs Row */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-2">
                        <div>
                          <span className="text-[#7A8187] block text-[10px] uppercase">Reported Budget:</span>
                          <span className="font-bold text-[#1E2022] text-sm">{p.budgetDisplay}</span>
                        </div>
                        <div>
                          <span className="text-[#7A8187] block text-[10px] uppercase">Corridor Length:</span>
                          <span className="font-bold text-[#1E2022] text-sm">
                            {p.lengthKm} km •{' '}
                            <span
                              className={
                                p.status === 'completed'
                                  ? 'text-[#1E6E38]'
                                  : p.status === 'delayed' || p.status === 'stalled'
                                  ? 'text-[#DC2626]'
                                  : 'text-[#856404]'
                              }
                            >
                              {p.status.replace('_', ' ')}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Delivery Delay Alert if applicable */}
                      {p.delayAlert && (
                        <div className="text-[11px] font-mono text-amber-900 bg-amber-50 p-2 border border-amber-200 flex items-start gap-1.5 mb-2 rounded-md">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
                          <span>{p.delayAlert}</span>
                        </div>
                      )}

                      {/* Active Status Footer */}
                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="text-[#6A7075] text-[11px] truncate max-w-[200px]">
                          Funder: {p.fundingSource.split('(')[0]}
                        </span>

                        {isSelected ? (
                          <span className="text-[#1D4ED8] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#1D4ED8] rounded-full" /> Case Loaded ↓
                          </span>
                        ) : (
                          <span className="text-[#5A6065] hover:text-[#1E2022] flex items-center gap-0.5">
                            Inspect <ArrowRight className="w-3 h-3" />
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
        <form onSubmit={handleCreateCustom} className="bg-white border-2 border-[#2C3034] p-5 sm:p-7 max-w-3xl rounded-xl">
          <div className="mb-5 pb-3 border-b border-[#E5DFD1]">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-serif font-bold text-2xl text-[#16191B] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#1D4ED8]" />
                Civic Classifier: Describe Any Road in {country.name}
              </h3>
              <span className="text-xs font-mono uppercase bg-[#EFF6FF] px-2 py-0.5 border border-[#BFDBFE] text-[#1D4ED8] rounded font-semibold">
                Zero Pre-existing Record Required
              </span>
            </div>
            <p className="text-xs text-[#52575C] font-serif leading-relaxed">
              If your neighborhood street, rural feeder link, or town avenue does not appear in national databases, enter it here. This civic engine immediately identifies the statutory road agency, legal mandate, oversight office, and benchmark cost corridor.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Road Name */}
            <div>
              <label className="block font-bold text-[#1E2022] uppercase tracking-wider mb-1">
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
                className="w-full p-2.5 border border-[#BDB39E] bg-[#FAF9F5] text-[#1E2022] focus:border-[#1D4ED8] focus:outline-none text-sm rounded-md"
              />
            </div>

            {/* Road Class Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-[#1E2022] uppercase tracking-wider">
                  Where does this road sit? (Statutory Classification) *
                </label>
                <span className="text-[11px] text-[#6A7075]">Selects statutory agency automatically</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
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
                    className={`border-2 p-3 cursor-pointer flex flex-col justify-between transition-all rounded-lg ${
                      customClass === item.id
                        ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#1E2022] shadow-xs'
                        : 'bg-[#FAF9F5] border-[#D8D1BF] text-[#52575C] hover:bg-[#F0EBE0]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="road_class"
                        value={item.id}
                        checked={customClass === item.id}
                        onChange={() => setCustomClass(item.id as RoadClass)}
                        className="accent-[#1D4ED8]"
                      />
                      <span className="font-serif font-bold text-base text-[#16191B]">{item.title}</span>
                    </div>
                    <span className="text-[11px] text-[#555A5F] mt-1.5 pl-6 font-mono leading-tight">
                      {item.desc}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Approximate Length & Budget with Benchmark Estimator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#F7F4EC] p-3.5 border border-[#D8D0BF] rounded-lg">
              <div>
                <label className="block font-bold text-[#1E2022] uppercase tracking-wider mb-1">
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
                    className="w-full p-2 bg-white border border-[#BDB39E] text-[#1E2022] focus:border-[#1D4ED8] focus:outline-none font-bold rounded-l-md"
                  />
                  <span className="bg-[#ECE5D8] px-3.5 py-2 border border-l-0 border-[#BDB39E] text-[#5A6065] font-semibold rounded-r-md">
                    km
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[#1E2022] uppercase tracking-wider">
                    Budget ({country.currency})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetEstimate(customClass)}
                    className="text-[10px] text-[#1D4ED8] font-bold underline flex items-center gap-1 hover:text-[#1E40AF]"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Estimate Typical Band
                  </button>
                </div>
                <input
                  type="number"
                  step="1000000"
                  id="custom-road-budget"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  className="w-full p-2 bg-white border border-[#BDB39E] text-[#1E2022] focus:border-[#1D4ED8] focus:outline-none font-bold rounded-md"
                />
                <span className="text-[11px] text-[#7A8187] mt-1 block">
                  ≈ {formatCurrency(parseFloat(customBudget) || 0, country.currency)}
                </span>
              </div>
            </div>

            {/* Resident Observations */}
            <div>
              <label className="block font-bold text-[#1E2022] uppercase tracking-wider mb-1">
                Resident Observations / Reported Condition (Optional)
              </label>
              <input
                type="text"
                id="custom-road-notes"
                placeholder="e.g. Graded last year, abandoned after rain washed out culvert; no signpost installed."
                value={customStatusNotes}
                onChange={(e) => setCustomStatusNotes(e.target.value)}
                className="w-full p-2.5 border border-[#BDB39E] bg-[#FAF9F5] text-[#1E2022] focus:border-[#1D4ED8] focus:outline-none rounded-md"
              />
            </div>
          </div>

          {/* Classification Outcome Preview */}
          <div className="mt-5 pt-3.5 border-t border-[#E5DFD1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-mono text-[#555A5F]">
              <span>Responsible Agency: </span>
              <strong className="text-[#1E2022] font-bold">
                {country.authorities[customClass].name} ({country.authorities[customClass].code})
              </strong>
            </div>

            <button
              type="submit"
              id="btn-classify-road"
              className="px-5 py-2.5 bg-[#1D4ED8] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#1E40AF] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm rounded-lg"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Classify & Open Case Docket
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
