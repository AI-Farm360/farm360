'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Satellite, Sparkles, CheckCircle2, FileText,
  RefreshCw, Plus, Menu, X, MapPin, MessageSquare,
  LayoutDashboard, Tractor, Compass, Settings, Bell,
} from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/src/contexts/DashboardContext';
import RegistrationForm from '@/src/components/RegistrationForm';
import NotificationBell from '@/src/components/NotificationBell';
import Select from '@/src/components/Select';
import type { ReactNode } from 'react';

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Fields', icon: Tractor, href: '/dashboard/fields' },
  { name: 'Advisories', icon: FileText, href: '/dashboard/advisories' },
  { name: 'Satellite Data', icon: Compass, href: '/dashboard/satellite-data' },
  { name: 'Weather', icon: MapPin, href: '/dashboard/weather' },
  { name: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
  { name: 'Feedback', icon: MessageSquare, href: '/dashboard/feedback' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

function Sidebar({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  const router = useRouter();
  const { farmerProfile, isMobileSidebarOpen, setIsMobileSidebarOpen, unreadCount } = useDashboard();

  const content = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        <button onClick={() => { setIsMobileSidebarOpen(false); router.push('/'); }} className="flex items-center gap-2.5 pb-2 cursor-pointer w-full text-left">
          <div className="p-1.5 bg-[#171717] text-white rounded-lg">
            <Satellite className="w-4 h-4" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-[#171717]">FieldPulse</span>
        </button>
        <div className="space-y-4">
          <span className="text-[9px] uppercase font-bold tracking-widest text-[#6B6B6B] block">FARM WORKSPACE</span>
          <nav className="space-y-1">
              {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              const isNotif = item.name === 'Notifications';
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onNav}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive ? 'bg-brand-light-green text-[#171717]' : 'text-[#6B6B6B] hover:bg-[#ECE8E1]/40 hover:text-[#171717]'}`}
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {isNotif && unreadCount > 0 && (
                    <span className="min-w-[18px] h-[18px] px-[5px] bg-red-500 text-white text-[10px] font-bold border-2 border-white rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.12)]">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="space-y-4 pt-4 border-t border-[#ECE8E1]">
        <div className="bg-white border border-[#ECE8E1] rounded-xl p-3.5 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#6B6B6B]">
            <span className="uppercase tracking-wider">Satellite checks</span>
            <span className="text-[#171717]">7 / 15</span>
          </div>
          <div className="w-full bg-[#FAF9F6] rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-green h-1.5 rounded-full" style={{ width: '46.6%' }}></div>
          </div>
          <p className="text-[9px] text-[#6B6B6B]">Auto-renews Jul 1st</p>
        </div>
        <div className="flex items-center gap-2.5 p-1">
          <div className="w-8 h-8 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-[11px]">
            {farmerProfile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-bold text-[#171717] leading-tight">{farmerProfile.name}</p>
            <p className="text-[10px] text-[#6B6B6B] mt-0.5">{farmerProfile.county} farmer</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-[260px] bg-[#FAF9F6] border-r border-[#ECE8E1] h-screen sticky top-0 shrink-0 select-none z-20 p-5">
        {content}
      </aside>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative bg-[#FAF9F6] border-r border-[#ECE8E1] w-[260px] h-full p-5 z-10"
            >
              <div className="flex items-center justify-between pb-2 mb-6 border-b border-[#ECE8E1]">
                <span className="font-serif text-lg font-bold tracking-tight text-[#171717]">FieldPulse</span>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1 text-[#6B6B6B]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    selectedFieldId, setSelectedFieldId, fields, activeField, farmerProfile,
    lastAnalyzed, isSyncing, showSyncSuccess, syncSuccessMsg, showWhatsNew, setShowWhatsNew,
    showAddField, setShowAddField, isMobileSidebarOpen, setIsMobileSidebarOpen,
    handleSync, setFields, showSuccessToast,
  } = useDashboard();

  const pageTitle = pathname === '/dashboard'
    ? `Good morning, ${farmerProfile.name.split(' ')[0]}.`
    : sidebarItems.find(i => i.href === pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#171717] flex flex-col md:flex-row relative">
      <AnimatePresence>
        {showSyncSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-brand-text text-brand-bg px-6 py-3.5 rounded-xl text-xs font-sans font-bold flex items-center gap-2.5 shadow-lg border border-brand-border"
          >
            <CheckCircle2 className="w-4 h-4 text-brand-green" />
            <span>{syncSuccessMsg || "Satellite telemetry synchronized successfully!"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWhatsNew && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#ECE8E1] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-[#ECE8E1]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-green" />
                  <h3 className="font-sans font-bold text-sm">What&apos;s New in FieldPulse v2.1</h3>
                </div>
                <button onClick={() => setShowWhatsNew(false)} className="p-1 hover:bg-[#FAF9F6] rounded-full text-[#6B6B6B]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-brand-light-green text-brand-green text-[10px] font-bold px-2 py-0.5 rounded-full">v2.1.0</span>
                    <span className="font-semibold text-[#171717]">SaaS Enterprise Shell</span>
                  </div>
                  <p className="text-[#6B6B6B] leading-relaxed">Implemented high-fidelity dashboard layouts with multi-page routing.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF9F6] text-[#6B6B6B] text-[10px] font-bold px-2 py-0.5 rounded-full">v2.0.4</span>
                    <span className="font-semibold text-[#171717]">Shangi Variety Calibration</span>
                  </div>
                  <p className="text-[#6B6B6B] leading-relaxed">Fine-tuned plant transpiration curves.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF9F6] text-[#6B6B6B] text-[10px] font-bold px-2 py-0.5 rounded-full">v2.0.1</span>
                    <span className="font-semibold text-[#171717]">Dual-band Spectral Analysis</span>
                  </div>
                  <p className="text-[#6B6B6B] leading-relaxed">Automated NDVI vegetation vigor indices checking.</p>
                </div>
              </div>
              <button onClick={() => setShowWhatsNew(false)} className="w-full bg-[#171717] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#2A2A2A] transition-colors">Got it, thank you</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddField && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF9F6] border border-[#ECE8E1] rounded-3xl max-w-lg w-full shadow-xl overflow-hidden"
            >
              <div className="max-h-[85vh] overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#D4D0C8] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              <div className="flex justify-between items-center pb-3 border-b border-[#ECE8E1]">
                <div className="flex items-center gap-2">
                  <Tractor className="w-4 h-4 text-brand-green" />
                  <h3 className="font-sans font-bold text-sm">Register a New Potato Field</h3>
                </div>
                <button onClick={() => setShowAddField(false)} className="p-1 hover:bg-[#FAF9F6] rounded-full text-[#6B6B6B]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#ECE8E1]">
                <RegistrationForm onSubmitSuccess={() => {
                  const stored = localStorage.getItem('fieldpulse_registration');
                  if (stored) {
                    try {
                      const parsed = JSON.parse(stored);
                      const newFieldId = `field-custom-${Date.now()}`;
                      setFields((prev) => [{
                        id: newFieldId, name: `${parsed.county} ${parsed.variety} Block`,
                        county: parsed.county, subCounty: parsed.subCounty, ward: parsed.ward,
                        variety: parsed.variety, plantingDate: parsed.plantingDate || "2026-06-15",
                        farmSize: Number(parsed.farmSize) || 2.5, status: "Healthy", riskScore: 18, confidence: 94, rainfall: 10
                      }, ...prev]);
                      setSelectedFieldId(newFieldId);
                    } catch (e) { console.error(e); }
                  }
                  setShowAddField(false);
                  showSuccessToast("New field added successfully!");
                }} />
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Sidebar pathname={pathname} onNav={() => setIsMobileSidebarOpen(false)} />

      <div className="md:hidden flex items-center justify-between px-5 py-3 bg-[#FAF9F6] border-b border-[#ECE8E1] sticky top-0 z-30 w-full select-none">
        <button onClick={() => setIsMobileSidebarOpen(true)} className="p-1.5 border border-[#ECE8E1] bg-white rounded-lg text-[#171717]">
          <Menu className="w-4 h-4" />
        </button>
        <button onClick={() => router.push('/')} className="flex items-center gap-2 cursor-pointer">
          <div className="p-1 bg-[#171717] text-white rounded-md">
            <Satellite className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif text-sm font-bold tracking-tight text-[#171717]">FieldPulse</span>
        </button>
        <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-[10px]">
          {farmerProfile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
      </div>

      <div className="flex-1 bg-white min-h-screen flex flex-col">
        <header className="px-6 pt-6 pb-5 border-b border-[#ECE8E1] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 select-none sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#6B6B6B]">
              <Select
                value={selectedFieldId}
                onChange={(v) => setSelectedFieldId(v)}
                options={fields.map((f) => ({ value: f.id, label: `${f.name} (${f.county})` }))}
                compact
              />
              <span className="hidden sm:inline">·</span>
              <span className="font-mono text-[11px] w-full sm:w-auto">last analyzed {lastAnalyzed}</span>
            </div>
            <h1 className="font-sans font-bold text-xl md:text-2xl text-[#171717] tracking-tight">{pageTitle}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto overflow-x-auto shrink-0 pb-1 lg:pb-0">
            <NotificationBell />
            <button disabled={isSyncing} onClick={handleSync}
              className="bg-white hover:bg-[#FAF9F6] text-[#171717] border border-[#ECE8E1] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed shrink-0">
              <RefreshCw className={`w-3.5 h-3.5 text-[#6B6B6B] ${isSyncing ? 'animate-spin text-brand-green' : ''}`} />
              <span>{isSyncing ? "Syncing..." : "Sync Satellite Data"}</span>
            </button>
            <button onClick={() => setShowAddField(true)}
              className="bg-[#171717] hover:bg-[#2A2A2A] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0">
              <Plus className="w-4 h-4" />
              <span>Add Field</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
