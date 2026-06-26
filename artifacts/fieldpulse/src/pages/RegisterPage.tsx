import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Satellite } from 'lucide-react';
import { useLocation } from 'wouter';
import RegistrationForm from '@/components/RegistrationForm';

export default function RegisterPage() {
  const [, navigate] = useLocation();

  const handleRegisterSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text antialiased selection:bg-brand-light-green selection:text-brand-green">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-10">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-brand-muted hover:text-brand-text transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to home
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-brand-green/10 text-brand-green rounded-lg">
                  <Satellite className="w-4 h-4" />
                </div>
                <span className="font-sans text-xs font-bold text-brand-muted uppercase tracking-widest">Farm Registration</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-light leading-tight text-brand-text">
                Start monitoring<br />
                <span className="italic text-brand-muted/70">your potato field.</span>
              </h1>
            </div>

            <p className="font-sans text-xs md:text-sm text-brand-muted leading-relaxed">
              Enter your farm details so our satellite engine can calibrate its spectral analysis and crop stage tracking to your specific location and potato variety.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { icon: CheckCircle2, text: 'GPS-calibrated field boundary tracking' },
                { icon: CheckCircle2, text: 'Variety-specific growth stage alerts' },
                { icon: CheckCircle2, text: 'Weekly moisture stress advisories' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-brand-muted">
                  <item.icon className="w-3.5 h-3.5 text-brand-green shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <RegistrationForm onSubmitSuccess={handleRegisterSuccess} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
