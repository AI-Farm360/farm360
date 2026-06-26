'use client';

import { motion } from 'motion/react';
import { Bot, Sparkles, CheckCircle, Percent, AlertCircle } from 'lucide-react';

interface AdvisoryCardProps {
  title: string;
  recommendation: string;
  confidence: number;
  severity?: string;
  className?: string;
}

export default function AdvisoryCard({
  title,
  recommendation,
  confidence,
  severity = 'Medium',
  className = ''
}: AdvisoryCardProps) {
  const getSeverityBadge = () => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-brand-danger/10 text-brand-danger border border-brand-danger/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      default:
        return 'bg-brand-green/10 text-brand-green border border-brand-green/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8 shadow-[0_10px_30px_rgba(23,23,23,0.02)] relative overflow-hidden ${className}`}
    >
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light-green/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-text text-brand-bg rounded-xl">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-brand-muted font-bold block">
              AI-Powered Advisory
            </span>
            <h4 className="font-sans font-bold text-base text-brand-text mt-0.5">
              {title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getSeverityBadge()}`}>
            {severity} Risk
          </span>
          <span className="text-xs bg-brand-bg text-brand-text border border-brand-border px-2.5 py-1 rounded-full font-mono font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-green" />
            {confidence}% Conf.
          </span>
        </div>
      </div>

      {/* Advisory Content */}
      <div className="py-6">
        <label className="text-[10px] uppercase font-bold tracking-widest text-brand-muted block mb-2">
          Recommended Advisory Action
        </label>
        <p className="font-serif text-lg md:text-xl text-brand-text leading-relaxed font-light">
          “{recommendation}”
        </p>
      </div>

      {/* Swahili Translation Accordion or Help Line */}
      <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-brand-muted">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle className="w-4 h-4 text-brand-green" />
          Advisory delivered to your dashboard
        </span>
        
        <span className="font-serif italic text-brand-muted/80">
          Ushauri wa Kilimo cha Kidijitali
        </span>
      </div>
    </motion.div>
  );
}
