import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import * as mock from '@/data/mockData';
import type { NotificationResponse, NotificationStatus } from '@/data/apiContract';

export interface FieldSummary {
  id: string;
  name: string;
  county: string;
  subCounty: string;
  ward: string;
  variety: string;
  plantingDate: string;
  farmSize: number;
  status: string;
  riskScore: number;
  confidence: number;
  rainfall: number;
}

interface DashboardContextValue {
  farmerProfile: typeof mock.farmer;
  setFarmerProfile: (p: typeof mock.farmer) => void;
  fields: FieldSummary[];
  setFields: (f: FieldSummary[] | ((prev: FieldSummary[]) => FieldSummary[])) => void;
  selectedFieldId: string;
  setSelectedFieldId: (id: string) => void;
  activeField: FieldSummary;
  lastAnalyzed: string;
  setLastAnalyzed: (d: string) => void;
  isSyncing: boolean;
  isAnalyzing: boolean;
  showSyncSuccess: boolean;
  syncSuccessMsg: string;
  showWhatsNew: boolean;
  setShowWhatsNew: (v: boolean) => void;
  showAddField: boolean;
  setShowAddField: (v: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (v: boolean) => void;
  handleSync: () => void;
  handleAnalyze: () => void;
  showSuccessToast: (msg: string) => void;
  notifications: NotificationResponse[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const [farmerProfile, setFarmerProfile] = useState<typeof mock.farmer>(mock.farmer);
  const [fields, setFields] = useState<FieldSummary[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('field-001');
  const [lastAnalyzed, setLastAnalyzed] = useState<string>('Jun 25, 2026');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState<boolean>(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string>('');
  const [showWhatsNew, setShowWhatsNew] = useState<boolean>(false);
  const [showAddField, setShowAddField] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('fieldpulse_notifications');
    if (stored) {
      try { setNotifications(JSON.parse(stored)); } catch { setNotifications(mock.notifications); }
    } else {
      setNotifications(mock.notifications);
      localStorage.setItem('fieldpulse_notifications', JSON.stringify(mock.notifications));
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('fieldpulse_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'read' as NotificationStatus } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' as NotificationStatus })));
  }, []);

  const defaultFields: FieldSummary[] = [
    { id: "field-001", name: "Nyandarua Shangi Field", county: "Nyandarua", subCounty: "Ol Kalou", ward: "Kaimbaga", variety: "Shangi", plantingDate: "2026-05-12", farmSize: 3.5, status: "Healthy", riskScore: 24, confidence: 91, rainfall: 12 },
    { id: "field-002", name: "Meru Potato Block B", county: "Meru", subCounty: "Buuri", ward: "Ruiri/Rwarera", variety: "Dutch Robyjn", plantingDate: "2026-04-10", farmSize: 2.2, status: "Healthy", riskScore: 15, confidence: 88, rainfall: 8 }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demo = params.get('demo') === 'true';
    const registration = localStorage.getItem('fieldpulse_registration');
    if (!demo && !registration) {
      navigate('/register');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [navigate]);

  useEffect(() => {
    const storedData = localStorage.getItem('fieldpulse_registration');
    const fieldsList = [...defaultFields];
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const farmerFieldId = "farmer-001";
        const exists = fieldsList.some(f => f.id === farmerFieldId);
        if (!exists) {
          fieldsList.unshift({
            id: farmerFieldId, name: `${parsed.county} ${parsed.variety} Field`,
            county: parsed.county, subCounty: parsed.subCounty, ward: parsed.ward,
            variety: parsed.variety, plantingDate: parsed.plantingDate || "2026-05-12",
            farmSize: Number(parsed.farmSize) || 3.5, status: "Healthy", riskScore: 24, confidence: 91, rainfall: 12
          });
        }
      } catch (e) { console.error(e); }
    }
    setFields(fieldsList);
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('fieldpulse_registration');
    if (storedData) {
      try { setFarmerProfile(JSON.parse(storedData)); } catch (e) { console.error(e); }
    }
  }, []);

  const activeField = fields.find(f => f.id === selectedFieldId) || fields[0] || defaultFields[0];

  const showSuccessToast = useCallback((msg: string) => {
    setSyncSuccessMsg(msg);
    setShowSyncSuccess(true);
    setTimeout(() => setShowSyncSuccess(false), 5000);
  }, []);

  const handleSync = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const dateText = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + " · " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setLastAnalyzed(dateText);
      showSuccessToast("Active satellite orbits calibrated!");
    }, 1800);
  }, [showSuccessToast]);

  const handleAnalyze = useCallback(() => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      showSuccessToast("Analysis complete!");
    }, 2000);
  }, [showSuccessToast]);

  return (
    <DashboardContext.Provider value={{
      farmerProfile, setFarmerProfile,
      fields, setFields,
      selectedFieldId, setSelectedFieldId,
      activeField,
      lastAnalyzed, setLastAnalyzed,
      isSyncing, isAnalyzing,
      showSyncSuccess, syncSuccessMsg,
      showWhatsNew, setShowWhatsNew,
      showAddField, setShowAddField,
      isMobileSidebarOpen, setIsMobileSidebarOpen,
      handleSync, handleAnalyze,
      showSuccessToast,
      notifications, unreadCount,
      markNotificationRead, markAllNotificationsRead,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
