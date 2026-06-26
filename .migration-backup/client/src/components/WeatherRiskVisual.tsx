'use client';

import { motion } from 'motion/react';
import { Thermometer, Droplets, CloudRain, Sun } from 'lucide-react';

interface WeatherMetric {
  label: string;
  value: string;
  icon: typeof Thermometer;
  progress: number;
  status: 'good' | 'warning' | 'severe';
  detail: string;
}

interface WeatherRiskVisualProps {
  temperature: string;
  humidity: string;
  rainfall: string;
  forecast: string;
}

function getStatus(value: number, thresholds: { good: number; warning: number }): 'good' | 'warning' | 'severe' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.warning) return 'warning';
  return 'severe';
}

const barColors = {
  good: { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  warning: { bar: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  severe: { bar: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
};

export default function WeatherRiskVisual({ temperature, humidity, rainfall, forecast }: WeatherRiskVisualProps) {
  const tempNum = parseInt(temperature);
  const humidNum = parseInt(humidity);
  const rainNum = parseInt(rainfall);

  const metrics: WeatherMetric[] = [
    {
      label: 'Temperature',
      value: temperature,
      icon: Thermometer,
      progress: Math.min(tempNum / 40 * 100, 100),
      status: getStatus(tempNum, { good: 22, warning: 28 }),
      detail: tempNum <= 22 ? 'Ideal for potatoes' : tempNum <= 28 ? 'Warm — monitor' : 'Heat stress risk',
    },
    {
      label: 'Rainfall',
      value: rainfall,
      icon: CloudRain,
      progress: Math.min(rainNum / 30 * 100, 100),
      status: getStatus(rainNum, { good: 20, warning: 10 }),
      detail: rainNum >= 20 ? 'Adequate moisture' : rainNum >= 10 ? 'Below average' : 'Dry spell risk',
    },
    {
      label: 'Humidity',
      value: humidity,
      icon: Droplets,
      progress: humidNum,
      status: getStatus(humidNum, { good: 75, warning: 85 }),
      detail: humidNum <= 75 ? 'Optimal range' : humidNum <= 85 ? 'Elevated — blight watch' : 'High blight risk',
    },
    {
      label: 'Dryness Risk',
      value: `${Math.max(0, 100 - rainNum * 5)}%`,
      icon: Sun,
      progress: Math.max(0, 100 - rainNum * 5),
      status: getStatus(rainNum, { good: 20, warning: 10 }),
      detail: forecast,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-4"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-[#ECE8E1]">
        <CloudRain className="w-4 h-4 text-brand-green" />
        <div>
          <h3 className="text-xs font-bold text-[#171717]">Weather &amp; Risk Summary</h3>
          <p className="text-[10px] text-[#6B6B6B]">Current field conditions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const colors = barColors[metric.status];
          return (
            <div key={metric.label} className={`${colors.bg} border ${colors.border} rounded-xl p-3.5 space-y-2`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                  <span className="text-[11px] font-bold text-[#171717]">{metric.label}</span>
                </div>
                <span className={`text-sm font-bold font-mono ${colors.text}`}>{metric.value}</span>
              </div>
              <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${colors.bar}`}
                />
              </div>
              <span className={`text-[9px] font-semibold ${colors.text}`}>{metric.detail}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
