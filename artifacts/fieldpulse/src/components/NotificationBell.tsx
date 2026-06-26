import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'wouter';
import { useDashboard } from '@/contexts/DashboardContext';

export default function NotificationBell() {
  const [, navigate] = useLocation();
  const { unreadCount } = useDashboard();

  const display = unreadCount > 9 ? '9+' : unreadCount;

  return (
    <button
      onClick={() => navigate('/dashboard/notifications')}
      className="relative overflow-visible bg-white hover:bg-[#FAF9F6] border border-brand-border p-2 rounded-xl transition-all cursor-pointer shadow-xs"
      aria-label="Notifications"
    >
      <Bell className="w-4 h-4 text-brand-text" />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            key={display}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="absolute -top-0.5 -right-1.5 z-20 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold border-2 border-white rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
          >
            {display}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
