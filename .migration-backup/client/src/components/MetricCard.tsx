'use client';

import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: keyof typeof Icons;
  statusType?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export default function MetricCard({
  label,
  value,
  description,
  icon,
  statusType = 'default',
  className = ''
}: MetricCardProps) {
  const IconComponent = icon ? Icons[icon] as React.ComponentType<{ className?: string }> : null;

  const getStatusColor = () => {
    switch (statusType) {
      case 'success':
        return 'border-l-4 border-brand-green bg-brand-light-green/20';
      case 'warning':
        return 'border-l-4 border-amber-500 bg-amber-500/5';
      case 'danger':
        return 'border-l-4 border-brand-danger bg-brand-danger/5';
      case 'info':
        return 'border-l-4 border-indigo-500 bg-indigo-500/5';
      default:
        return 'border-slate-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`bg-brand-card border border-brand-border rounded-xl p-5 shadow-[0_4px_16px_rgba(23,23,23,0.01)] flex flex-col justify-between ${getStatusColor()} ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-brand-muted tracking-wider uppercase">
          {label}
        </span>
        {IconComponent && (
          <div className="p-1.5 rounded-lg bg-brand-bg text-brand-muted">
            <IconComponent className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5">
        <div className="font-serif text-2xl md:text-3xl font-bold text-brand-text tracking-tight">
          {value}
        </div>
        {description && (
          <p className="text-[11px] text-brand-muted mt-1 leading-normal font-medium">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
