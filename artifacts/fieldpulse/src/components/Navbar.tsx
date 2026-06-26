import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Landmark, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Navbar() {
  const [pathname, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Features', path: '#features', isAnchor: true },
    { name: 'How It Works', path: '#how-it-works', isAnchor: true },
    { name: 'Feedback', path: '/feedback', isAnchor: false },
  ];

  const handleLinkClick = (link: { name: string; path: string; isAnchor: boolean }) => {
    setIsOpen(false);
    if (link.isAnchor) {
      if (pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(link.path.substring(1));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(link.path.substring(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(link.path);
    }
  };

  return (
    <div className="w-full flex justify-center sticky top-4 z-50 px-4 md:px-0">
      <nav className="w-full max-w-4xl bg-brand-card/60 backdrop-blur-xl border border-brand-border/80 rounded-full py-2.5 px-4 md:px-6 flex items-center justify-between shadow-[0_8px_30px_rgb(23,23,23,0.04)]">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer group transition-all"
          id="nav-logo"
        >
          <div className="p-1.5 bg-brand-green/10 text-brand-green rounded-full group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
            <Landmark className="w-4 h-4" />
          </div>
          <span className="font-sans font-bold text-base tracking-tight text-brand-text">
            Farm360
          </span>
        </button>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link)}
              className={`text-xs font-medium cursor-pointer transition-colors duration-200 ${
                pathname === link.path
                  ? 'text-brand-green font-semibold'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/register')}
            className="text-xs bg-brand-text text-brand-bg hover:bg-brand-muted px-4 py-2 rounded-full font-medium tracking-tight transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-none flex items-center gap-1 cursor-pointer active:scale-95"
            id="nav-cta"
          >
            Register Farm
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-brand-text hover:text-brand-muted transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="absolute top-18 left-4 right-4 bg-brand-card border border-brand-border rounded-3xl p-6 shadow-xl flex flex-col gap-4 z-40 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link)}
                  className={`text-left text-sm py-2 px-1 font-medium border-b border-brand-bg transition-colors ${
                    pathname === link.path ? 'text-brand-green' : 'text-brand-muted'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/register');
              }}
              className="w-full text-center py-3 bg-brand-text text-brand-bg hover:bg-brand-muted rounded-2xl font-medium text-xs tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              Register Farm
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
