'use client';

import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

export interface AlertCardProps {
  key?: any;
  id: number;
  level: string;
  title: string;
  date: string;
}

export default function AlertCard({ id, level, title, date }: AlertCardProps) {
  const getAlertStyle = () => {
    switch (level.toLowerCase()) {
      case 'high':
        return {
          icon: AlertCircle,
          colors: 'border-brand-danger/20 bg-brand-danger/5 text-brand-danger',
          badge: 'bg-brand-danger/10 text-brand-danger border-brand-danger/20',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          colors: 'border-amber-500/20 bg-amber-500/5 text-amber-700',
          badge: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        };
      default:
        return {
          icon: CheckCircle,
          colors: 'border-brand-green/20 bg-brand-light-green/20 text-brand-green',
          badge: 'bg-brand-green/10 text-brand-green border-brand-green/20',
        };
    }
  };

  const style = getAlertStyle();
  const IconComponent = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-xl p-4 flex items-center justify-between gap-4 transition-all hover:bg-white hover:shadow-sm ${style.colors}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/80 rounded-lg shadow-xs shrink-0">
          <IconComponent className="w-4 h-4" />
        </div>
        <div>
          <h5 className="font-sans font-bold text-xs text-brand-text">
            {title}
          </h5>
          <div className="flex items-center gap-1.5 text-[10px] text-brand-muted mt-0.5">
            <Calendar className="w-3 h-3 text-brand-muted/70" />
            <span>{date}</span>
          </div>
        </div>
      </div>

      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
        {level}
      </span>
    </motion.div>
  );
}
