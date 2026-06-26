'use client';

import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Satellite } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RegistrationForm from '@/src/components/RegistrationForm';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    router.push('/dashboard');
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
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-brand-muted hover:text-brand-text transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to home
            </button>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-green bg-brand-light-green/40 px-3 py-1 rounded-full border border-brand-green/15 inline-block">
                Secure Enrollment
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-text leading-tight tracking-tight">
                Register <br />
                <span className="serif-italic italic text-brand-muted/70">your farm.</span>
              </h2>
              <p className="font-sans text-xs text-brand-muted leading-relaxed font-normal">
                Tell us about your field. FieldPulse will align satellite imagery, calibrate to your potato variety, and begin monitoring vegetation health — all from your browser.
              </p>
            </div>

            <div className="space-y-3 pt-5 border-t border-brand-border">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-brand-light-green/40 text-brand-green rounded-lg shrink-0 mt-0.5">
                  <Satellite className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-text">Satellite-Calibrated</p>
                  <p className="text-[10px] text-brand-muted mt-0.5">Your exact field boundary gets a dedicated satellite observation window.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-brand-light-green/40 text-brand-green rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-text">Real-time AI Analysis</p>
                  <p className="text-[10px] text-brand-muted mt-0.5">Vegetation, moisture, and weather indices processed into simple alerts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-brand-border rounded-2xl p-5 md:p-6 shadow-[0_12px_40px_rgba(23,23,23,0.02)]">
              <RegistrationForm onSubmitSuccess={handleRegisterSuccess} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
