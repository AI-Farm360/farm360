'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Crosshair, ChevronDown, CheckCircle2, RotateCcw, Check, Loader2, AlertCircle, MapPinned } from 'lucide-react';
import Select from './Select';
import FarmMap from '@/components/FarmMap';

interface LocationData {
  county: string;
  subCounty: string;
  ward: string;
  village: string;
  latitude: string;
  longitude: string;
}

interface LocationCardProps {
  value: LocationData;
  onChange: (data: Partial<LocationData>) => void;
}

const counties = ['Nyandarua', 'Meru', 'Nakuru', 'Nandi', 'Trans Nzoia', 'Uasin Gishu'];
const subCounties: Record<string, string[]> = {
  Nyandarua: ['Ol Kalou', 'Kinangop', 'Ndaragwa', 'Kipipiri', 'Mukurweini'],
  Meru: ['Buuri', 'Imenti North', 'Imenti South', 'Tigania', 'Igembe'],
  Nakuru: ['Njoro', 'Molo', 'Kuresoi', 'Rongai', 'Naivasha'],
  Nandi: ['Nandi Hills', 'Chesumei', 'Tinderet', 'Aldai'],
  'Trans Nzoia': ['Kiminini', 'Saboti', 'Kwanza', 'Cherangany'],
  'Uasin Gishu': ['Kapseret', 'Molben', 'Soy', 'Turbo'],
};
const wards: Record<string, string[]> = {
  'Ol Kalou': ['Kaimbaga', 'Muruaki', 'Nyakiambi', 'Gitiri'],
  Kinangop: ['Njabini', 'Magumu', 'Engineer', 'Gathara'],
  Buuri: ['Ruiri/Rwarera', 'Kiirua', 'Kisima', 'Nguyumi'],
  'Imenti North': ['Ntima East', 'Ntima West', 'Kiara', 'Nyaki West'],
  Njoro: ['Mau Narok', 'Nessuit', 'Lare', 'Kihingo'],
  Molo: ['Molo', 'Turbo', 'Elburgon', 'Marioshoni'],
};
const villages: Record<string, string[]> = {
  Kaimbaga: ['Kaimbaga Central', 'Gathara-ini', 'Kanyagia', 'Gitiri'],
  Muruaki: ['Muruaki Central', 'Githioro', 'Mugumo-ini'],
  'Ruiri/Rwarera': ['Ruiri', 'Rwarera', 'Kithoka', 'Nkabune'],
  'Ntima East': ['Kibirichia', 'Nkubu', 'Kanyakine'],
  'Mau Narok': ['Mau Narok', 'Mariashoni', 'Sururu'],
};

const demoCoords: Record<string, { lat: number; lng: number }> = {
  Nyandarua: { lat: -0.2643, lng: 36.3789 },
  Meru: { lat: 0.1251, lng: 37.5283 },
};

function getDefaultCoords(county: string): { lat: number; lng: number } {
  return demoCoords[county] || { lat: -0.2643, lng: 36.3789 };
}

export default function LocationCard({ value, onChange }: LocationCardProps) {
  const [locating, setLocating] = useState(false);
  const [located, setLocated] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geoStatus, setGeoStatus] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null);
  const [dynamicOpts, setDynamicOpts] = useState<{
    counties: string[];
    subCounties: Record<string, string[]>;
    wards: Record<string, string[]>;
    villages: Record<string, string[]>;
  }>({ counties: [], subCounties: {}, wards: {}, villages: {} });

  const lat = parseFloat(value.latitude) || 0;
  const lng = parseFloat(value.longitude) || 0;
  const hasCoords = lat !== 0 && lng !== 0;

  useEffect(() => {
    if (hasCoords) setShowMap(true);
  }, [value.latitude, value.longitude]);

  const reverseGeocode = useCallback(async (targetLat: number, targetLng: number) => {
    setGeocoding(true);
    setGeoStatus({ type: 'loading', message: 'Detecting your farm location…' });
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${targetLat}&lon=${targetLng}`,
        { headers: { 'User-Agent': 'FieldPulse/1.0' } }
      );
      if (!res.ok) throw new Error('Geocoding failed');
      const data = await res.json();
      if (data?.address) {
        const addr = data.address;
        const state = addr.state || '';
        const county = addr.county || addr.region || state;
        const subCounty = addr.suburb || addr.city_district || addr.municipality || addr.town || '';
        const ward = addr.neighbourhood || addr.quarter || addr.village || '';
        const village = addr.hamlet || '';

        setDynamicOpts((prev) => {
          const next = { ...prev };
          if (county && !counties.includes(county) && !prev.counties.includes(county)) {
            next.counties = [...prev.counties, county];
          }
          if (county && subCounty && !(subCounties[county]?.includes(subCounty)) && !(prev.subCounties[county]?.includes(subCounty))) {
            next.subCounties = { ...prev.subCounties, [county]: [...(prev.subCounties[county] || []), subCounty] };
          }
          if (subCounty && ward && !(wards[subCounty]?.includes(ward)) && !(prev.wards[subCounty]?.includes(ward))) {
            next.wards = { ...prev.wards, [subCounty]: [...(prev.wards[subCounty] || []), ward] };
          }
          if (ward && village && !(villages[ward]?.includes(village)) && !(prev.villages[ward]?.includes(village))) {
            next.villages = { ...prev.villages, [ward]: [...(prev.villages[ward] || []), village] };
          }
          return next;
        });

        const update: Partial<LocationData> = {};
        if (county) update.county = county;
        if (subCounty) update.subCounty = subCounty;
        if (ward) update.ward = ward;
        if (village) update.village = village;
        onChange(update);

        const detected = [county, subCounty, ward].filter(Boolean).join(', ');
        setGeoStatus({ type: 'success', message: `Location detected: ${detected}` });
      } else {
        setGeoStatus({
          type: 'error',
          message: 'GPS captured, but we could not identify the administrative location. Please select county and ward manually.',
        });
      }
    } catch {
      setGeoStatus({
        type: 'error',
        message: 'GPS captured, but we could not identify the administrative location. Please select county and ward manually.',
      });
    } finally {
      setGeocoding(false);
    }
  }, [onChange]);

  const handleLocate = () => {
    setLocating(true);
    setGeoStatus(null);
    if (!navigator.geolocation) {
      const coords = getDefaultCoords(value.county);
      onChange({ latitude: String(coords.lat), longitude: String(coords.lng) });
      setLocating(false);
      setLocated(true);
      setShowMap(true);
      reverseGeocode(coords.lat, coords.lng);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        onChange({ latitude: String(newLat), longitude: String(newLng) });
        setLocating(false);
        setLocated(true);
        setShowMap(true);
        reverseGeocode(newLat, newLng);
      },
      () => {
        const coords = getDefaultCoords(value.county);
        onChange({ latitude: String(coords.lat), longitude: String(coords.lng) });
        setLocating(false);
        setLocated(true);
        setShowMap(true);
        reverseGeocode(coords.lat, coords.lng);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleResetLocation = () => {
    const coords = getDefaultCoords(value.county);
    onChange({ latitude: String(coords.lat), longitude: String(coords.lng) });
    setLocated(true);
    setShowMap(true);
  };

  const handleConfirmLocation = () => {
    setConfirming(true);
    setTimeout(() => setConfirming(false), 1500);
  };

  const handleMapMove = (newLat: number, newLng: number) => {
    onChange({ latitude: String(newLat), longitude: String(newLng) });
    setLocated(true);
    setGeoStatus(null);
    reverseGeocode(newLat, newLng);
  };

  const availableCounties = useMemo(() => {
    const merged = [...counties];
    for (const c of dynamicOpts.counties) {
      if (!merged.includes(c)) merged.push(c);
    }
    return merged;
  }, [dynamicOpts.counties]);

  const availableSubCounties = useMemo(() => {
    const base = subCounties[value.county] || [];
    const extra = dynamicOpts.subCounties[value.county] || [];
    return [...new Set([...base, ...extra])];
  }, [value.county, dynamicOpts.subCounties]);

  const availableWards = useMemo(() => {
    const base = wards[value.subCounty] || [];
    const extra = dynamicOpts.wards[value.subCounty] || [];
    return [...new Set([...base, ...extra])];
  }, [value.subCounty, dynamicOpts.wards]);

  const availableVillages = useMemo(() => {
    const base = villages[value.ward] || [];
    const extra = dynamicOpts.villages[value.ward] || [];
    return [...new Set([...base, ...extra])];
  }, [value.ward, dynamicOpts.villages]);

  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-[#ECE8E1]">
        <div className="p-1.5 bg-brand-light-green/40 text-brand-green rounded-lg">
          <MapPin className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#171717]">Farm Location</h3>
          <p className="text-[10px] text-[#6B6B6B]">Where is your farm located?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wider">County</label>
          <Select
            value={value.county}
            onChange={(v) => {
              setGeoStatus(null);
              const coords = getDefaultCoords(v);
              onChange({ county: v, subCounty: '', ward: '', village: '', latitude: String(coords.lat), longitude: String(coords.lng) });
              setShowMap(true);
            }}
            options={availableCounties.map((c) => ({ value: c, label: c }))}
            placeholder="Select county"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wider">Sub-county</label>
          <Select
            value={value.subCounty}
            onChange={(v) => { setGeoStatus(null); onChange({ subCounty: v, ward: '', village: '' }) }}
            options={availableSubCounties.map((s) => ({ value: s, label: s }))}
            placeholder="Select sub-county"
            disabled={!value.county}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wider">Ward</label>
          <Select
            value={value.ward}
            onChange={(v) => { setGeoStatus(null); onChange({ ward: v, village: '' }) }}
            options={availableWards.map((w) => ({ value: w, label: w }))}
            placeholder="Select ward"
            disabled={!value.subCounty}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wider">Village</label>
          <Select
            value={value.village}
            onChange={(v) => { setGeoStatus(null); onChange({ village: v }) }}
            options={availableVillages.map((v) => ({ value: v, label: v }))}
            placeholder="Select village"
            disabled={!value.ward}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap pt-1">
        <button type="button" onClick={handleLocate} disabled={locating}
          className="flex items-center gap-2 bg-[#171717] hover:bg-[#2A2A2A] text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50">
          <Crosshair className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
          {locating ? 'Locating...' : 'Use My Location'}
        </button>
        {hasCoords && (
          <button type="button" onClick={handleResetLocation}
            className="flex items-center gap-1.5 bg-white border border-[#ECE8E1] hover:bg-[#FAF9F6] text-[#171717] text-[11px] font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer">
            <RotateCcw className="w-3 h-3" /> Reset to Demo
          </button>
        )}
        {hasCoords && (
          <button type="button" onClick={handleConfirmLocation}
            className="flex items-center gap-1.5 bg-brand-green/10 border border-brand-green/30 text-brand-green text-[11px] font-bold px-3 py-2 rounded-xl transition-all cursor-pointer">
            <Check className="w-3.5 h-3.5" />
            {confirming ? 'Confirmed' : 'Confirm Location'}
          </button>
        )}
        {located && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-brand-green font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> GPS located
          </motion.span>
        )}
      </div>

      <AnimatePresence>
        {geoStatus && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium ${
              geoStatus.type === 'loading'
                ? 'bg-blue-50 text-blue-700'
                : geoStatus.type === 'success'
                ? 'bg-brand-light-green/40 text-brand-green'
                : 'bg-amber-50 text-amber-800'
            }`}
          >
            {geoStatus.type === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            ) : geoStatus.type === 'success' ? (
              <MapPinned className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{geoStatus.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMap && hasCoords && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Satellite Map
                </span>
                <span className="text-[9px] text-brand-green font-semibold bg-brand-light-green/40 px-2 py-0.5 rounded-full border border-brand-green/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" /> Live
                </span>
              </div>
              <FarmMap
                latitude={lat}
                longitude={lng}
                onLocationChange={handleMapMove}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasCoords && (
        <div className="pt-1 border-t border-[#ECE8E1]">
          <details className="group">
            <summary className="text-[10px] text-[#6B6B6B] font-semibold cursor-pointer hover:text-[#171717] transition-colors select-none list-none flex items-center gap-1">
              <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
              Advanced location details
            </summary>
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="space-y-1">
                <label className="text-[9px] font-semibold text-[#6B6B6B] uppercase tracking-wider">Latitude</label>
                <input type="text" value={value.latitude} readOnly
                  className="w-full bg-[#FAF9F6] text-[#171717] border border-[#ECE8E1] rounded-lg px-2.5 py-1.5 text-[11px] font-mono outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-semibold text-[#6B6B6B] uppercase tracking-wider">Longitude</label>
                <input type="text" value={value.longitude} readOnly
                  className="w-full bg-[#FAF9F6] text-[#171717] border border-[#ECE8E1] rounded-lg px-2.5 py-1.5 text-[11px] font-mono outline-none" />
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
