import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
  CartesianGrid,
} from 'recharts';
import { CostVerdict } from '../../types';
import { formatCurrency, formatUsd } from '../../utils/calculator';

interface BenchmarkComparisonChartProps {
  costPerKmUsd: number;
  costPerKmLocal: number;
  minUsdPerKm: number;
  maxUsdPerKm: number;
  currencyMode: 'local' | 'usd';
  currency: string;
  fxRate: number;
  projectName: string;
  roadClassLabel: string;
  verdict: CostVerdict;
}

export const BenchmarkComparisonChart: React.FC<BenchmarkComparisonChartProps> = ({
  costPerKmUsd,
  costPerKmLocal,
  minUsdPerKm,
  maxUsdPerKm,
  currencyMode,
  currency,
  fxRate,
  projectName,
  roadClassLabel,
  verdict,
}) => {
  const isUsd = currencyMode === 'usd';

  const convert = (usdVal: number) => {
    return isUsd ? usdVal : usdVal * fxRate;
  };

  const formatVal = (val: number) => {
    return isUsd ? formatUsd(val) : formatCurrency(val, currency);
  };

  const projectCost = isUsd ? costPerKmUsd : costPerKmLocal;
  const minCost = convert(minUsdPerKm);
  const maxCost = convert(maxUsdPerKm);
  const avgBenchmark = (minCost + maxCost) / 2;

  const data = [
    {
      name: 'Benchmark Floor',
      shortName: 'Band Min',
      value: Math.round(minCost),
      type: 'benchmark',
      desc: `Minimum typical cost for ${roadClassLabel}`,
      fill: '#94A3B8',
    },
    {
      name: 'Benchmark Average',
      shortName: 'Class Avg',
      value: Math.round(avgBenchmark),
      type: 'benchmark',
      desc: `Empirical international median for ${roadClassLabel}`,
      fill: '#64748B',
    },
    {
      name: 'Benchmark Ceiling',
      shortName: 'Band Max',
      value: Math.round(maxCost),
      type: 'benchmark',
      desc: `Upper threshold corridor before audit flags`,
      fill: '#475569',
    },
    {
      name: projectName.length > 20 ? projectName.slice(0, 18) + '...' : projectName,
      fullName: projectName,
      shortName: 'This Road',
      value: Math.round(projectCost),
      type: 'project',
      desc: `Reported civil works contract cost per kilometer`,
      fill:
        verdict === 'above_typical'
          ? '#DC2626'
          : verdict === 'normal'
          ? '#1E6E38'
          : '#D9981E',
    },
  ];

  const ceilingValue = Math.round(maxCost);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const isAbove = item.value > ceilingValue && item.type === 'project';
      const isBelow = item.value < minCost && item.type === 'project';

      return (
        <div className="bg-white border-2 border-[#1E2022] p-3 shadow-lg rounded-lg text-xs font-mono max-w-xs">
          <div className="font-bold text-sm text-[#16191B] font-serif border-b border-gray-200 pb-1 mb-1.5">
            {item.fullName || item.name}
          </div>
          <div className="text-base font-bold text-[#1D4ED8]">
            {formatVal(item.value)}
            <span className="text-xs font-normal text-gray-500 ml-1">/ km</span>
          </div>
          <p className="text-[11px] text-gray-600 mt-1 font-sans">{item.desc}</p>
          {item.type === 'project' && (
            <div className="mt-2 pt-1.5 border-t border-gray-200 text-[11px]">
              {isAbove && (
                <span className="text-rose-600 font-bold">
                  ⚠️ Exceeds typical corridor ceiling by +{Math.round(((item.value - ceilingValue) / ceilingValue) * 100)}%
                </span>
              )}
              {isBelow && (
                <span className="text-[#D9981E] font-bold">
                  ℹ️ Lower than standard corridor floor
                </span>
              )}
              {!isAbove && !isBelow && (
                <span className="text-[#1E6E38] font-bold">
                  ✓ Within empirical benchmark corridor
                </span>
              )}
            </div>
          )}
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
            Comparative Unit Cost Chart
          </span>
          <h4 className="font-serif font-bold text-base sm:text-lg text-[#16191B]">
            Project Cost vs International Benchmark Corridors
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#64748B] rounded-sm inline-block" /> Benchmark Band
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{
                backgroundColor:
                  verdict === 'above_typical'
                    ? '#DC2626'
                    : verdict === 'normal'
                    ? '#1E6E38'
                    : '#D9981E',
              }}
            />{' '}
            Selected Road
          </span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="shortName"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
            />
            <YAxis
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <ReferenceLine
              y={ceilingValue}
              stroke="#DC2626"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Ceiling: ${formatVal(ceilingValue)}/km`,
                position: 'top',
                fill: '#DC2626',
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-center text-[11px] font-mono text-gray-500 bg-gray-50 py-1.5 px-3 rounded border border-gray-200">
        Empirical comparative ceiling: <strong>{formatVal(ceilingValue)}/km</strong>. Projects exceeding this line trigger forensic review protocols.
      </div>
    </div>
  );
};
