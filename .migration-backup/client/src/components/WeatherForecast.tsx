'use client';

import { motion } from 'motion/react';
import { CloudSun, CloudRain, Cloud, Sun, Droplets } from 'lucide-react';
import type { ElementType } from 'react';
import * as mock from '@/src/data/mockData';

const iconMap: Record<string, ElementType> = {
  Cloud, CloudSun, CloudRain, Sun,
};

export default function WeatherForecast() {
  const forecastDays = mock.forecastDays.map((d) => ({
    ...d,
    icon: iconMap[d.icon] || Cloud,
  }));
  const maxRain = Math.max(...forecastDays.map((d) => d.rain));

  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[#ECE8E1]">
        <CloudSun className="w-4 h-4 text-brand-green" />
        <div>
          <h3 className="text-xs font-bold text-[#171717]">7-Day Forecast</h3>
          <p className="text-[10px] text-[#6B6B6B]">Localized weather with farmer guidance</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
        {forecastDays.map((day, i) => {
          const Icon = day.icon;
          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="p-4 bg-[#FAF9F6] border border-[#ECE8E1] rounded-xl text-center space-y-2"
            >
              <span className="text-[10px] font-bold text-[#6B6B6B] uppercase">{day.day}</span>
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                className="flex justify-center"
              >
                <Icon className="w-6 h-6 text-[#6B6B6B]" />
              </motion.div>
              <span className="text-sm font-bold text-[#171717]">{day.temp}°C</span>
              <div className="w-full bg-white border border-[#ECE8E1] rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(day.rain / maxRain) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="h-full bg-blue-400 rounded-full"
                />
              </div>
              <span className="text-[9px] font-medium text-blue-600">{day.rain}mm</span>
              <p className="text-[9px] text-[#6B6B6B] leading-tight">{day.meaning}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
