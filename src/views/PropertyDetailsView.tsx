import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  MapPin, 
  Layout, 
  Home, 
  Info,
  ChevronDown
} from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { NavTab } from '../components/Header';
import { ReraPropertyType } from '../types';

interface PropertyDetailsViewProps {
  onBack: () => void;
  onContinue: () => void;
}

export const PropertyDetailsView: React.FC<PropertyDetailsViewProps> = ({ onBack, onContinue }) => {
  const { verificationDraft, setVerificationDraft, displayUnit } = useSession();

  // Local form state initialized from draft if it exists
  const [formData, setFormData] = useState({
    auditName: verificationDraft?.auditName || '',
    builder: verificationDraft?.builder || '',
    propertyType: (verificationDraft?.propertyType as string) || 'apartment',
    configuration: verificationDraft?.configuration || '2 BHK',
    flat: verificationDraft?.flat || '',
    floor: verificationDraft?.floor || '',
    city: verificationDraft?.city || '',
    state: verificationDraft?.state || '',
    preferredUnit: verificationDraft?.rawText || (displayUnit === 'metric' ? 'metric' : 'imperial') // Reusing rawText temporarily or just local state
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update draft in context whenever local state changes
  useEffect(() => {
    setVerificationDraft({
      ...verificationDraft,
      auditName: formData.auditName,
      project: formData.auditName, // Keeping project sync'd for now
      builder: formData.builder,
      propertyType: formData.propertyType as ReraPropertyType,
      configuration: formData.configuration,
      flat: formData.flat,
      floor: formData.floor,
      city: formData.city,
      state: formData.state,
      rawText: formData.preferredUnit
    });
  }, [formData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.auditName.trim()) {
      newErrors.auditName = 'Enter a property or project name.';
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Select a property type.';
    }
    if (!formData.preferredUnit) {
      newErrors.preferredUnit = 'Select a preferred area unit.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onContinue();
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Navigation & Progress */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors mb-6 group cursor-pointer"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-tight">Area Verification</span>
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2457D6] bg-blue-50 px-2 py-0.5 rounded-full">Step 1 of 5</span>
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-1/5 h-full bg-[#2457D6] rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">Property Details</h1>
        </div>
      </div>

      {/* Main Heading */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#172033]">Tell us about the property</h2>
        <p className="text-sm text-[#697386] mt-1">Add the basic property details for this area verification.</p>
      </div>

      <div className="space-y-6">
        {/* Property Name */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#172033]">Property / Project Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="e.g. Green Heights"
              value={formData.auditName}
              onChange={(e) => {
                setFormData({ ...formData, auditName: e.target.value });
                if (errors.auditName) setErrors({ ...errors, auditName: '' });
              }}
              className={`w-full h-14 pl-11 pr-4 bg-white border ${errors.auditName ? 'border-red-500 bg-red-50' : 'border-[#E2E8F0]'} rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none`}
            />
          </div>
          {errors.auditName && (
            <p className="text-xs font-bold text-red-600 mt-1">{errors.auditName}</p>
          )}
        </div>

        {/* Builder Name */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#172033]">Builder / Developer Name <span className="text-slate-400 font-normal">(Optional)</span></label>
          <input 
            type="text" 
            placeholder="e.g. ABC Developers"
            value={formData.builder}
            onChange={(e) => setFormData({ ...formData, builder: e.target.value })}
            className="w-full h-14 px-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none"
          />
        </div>

        {/* Row: Property Type & Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">Property Type</label>
            <div className="relative">
              <select 
                value={formData.propertyType}
                onChange={(e) => {
                  setFormData({ ...formData, propertyType: e.target.value });
                  if (errors.propertyType) setErrors({ ...errors, propertyType: '' });
                }}
                className={`w-full h-14 pl-4 pr-10 bg-white border ${errors.propertyType ? 'border-red-500 bg-red-50' : 'border-[#E2E8F0]'} rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none appearance-none cursor-pointer`}
              >
                <option value="apartment">Apartment / Flat</option>
                <option value="villa">Villa / House</option>
                <option value="plot">Plot</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {errors.propertyType && (
              <p className="text-xs font-bold text-red-600 mt-1">{errors.propertyType}</p>
            )}
          </div>

          {formData.propertyType === 'apartment' && (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#172033]">Configuration</label>
              <div className="relative">
                <select 
                  value={formData.configuration}
                  onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                  className="w-full h-14 pl-4 pr-10 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="1 RK">1 RK</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="5+ BHK">5+ BHK</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Row: Flat & Floor */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">Unit / Flat Number</label>
            <input 
              type="text" 
              placeholder="e.g. A-1204"
              value={formData.flat}
              onChange={(e) => setFormData({ ...formData, flat: e.target.value })}
              className="w-full h-14 px-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">Floor</label>
            <input 
              type="text" 
              placeholder="e.g. 12"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              className="w-full h-14 px-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none"
            />
          </div>
        </div>

        {/* Row: City & State */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">City</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                placeholder="Bhubaneswar"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full h-14 pl-11 pr-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">State</label>
            <input 
              type="text" 
              placeholder="Odisha"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full h-14 px-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none"
            />
          </div>
        </div>

        {/* Area Unit Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-[#172033]">Preferred Area Unit</label>
          <div className={`flex p-1 rounded-2xl transition-all ${errors.preferredUnit ? 'bg-red-50 border border-red-500' : 'bg-slate-100 border border-transparent'}`}>
            <button
              onClick={() => {
                setFormData({ ...formData, preferredUnit: 'imperial' });
                if (errors.preferredUnit) setErrors({ ...errors, preferredUnit: '' });
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${formData.preferredUnit === 'imperial' ? 'bg-white text-[#2457D6] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              Sq. Ft.
            </button>
            <button
              onClick={() => {
                setFormData({ ...formData, preferredUnit: 'metric' });
                if (errors.preferredUnit) setErrors({ ...errors, preferredUnit: '' });
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${formData.preferredUnit === 'metric' ? 'bg-white text-[#2457D6] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              Sq. Meters
            </button>
            <button
              onClick={() => {
                setFormData({ ...formData, preferredUnit: 'hybrid' });
                if (errors.preferredUnit) setErrors({ ...errors, preferredUnit: '' });
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${formData.preferredUnit === 'hybrid' ? 'bg-white text-[#2457D6] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              Both (Dual)
            </button>
          </div>
          {errors.preferredUnit && (
            <p className="text-xs font-bold text-red-600 mt-1">{errors.preferredUnit}</p>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2457D6] flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900">Why we need this</h4>
            <p className="text-xs text-blue-800 leading-relaxed mt-1">
              These details help organize your verification and identify the property in your saved audit and report.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 sm:relative sm:bg-transparent sm:border-0 sm:p-0 sm:mt-12">
        <button
          onClick={handleContinue}
          className="w-full h-16 bg-[#2457D6] hover:bg-[#1D47B0] text-white font-black text-lg rounded-[24px] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
