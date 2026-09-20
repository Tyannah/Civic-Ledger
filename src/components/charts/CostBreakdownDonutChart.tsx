import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { formatCurrency, formatUsd } from '../../utils/calculator';

interface CostBreakdownDonutChartProps {
  totalCostPerKmUsd: number;
  totalCostPerKmLocal: number;
  currencyMode: 'local' | 'usd';
  currency: string;
}

const COMPONENTS = [
  { name: 'Asphalt & Pavement', share: 0.38, color: '#1E293B', desc: 'Wearing course, binder layer, asphalt concrete surfacing' },
  { name: 'Earthworks & Subbase', share: 0.26, color: '#0284C7', desc: 'Grading, cut & fill, gravel compaction, subgrade prep' },
  { name: 'Storm Drainage', share: 0.18, color: '#2563EB', desc: 'Lined concrete ditches, side drains, culvert channels' },
  { name: 'Structures & Bridges', share: 0.12, color: '#D97706', desc: 'Box culverts, flyover retaining walls, pedestrian spans' },
  { name: 'Safety, Signs & Lighting', share: 0.06, color: '#16A34A', desc: 'Road marking, guardrails, reflective signs, cat eyes' },
];

export const CostBreakdownDonutChart: React.FC<CostBreakdownDonutChartProps> = ({
  totalCostPerKmUsd,
  totalCostPerKmLocal,
  currencyMode,
  currency,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isUsd = currencyMode === 'usd';
  const totalCost = isUsd ? totalCostPerKmUsd : totalCostPerKmLocal;

  const data = COMPONENTS.map((item) => ({
    name: item.name,
    percentage: Math.round(item.share * 100),
    value: Math.round(totalCost * item.share),
    color: item.color,
    desc: item.desc,
  }));

  const formatVal = (val: number) => {
    return isUsd ? formatUsd(val) : formatCurrency(val, currency);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border-2 border-[#1E2022] p-3 shadow-lg rounded-lg text-xs font-mono max-w-xs">
          <div className="font-serif font-bold text-sm text-[#16191B] pb-1 border-b border-gray-200">
            {item.name}
          </div>
          <div className="text-base font-bold text-[#1D4ED8] mt-1">
            {formatVal(item.value)}
            <span className="text-xs font-normal text-gray-500 ml-1">/ km ({item.percentage}%)</span>
          </div>
          <p className="text-[11px] text-gray-600 mt-1 font-sans">{item.desc}</p>
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
            Engineering Cost Composition
          </span>
          <h4 className="font-serif font-bold text-base sm:text-lg text-[#16191B]">
            Civil Works Component Allocation (Estimated)
          </h4>
        </div>
        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          Standard FIDIC / Road Agency Model
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Donut Chart with Centered Total */}
        <div className="md:col-span-6 relative h-60 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={activeIndex === index ? '#1E2022' : '#ffffff'}
                    strokeWidth={activeIndex === index ? 2 : 1}
                    className="transition-all duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
              Total Cost
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-[#16191B]">
              {formatVal(totalCost)}
            </span>
            <span className="text-[10px] font-mono text-gray-500">per km</span>
          </div>
        </div>

        {/* Legend / Breakdown Details */}
        <div className="md:col-span-6 space-y-2 text-xs font-mono">
          {data.map((item, idx) => (
            <div
              key={item.name}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                activeIndex === idx
                  ? 'bg-gray-50 border-[#1E2022] shadow-xs'
                  : 'bg-white border-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <span className="font-bold text-[#1E2022] block font-sans text-xs">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-gray-500">{item.percentage}% of contract</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-[#1E2022] block">{formatVal(item.value)}</span>
                <span className="text-[10px] text-gray-400">/ km</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
