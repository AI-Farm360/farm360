'use client';

import { motion } from 'motion/react';
import { CloudRain, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';

interface WeatherHeroProps {
  temperature: string;
  rainfall: string;
  humidity: string;
  condition: string;
  drynessRisk: number;
  farmerAction: string;
}

export default function WeatherHero({ temperature, rainfall, humidity, condition, drynessRisk, farmerAction }: WeatherHeroProps) {
  const riskLevel = drynessRisk <= 30 ? 'Low' : drynessRisk <= 60 ? 'Moderate' : 'High';
  const riskColor = riskLevel === 'Low' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : riskLevel === 'Moderate' ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl shadow-xs overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <CloudRain className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#171717]">Weather & Field Risk</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Animated weather icon + condition */}
          <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50/40 to-sky-50/40 rounded-xl border border-blue-100/50">
            <div className="relative w-20 h-20 mb-2">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CloudRain className="w-16 h-16 text-blue-400" />
              </motion.div>
              <motion.div
                animate={{ opacity: [0, 1, 0], y: [0, 8, 16] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3, ease: 'easeIn' }}
                className="absolute bottom-3 left-6 w-1 h-2 bg-blue-400 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0, 1, 0], y: [0, 8, 16] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.6, ease: 'easeIn' }}
                className="absolute bottom-3 left-9 w-1 h-2 bg-blue-400 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0, 1, 0], y: [0, 8, 16] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.9, ease: 'easeIn' }}
                className="absolute bottom-3 left-12 w-1 h-2 bg-blue-400 rounded-full"
              />
            </div>
            <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Current</span>
            <span className="text-sm font-bold text-[#171717] mt-0.5">{condition}</span>
          </div>

          {/* Key metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[#FAF9F6] rounded-xl border border-[#ECE8E1]">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">Temperature</p>
                <p className="text-lg font-bold text-[#171717] font-mono">{temperature}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#FAF9F6] rounded-xl border border-[#ECE8E1]">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">Rainfall</p>
                <p className="text-lg font-bold text-[#171717] font-mono">{rainfall}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#FAF9F6] rounded-xl border border-[#ECE8E1]">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">Humidity</p>
                <p className="text-lg font-bold text-[#171717] font-mono">{humidity}</p>
              </div>
            </div>
          </div>

          {/* Dryness risk + action */}
          <div className="space-y-3">
            <div className="p-4 bg-[#FAF9F6] border border-[#ECE8E1] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">Dryness Risk</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskColor}`}>{riskLevel}</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-[#ECE8E1]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${drynessRisk}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${drynessRisk > 60 ? 'bg-rose-500' : drynessRisk > 30 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                />
              </div>
              <p className="text-right text-[10px] font-mono text-[#6B6B6B] mt-1">{drynessRisk}%</p>
            </div>
            <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Farmer Action</p>
                  <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">{farmerAction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
