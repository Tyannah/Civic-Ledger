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
    { name: 'Matches Specifications', count: matches, color: '#1E6E38', desc: 'Civic verification reports confirming completed execution' },
    { name: 'Defects / Partial Completion', count: partial, color: '#D9981E', desc: 'Reports citing incomplete drainage, missing asphalt, or cracks' },
    { name: 'Stalled / Abandoned / Not Done', count: notDone, color: '#DC2626', desc: 'Reports citing deserted machinery, unpaved dust, or ghost road' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
      return (
        <div className="bg-white border-2 border-[#1E2022] p-2.5 shadow-lg rounded-lg text-xs font-mono max-w-xs">
          <div className="font-bold text-sm text-[#16191B]">{item.name}</div>
          <div className="text-base font-bold" style={{ color: item.color }}>
            {item.count} citizen report{item.count === 1 ? '' : 's'} ({pct}%)
          </div>
          <p className="text-[11px] text-gray-600 mt-1 font-sans">{item.desc}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white border border-[#E2E8F0] p-4 rounded-xl">
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
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-serif font-bold text-xl sm:text-2xl text-[#16191B]">
            {confidenceScore}%
          </span>
          <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">
            Confidence
          </span>
        </div>
      </div>

      <div className="sm:col-span-7 space-y-2 text-xs font-mono">
        {data.map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.name} className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[#1E2022] font-semibold">{item.name}</span>
              </div>
              <div className="text-right font-bold text-[#1E2022]">
                {item.count} <span className="text-gray-400 font-normal">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
