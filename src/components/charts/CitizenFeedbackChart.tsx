import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

interface CitizenFeedbackChartProps {
  matches: number;
  partial: number;
  notDone: number;
  total: number;
  confidenceScore: number;
}

export const CitizenFeedbackChart: React.FC<CitizenFeedbackChartProps> = ({
  matches,
  partial,
  notDone,
  total,
  confidenceScore,
}) => {
  const data = [
    { name: 'Matches Specifications', count: matches, color: '#2E663B', desc: 'Civic verification reports confirming completed execution' },
    { name: 'Defects / Partial Completion', count: partial, color: '#E09F3E', desc: 'Reports citing incomplete drainage, missing asphalt, or cracks' },
    { name: 'Stalled / Abandoned / Not Done', count: notDone, color: '#BF532C', desc: 'Reports citing deserted machinery, unpaved dust, or ghost road' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
      return (
        <div className="bg-white border-2 border-[#3A543E] p-3 shadow-lg rounded-xl text-xs font-mono max-w-xs">
          <div className="font-bold text-sm text-[#1E2522] border-b border-[#DDD4C4] pb-1 mb-1">{item.name}</div>
          <div className="text-base font-bold" style={{ color: item.color }}>
            {item.count} citizen report{item.count === 1 ? '' : 's'} ({pct}%)
          </div>
          <p className="text-[11px] text-[#556259] mt-1">{item.desc}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#FAF7F2] border-2 border-[#DDD4C4] p-4 sm:p-5 rounded-2xl">
      <div className="sm:col-span-5 relative h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={75}
              paddingAngle={4}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#FAF7F2" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-[#1E2522]">
            {total === 0 ? '0' : `${confidenceScore}%`}
          </span>
          <span className="text-[10px] font-mono uppercase text-[#66726A] font-bold">Confidence</span>
        </div>
      </div>

      <div className="sm:col-span-7 space-y-2 text-xs font-mono">
        <div className="text-[11px] uppercase tracking-wider text-[#3A543E] font-bold mb-1">
          Community Observations Verification
        </div>

        {data.map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div
              key={item.name}
              className="p-2 bg-white border border-[#DDD4C4] rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-[#1E2522]">{item.name}</span>
              </div>
              <div className="text-right font-bold text-[#1E2522]">
                {item.count} <span className="text-[#66726A] text-[11px]">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
