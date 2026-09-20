import React, { useState } from 'react';
import { CountryInfo, RoadProject } from '../types';
import { analyzeProjectBudget, formatCurrency, formatUsd } from '../utils/calculator';
import { SEED_PROJECTS } from '../data/roadsData';
import { BenchmarkComparisonChart } from './charts/BenchmarkComparisonChart';
import { CostBreakdownDonutChart } from './charts/CostBreakdownDonutChart';
import { NationalRoadsComparisonChart } from './charts/NationalRoadsComparisonChart';
import {
  TrendingUp,
  AlertOctagon,
  CheckCircle,
  BarChart3,
  Clock,
  Info,
  AlignLeft,
} from 'lucide-react';

interface BudgetBenchmarkProps {
  project: RoadProject;
  country: CountryInfo;
  onSelectProject?: (project: RoadProject) => void;
}

export const BudgetBenchmark: React.FC<BudgetBenchmarkProps> = ({
  project,
  country,
  onSelectProject,
}) => {
  const [currencyMode, setCurrencyMode] = useState<'local' | 'usd'>('local');
  const [activeAnalysisView, setActiveAnalysisView] = useState<'all' | 'benchmark' | 'breakdown' | 'portfolio'>('all');
  const analysis = analyzeProjectBudget(project);
  const band = analysis.band;

  // Filter projects for the national comparison chart
  const countryProjects = SEED_PROJECTS.filter((p) => p.countryCode === project.countryCode);

  // Percentage variance calculation
  let varianceText = '';
  if (analysis.verdict === 'above_typical') {
    const diffPct = Math.round(((analysis.costPerKmUsd - band.maxUsdPerKm) / band.maxUsdPerKm) * 100);
    varianceText = `+${diffPct}% above typical band ceiling`;
  } else if (analysis.verdict === 'below_typical') {
    const diffPct = Math.round(((band.minUsdPerKm - analysis.costPerKmUsd) / band.minUsdPerKm) * 100);
    varianceText = `-${diffPct}% below typical band floor`;
  } else {
    varianceText = 'Within standard international cost corridor';
  }

  // Visual pin position calculation
  const scaleMax = band.maxUsdPerKm * 1.5;
  const pinPercent = Math.min(Math.max((analysis.costPerKmUsd / scaleMax) * 100, 4), 96);
  const minPercent = (band.minUsdPerKm / scaleMax) * 100;
  const maxPercent = (band.maxUsdPerKm / scaleMax) * 100;

  return (
    <section id="step-04-budget-comparison" className="relative bg-white border-2 border-[#DDD4C4] p-5 sm:p-7 mb-8 rounded-2xl shadow-xs overflow-hidden">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-2 border-[#EAE3D5] pb-4 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold uppercase bg-[#E09F3E] text-[#1E2522] px-3 py-0.5 rounded-full shadow-xs">
              Step 04
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#3A543E] font-bold">
              Forensic Cost Analysis &amp; Benchmarking
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-wide text-[#3A543E]">
            Budget, and How It Compares
          </h2>
        </div>

        {/* Currency Switcher Toggle */}
        <div className="flex items-center gap-1.5 bg-[#F4EFE6] p-1 border border-[#DDD4C4] text-xs font-mono rounded-full">
          <span className="text-[11px] text-[#66726A] px-2 font-bold uppercase">Currency:</span>
          <button
            type="button"
            onClick={() => setCurrencyMode('local')}
            className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer rounded-full ${
              currencyMode === 'local'
                ? 'bg-[#3A543E] text-white shadow-xs'
                : 'text-[#4A554E] hover:text-[#1E2522]'
            }`}
          >
            {country.currency}
          </button>
          <button
            type="button"
            onClick={() => setCurrencyMode('usd')}
            className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer rounded-full ${
              currencyMode === 'usd'
                ? 'bg-[#3A543E] text-white shadow-xs'
                : 'text-[#4A554E] hover:text-[#1E2522]'
            }`}
          >
            USD ($)
          </button>
        </div>
      </div>

      {/* Primary Metrics Dossier Box */}
      <div className="border-2 border-[#DDD4C4] bg-[#FAF7F2] p-5 sm:p-6 mb-6 rounded-2xl shadow-xs">
        {/* Top 3 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#EAE3D5]">
          {/* Card 1: Actual Cost per km */}
          <div className="bg-white p-5 border border-[#DDD4C4] flex flex-col justify-between rounded-2xl shadow-2xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#66726A] block font-bold">
                Project Cost Per Kilometer
              </span>
              <div className="font-bold text-2xl sm:text-3xl text-[#1E2522] mt-1 tracking-tight">
                {currencyMode === 'local'
                  ? formatCurrency(analysis.costPerKmLocal, country.currency)
                  : formatUsd(analysis.costPerKmUsd)}
                <span className="text-xs font-mono font-normal text-[#66726A] ml-1">/ km</span>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-[#EAE3D5] text-[11px] font-mono text-[#66726A]">
              Total: {project.budgetDisplay} ÷ {project.lengthKm} km
            </div>
          </div>

          {/* Card 2: Universal Benchmark Band */}
          <div className="bg-white p-5 border border-[#DDD4C4] flex flex-col justify-between rounded-2xl shadow-2xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#66726A] block font-bold">
                Typical Band ({band.label})
              </span>
              <div className="font-bold text-xl sm:text-2xl text-[#1E2522] mt-1 tracking-tight">
                {currencyMode === 'local' ? (
                  <>
                    {formatCurrency(band.minUsdPerKm * country.fxRateToUsd, country.currency)} –{' '}
                    {formatCurrency(band.maxUsdPerKm * country.fxRateToUsd, country.currency)}
                  </>
                ) : (
                  <>
                    {formatUsd(band.minUsdPerKm)} – {formatUsd(band.maxUsdPerKm)}
                  </>
                )}
                <span className="text-xs font-mono font-normal text-[#66726A] ml-1">/ km</span>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-[#EAE3D5] text-[11px] font-mono text-[#66726A]">
              World Bank &amp; AfDB empirical corridors
            </div>
          </div>

          {/* Card 3: Verdict Pill Card */}
          <div
            className={`p-5 border-2 flex flex-col justify-between rounded-2xl shadow-2xs ${
              analysis.verdict === 'normal'
                ? 'bg-[#E8F0EA] border-[#2E663B] text-[#2E663B]'
                : analysis.verdict === 'above_typical'
                ? 'bg-[#FDF0EC] border-[#BF532C] text-[#BF532C]'
                : 'bg-[#FDF4E7] border-[#E09F3E] text-[#8C5E1E]'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block font-bold text-[#1E2522]">
                Comparative Forensic Verdict
              </span>
              <div className="font-bold text-xl sm:text-2xl mt-1 tracking-tight flex items-center gap-2">
                {analysis.verdict === 'normal' && <CheckCircle className="w-5 h-5 shrink-0 text-[#2E663B]" />}
                {analysis.verdict === 'above_typical' && <AlertOctagon className="w-5 h-5 shrink-0 text-[#BF532C]" />}
                {analysis.verdict === 'below_typical' && <TrendingUp className="w-5 h-5 shrink-0 text-[#E09F3E]" />}
                <span>{analysis.verdictTitle}</span>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-black/10 text-[11px] font-mono font-bold">
              {varianceText}
            </div>
          </div>
        </div>

        {/* ANALYSIS VISUALIZATION TABS */}
        <div className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#EAE3D5] gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#3A543E]" />
              <h3 className="font-bold text-lg text-[#1E2522]">
                Interactive Forensic Visualizations &amp; Charts
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-[#F4EFE6] p-1 border border-[#DDD4C4] text-xs font-mono rounded-full">
              {[
                { id: 'all', label: 'All Visuals' },
                { id: 'benchmark', label: 'Benchmark Bar' },
                { id: 'breakdown', label: 'Cost Donut' },
                { id: 'portfolio', label: 'National Ranking' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveAnalysisView(tab.id as any)}
                  className={`px-3 py-1 transition-all cursor-pointer rounded-full font-bold ${
                    activeAnalysisView === tab.id
                      ? 'bg-[#3A543E] text-white shadow-xs'
                      : 'text-[#4A554E] hover:text-[#1E2522]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* CHARTS CONTAINER */}
          <div className="space-y-6">
            {/* CHART 1: Benchmark Comparison Chart */}
            {(activeAnalysisView === 'all' || activeAnalysisView === 'benchmark') && (
              <BenchmarkComparisonChart
                costPerKmUsd={analysis.costPerKmUsd}
                costPerKmLocal={analysis.costPerKmLocal}
                minUsdPerKm={band.minUsdPerKm}
                maxUsdPerKm={band.maxUsdPerKm}
                currencyMode={currencyMode}
                currency={country.currency}
                fxRate={country.fxRateToUsd}
                projectName={project.name}
                roadClassLabel={band.label}
                verdict={analysis.verdict}
              />
            )}

            {/* CHART 2: Civil Engineering Cost Breakdown Donut Chart */}
            {(activeAnalysisView === 'all' || activeAnalysisView === 'breakdown') && (
              <CostBreakdownDonutChart
                totalCostPerKmUsd={analysis.costPerKmUsd}
                totalCostPerKmLocal={analysis.costPerKmLocal}
                currencyMode={currencyMode}
                currency={country.currency}
              />
            )}

            {/* CHART 3: National Cross-Comparison Chart */}
            {(activeAnalysisView === 'all' || activeAnalysisView === 'portfolio') && countryProjects.length > 1 && (
              <NationalRoadsComparisonChart
                projects={countryProjects}
                selectedProjectId={project.id}
                onSelectProject={(p) => {
                  if (onSelectProject) {
                    onSelectProject(p);
                  }
                }}
                currencyMode={currencyMode}
                currency={country.currency}
                fxRate={country.fxRateToUsd}
                countryName={country.name}
              />
            )}
          </div>
        </div>

        {/* VISUAL BENCHMARK GAUGE METER */}
        <div className="pt-6 pb-2 border-t border-[#EAE3D5] mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h4 className="font-bold text-base text-[#1E2522] flex items-center gap-1.5">
              <AlignLeft className="w-4 h-4 text-[#3A543E]" />
              Continuous Cost Spectrum Linear Meter
            </h4>
            <span className="text-xs font-mono text-[#66726A]">
              Project: <strong className="text-[#1E2522]">{formatUsd(analysis.costPerKmUsd)}/km</strong> vs Benchmark:{' '}
              {formatUsd(band.minUsdPerKm)} – {formatUsd(band.maxUsdPerKm)}/km
            </span>
          </div>

          {/* Meter Bar Track */}
          <div className="relative pt-8 pb-7">
            {/* The Background Bar */}
            <div className="h-6 w-full bg-[#EAE3D5] border border-[#DDD4C4] relative flex overflow-hidden rounded-xl">
              {/* Typical Band Highlighted Green Area */}
              <div
                className="h-full bg-[#BBD7C2] border-x-2 border-[#2E663B] relative"
                style={{
                  left: `${minPercent}%`,
                  width: `${maxPercent - minPercent}%`,
                }}
                title={`Typical Band: ${formatUsd(band.minUsdPerKm)} to ${formatUsd(band.maxUsdPerKm)}`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-[#1E4D2B] font-bold uppercase tracking-wider">
                  Typical Range Band
                </span>
              </div>
            </div>

            {/* Threshold Labels */}
            <div className="relative w-full text-[10px] font-mono text-[#66726A] mt-1.5">
              <span className="absolute left-0 font-bold">$0</span>
              <span className="absolute transform -translate-x-1/2" style={{ left: `${minPercent}%` }}>
                Min: {formatUsd(band.minUsdPerKm)}
              </span>
              <span className="absolute transform -translate-x-1/2" style={{ left: `${maxPercent}%` }}>
                Max: {formatUsd(band.maxUsdPerKm)}
              </span>
              <span className="absolute right-0 font-bold">{formatUsd(scaleMax)}+</span>
            </div>

            {/* The Pin Marker for this Project */}
            <div
              className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-500"
              style={{ left: `${pinPercent}%` }}
            >
              <div className="bg-[#1E2522] text-white text-[10px] font-mono font-bold px-2.5 py-1 whitespace-nowrap shadow-md flex items-center gap-1.5 border border-[#3A543E] rounded-full">
                <span>{project.name.split(' ')[0]}</span>
                <span className="text-[#E09F3E]">{formatUsd(analysis.costPerKmUsd)}/km</span>
              </div>
              <div className="w-0.5 h-6 bg-[#3A543E]" />
              <div className="w-2.5 h-2.5 bg-[#E09F3E] transform rotate-45 -mt-1 shadow-xs" />
            </div>
          </div>
        </div>

        {/* Plain Language Verdict Explanation */}
        <div className="mt-4 p-4 bg-[#F4EFE6] border-l-4 border-[#3A543E] border-y border-r border-[#DDD4C4] rounded-xl">
          <h4 className="font-bold text-base text-[#1E2522] mb-1">
            Plain-Language Assessment for Citizens
          </h4>
          <p className="text-xs text-[#3E4741] leading-relaxed sm:text-sm">
            {analysis.verdictExplanation}
          </p>
        </div>

        {/* SEPARATE DELIVERY DELAY SIGNAL */}
        {project.delayAlert && (
          <div className="mt-4 bg-[#FDF0EC] border border-[#F2C7BB] p-4 text-xs font-mono rounded-xl">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#BF532C] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-sm text-[#7A2E12] uppercase tracking-wider">
                  Independent Governance Signal: Prolonged Delivery Schedule
                </strong>
                <p className="text-xs text-[#3E4741] mt-1 leading-relaxed">
                  {project.delayAlert} Even if nominal unit costs appear near benchmark corridors, schedule inflation introduces hidden economic burdens through repeated revisions, inflation indexing, and prolonged resident disruption.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Engineering & Terrain Caveats Box */}
        <div className="mt-5 bg-white p-4 border border-[#DDD4C4] text-xs text-[#3E4741] space-y-2 rounded-xl">
          <div className="flex items-center gap-1.5 font-mono font-bold uppercase text-[#3A543E] text-[11px]">
            <Info className="w-3.5 h-3.5 text-[#BF532C]" />
            Auditor's Note: Legitimate Factors That Shift Cost Per Kilometer
          </div>
          <p className="leading-relaxed text-xs">
            Unit cost alone does not prove corruption or under-delivery. Legitimate multipliers include:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs list-disc pl-4 font-mono text-[#556259]">
            <li>Swampy terrain, black cotton soils, or heavy cuts through rock</li>
            <li>Number of lanes (e.g. 4-lane or 6-lane divided dual carriageways)</li>
            <li>Major viaducts, multi-level interchanges, and flyovers</li>
            <li>Urban land acquisition and relocation compensation costs</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
