'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { User, MapPin } from 'lucide-react';
import { createField } from '@/lib/api';
import LocationCard from './LocationCard';
import SatellitePreviewCard from './SatellitePreviewCard';
import Select from './Select';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Farmer name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  county: z.string().min(1, { message: 'County is required.' }),
  subCounty: z.string().min(1, { message: 'Sub-County is required.' }),
  ward: z.string().min(1, { message: 'Ward is required.' }),
  village: z.string().optional(),
  variety: z.string().min(1, { message: 'Please select a potato variety.' }),
  plantingDate: z.string().min(5, { message: 'Planting date is required.' }),
  farmSize: z.coerce.number().positive({ message: 'Farm size must be positive.' }),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  notes: z.string().optional(),
});

interface RegistrationFormProps {
  onSubmitSuccess: () => void;
}

export default function RegistrationForm({ onSubmitSuccess }: RegistrationFormProps) {
  const [step, setStep] = useState<'form' | 'preview' | 'submitted'>('form');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'John Mwangi',
      phone: '+254712345678',
      county: '',
      subCounty: '',
      ward: '',
      village: '',
      variety: 'Shangi',
      plantingDate: '2026-05-12',
      farmSize: 3.5,
      latitude: '',
      longitude: '',
      notes: '',
    }
  });

  const county = watch('county');
  const subCounty = watch('subCounty');
  const variety = watch('variety');
  const farmSize = watch('farmSize');

  const onSubmit = async (data: any) => {
    const lat = parseFloat(data.latitude) || -0.2643;
    const lng = parseFloat(data.longitude) || 36.3789;
    const latOffset = 0.001;
    const lngOffset = 0.001 / Math.cos((lat * Math.PI) / 180);

    // GeoJSON boundary: [lng, lat] pairs (closed ring)
    const boundary: [number, number][] = [
      [lng - lngOffset, lat + latOffset],
      [lng + lngOffset, lat + latOffset],
      [lng + lngOffset, lat - latOffset],
      [lng - lngOffset, lat - latOffset],
      [lng - lngOffset, lat + latOffset],
    ];

    const registrationData = {
      id: 'farmer-001',
      name: data.name,
      phone: data.phone,
      county: data.county,
      subCounty: data.subCounty,
      ward: data.ward,
      village: data.village || '',
      farmSize: data.farmSize,
      variety: data.variety,
      plantingDate: data.plantingDate,
      latitude: String(lat),
      longitude: String(lng),
      boundary,
      notes: data.notes || '',
    };
    localStorage.setItem('fieldpulse_registration', JSON.stringify(registrationData));

    setStep('preview');

    // Fire backend field creation in parallel with the animation — no blocking
    createField({
      farmer_name: data.name,
      farmer_phone: data.phone,
      boundary,
      planting_date: data.plantingDate,
      potato_variety: data.variety,
      location: { lat, lng, county: data.county },
    })
      .then((created) => {
        // Store the real backend ID so the dashboard can find this field
        localStorage.setItem('fieldpulse_backend_field_id', created.id);
        const stored = localStorage.getItem('fieldpulse_registration');
        if (stored) {
          try {
            localStorage.setItem(
              'fieldpulse_registration',
              JSON.stringify({ ...JSON.parse(stored), id: created.id, backendFieldId: created.id })
            );
          } catch { /* ignore */ }
        }
      })
      .catch(() => {
        // Backend unavailable — localStorage-only mode, DashboardContext will seed on load
      });

    setTimeout(() => { setStep('submitted'); setTimeout(() => onSubmitSuccess(), 2500); }, 1800);
  };

  const autofill = (preset: 'nyandarua' | 'meru') => {
    if (preset === 'nyandarua') {
      setValue('county', 'Nyandarua');
      setValue('subCounty', 'Ol Kalou');
      setValue('ward', 'Kaimbaga');
      setValue('village', 'Kaimbaga Central');
      setValue('variety', 'Shangi');
      setValue('latitude', '-0.2643');
      setValue('longitude', '36.3789');
      setValue('farmSize', 3.5);
    } else {
      setValue('county', 'Meru');
      setValue('subCounty', 'Buuri');
      setValue('ward', 'Ruiri/Rwarera');
      setValue('village', 'Ruiri');
      setValue('variety', 'Dutch Robyjn');
      setValue('latitude', '0.1251');
      setValue('longitude', '37.5283');
      setValue('farmSize', 2.2);
    }
  };

  if (step === 'preview') {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="font-bold text-lg text-[#171717]">Registering your farm...</h3>
          <p className="text-xs text-[#6B6B6B]">FieldPulse is calibrating your field for satellite monitoring.</p>
        </div>
        <SatellitePreviewCard county={county} variety={variety} farmSize={Number(farmSize) || 0} />
      </div>
    );
  }

  if (step === 'submitted') {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-6">
        <MotionCheck className="w-14 h-14 text-brand-green" />
        <div className="text-center space-y-4 w-full max-w-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#171717]">Farm Registered</h3>
            <p className="text-xs text-[#6B6B6B]">Your field is being set up for satellite monitoring.</p>
          </div>

          <div className="bg-[#FAF9F6] rounded-xl p-4 space-y-3 text-left border border-[#ECE8E1]">
            <div className="flex items-center gap-2.5">
              <SatelliteIcon className="w-4 h-4 text-brand-green" />
              <span className="text-xs font-semibold text-[#171717]">Satellite Assigned</span>
              <CheckCircleIcon className="ml-auto w-3.5 h-3.5 text-brand-green" />
            </div>
            <div className="flex items-center gap-2.5 text-[11px] text-[#6B6B6B]">
              <MapPin className="w-3.5 h-3.5" />
              {county} &middot; {variety} Potato
            </div>
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#6B6B6B]">
                <span>Analyzing first satellite image...</span>
                <span className="font-mono">80%</span>
              </div>
              <div className="w-full bg-[#E8E4DE] rounded-full h-1.5 overflow-hidden">
                <ProgressBar width="80%" delay={0.3} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#6B6B6B]">
                <span>Generating AI advisory...</span>
                <span className="font-mono">45%</span>
              </div>
              <div className="w-full bg-[#E8E4DE] rounded-full h-1.5 overflow-hidden">
                <ProgressBar width="45%" delay={0.8} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#6B6B6B]">
          <LoadingDots />
          Redirecting to dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap pb-1">
        <span className="text-[9px] uppercase font-bold text-brand-muted tracking-wider">Quick preset:</span>
        <button type="button" onClick={() => autofill('nyandarua')}
          className="text-[10px] bg-brand-bg hover:bg-brand-light-green/40 border border-brand-border hover:border-brand-green/30 text-brand-text px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer">
          <MapPin className="w-2.5 h-2.5 text-brand-green" /> Nyandarua (Shangi)
        </button>
        <button type="button" onClick={() => autofill('meru')}
          className="text-[10px] bg-brand-bg hover:bg-brand-light-green/40 border border-brand-border hover:border-brand-green/30 text-brand-text px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer">
          <MapPin className="w-2.5 h-2.5 text-brand-green" /> Meru (Dutch Robyjn)
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-1 border-b border-[#ECE8E1]">
            <User className="w-3.5 h-3.5 text-brand-green" />
            <span className="text-xs font-bold text-[#171717]">Farmer Details</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wider">Full Name</label>
              <input {...register('name')}
                className="w-full bg-[#FAF9F6] text-[#171717] border border-[#ECE8E1] rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-green/40"
                placeholder="e.g., John Mwangi" />
              {errors.name && <p className="text-[10px] text-red-500">{String(errors.name.message)}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wider">Phone Number</label>
              <input {...register('phone')}
                className="w-full bg-[#FAF9F6] text-[#171717] border border-[#ECE8E1] rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-green/40"
                placeholder="e.g., +254712345678" />
              {errors.phone && <p className="text-[10px] text-red-500">{String(errors.phone.message)}</p>}
            </div>
          </div>
        </div>

        <LocationCard
          value={{ county, subCounty: watch('subCounty'), ward: watch('ward'), village: watch('village'), latitude: watch('latitude'), longitude: watch('longitude') }}
          onChange={(data) => {
            if (data.county !== undefined) setValue('county', data.county);
            if (data.subCounty !== undefined) setValue('subCounty', data.subCounty);
            if (data.ward !== undefined) setValue('ward', data.ward);
            if (data.village !== undefined) setValue('village', data.village);
            if (data.latitude !== undefined) setValue('latitude', data.latitude);
            if (data.longitude !== undefined) setValue('longitude', data.longitude);
          }}
        />

        <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-1 border-b border-[#ECE8E1]">
            <svg className="w-3.5 h-3.5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <span className="text-xs font-bold text-[#171717]">Crop Details</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wider">Potato Variety</label>
              <Select
                value={variety}
                onChange={(v) => setValue('variety', v)}
                options={[
                  { value: 'Shangi', label: 'Shangi' },
                  { value: 'Dutch Robyjn', label: 'Dutch Robyjn' },
                  { value: 'Unica', label: 'Unica' },
                  { value: 'Kerrs Pink', label: "Kerr's Pink" },
                ]}
                placeholder="Select variety"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wider">Planting Date</label>
              <input type="date" {...register('plantingDate')}
                className="w-full bg-[#FAF9F6] text-[#171717] border border-[#ECE8E1] rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-green/40" />
              {errors.plantingDate && <p className="text-[10px] text-red-500">{String(errors.plantingDate.message)}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wider">Field Size (Acres)</label>
              <input type="number" step="0.1" {...register('farmSize')}
                className="w-full bg-[#FAF9F6] text-[#171717] border border-[#ECE8E1] rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-green/40"
                placeholder="e.g., 3.5" />
              {errors.farmSize && <p className="text-[10px] text-red-500">{String(errors.farmSize.message)}</p>}
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-[#171717] hover:bg-[#2A2A2A] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-sm">
          {isSubmitting ? 'Registering...' : 'Register Farm & Start Monitoring'}
        </button>
      </form>
    </div>
  );
}

function MotionCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <motion.circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
      <motion.path d="M8 12l2 2 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.3 }} />
    </svg>
  );
}

function SatelliteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ProgressBar({ width, delay }: { width: string; delay: number }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      className="h-full rounded-full bg-brand-green"
    />
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 bg-[#6B6B6B] rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}
