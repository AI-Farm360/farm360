import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';

export default function DashboardFeedbackPage() {
  const { activeField, showSuccessToast } = useDashboard();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<'yes' | 'partially' | 'no' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackRating) return;
    const feedbackObj = { rating: feedbackRating, text: feedbackText, timestamp: new Date().toISOString() };
    localStorage.setItem('fieldpulse_feedback', JSON.stringify(feedbackObj));
    setFeedbackSubmitted(true);
    setFeedbackText('');
    setFeedbackRating(null);
    showSuccessToast('Feedback submitted successfully!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white border border-[#ECE8E1] rounded-2xl p-6 space-y-6 max-w-2xl mx-auto shadow-xs">
        <div className="pb-4 border-b border-[#ECE8E1] flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-brand-green bg-brand-light-green px-2.5 py-0.5 rounded-full border border-brand-green/20">Advisory Tuning</span>
            <h3 className="font-sans font-bold text-sm text-[#171717] mt-1">Submit Farm Verification</h3>
          </div>
          <span className="text-[10px] text-[#6B6B6B]">Field: {activeField.name}</span>
        </div>
        {!feedbackSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#171717] block">Was the recent moisture stress warning accurate?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { rating: 'yes' as const, label: 'Yes, accurate', desc: 'Observed dry soil spots' },
                  { rating: 'partially' as const, label: 'Partially accurate', desc: 'Drying, but no stress' },
                  { rating: 'no' as const, label: 'No, inaccurate', desc: 'Moisture level is high' }
                ].map((item) => (
                  <button key={item.rating} type="button" onClick={() => setFeedbackRating(item.rating)}
                    className={`p-3 border rounded-xl text-left transition-all cursor-pointer ${feedbackRating === item.rating ? 'border-[#171717] bg-[#FAF9F6] ring-1 ring-[#171717]' : 'border-[#ECE8E1] bg-white hover:bg-[#FAF9F6]/50'}`}>
                    <div className="font-bold text-[#171717]">{item.label}</div>
                    <div className="text-[10px] text-[#6B6B6B] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#171717] block">Add field notes or ground-truth details (Optional)</label>
              <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} rows={4} placeholder="E.g., Soil has some moisture at 5cm deep, but top cover is dry."
                className="w-full bg-[#FAF9F6] border border-[#ECE8E1] rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#171717] leading-relaxed" />
            </div>
            <button type="submit" className="w-full bg-[#171717] text-white py-3 rounded-xl font-bold hover:bg-[#2A2A2A] transition-colors cursor-pointer">Submit Ground Observations</button>
          </form>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-brand-light-green text-brand-green rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-6 h-6" /></div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#171717]">Observations Recorded!</h4>
              <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto leading-relaxed">Thank you. Your feedback is sent directly to calibration loops.</p>
            </div>
            <button onClick={() => { setFeedbackSubmitted(false); setFeedbackText(''); setFeedbackRating(null); }} className="bg-white hover:bg-[#FAF9F6] border border-[#ECE8E1] text-[#171717] font-bold text-xs py-2 px-5 rounded-xl transition-all cursor-pointer">Submit Another Update</button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
