'use client';

import { motion } from 'motion/react';
import * as Lucide from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: 'Satellite' | 'Brain' | 'Bell';
  index: number;
}

const miniVisuals: Record<string, React.ReactNode> = {
  Satellite: (
    <svg className="w-full h-12 mb-3" viewBox="0 0 120 40">
      <rect x="10" y="8" width="20" height="20" rx="2" fill="rgba(34,163,79,0.15)" stroke="rgba(34,163,79,0.3)" strokeWidth="0.5" />
      <rect x="34" y="8" width="20" height="20" rx="2" fill="rgba(34,163,79,0.3)" stroke="rgba(34,163,79,0.3)" strokeWidth="0.5" />
      <rect x="58" y="8" width="20" height="20" rx="2" fill="rgba(250,204,21,0.2)" stroke="rgba(250,204,21,0.3)" strokeWidth="0.5" />
      <rect x="82" y="8" width="20" height="20" rx="2" fill="rgba(34,163,79,0.15)" stroke="rgba(34,163,79,0.3)" strokeWidth="0.5" />
      <rect x="10" y="32" width="20" height="8" rx="1" fill="rgba(34,163,79,0.2)" />
      <rect x="34" y="32" width="20" height="8" rx="1" fill="rgba(34,163,79,0.4)" />
      <rect x="58" y="32" width="20" height="8" rx="1" fill="rgba(250,204,21,0.3)" />
      <rect x="82" y="32" width="20" height="8" rx="1" fill="rgba(34,163,79,0.2)" />
      <motion.line x1="0" y1="20" x2="120" y2="20" stroke="rgba(34,163,79,0.1)" strokeWidth="1" strokeDasharray="3,3"
        animate={{ x: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
    </svg>
  ),
  Brain: (
    <svg className="w-full h-12 mb-3" viewBox="0 0 120 40">
      <motion.rect x="10" y="5" width="100" height="6" rx="3" fill="rgba(34,163,79,0.1)" />
      <motion.rect x="10" y="5" width="70" height="6" rx="3" fill="rgba(34,163,79,0.5)"
        animate={{ width: [70, 85, 70] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.rect x="10" y="17" width="100" height="6" rx="3" fill="rgba(34,163,79,0.1)" />
      <motion.rect x="10" y="17" width="45" height="6" rx="3" fill="rgba(250,204,21,0.5)"
        animate={{ width: [45, 60, 45] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <motion.rect x="10" y="29" width="100" height="6" rx="3" fill="rgba(34,163,79,0.1)" />
      <motion.rect x="10" y="29" width="90" height="6" rx="3" fill="rgba(34,163,79,0.5)"
        animate={{ width: [90, 75, 90] }} transition={{ duration: 1.8, repeat: Infinity }} />
    </svg>
  ),
  Bell: (
    <svg className="w-full h-12 mb-3" viewBox="0 0 120 40">
      {/* Phone message preview */}
      <rect x="5" y="4" width="110" height="32" rx="6" fill="rgba(34,163,79,0.04)" stroke="rgba(34,163,79,0.1)" strokeWidth="0.5" />
      <rect x="14" y="10" width="18" height="4" rx="2" fill="rgba(34,163,79,0.3)" />
      <rect x="14" y="18" width="60" height="3" rx="1.5" fill="rgba(34,163,79,0.15)" />
      <rect x="14" y="24" width="45" height="3" rx="1.5" fill="rgba(34,163,79,0.15)" />
      <motion.circle cx="100" cy="12" r="3" fill="rgba(239,68,68,0.5)"
        animate={{ r: [3, 4, 3] }} transition={{ duration: 2, repeat: Infinity }} />
    </svg>
  ),
};

export default function FeatureCard({ title, description, iconName, index }: FeatureCardProps) {
  const IconComponent = iconName === 'Satellite' ? Lucide.Satellite
                      : iconName === 'Brain' ? Lucide.Brain
                      : Lucide.Bell;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(23,23,23,0.01)] hover:shadow-[0_12px_30px_rgba(23,23,23,0.03)] transition-all duration-300 flex flex-col justify-between group"
    >
      <div className="space-y-4">
        {/* Mini visual */}
        {miniVisuals[iconName]}
        {/* Icon wrapper */}
        <div className="w-12 h-12 bg-brand-bg border border-brand-border rounded-xl flex items-center justify-center text-brand-muted group-hover:text-brand-green group-hover:bg-brand-light-green/40 transition-colors duration-300">
          <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        </div>
        
        {/* Texts */}
        <div className="space-y-2">
          <h3 className="font-sans font-semibold text-lg text-brand-text tracking-tight">
            {title}
          </h3>
          <p className="font-sans text-xs md:text-sm text-brand-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-brand-muted group-hover:text-brand-green transition-colors duration-300">
        <span>Learn more</span>
        <Lucide.ArrowUpRight className="w-3.5 h-3.5" />
      </div>
    </motion.div>
  );
}
