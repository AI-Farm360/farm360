import { motion } from 'motion/react';
import { ArrowRight, Droplets, Leaf, Bug, TrendingUp } from 'lucide-react';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import SectionTitle from '@/components/SectionTitle';
import FeatureCard from '@/components/FeatureCard';
import TimelineCard from '@/components/TimelineCard';
import DashboardPreview from '@/components/DashboardPreview';
import SatelliteFlow from '@/components/SatelliteFlow';
import FieldHealthMap from '@/components/FieldHealthMap';
import PhoneMockup from '@/components/PhoneMockup';
import MockMap from '@/components/MockMap';
import Footer from '@/components/Footer';

const STATS = [
  { value: '3–5 days', label: 'Satellite revisit cadence' },
  { value: '0–100', label: 'Per-field risk score' },
  { value: 'EN / SW', label: 'Bilingual advisories' },
  { value: 'WhatsApp · SMS · USSD', label: 'Delivery channels' },
];

const CONDITIONS = [
  { label: 'Water stress', icon: Droplets },
  { label: 'Nutrient deficiency', icon: Leaf },
  { label: 'Pest & disease', icon: Bug },
  { label: 'Healthy growth', icon: TrendingUp },
];

export default function HomePage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col antialiased">
      <Navbar />

      <main className="flex-1">
        {/* HERO — full-bleed aerial farm photo */}
        <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
          {/* Aerial farm photo background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')`,
            }}
          />
          {/* Dark overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/40 to-black/30" />
          {/* Green tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d1a]/60 to-transparent" />

          {/* Floating data labels — decorative */}
          <div className="absolute left-4 top-1/4 hidden lg:flex flex-col gap-8 text-white/60 text-xs font-mono select-none pointer-events-none">
            {['128.4 HA', 'YOUR CROP', 'PLANT INDEX', 'PLANT DENSITY', 'GERMINATION STATUS'].map((label) => (
              <span key={label} className="block opacity-50">{label}</span>
            ))}
          </div>

          {/* NDVI label top-right */}
          <div className="absolute top-6 right-6 hidden lg:block">
            <div className="bg-brand-green/20 backdrop-blur-sm border border-brand-green/30 rounded-lg px-3 py-1.5">
              <span className="text-xs font-bold text-brand-green uppercase tracking-widest">VEGETATIVE</span>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
            {/* Badge pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8"
            >
              <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">Built for smallholder potato farmers in East Africa</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-bold text-5xl md:text-7xl leading-[1.05] tracking-tight text-white mb-6 max-w-3xl"
            >
              Know your field,{' '}
              <span className="text-brand-green">act before</span>
              <br />
              <span className="text-brand-green">it costs you.</span>
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl mb-10"
            >
              Farm360 continuously analyzes satellite imagery, weather indices, and crop growth
              patterns to detect moisture stress, leaf anomaly, and pest risk early —
              then tells you exactly what to do.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-12"
            >
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-dark-green text-white font-bold text-sm px-7 py-3.5 rounded-lg transition-all duration-200 active:scale-98 cursor-pointer shadow-lg shadow-brand-green/30"
                id="hero-primary-cta"
              >
                Register a field
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/dashboard?demo=true')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold text-sm px-7 py-3.5 rounded-lg transition-all duration-200 active:scale-98 cursor-pointer"
                id="hero-secondary-cta"
              >
                View live dashboard
              </button>
            </motion.div>

            {/* Condition tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {CONDITIONS.map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-white/70 text-xs font-medium">
                  <Icon className="w-3.5 h-3.5 text-brand-green" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Bottom label */}
          <div className="absolute bottom-6 right-6 text-white/30 text-[10px] font-mono uppercase tracking-widest hidden md:block select-none">
            INSIGHTS &amp; ALERTS
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-white border-b border-brand-border">
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-brand-border">
            {STATS.map(({ value, label }) => (
              <div key={label} className="md:px-8 first:pl-0 last:pr-0">
                <p className="font-bold text-2xl md:text-3xl text-brand-green leading-tight">{value}</p>
                <p className="text-brand-muted text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-24 md:space-y-32 py-24">
          {/* SATELLITE-TO-ACTION FLOW */}
          <SatelliteFlow />

          {/* VEGETATION HEALTH + PHONE MOCKUP */}
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
              title="Decision intelligence,"
              italicText="not just data."
              subtitle="We bridge the gap between complex geospatial signals and the next practical step a farmer should take."
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
              title="Simple, elegant flow"
              italicText="built for African farmers."
              subtitle="How Farm360 keeps tabs on field hydration and crop health with zero hardware required."
            />
            <div className="space-y-4 pt-6">
              <TimelineCard index={0} stepNumber="01" title="Register Farm Details" description="Enter your ward location, potato variety (like Shangi or Dutch Robyjn), and estimated planting date so our algorithm calibrates your growth cycle." />
              <TimelineCard index={1} stepNumber="02" title="Continuous Satellite Sweeps" description="Farm360 tracks spectral indices over your custom bounds, analyzing leaf reflectance and soil wetness weekly." />
              <TimelineCard index={2} stepNumber="03" title="AI Stress Classification" description="Our localized model computes a field risk score and weights weather forecasts against actual plant health curves." />
              <TimelineCard index={3} stepNumber="04" title="Dashboard Alerts" description="View actionable recommendations in your dashboard. Submit farm observations back to improve model accuracy." />
            </div>
          </section>

          {/* DASHBOARD PREVIEW */}
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

          {/* BOTTOM CTA CARD */}
          <section className="max-w-4xl mx-auto px-6 pb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-brand-dark-green text-white rounded-3xl p-8 md:p-14 text-center space-y-6 relative overflow-hidden"
            >
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -top-20 w-48 h-48 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative space-y-3 z-10">
                <h3 className="font-bold text-3xl md:text-5xl leading-tight">
                  Ready to safeguard your harvest?
                </h3>
                <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                  Join smart farmers in Nyandarua, Meru, and Nakuru counties already receiving AI-powered insights for their potato fields.
                </p>
              </div>
              <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto bg-brand-green hover:bg-green-500 text-white font-bold text-sm py-4 px-8 rounded-full transition-all duration-150 active:scale-98 cursor-pointer shadow-md"
                >
                  Register Farm Now
                </button>
                <button
                  onClick={() => navigate('/dashboard?demo=true')}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm py-4 px-8 rounded-full transition-all duration-150 active:scale-98 cursor-pointer"
                >
                  View live dashboard
                </button>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
