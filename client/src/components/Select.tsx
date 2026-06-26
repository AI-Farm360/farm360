'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  compact?: boolean;
}

export default function Select({ value, onChange, options, placeholder = 'Select...', disabled = false, compact = false }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 bg-[#FAF9F6] text-left border border-[#ECE8E1] rounded-lg text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
          ${open ? 'border-brand-green/40' : 'hover:border-[#6B6B6B]'}
          ${compact ? 'py-1 px-2.5 font-bold' : 'py-2 px-3'}
          ${!value && !compact ? 'text-[#6B6B6B]/60' : 'text-[#171717]'}
        `}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className={`shrink-0 text-[#6B6B6B] transition-transform ${open ? 'rotate-180' : ''} ${compact ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-50 mt-1 bg-white border border-[#ECE8E1] rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#D4D0C8] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
            style={{ transformOrigin: 'top center' }}
          >
            {options.length === 0 && (
              <li className="px-3 py-2 text-[11px] text-[#6B6B6B]">No options</li>
            )}
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`px-3 py-2 text-xs cursor-pointer transition-colors hover:bg-[#FAF9F6]
                  ${option.value === value ? 'bg-brand-light-green/30 text-brand-green font-semibold' : 'text-[#171717]'}
                `}
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
