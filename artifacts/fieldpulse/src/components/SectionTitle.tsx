'use client';

import { motion } from 'motion/react';

interface SectionTitleProps {
  title: string;
  italicText?: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionTitle({ title, italicText, subtitle, centered = true }: SectionTitleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-2xl ${centered ? 'text-center mx-auto' : 'text-left'} space-y-3 mb-12`}
    >
      <h2 className="font-sans font-bold text-3xl md:text-4xl text-brand-dark-green leading-tight tracking-tight">
        {title}{' '}
        {italicText && (
          <span className="serif-italic text-brand-green">
            {italicText}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="font-sans text-sm md:text-base text-brand-muted font-normal leading-relaxed max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
