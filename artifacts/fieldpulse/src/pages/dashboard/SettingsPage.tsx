import { motion } from 'motion/react';
import { useDashboard } from '@/contexts/DashboardContext';

export default function SettingsPage() {
  const { farmerProfile, setFarmerProfile, showSuccessToast } = useDashboard();

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white border border-[#ECE8E1] rounded-2xl p-6 space-y-5 shadow-xs">
        <div className="pb-3 border-b border-[#ECE8E1]">
          <h2 className="font-sans font-bold text-sm text-[#171717]">Farmer Account Settings</h2>
          <p className="text-xs text-[#6B6B6B]">Customize details calibrated during your initial agricultural sign-up.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('fieldpulse_registration', JSON.stringify(farmerProfile)); showSuccessToast('Farmer account settings saved successfully!'); }} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#171717] block">Full Name</label>
              <input type="text" value={farmerProfile.name} onChange={(e) => setFarmerProfile({ ...farmerProfile, name: e.target.value })} className="w-full bg-[#FAF9F6] border border-[#ECE8E1] rounded-lg p-2.5 text-[#171717]" />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-[#171717] block">Phone Number</label>
              <input type="text" value={farmerProfile.phone} onChange={(e) => setFarmerProfile({ ...farmerProfile, phone: e.target.value })} className="w-full bg-[#FAF9F6] border border-[#ECE8E1] rounded-lg p-2.5 text-[#171717]" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#171717] block">County</label>
              <input type="text" value={farmerProfile.county} onChange={(e) => setFarmerProfile({ ...farmerProfile, county: e.target.value })} className="w-full bg-[#FAF9F6] border border-[#ECE8E1] rounded-lg p-2.5 text-[#171717]" />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-[#171717] block">Sub-County</label>
              <input type="text" value={farmerProfile.subCounty} onChange={(e) => setFarmerProfile({ ...farmerProfile, subCounty: e.target.value })} className="w-full bg-[#FAF9F6] border border-[#ECE8E1] rounded-lg p-2.5 text-[#171717]" />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-[#171717] block">Ward</label>
              <input type="text" value={farmerProfile.ward} onChange={(e) => setFarmerProfile({ ...farmerProfile, ward: e.target.value })} className="w-full bg-[#FAF9F6] border border-[#ECE8E1] rounded-lg p-2.5 text-[#171717]" />
            </div>
          </div>
          <button type="submit" className="bg-[#171717] hover:bg-[#2A2A2A] text-white font-bold py-2 px-5 rounded-xl transition-all cursor-pointer">Save Settings</button>
        </form>
      </div>
    </motion.div>
  );
}
