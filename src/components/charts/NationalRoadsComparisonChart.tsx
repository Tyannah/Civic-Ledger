import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { RoadProject } from '../../types';
import { formatCurrency, formatUsd } from '../../utils/calculator';

interface NationalRoadsComparisonChartProps {
  projects: RoadProject[];
  selectedProjectId: string;
  onSelectProject: (project: RoadProject) => void;
  currencyMode: 'local' | 'usd';
  currency: string;
  fxRate: number;
  countryName: string;
}

export const NationalRoadsComparisonChart: React.FC<NationalRoadsComparisonChartProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  currencyMode,
  currency,
  fxRate,
  countryName,
}) => {
  const isUsd = currencyMode === 'usd';

  // Compute cost per km for each project
  const chartData = projects.map((p) => {
    const costPerKmLocal = p.budgetLocal / Math.max(p.lengthKm, 0.1);
    const costPerKmUsd = costPerKmLocal / fxRate;
    const value = isUsd ? costPerKmUsd : costPerKmLocal;
    const isSelected = p.id === selectedProjectId;

    return {
      id: p.id,
      name: p.name.length > 22 ? p.name.slice(0, 20) + '...' : p.name,
      fullName: p.name,
      roadClass: p.roadClass,
      costPerKmUsd,
      costPerKmLocal,
      value: Math.round(value),
      isSelected,
      originalProject: p,
    };
  });

  // Sort descending by cost per km for a clean ranking
  chartData.sort((a, b) => b.value - a.value);

  const formatVal = (val: number) => {
    return isUsd ? formatUsd(val) : formatCurrency(val, currency);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border-2 border-[#3A543E] p-3 shadow-lg rounded-xl text-xs font-mono max-w-xs">
          <div className="font-bold text-sm text-[#1E2522] border-b border-[#DDD4C4] pb-1 mb-1">
            {item.fullName}
          </div>
          <div className="text-base font-bold text-[#3A543E]">
            {formatVal(item.value)}
            <span className="text-xs font-normal text-[#66726A] ml-1">/ km</span>
          </div>
          <div className="mt-1 text-[11px] text-[#4A554E]">
            Class: <span className="uppercase font-bold">{item.roadClass}</span> • Length:{' '}
            {item.originalProject.lengthKm} km
          </div>
          <div className="mt-1 text-[10px] text-[#BF532C] font-bold">
            {item.isSelected ? '★ Currently Selected' : 'Click bar to inspect this project'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[#FAF7F2] border-2 border-[#DDD4C4] p-4 sm:p-5 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EAE3D5] gap-2 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#3A543E] font-bold block">
            National Portfolio Cross-Comparison
          </span>
          <h4 className="font-bold text-base sm:text-lg text-[#1E2522]">
            Cost-per-Kilometer Ranking across {countryName} Projects
          </h4>
        </div>
        <span className="text-xs font-mono text-[#66726A]">
          Click any bar to load project into docket
        </span>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAE3D5" />
            <XAxis
              type="number"
              stroke="#66726A"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#DDD4C4' }}
              tickFormatter={(val) => {
                if (isUsd) {
                  return val >= 1_000_000 ? `$${(val / 1_000_000).toFixed(1)}M` : `$${(val / 1_000).toFixed(0)}k`;
                }
                return val >= 1_000_000_000
                  ? `${(val / 1_000_000_000).toFixed(1)}B`
                  : val >= 1_000_000
                  ? `${(val / 1_000_000).toFixed(0)}M`
                  : `${val}`;
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#1E2522"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#DDD4C4' }}
              width={140}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              onClick={(entry: any) => onSelectProject(entry.originalProject)}
              cursor="pointer"
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={entry.isSelected ? '#3A543E' : '#D0C6B5'}
                  stroke={entry.isSelected ? '#E09F3E' : 'none'}
                  strokeWidth={entry.isSelected ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#66726A] border-t border-[#EAE3D5] pt-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#3A543E] rounded-full" /> Selected Road
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#D0C6B5] rounded-full" /> Peer Projects
          </span>
        </div>
        <span>Select any row to inspect case</span>
      </div>
    </div>
  );
};
