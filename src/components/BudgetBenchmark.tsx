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
  Layers,
  Clock,
  Info,
  PieChart as PieChartIcon,
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
    <section id="step-04-budget-comparison" className="bg-white border border-[#2C3034] p-5 sm:p-7 mb-7 shadow-xs rounded-2xl">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-gray-200 pb-4 mb-5 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase bg-[#1D4ED8] text-white px-2 py-0.5 rounded">
              Step 04
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-600 font-semibold">
              Forensic Cost Analysis & Benchmarking
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#16191B]">
            Budget, and How It Compares
          </h2>
        </div>

        {/* Currency Switcher Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 border border-gray-300 text-xs font-mono rounded-md">
          <span className="text-[11px] text-gray-600 px-1 font-semibold uppercase">Currency:</span>
          <button
            type="button"
            onClick={() => setCurrencyMode('local')}
            className={`px-2.5 py-1 text-xs font-bold transition-all cursor-pointer rounded ${
              currencyMode === 'local'
                ? 'bg-[#1E2022] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {country.currency}
          </button>
          <button
            type="button"
            onClick={() => setCurrencyMode('usd')}
            className={`px-2.5 py-1 text-xs font-bold transition-all cursor-pointer rounded ${
              currencyMode === 'usd'
                ? 'bg-[#1E2022] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            USD ($)
          </button>
        </div>
      </div>

      {/* Primary Metrics Dossier Box */}
      <div className="border border-[#CBD5E1] bg-white p-5 sm:p-6 mb-6 rounded-xl shadow-xs">
        {/* Top 3 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-gray-200">
          {/* Card 1: Actual Cost per km */}
          <div className="bg-[#F8FAFC] p-4 border border-[#E2E8F0] flex flex-col justify-between rounded-lg">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block font-bold">
                Project Cost Per Kilometer
              </span>
              <div className="font-serif font-bold text-2xl sm:text-3xl text-[#16191B] mt-1 tracking-tight">
                {currencyMode === 'local'
                  ? formatCurrency(analysis.costPerKmLocal, country.currency)
                  : formatUsd(analysis.costPerKmUsd)}
                <span className="text-xs font-mono font-normal text-gray-500 ml-1">/ km</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200 text-[11px] font-mono text-gray-600">
              Total: {project.budgetDisplay} ÷ {project.lengthKm} km
            </div>
          </div>

          {/* Card 2: Universal Benchmark Band */}
          <div className="bg-[#F8FAFC] p-4 border border-[#E2E8F0] flex flex-col justify-between rounded-lg">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block font-bold">
                Typical Band ({band.label})
              </span>
              <div className="font-serif font-bold text-xl sm:text-2xl text-[#16191B] mt-1 tracking-tight">
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
                <span className="text-xs font-mono font-normal text-gray-500 ml-1">/ km</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200 text-[11px] font-mono text-gray-600">
              World Bank & AfDB empirical corridors
            </div>
          </div>

          {/* Card 3: Verdict Pill Card */}
          <div
            className={`p-4 border-2 flex flex-col justify-between rounded-lg ${
              analysis.verdict === 'normal'
                ? 'bg-[#EAF3EC] border-[#1E6E38] text-[#1E6E38]'
                : analysis.verdict === 'above_typical'
                ? 'bg-rose-50 border-rose-600 text-rose-700'
                : 'bg-[#FFF8EC] border-[#D9981E] text-[#856404]'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block font-bold text-[#1E2022]">
                Comparative Forensic Verdict
              </span>
              <div className="font-serif font-bold text-xl sm:text-2xl mt-1 tracking-tight flex items-center gap-1.5">
                {analysis.verdict === 'normal' && <CheckCircle className="w-5 h-5 shrink-0" />}
                {analysis.verdict === 'above_typical' && <AlertOctagon className="w-5 h-5 shrink-0" />}
                {analysis.verdict === 'below_typical' && <TrendingUp className="w-5 h-5 shrink-0" />}
                <span>{analysis.verdictTitle}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-black/15 text-[11px] font-mono font-bold">
              {varianceText}
            </div>
          </div>
        </div>

        {/* ANALYSIS VISUALIZATION TABS */}
        <div className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-gray-200 gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#1D4ED8]" />
              <h3 className="font-serif font-bold text-lg text-[#16191B]">
                Interactive Forensic Visualizations & Charts
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 p-1 border border-gray-300 text-xs font-mono rounded-lg">
              <button
                type="button"
                onClick={() => setActiveAnalysisView('all')}
                className={`px-2.5 py-1 transition-all cursor-pointer rounded ${
                  activeAnalysisView === 'all'
                    ? 'bg-[#1E2022] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Visuals
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisView('benchmark')}
                className={`px-2.5 py-1 transition-all cursor-pointer rounded ${
                  activeAnalysisView === 'benchmark'
                    ? 'bg-[#1E2022] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Benchmark Bar
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisView('breakdown')}
                className={`px-2.5 py-1 transition-all cursor-pointer rounded ${
                  activeAnalysisView === 'breakdown'
                    ? 'bg-[#1E2022] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cost Donut
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisView('portfolio')}
                className={`px-2.5 py-1 transition-all cursor-pointer rounded ${
                  activeAnalysisView === 'portfolio'
                    ? 'bg-[#1E2022] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                National Ranking
              </button>
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
        <div className="pt-6 pb-2 border-t border-gray-200 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h4 className="font-serif font-bold text-base text-[#16191B] flex items-center gap-1.5">
              <AlignLeft className="w-4 h-4 text-[#1D4ED8]" />
              Continuous Cost Spectrum Linear Meter
            </h4>
            <span className="text-xs font-mono text-gray-500">
              Project: <strong className="text-[#1E2022]">{formatUsd(analysis.costPerKmUsd)}/km</strong> vs Benchmark:{' '}
              {formatUsd(band.minUsdPerKm)} – {formatUsd(band.maxUsdPerKm)}/km
            </span>
          </div>

          {/* Meter Bar Track */}
          <div className="relative pt-8 pb-7">
            {/* The Background Bar */}
            <div className="h-6 w-full bg-gray-200 border border-gray-400 relative flex overflow-hidden rounded-md">
              {/* Typical Band Highlighted Green Area */}
              <div
                className="h-full bg-[#BBD9C3] border-x-2 border-[#1E6E38] relative"
                style={{
                  left: `${minPercent}%`,
                  width: `${maxPercent - minPercent}%`,
                }}
                title={`Typical Band: ${formatUsd(band.minUsdPerKm)} to ${formatUsd(band.maxUsdPerKm)}`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-[#155229] font-bold uppercase tracking-wider">
                  Typical Range Band
                </span>
              </div>
            </div>

            {/* Threshold Labels */}
            <div className="relative w-full text-[10px] font-mono text-gray-500 mt-1.5">
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
              <div className="bg-[#1E2022] text-white text-[10px] font-mono font-bold px-2 py-0.5 whitespace-nowrap shadow-md flex items-center gap-1 border border-black rounded">
                <span>{project.name.split(' ')[0]}</span>
                <span className="text-blue-300">{formatUsd(analysis.costPerKmUsd)}/km</span>
              </div>
              <div className="w-0.5 h-7 bg-[#1D4ED8] border-l-2 border-[#1D4ED8]" />
              <div className="w-2.5 h-2.5 bg-[#1D4ED8] transform rotate-45 -mt-1 shadow-xs" />
            </div>
          </div>
        </div>

        {/* Plain Language Verdict Explanation */}
        <div className="mt-4 p-4 bg-[#F8FAFC] border-l-4 border-[#1D4ED8] border-y border-r border-gray-200 rounded-lg">
          <h4 className="font-serif font-bold text-base text-[#16191B] mb-1">
            Plain-Language Assessment for Citizens
          </h4>
          <p className="text-xs text-gray-700 font-serif leading-relaxed sm:text-sm">
            {analysis.verdictExplanation}
          </p>
        </div>

        {/* SEPARATE DELIVERY DELAY SIGNAL (e.g. Lagos-Ibadan 11+ years) */}
        {project.delayAlert && (
          <div className="mt-4 bg-amber-50 border-2 border-amber-300 p-4 text-xs font-mono rounded-lg">
            <div className="flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-sm text-amber-900 uppercase tracking-wider">
                  Independent Governance Signal: Prolonged Delivery Schedule
                </strong>
                <p className="text-xs text-[#2A2E33] font-serif mt-1 leading-relaxed">
                  {project.delayAlert} Even if nominal unit costs appear near benchmark corridors, schedule inflation introduces hidden economic burdens through repeated revisions, inflation indexing, and prolonged resident disruption.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Engineering & Terrain Caveats Box */}
        <div className="mt-5 bg-[#F8FAFC] p-4 border border-gray-300 text-xs font-serif text-gray-700 space-y-2 rounded-lg">
          <div className="flex items-center gap-1.5 font-mono font-bold uppercase text-[#1E2022] text-[11px]">
            <Info className="w-3.5 h-3.5 text-[#1D4ED8]" />
            Auditor's Note: Legitimate Factors That Shift Cost Per Kilometer
          </div>
          <p className="leading-relaxed text-xs">
            Unit cost alone does not prove corruption or under-delivery. Legitimate multipliers include:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs list-disc pl-4 font-mono text-gray-600">
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

