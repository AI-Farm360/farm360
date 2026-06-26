import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCheck, Filter } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import NotificationCard from '@/components/NotificationCard';
import type { NotificationType } from '@/data/apiContract';

type FilterKey = 'all' | 'unread' | NotificationType;

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'advisory', label: 'Advisory' },
  { key: 'weather', label: 'Weather' },
  { key: 'satellite', label: 'Satellite' },
  { key: 'feedback', label: 'Feedback' },
];

export default function NotificationsPage() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useDashboard();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'unread') return notifications.filter((n) => n.status === 'unread');
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const highPriorityCount = notifications.filter((n) => n.priority === 'high').length;
  const advisoryCount = notifications.filter((n) => n.type === 'advisory').length;
  const weatherCount = notifications.filter((n) => n.type === 'weather').length;

  const summaryCards = [
    { label: 'Unread', value: unreadCount, color: 'text-brand-green', bg: 'bg-brand-light-green/40', border: 'border-brand-green/20' },
    { label: 'High Priority', value: highPriorityCount, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    { label: 'Advisory Updates', value: advisoryCount, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Weather Risks', value: weatherCount, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-lg text-[#171717]">Notifications</h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">Important field updates and advisory actions.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0 self-start"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map((card) => (
          <div key={card.label} className={`${card.bg} border ${card.border} rounded-xl p-3.5 space-y-1`}>
            <span className={`text-xl font-bold font-mono ${card.color}`}>{card.value}</span>
            <span className="text-[10px] font-semibold text-[#6B6B6B] block">{card.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0" />
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-white text-[#6B6B6B] border-[#ECE8E1] hover:bg-[#FAF9F6] hover:text-[#171717]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-[#ECE8E1] rounded-2xl p-10 text-center space-y-3"
          >
            <Bell className="w-8 h-8 text-[#E8E4DE] mx-auto" />
            <p className="text-sm font-bold text-[#6B6B6B]">No notifications</p>
            <p className="text-xs text-[#6B6B6B]">All caught up! Check back later for field updates.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <NotificationCard key={n.id} notification={n} onMarkRead={markNotificationRead} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
