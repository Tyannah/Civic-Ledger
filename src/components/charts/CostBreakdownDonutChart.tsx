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
  { name: 'Asphalt & Pavement', share: 0.38, color: '#3A543E', desc: 'Wearing course, binder layer, asphalt concrete surfacing' },
  { name: 'Earthworks & Subbase', share: 0.26, color: '#BF532C', desc: 'Grading, cut & fill, gravel compaction, subgrade prep' },
  { name: 'Storm Drainage', share: 0.18, color: '#E09F3E', desc: 'Lined concrete ditches, side drains, culvert channels' },
  { name: 'Structures & Bridges', share: 0.12, color: '#8C5E1E', desc: 'Box culverts, flyover retaining walls, pedestrian spans' },
  { name: 'Safety, Signs & Lighting', share: 0.06, color: '#5B7A60', desc: 'Road marking, guardrails, reflective signs, cat eyes' },
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
        <div className="bg-white border-2 border-[#3A543E] p-3 shadow-lg rounded-xl text-xs font-mono max-w-xs">
          <div className="font-bold text-sm text-[#1E2522] pb-1 border-b border-[#DDD4C4]">
            {item.name}
          </div>
          <div className="text-base font-bold text-[#3A543E] mt-1">
            {formatVal(item.value)}
            <span className="text-xs font-normal text-[#66726A] ml-1">/ km ({item.percentage}%)</span>
          </div>
          <p className="text-[11px] text-[#4A554E] mt-1">{item.desc}</p>
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
            Civil Engineering Allocation
          </span>
          <h4 className="font-bold text-base sm:text-lg text-[#1E2522]">
            Standard Cost Component Breakdown per km
          </h4>
        </div>
        <span className="text-xs font-mono text-[#66726A]">
          Civil works empirical shares
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-6 h-60 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#FAF7F2"
                    strokeWidth={2}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono uppercase text-[#66726A] font-bold">Total / km</span>
            <span className="font-bold text-sm text-[#1E2522]">
              {formatVal(totalCost)}
            </span>
          </div>
        </div>

        <div className="md:col-span-6 space-y-2 text-xs font-mono">
          {data.map((item, index) => {
            const isHovered = activeIndex === index;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                  isHovered
                    ? 'bg-white border-[#3A543E] shadow-xs'
                    : 'bg-[#F4EFE6] border-transparent hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-bold text-[#1E2522]">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#1E2522]">{formatVal(item.value)}</span>
                  <span className="text-[10px] text-[#66726A] ml-1">({item.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
