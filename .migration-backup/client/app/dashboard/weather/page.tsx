'use client';

import { motion } from 'motion/react';
import { AlertTriangle, Clock } from 'lucide-react';
import { useDashboard } from '@/src/contexts/DashboardContext';
import * as mock from '@/src/data/mockData';
import WeatherHero from '@/src/components/WeatherHero';
import WeatherForecast from '@/src/components/WeatherForecast';
import RainfallChart from '@/src/components/RainfallChart';
import WeatherAdvisoryFlow from '@/src/components/WeatherAdvisoryFlow';
import DataReliabilityVisual from '@/src/components/DataReliabilityVisual';

export default function WeatherPage() {
  const { activeField } = useDashboard();
  const { temperatureCelsius, humidityPercent, rainfallMm, forecast } = mock.weather;

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <WeatherHero
        temperature={`${temperatureCelsius}°C`}
        rainfall={`${rainfallMm}mm`}
        humidity={`${humidityPercent}%`}
        condition="Cool and Humid"
        drynessRisk={40}
        farmerAction="Monitor soil moisture. Light rain is expected tomorrow."
      />

      {/* Rainfall Risk Meter */}
      <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
            </svg>
          </div>
          <h3 className="text-xs font-bold text-[#171717]">Rainfall Risk Meter</h3>
        </div>

        <div className="relative pt-2">
          {/* Labels */}
          <div className="flex justify-between text-[10px] font-bold text-[#6B6B6B] mb-1.5 px-1">
            <span className="text-emerald-600">Low</span>
            <span className="text-amber-600">Moderate</span>
            <span className="text-rose-600">High</span>
          </div>
          {/* Bar */}
          <div className="w-full h-3 bg-gradient-to-r from-emerald-200 via-amber-200 to-rose-200 rounded-full border border-[#ECE8E1] relative overflow-hidden">
            <motion.div
              initial={{ left: '0%' }}
              animate={{ left: '42%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-amber-500 rounded-full shadow-md z-10"
            />
            {/* Tick marks */}
            <div className="absolute inset-0 flex justify-between px-1 items-center">
              <div className="w-0.5 h-2 bg-white/40 rounded" />
              <div className="w-0.5 h-2 bg-white/40 rounded" />
              <div className="w-0.5 h-2 bg-white/40 rounded" />
              <div className="w-0.5 h-2 bg-white/40 rounded" />
              <div className="w-0.5 h-2 bg-white/40 rounded" />
            </div>
          </div>
          <p className="text-xs text-[#6B6B6B] mt-2.5 font-medium">
            Rainfall is below average but not critical.
          </p>
        </div>
      </div>

      <WeatherForecast />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RainfallChart />
        <WeatherAdvisoryFlow />
      </div>

      {/* Farmer Action Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/60 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-amber-200/40">
          <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Today&apos;s Weather Action</h3>
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/80 rounded-xl shrink-0 mt-0.5">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">
              {activeField.name}: {activeField.variety}
            </p>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Check soil moisture within 24 hours. If the top 5&ndash;10cm is dry, irrigate if possible.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/50">
                Urgency: Medium
              </span>
            </div>
          </div>
        </div>
      </div>

      <DataReliabilityVisual />
    </motion.div>
  );
}
