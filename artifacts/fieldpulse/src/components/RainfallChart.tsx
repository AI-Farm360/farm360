'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import * as mock from '@/data/mockData';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const row = mock.rainfallData.find((d) => d.rain === payload[0].value);
    return (
      <div className="bg-[#171717] text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg border border-white/10">
        {row?.label}
        <span className="ml-1.5 text-blue-300">{payload[0].value}mm</span>
      </div>
    );
  }
  return null;
};

export default function RainfallChart() {
  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[#ECE8E1]">
        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="10" width="4" height="10" rx="1" />
            <rect x="10" y="6" width="4" height="14" rx="1" />
            <rect x="17" y="8" width="4" height="12" rx="1" />
          </svg>
        </div>
        <div>
          <h3 className="text-xs font-bold text-[#171717]">30-Day Rainfall History</h3>
          <p className="text-[10px] text-[#6B6B6B]">Weekly rainfall totals with trend</p>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mock.rainfallData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="week"
              tick={{ fontSize: 9, fill: '#6B6B6B', fontWeight: 600 }}
              axisLine={{ stroke: '#ECE8E1' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#6B6B6B' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FAF9F6' }} />
            <Bar dataKey="rain" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {mock.rainfallData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.rain > 15 ? '#3B82F6' : entry.rain > 10 ? '#60A5FA' : '#93C5FD'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#6B6B6B] pt-1 border-t border-[#ECE8E1]">
        <span>Total: 55mm</span>
        <span>Average: 13.75mm/week</span>
        <span className={`font-semibold ${mock.rainfallData[mock.rainfallData.length - 1].rain < 15 ? 'text-amber-600' : 'text-brand-green'}`}>
          {mock.rainfallData[mock.rainfallData.length - 1].rain < 15 ? 'Below average' : 'Normal'}
        </span>
      </div>
    </div>
  );
}
