'use client';

import { motion } from 'motion/react';

const stepVisuals: Record<string, React.ReactNode> = {
  '01': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
      <rect x="4" y="8" width="40" height="32" rx="4" stroke="rgba(34,163,79,0.3)" strokeWidth="1.5" fill="rgba(34,163,79,0.04)" />
      <motion.circle cx="24" cy="24" r="6" fill="rgba(34,163,79,0.2)" stroke="rgba(34,163,79,0.4)" strokeWidth="1.5" />
      <motion.circle cx="24" cy="24" r="2.5" fill="rgba(34,163,79,0.5)" />
      <rect x="14" y="32" width="20" height="2" rx="1" fill="rgba(34,163,79,0.15)" />
    </svg>
  ),
  '02': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
      <rect x="2" y="2" width="44" height="44" rx="4" stroke="rgba(34,163,79,0.3)" strokeWidth="1" fill="rgba(34,163,79,0.04)" />
      <motion.rect x="8" y="8" width="8" height="8" rx="1" fill="rgba(34,163,79,0.3)" />
      <rect x="20" y="8" width="8" height="8" rx="1" fill="rgba(250,204,21,0.2)" />
      <rect x="32" y="8" width="8" height="8" rx="1" fill="rgba(34,163,79,0.3)" />
      <rect x="8" y="20" width="8" height="8" rx="1" fill="rgba(250,204,21,0.2)" />
      <rect x="20" y="20" width="8" height="8" rx="1" fill="rgba(239,68,68,0.15)" />
      <rect x="32" y="20" width="8" height="8" rx="1" fill="rgba(34,163,79,0.3)" />
      <rect x="8" y="32" width="8" height="8" rx="1" fill="rgba(34,163,79,0.3)" />
      <rect x="20" y="32" width="8" height="8" rx="1" fill="rgba(34,163,79,0.3)" />
      <rect x="32" y="32" width="8" height="8" rx="1" fill="rgba(250,204,21,0.2)" />
      <motion.line x1="0" y1="24" x2="48" y2="24" stroke="rgba(34,163,79,0.06)" strokeWidth="1" strokeDasharray="2,2"
        animate={{ x: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
    </svg>
  ),
  '03': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
      <rect x="2" y="2" width="44" height="44" rx="4" stroke="rgba(34,163,79,0.3)" strokeWidth="1" fill="rgba(34,163,79,0.04)" />
      <motion.rect x="6" y="8" width="36" height="5" rx="2.5" fill="rgba(34,163,79,0.08)" />
      <motion.rect x="6" y="8" width="60%" height="5" rx="2.5" fill="rgba(34,163,79,0.5)"
        animate={{ width: ['60%', '75%', '60%'] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.rect x="6" y="18" width="36" height="5" rx="2.5" fill="rgba(34,163,79,0.08)" />
      <motion.rect x="6" y="18" width="35%" height="5" rx="2.5" fill="rgba(250,204,21,0.5)"
        animate={{ width: ['35%', '50%', '35%'] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <motion.rect x="6" y="28" width="36" height="5" rx="2.5" fill="rgba(34,163,79,0.08)" />
      <motion.rect x="6" y="28" width="80%" height="5" rx="2.5" fill="rgba(34,163,79,0.5)"
        animate={{ width: ['80%', '65%', '80%'] }} transition={{ duration: 1.8, repeat: Infinity }} />
    </svg>
  ),
  '04': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
      <rect x="2" y="2" width="44" height="44" rx="4" stroke="rgba(34,163,79,0.3)" strokeWidth="1" fill="rgba(34,163,79,0.04)" />
      <rect x="8" y="8" width="32" height="32" rx="3" fill="rgba(250,204,21,0.06)" stroke="rgba(250,204,21,0.2)" strokeWidth="0.5" />
      <motion.rect x="12" y="14" width="24" height="3" rx="1.5" fill="rgba(250,204,21,0.3)" />
      <rect x="12" y="21" width="18" height="2" rx="1" fill="rgba(34,163,79,0.2)" />
      <rect x="12" y="27" width="14" height="2" rx="1" fill="rgba(34,163,79,0.2)" />
      <motion.circle cx="36" cy="36" r="4" fill="rgba(34,163,79,0.15)" stroke="rgba(34,163,79,0.3)" strokeWidth="1" />
      <motion.path d="M34 36l1.5 1.5 3-3" stroke="rgba(34,163,79,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
    </svg>
  ),
};

interface TimelineCardProps {
  stepNumber: string;
  title: string;
  description: string;
  index: number;
}

export default function TimelineCard({ stepNumber, title, description, index }: TimelineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start justify-between shadow-[0_4px_12px_rgba(23,23,23,0.01)]"
    >
      <div className="flex items-center gap-4 shrink-0">
        {/* Step visual icon */}
        <div className="hidden md:block">
          {stepVisuals[stepNumber]}
        </div>
        {/* Large Index Number */}
        <span className="font-serif text-4xl md:text-5xl font-light text-brand-muted/40 tracking-tight leading-none">
          {stepNumber}
        </span>
      </div>

      <div className="space-y-2 flex-1">
        <h4 className="font-sans font-bold text-base text-brand-text tracking-tight">
          {title}
        </h4>
        <p className="font-sans text-xs md:text-sm text-brand-muted leading-relaxed max-w-xl">
          {description}
        </p>
      </div>

      {/* Decorative pulse point */}
      <div className="hidden md:flex self-center w-2.5 h-2.5 rounded-full bg-brand-green/20 border border-brand-green/40 relative">
        <span className="absolute inset-0 rounded-full bg-brand-green/40 animate-ping opacity-75"></span>
      </div>
    </motion.div>
  );
}
