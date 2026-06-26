import { useState } from 'react';
import { motion } from 'motion/react';
import { ThumbsUp, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function FeedbackPage() {
  const [, navigate] = useLocation();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<'yes' | 'partially' | 'no' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackRating) return;
    localStorage.setItem('fieldpulse_feedback', JSON.stringify({
      rating: feedbackRating, text: feedbackText, timestamp: new Date().toISOString()
    }));
    setFeedbackSubmitted(true);
    setFeedbackText('');
    setFeedbackRating(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text antialiased selection:bg-brand-light-green selection:text-brand-green">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto px-6 py-12 md:py-20"
      >
        <div className="space-y-8 bg-white border border-brand-border rounded-3xl p-6 md:p-10 shadow-[0_12px_40px_rgba(23,23,23,0.02)]">
          <div className="pb-4 border-b border-brand-bg flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-green">Model Refinement</span>
              <h3 className="font-serif text-2xl md:text-3xl font-light text-brand-text mt-1">Advisory Feedback</h3>
            </div>
            <button onClick={() => navigate('/dashboard')} className="text-xs text-brand-muted hover:text-brand-text border border-brand-border bg-brand-bg px-3.5 py-1.5 rounded-full transition-all cursor-pointer">
              Go back to Dashboard
            </button>
          </div>

          {!feedbackSubmitted ? (
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-text block">Was this recommendation accurate?</label>
                <p className="text-xs text-brand-muted">Recommendation Ref: <span className="font-semibold text-brand-text">&ldquo;Moisture levels are dropping slightly. Inspect soil moisture within 24 hours...&rdquo;</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { rating: 'yes', label: 'Yes, Fully Accurate', icon: ThumbsUp, colors: 'bg-brand-green/20 border-brand-green text-brand-green' },
                    { rating: 'partially', label: 'Partially Accurate', icon: AlertCircle, colors: 'bg-amber-500/10 border-amber-500 text-amber-700' },
                    { rating: 'no', label: 'No, Inaccurate', icon: AlertCircle, colors: 'bg-brand-danger/10 border-brand-danger text-brand-danger' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button key={item.rating} type="button" onClick={() => setFeedbackRating(item.rating as 'yes' | 'partially' | 'no')}
                        className={`py-3.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${feedbackRating === item.rating ? item.colors : 'bg-brand-bg border-brand-border text-brand-text hover:bg-brand-border/40'}`}>
                        <Icon className="w-4 h-4" /> {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-text block">Tell us what you observed in the field</label>
                <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} required rows={4}
                  placeholder="Describe soil moisture conditions, leaf yellowing, weather updates, or if you irrigated."
                  className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl p-3.5 text-xs outline-none focus:border-brand-green/40 resize-none" />
              </div>

              <button type="submit" disabled={!feedbackRating}
                className="w-full bg-brand-text text-brand-bg hover:bg-brand-muted font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-40">
                Submit Feedback
              </button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-brand-light-green rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-brand-green" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xl text-brand-text">Thank You!</h4>
                <p className="text-sm text-brand-muted">Your feedback helps us improve advisory accuracy for farmers across East Africa.</p>
              </div>
              <button onClick={() => { setFeedbackSubmitted(false); setFeedbackText(''); setFeedbackRating(null); }}
                className="bg-brand-text text-brand-bg font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-brand-muted transition-all cursor-pointer">
                Submit another response
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
