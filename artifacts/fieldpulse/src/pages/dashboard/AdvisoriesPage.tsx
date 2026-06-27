import { motion } from 'motion/react';
import { ThumbsUp } from 'lucide-react';
import { useLocation } from 'wouter';
import { useDashboard } from '@/contexts/DashboardContext';
import * as mock from '@/data/mockData';
import { riskTypeToTitle, riskTypeToTriggeredBy, scoreToSeverity } from '@/lib/api';
import AdvisoryPriorityVisual from '@/components/AdvisoryPriorityVisual';
import AIReasoningFlow from '@/components/AIReasoningFlow';
import ChatBox from '@/components/ChatBox';

export default function AdvisoriesPage() {
  const [, navigate] = useLocation();
  const { advisory } = useDashboard();

  // Derive display values — live from backend if available, else mock
  const title = advisory ? riskTypeToTitle(advisory.risk_type) : mock.advisory.title;
  const severity = advisory ? scoreToSeverity(advisory.risk_score) : mock.advisory.severity;
  const recommendation = advisory ? advisory.recommended_action : mock.advisory.recommendation;
  const confidence = advisory ? Math.round(advisory.confidence * 100) : mock.advisory.confidence;
  const triggeredBy = advisory
    ? riskTypeToTriggeredBy(advisory.risk_type, advisory.inputs.satellite, advisory.risk_score)
    : mock.advisory.triggeredBy;

  // Build history rows from live data or mock
  type HistoryRow = { id: string; title: string; description: string; severity: 'Low' | 'Medium' | 'High'; confidence: number; date: string; status: string };
  const historyRows: HistoryRow[] = advisory
    ? [{
        id: advisory.id,
        title: riskTypeToTitle(advisory.risk_type),
        description: advisory.message,
        severity: scoreToSeverity(advisory.risk_score),
        confidence: Math.round(advisory.confidence * 100),
        date: new Date(advisory.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Delivered',
      }]
    : mock.historicalAdvisories;

  const sevColors: Record<string, string> = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AdvisoryPriorityVisual
        title={title}
        severity={severity}
        recommendation={recommendation}
        confidence={confidence}
        triggeredBy={triggeredBy}
      />

      <AIReasoningFlow />

      <ChatBox />

      <div className="bg-white border border-[#ECE8E1] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#ECE8E1]">
          <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">Historical Advisory Logs</h3>
          <p className="text-[10px] text-[#6B6B6B] mt-0.5">Past alerts and recommendations for your field.</p>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF9F6] border-b border-[#ECE8E1] text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">
              <th className="py-3 px-5">Advisory</th>
              <th className="py-3 px-5">Urgency</th>
              <th className="py-3 px-5">Confidence</th>
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE8E1]">
            {historyRows.map((h) => (
              <tr key={h.id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                <td className="py-3.5 px-5">
                  <span className="font-bold text-[#171717]">{h.title}</span>
                  <p className="text-[10px] text-[#6B6B6B] mt-0.5">{h.description}</p>
                </td>
                <td className="py-3.5 px-5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${sevColors[h.severity] || sevColors.Low}`}>{h.severity}</span>
                </td>
                <td className="py-3.5 px-5 font-mono text-[#171717]">{h.confidence}%</td>
                <td className="py-3.5 px-5 text-[#6B6B6B]">{h.date}</td>
                <td className="py-3.5 px-5">
                  <span className="text-[10px] font-bold text-brand-green bg-brand-light-green/40 px-2 py-0.5 rounded-full border border-brand-green/20">{h.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-light-green/40 text-brand-green rounded-xl shrink-0">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#171717]">Was this advisory accurate?</h3>
            <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
              Your feedback helps FieldPulse improve future recommendations for your farm.
            </p>
            <div className="flex items-center gap-2 mt-3">
              {['Yes, accurate', 'Partially', 'No'].map((option) => (
                <button
                  key={option}
                  onClick={() => navigate('/dashboard/feedback')}
                  className="text-[11px] bg-white hover:bg-[#FAF9F6] border border-[#ECE8E1] text-[#171717] font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
