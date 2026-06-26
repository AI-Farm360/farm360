import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Navbar() {
  const [pathname, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', isAnchor: false },
    { name: 'Dashboard', path: '/dashboard?demo=true', isAnchor: false },
    { name: 'Register field', path: '/register', isAnchor: false },
    { name: 'Feedback', path: '/feedback', isAnchor: false },
  ];

  const handleLinkClick = (link: { name: string; path: string; isAnchor: boolean }) => {
    setIsOpen(false);
    navigate(link.path);
  };

  return (
    <div className="w-full flex justify-center sticky top-0 z-50 px-0">
      <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-brand-border py-3 px-6 md:px-10 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="nav-logo"
        >
          <div className="w-8 h-8 bg-brand-dark-green rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <span className="font-sans font-bold text-base tracking-tight text-brand-dark-green">
            Farm360 <span className="text-brand-green">FieldPulse</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link)}
              className={`text-sm font-medium px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                pathname === link.path || (link.path === '/dashboard?demo=true' && pathname.startsWith('/dashboard'))
                  ? 'bg-brand-light-green text-brand-dark-green font-semibold'
                  : 'text-brand-muted hover:text-brand-dark-green hover:bg-gray-50'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center">
          <button
            onClick={() => navigate('/register')}
            className="text-sm bg-brand-dark-green text-white hover:bg-brand-green px-5 py-2 rounded-full font-semibold transition-all duration-200 cursor-pointer active:scale-95"
            id="nav-cta"
          >
            Get started
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
            className="absolute top-14 left-4 right-4 bg-white border border-brand-border rounded-3xl p-6 shadow-xl flex flex-col gap-4 z-40 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link)}
                  className={`text-left text-sm py-2.5 px-3 font-medium rounded-xl transition-colors ${
                    pathname === link.path ? 'text-brand-green bg-brand-light-green' : 'text-brand-muted hover:text-brand-dark-green hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setIsOpen(false); navigate('/register'); }}
              className="w-full text-center py-3 bg-brand-dark-green text-white hover:bg-brand-green rounded-2xl font-semibold text-sm transition-all duration-200"
            >
              Get started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
