'use client';

import { Landmark, Github, BookOpen, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-brand-border bg-brand-card py-10 px-6 mt-20">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left side */}
        <div className="flex items-center gap-2.5 text-brand-text">
          <div className="p-1.5 bg-brand-bg border border-brand-border rounded-full text-brand-green">
            <Landmark className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-sans font-bold text-sm tracking-tight block">
              Farm360
            </span>
            <span className="text-[10px] text-brand-muted block mt-0.5">
              AI-powered satellite advisory for smarter potato farming.
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-brand-muted font-medium">
          <a href="#features" className="hover:text-brand-text transition-colors flex items-center gap-1">
            Features
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-brand-text transition-colors flex items-center gap-1.5">
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
          <a href="#" className="hover:text-brand-text transition-colors flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Docs
          </a>
          <a href="#" className="hover:text-brand-text transition-colors flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            Contact
          </a>
        </div>

      </div>

      <div className="max-w-4xl mx-auto pt-8 mt-8 border-t border-brand-bg flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-brand-muted font-mono uppercase tracking-wider">
        <span>© 2026 Farm360 Africa. All Rights Reserved.</span>
        <span>Designed for Kenyan Potato Growers</span>
      </div>
    </footer>
  );
}
