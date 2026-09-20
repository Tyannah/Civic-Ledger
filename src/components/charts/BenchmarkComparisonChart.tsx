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
      fill: '#D8CFBF',
    },
    {
      name: 'Benchmark Average',
      shortName: 'Class Avg',
      value: Math.round(avgBenchmark),
      type: 'benchmark',
      desc: `Empirical international median for ${roadClassLabel}`,
      fill: '#B8AD99',
    },
    {
      name: 'Benchmark Ceiling',
      shortName: 'Band Max',
      value: Math.round(maxCost),
      type: 'benchmark',
      desc: `Upper threshold corridor before audit flags`,
      fill: '#8E826F',
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
          ? '#BF532C'
          : verdict === 'normal'
          ? '#3A543E'
          : '#E09F3E',
    },
  ];

  const ceilingValue = Math.round(maxCost);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const isAbove = item.value > ceilingValue && item.type === 'project';
      const isBelow = item.value < minCost && item.type === 'project';

      return (
        <div className="bg-white border-2 border-[#3A543E] p-3 shadow-lg rounded-xl text-xs font-mono max-w-xs">
          <div className="font-bold text-sm text-[#1E2522] border-b border-[#DDD4C4] pb-1 mb-1.5">
            {item.fullName || item.name}
          </div>
          <div className="text-base font-bold text-[#3A543E]">
            {formatVal(item.value)}
            <span className="text-xs font-normal text-[#66726A] ml-1">/ km</span>
          </div>
          <p className="text-[11px] text-[#4A554E] mt-1">{item.desc}</p>
          {item.type === 'project' && (
            <div className="mt-2 pt-1.5 border-t border-[#DDD4C4] text-[11px]">
              {isAbove && (
                <span className="text-[#BF532C] font-bold">
                  ⚠️ Exceeds typical corridor ceiling by +{Math.round(((item.value - ceilingValue) / ceilingValue) * 100)}%
                </span>
              )}
              {isBelow && (
                <span className="text-[#D08E2E] font-bold">
                  ℹ️ Low unit cost relative to corridor expectations
                </span>
              )}
              {!isAbove && !isBelow && (
                <span className="text-[#2E663B] font-bold">
                  ✓ Sits securely within empirical standard range
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
    <div className="w-full bg-[#FAF7F2] border-2 border-[#DDD4C4] p-4 sm:p-5 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EAE3D5] gap-2 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#3A543E] font-bold block">
            Corridor Benchmark Analysis
          </span>
          <h4 className="font-bold text-base sm:text-lg text-[#1E2522]">
            Cost / km vs. World Bank &amp; AfDB Typical Bands
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#B8AD99] rounded-sm" />
            <span className="text-[#66726A]">Empirical Corridor</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor:
                  verdict === 'above_typical'
                    ? '#BF532C'
                    : verdict === 'normal'
                    ? '#3A543E'
                    : '#E09F3E',
              }}
            />
            <span className="font-bold text-[#1E2522]">Current Road</span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE3D5" />
            <XAxis
              dataKey="shortName"
              stroke="#66726A"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#DDD4C4' }}
            />
            <YAxis
              stroke="#66726A"
              fontSize={11}
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
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={ceilingValue}
              stroke="#BF532C"
              strokeDasharray="4 4"
              label={{
                value: `Ceiling: ${formatVal(ceilingValue)}`,
                position: 'top',
                fill: '#BF532C',
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

      <div className="mt-3 text-[11px] font-mono text-[#66726A] flex flex-wrap items-center justify-between border-t border-[#EAE3D5] pt-2">
        <span>Classification: <strong>{roadClassLabel}</strong></span>
        <span>Empirical range: <strong>{formatVal(minCost)}</strong> – <strong>{formatVal(maxCost)}</strong> / km</span>
      </div>
    </div>
  );
};
