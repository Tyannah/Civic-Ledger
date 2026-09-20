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
        <div className="bg-white border-2 border-[#1E2022] p-3 shadow-lg rounded-lg text-xs font-mono max-w-xs">
          <div className="font-serif font-bold text-sm text-[#16191B] border-b border-gray-200 pb-1 mb-1">
            {item.fullName}
          </div>
          <div className="text-base font-bold text-[#1D4ED8]">
            {formatVal(item.value)}
            <span className="text-xs font-normal text-gray-500 ml-1">/ km</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-600">
            Class: <span className="uppercase font-bold">{item.roadClass}</span> • Length:{' '}
            {item.originalProject.lengthKm} km
          </div>
          <div className="mt-1 text-[10px] text-blue-600 font-bold">
            {item.isSelected ? '★ Currently Selected' : 'Click bar to inspect this project'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white border border-[#E2E8F0] p-4 sm:p-5 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block">
            National Portfolio Cross-Comparison
          </span>
          <h4 className="font-serif font-bold text-base sm:text-lg text-[#16191B]">
            Cost-per-Kilometer Ranking across {countryName} Projects
          </h4>
        </div>
        <span className="text-xs font-mono text-gray-500">
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
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
            <XAxis
              type="number"
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tickFormatter={(val) => {
                if (isUsd) {
                  return val >= 1_000_000 ? `$${(val / 1_000_000).toFixed(1)}M` : `$${(val / 1_000).toFixed(0)}k`;
                }
                return val >= 1_000_000_000 ? `${(val / 1_000_000_000).toFixed(1)}B` : `${(val / 1_000_000).toFixed(0)}M`;
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748B"
              fontSize={11}
              width={140}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              onClick={(data: any) => {
                const project = data?.originalProject || data?.payload?.originalProject;
                if (project) {
                  onSelectProject(project);
                }
              }}
              className="cursor-pointer"
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={entry.isSelected ? '#1D4ED8' : '#94A3B8'}
                  stroke={entry.isSelected ? '#1E2022' : 'transparent'}
                  strokeWidth={entry.isSelected ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-500 bg-gray-50 py-1.5 px-3 rounded border border-gray-200 gap-2">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#1D4ED8] rounded-sm inline-block" /> Selected Road
          <span className="w-3 h-3 bg-[#94A3B8] rounded-sm inline-block ml-2" /> Other Monitored Projects
        </span>
        <span>Interactive: select bars to switch docket</span>
      </div>
    </div>
  );
};
