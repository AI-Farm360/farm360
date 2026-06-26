'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import SectionTitle from '@/src/components/SectionTitle';
import FeatureCard from '@/src/components/FeatureCard';
import TimelineCard from '@/src/components/TimelineCard';
import DashboardPreview from '@/src/components/DashboardPreview';
import HeroVisual from '@/src/components/HeroVisual';
import SatelliteFlow from '@/src/components/SatelliteFlow';
import FieldHealthMap from '@/src/components/FieldHealthMap';
import PhoneMockup from '@/src/components/PhoneMockup';
import MockMap from '@/src/components/MockMap';
import Footer from '@/src/components/Footer';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col antialiased selection:bg-brand-light-green selection:text-brand-green">
      <Navbar />
      <main className="flex-1 space-y-24 md:space-y-32 pt-10">
        {/* HERO SECTION */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-8 pt-10 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {['Satellite Monitoring', 'AI Advisory', 'Weather Intelligence', 'Growth Tracking', 'Farmer Feedback'].map((tag) => (
              <span
                key={tag}
                className="text-[10px] md:text-xs font-semibold px-3 py-1 bg-white border border-brand-border text-brand-muted rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:border-brand-green/30 hover:text-brand-text transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-5xl md:text-7xl font-light tracking-tight leading-[1.05] text-brand-text"
            >
              Know your field, <br className="hidden md:inline" />
              <span className="serif-italic block sm:inline font-light italic text-brand-muted/70">
                before your crop tells you.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-sm md:text-base text-brand-muted leading-relaxed max-w-2xl mx-auto font-normal"
            >
              Farm360 continuously analyzes satellite imagery, weather indices, and crop growth patterns to detect moisture stress, leaf anomaly, and pest risk early, generating simple advisory alerts for potato growers.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => router.push('/register')}
              className="w-full sm:w-auto bg-brand-text text-brand-bg hover:bg-brand-muted px-8 py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              id="hero-primary-cta"
            >
              Register Farm
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/dashboard?demo=true')}
              className="w-full sm:w-auto bg-white border border-brand-border text-brand-text hover:bg-brand-bg px-8 py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              id="hero-secondary-cta"
            >
              View Demo
            </button>
          </motion.div>
        </section>

        {/* HERO VISUAL - Farm map, polygon, scan, advisory card */}
        <HeroVisual />

        {/* SATELLITE-TO-ACTION FLOW */}
        <SatelliteFlow />

        {/* VEGETATION HEALTH + PHONE MOCKUP SIDE BY SIDE */}
        <section className="max-w-4xl mx-auto px-6">
          <SectionTitle
            title="From space to your"
            italicText="phone in seconds."
            subtitle="Satellite data analyzed and delivered as a simple farmer-friendly message."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 items-stretch">
            <FieldHealthMap />
            <PhoneMockup />
          </div>
        </section>

        {/* MAP PREVIEW */}
        <section className="max-w-4xl mx-auto px-6">
          <SectionTitle
            title="Your field,"
            italicText="always watched."
            subtitle="Continuous satellite monitoring with GPS-precise field boundaries."
          />
          <div className="pt-6">
            <MockMap />
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="max-w-5xl mx-auto px-6 scroll-mt-24">
          <SectionTitle
            title="From satellite imagery"
            italicText="to actionable decisions."
            subtitle="Cutting-edge space analytics converted to clean, native recommendations for smallholder potato farmers in East Africa."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <FeatureCard index={0} title="Continuous Monitoring" description="Monitor vegetation vigor (NDVI), canopy moisture indexes (NDMI), and plant transpiration levels to trace soil health indicators." iconName="Satellite" />
            <FeatureCard index={1} title="AI Risk Analysis" description="Automatically classify disease potential (late blight, wilt), nutritional imbalances, and early moisture stress triggers before damage is visible." iconName="Brain" />
            <FeatureCard index={2} title="Personalized Advisory" description="Receive short recommendations based on local potato crop stage, regional rain forecasts, and weather indices." iconName="Bell" />
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="max-w-3xl mx-auto px-6 scroll-mt-24">
          <SectionTitle
            title="A simple, elegant flow"
            italicText="built for African farmers."
            subtitle="How Farm360 keeps tabs on field hydration and crop health with zero hardware required."
          />
          <div className="space-y-4 pt-6">
            <TimelineCard index={0} stepNumber="01" title="Register Farm Details" description="Enter your ward location, potato variety (like Shangi or Dutch Robyjn), and estimated planting date so our algorithm calibrates your growth cycle." />
            <TimelineCard index={1} stepNumber="02" title="Continuous Satellite Sweeps" description="Farm360 tracks spectral indices over your custom bounds, analyzing leaf reflectance and soil wetness weekly." />
            <TimelineCard index={2} stepNumber="03" title="AI Stress Classification" description="Our localized model computes a localized field risk score and weights weather forecasts against actual plant health curves." />
            <TimelineCard index={3} stepNumber="04" title="Dashboard Alerts" description="View actionable recommendations in your dashboard. Submit farm observations back to improve model accuracy." />
          </div>
        </section>

        {/* DASHBOARD PREVIEW SECTION */}
        <section className="max-w-5xl mx-auto px-6">
          <SectionTitle
            title="Inside the workspace"
            italicText="live platform preview."
            subtitle="An intuitive, high-contrast dashboard with no clutter. Focus on vegetation density, crop moisture indexes, and prioritized advice."
          />
          <div className="pt-6">
            <DashboardPreview />
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION CARD */}
        <section className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-brand-text text-brand-bg rounded-3xl p-8 md:p-14 text-center space-y-6 relative overflow-hidden"
          >
            {/* Background visual: grid + green glow */}
            <div className="absolute inset-0 opacity-[0.04]">
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-48 h-48 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle field rows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-full h-6 border-b border-white/30" style={{ transform: `skewY(-2deg) translateY(${i * 20}px)` }} />
              ))}
            </div>

            <div className="relative space-y-3 z-10">
              <h3 className="font-serif text-3xl md:text-5xl font-light leading-tight">
                Ready to safeguard your harvest?
              </h3>
              <p className="font-sans text-xs md:text-sm text-brand-bg/85 max-w-lg mx-auto leading-relaxed">
                Join other smart farmers in Nyandarua, Meru, and Nakuru counties already receiving AI-powered insights for their potato fields.
              </p>
            </div>
            <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push('/register')}
                className="w-full sm:w-auto bg-brand-green hover:bg-brand-green/90 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full transition-all duration-150 active:scale-98 cursor-pointer shadow-md"
              >
                Register Farm Now
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
