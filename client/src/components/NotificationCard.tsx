'use client';

import { motion } from 'motion/react';
import { AlertTriangle, CloudSun, Compass, MessageSquare, Bell, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import type { NotificationResponse } from '@/src/data/apiContract';

const typeConfig = {
  advisory: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-600' },
  weather: { icon: CloudSun, bg: 'bg-sky-50', border: 'border-sky-200', iconColor: 'text-sky-600' },
  satellite: { icon: Compass, bg: 'bg-emerald-50', border: 'border-emerald-200', iconColor: 'text-emerald-600' },
  feedback: { icon: MessageSquare, bg: 'bg-indigo-50', border: 'border-indigo-200', iconColor: 'text-indigo-600' },
  system: { icon: Bell, bg: 'bg-[#FAF9F6]', border: 'border-[#ECE8E1]', iconColor: 'text-[#6B6B6B]' },
};

const priorityBadge = {
  low: { label: 'Low', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  medium: { label: 'Medium', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  high: { label: 'High', class: 'bg-rose-50 text-rose-700 border-rose-200' },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface NotificationCardProps {
  notification: NotificationResponse;
  onMarkRead: (id: string) => void;
}

export default function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  const type = typeConfig[notification.type];
  const priority = priorityBadge[notification.priority];
  const Icon = type.icon;
  const isUnread = notification.status === 'unread';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={`bg-white border rounded-2xl overflow-hidden shadow-xs transition-all ${
        isUnread ? 'border-brand-green/30 ring-1 ring-brand-green/10' : 'border-[#ECE8E1]'
      }`}
    >
      <div className="flex items-stretch">
        <div className={`w-1.5 shrink-0 ${isUnread ? 'bg-brand-green' : 'bg-transparent'}`} />
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2 rounded-xl ${type.bg} ${type.border} shrink-0`}>
                <Icon className={`w-4 h-4 ${type.iconColor}`} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#171717]">{notification.title}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${priority.class}`}>
                    {priority.label}
                  </span>
                  {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />}
                </div>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">{notification.message}</p>
              </div>
            </div>
            <span className="text-[9px] text-[#6B6B6B] shrink-0 font-mono mt-1">{timeAgo(notification.createdAt)}</span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#ECE8E1]">
            <span className="text-[10px] text-[#6B6B6B] flex items-center gap-1">
              <Compass className="w-3 h-3" />
              {notification.fieldName}
            </span>
            <div className="flex items-center gap-2">
              {isUnread && (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="text-[10px] font-semibold text-brand-green bg-brand-light-green/40 hover:bg-brand-light-green px-2.5 py-1 rounded-lg border border-brand-green/20 transition-all cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Mark Read
                </button>
              )}
              <Link
                href={notification.actionHref}
                onClick={() => { if (isUnread) onMarkRead(notification.id); }}
                className="text-[10px] font-semibold text-[#171717] bg-[#FAF9F6] hover:bg-[#ECE8E1] px-2.5 py-1 rounded-lg border border-[#ECE8E1] transition-all flex items-center gap-1"
              >
                {notification.actionLabel}
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
