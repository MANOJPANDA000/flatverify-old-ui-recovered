import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Info,
  Check,
  ChevronDown,
  Building2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { PropertyAudit, AreaDisplayUnit, BuilderOtherArea } from '../types';
import { DimensionParser } from '../utils/dimensionParser';
import { Plus, X } from 'lucide-react';

interface BuilderAreaViewProps {
  onBack: () => void;
  onContinue: () => void;
}

const INFORMATION_SOURCES = [
  'Brochure',
  'Cost Sheet',
  'Floor Plan',
  'Agreement / Allotment Document',
  'Builder Website',
  'Sales Representative',
  'Other'
];

export const BuilderAreaView: React.FC<BuilderAreaViewProps> = ({ onBack, onContinue }) => {
  const { verificationDraft, setVerificationDraft } = useSession();

  // Get preferred unit from step 1 (stored in rawText)
  const preferredUnit = (verificationDraft?.rawText as AreaDisplayUnit) || 'imperial';
  const isMetric = preferredUnit === 'metric';
  
  // Helper to convert draft value (always sqft) to local display value
  const toDisplay = (sqft: number | undefined): string => {
    if (sqft === undefined || isNaN(sqft)) return '';
    if (isMetric) {
      return DimensionParser.squareFeetToSquareMeters(sqft).toFixed(2);
    }
    return sqft.toString();
  };

  // Local form state - initialized from draft
  const [formData, setFormData] = useState({
    carpetArea: toDisplay(verificationDraft?.builderCarpetArea),
    builtUpArea: toDisplay(verificationDraft?.builderBuiltUpArea),
    superBuiltUpArea: toDisplay(verificationDraft?.builderSuperBuiltUpArea),
    otherAreas: (verificationDraft?.builderOtherAreas || []).map(oa => ({
      type: oa.type,
      name: oa.name || '',
      value: toDisplay(oa.value)
    })),
    loadingType: verificationDraft?.builderLoadingType || 'none',
    loadingPercent: verificationDraft?.builderLoadingPercent?.toString() || '',
    loadingArea: toDisplay(verificationDraft?.builderLoadingArea),
    sources: verificationDraft?.builderAreaSources || [] as string[],
    reference: verificationDraft?.builderAreaReference || ''
  });

  // Migrating old fields to otherAreas if needed on first load
  useEffect(() => {
    if (!verificationDraft?.builderOtherAreas && (verificationDraft?.builderBalconyArea || verificationDraft?.builderOtherAreaValue)) {
      const migrated: { type: any, name: string, value: string }[] = [];
      
      if (verificationDraft.builderBalconyArea) {
        migrated.push({
          type: 'Balcony',
          name: '',
          value: toDisplay(verificationDraft.builderBalconyArea)
        });
      }
      
      if (verificationDraft.builderOtherAreaValue) {
        migrated.push({
          type: 'Other',
          name: verificationDraft.builderOtherAreaName || '',
          value: toDisplay(verificationDraft.builderOtherAreaValue)
        });
      }

      if (migrated.length > 0) {
        setFormData(prev => ({
          ...prev,
          otherAreas: [...prev.otherAreas, ...migrated]
        }));
      }
    }
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const unitSuffix = isMetric ? 'sq m' : 'sq ft';

  // Sync with verificationDraft
  useEffect(() => {
    // Helper to convert local display value to draft value (always sqft)
    const toSqFt = (val: string): number | undefined => {
      const num = parseFloat(val);
      if (isNaN(num)) return undefined;
      if (isMetric) {
        return DimensionParser.squareMetersToSquareFeet(num);
      }
      return num;
    };

    setVerificationDraft({
      ...verificationDraft,
      builderCarpetArea: toSqFt(formData.carpetArea),
      builderBuiltUpArea: toSqFt(formData.builtUpArea),
      builderSuperBuiltUpArea: toSqFt(formData.superBuiltUpArea),
      builderOtherAreas: formData.otherAreas
        .filter(oa => oa.value && !isNaN(parseFloat(oa.value)))
        .map(oa => ({
          type: oa.type as any,
          name: oa.type === 'Other' ? oa.name : undefined,
          value: toSqFt(oa.value) || 0
        })),
      builderLoadingType: formData.loadingType as any,
      builderLoadingPercent: formData.loadingType === 'percentage' && formData.loadingPercent ? parseFloat(formData.loadingPercent) : undefined,
      builderLoadingArea: formData.loadingType === 'fixed' ? toSqFt(formData.loadingArea) : undefined,
      builderAreaSources: formData.sources,
      builderAreaReference: formData.reference
    });
  }, [formData, isMetric]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    const carpet = parseFloat(formData.carpetArea);
    const builtUp = parseFloat(formData.builtUpArea);
    const superBuiltUp = parseFloat(formData.superBuiltUpArea);
    const hasOtherArea = formData.otherAreas.some(oa => parseFloat(oa.value) > 0);

    const hasOneArea = (carpet > 0) || (builtUp > 0) || (superBuiltUp > 0) || hasOtherArea;

    if (!hasOneArea) {
      newErrors.general = 'Enter at least one area.';
    }

    if (formData.loadingType === 'percentage' && formData.loadingPercent) {
      const loading = parseFloat(formData.loadingPercent);
      if (isNaN(loading) || loading < 0 || loading > 100) {
        newErrors.loadingPercent = 'Loading must be between 0 and 100%';
      }
    }

    if (formData.loadingType === 'fixed' && formData.loadingArea) {
      const loadingArea = parseFloat(formData.loadingArea);
      if (isNaN(loadingArea) || loadingArea < 0) {
        newErrors.loadingArea = 'Invalid loading area';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onContinue();
    }
  };

  const addOtherArea = () => {
    setFormData(prev => ({
      ...prev,
      otherAreas: [...prev.otherAreas, { type: 'Balcony' as const, name: '', value: '' }]
    }));
  };

  const removeOtherArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      otherAreas: prev.otherAreas.filter((_, i) => i !== index)
    }));
  };

  const updateOtherArea = (index: number, updates: Partial<{ type: any, name: string, value: string }>) => {
    setFormData(prev => ({
      ...prev,
      otherAreas: prev.otherAreas.map((oa, i) => i === index ? { ...oa, ...updates } : oa)
    }));
  };

  const toggleSource = (source: string) => {
    setFormData(prev => {
      const sources = prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source];
      return { ...prev, sources };
    });
  };

  // Helper component for dual display
  const DualEquivalent = ({ value }: { value: string }) => {
    if (preferredUnit !== 'hybrid' || !value || isNaN(parseFloat(value))) return null;
    const num = parseFloat(value);
    const converted = DimensionParser.squareFeetToSquareMeters(num);
    return (
      <div className="mt-1.5 px-3 py-1 bg-slate-50 rounded-lg inline-block border border-slate-100">
        <span className="text-[10px] font-black text-[#64748B] uppercase tracking-wider">Equivalent: </span>
        <span className="text-[10px] font-black text-blue-600 uppercase">{converted.toFixed(2)} sq m</span>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 sm:px-0">
      {/* Navigation & Progress */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors mb-6 group cursor-pointer"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-tight">Back</span>
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2457D6] bg-blue-50 px-2 py-0.5 rounded-full">Step 2 of 5</span>
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-2/5 h-full bg-[#2457D6] rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">Builder's Area</h1>
        </div>
      </div>

      {/* Main Heading */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#172033]">Builder's Area</h2>
        <p className="text-sm text-[#697386] mt-1 leading-relaxed">
          Enter the area details shown in the builder's documents.
        </p>
        <p className="text-sm text-[#2457D6] font-bold mt-2">
          Enter at least one area.
        </p>
      </div>

      <div className="space-y-8">
        {/* Unit Display Info */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <span className="text-xs font-bold text-[#64748B]">Preferred Area Unit</span>
          <span className="text-sm font-black text-[#172033] uppercase">
            {preferredUnit === 'hybrid' ? 'Sq. Ft. / Sq. Meters' : preferredUnit === 'metric' ? 'Sq. Meters' : 'Sq. Ft.'}
          </span>
        </div>

        {errors.general && (
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-700 text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Carpet Area */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">Carpet Area</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="e.g. 1250"
                value={formData.carpetArea}
                onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
                className="w-full h-14 px-4 pr-16 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 text-[10px] font-black uppercase">
                {unitSuffix}
              </div>
            </div>
            <DualEquivalent value={formData.carpetArea} />
            <p className="text-[11px] text-[#64748B] font-medium italic mt-1">Enter the carpet area stated in the documents.</p>
          </div>

          {/* Built-up Area */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">Built-Up Area</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="e.g. 1450"
                value={formData.builtUpArea}
                onChange={(e) => setFormData({ ...formData, builtUpArea: e.target.value })}
                className="w-full h-14 px-4 pr-16 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 text-[10px] font-black uppercase">
                {unitSuffix}
              </div>
            </div>
            <DualEquivalent value={formData.builtUpArea} />
            <p className="text-[11px] text-[#64748B] font-medium italic mt-1">Enter this only if provided.</p>
          </div>

          {/* Super Built-up Area */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">Super Built-Up Area</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="e.g. 1800"
                value={formData.superBuiltUpArea}
                onChange={(e) => setFormData({ ...formData, superBuiltUpArea: e.target.value })}
                className="w-full h-14 px-4 pr-16 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 text-[10px] font-black uppercase">
                {unitSuffix}
              </div>
            </div>
            <DualEquivalent value={formData.superBuiltUpArea} />
            <p className="text-[11px] text-[#64748B] font-medium italic mt-1">Often shown as saleable or chargeable area.</p>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Other Areas Section */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-[#172033] uppercase tracking-wider">Other Areas</h3>
              <p className="text-[11px] text-[#64748B] font-medium italic">Add only if shown separately in the builder's documents.</p>
            </div>

            <div className="space-y-4">
              {formData.otherAreas.map((area, index) => (
                <div key={index} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 relative group animate-in fade-in slide-in-from-top-2 duration-300">
                  <button 
                    onClick={() => removeOtherArea(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-[#64748B] uppercase tracking-wider">Area Type</label>
                      <div className="relative">
                        <select 
                          value={area.type}
                          onChange={(e) => updateOtherArea(index, { type: e.target.value as any })}
                          className="w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-sm font-medium outline-none appearance-none focus:ring-2 focus:ring-[#2457D6] transition-all"
                        >
                          <option value="Balcony">Balcony</option>
                          <option value="Utility">Utility</option>
                          <option value="Terrace">Terrace</option>
                          <option value="Private Garden">Private Garden</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-[#64748B] uppercase tracking-wider">Area ({unitSuffix})</label>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={area.value}
                        onChange={(e) => updateOtherArea(index, { value: e.target.value })}
                        className="w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#2457D6] transition-all"
                      />
                    </div>

                    {area.type === 'Other' && (
                      <div className="sm:col-span-2 space-y-2">
                        <label className="block text-[10px] font-black text-[#64748B] uppercase tracking-wider">Area Name</label>
                        <input 
                          type="text" 
                          placeholder="Enter area name"
                          value={area.name}
                          onChange={(e) => updateOtherArea(index, { name: e.target.value })}
                          className="w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#2457D6] transition-all"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <DualEquivalent value={area.value} />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addOtherArea}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-[#2457D6] hover:border-[#2457D6] hover:bg-blue-50/50 transition-all text-sm font-bold group"
              >
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#2457D6] group-hover:text-white transition-all">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span>Add Another Area</span>
              </button>
            </div>
          </div>

          {/* Loading / Common Area */}
          <div className="space-y-6">
            <div className="h-px bg-slate-100 my-2" />
            
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[#172033] uppercase tracking-wider">Loading / Common Area</h3>
                <p className="text-sm text-[#172033] font-bold">Is loading mentioned in the builder's documents?</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'No' },
                  { id: 'percentage', label: 'Percentage' },
                  { id: 'fixed', label: 'Fixed Area' }
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, loadingType: option.id as any })}
                    className={`h-12 rounded-xl text-xs font-bold transition-all border ${
                      formData.loadingType === option.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-white border-slate-200 text-[#64748B] hover:border-blue-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {formData.loadingType === 'percentage' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-black text-[#64748B] uppercase tracking-wider">Loading Percentage</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="e.g. 30"
                      value={formData.loadingPercent}
                      onChange={(e) => setFormData({ ...formData, loadingPercent: e.target.value })}
                      className={`w-full h-14 px-4 pr-10 bg-white border ${errors.loadingPercent ? 'border-red-500' : 'border-[#E2E8F0]'} rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                      %
                    </div>
                  </div>
                  {errors.loadingPercent && <p className="text-[10px] font-bold text-red-600">{errors.loadingPercent}</p>}
                </div>
              )}

              {formData.loadingType === 'fixed' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-black text-[#64748B] uppercase tracking-wider">Loading Area ({unitSuffix})</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="e.g. 450"
                      value={formData.loadingArea}
                      onChange={(e) => setFormData({ ...formData, loadingArea: e.target.value })}
                      className={`w-full h-14 px-4 pr-16 bg-white border ${errors.loadingArea ? 'border-red-500' : 'border-[#E2E8F0]'} rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 text-[10px] font-black uppercase">
                      {unitSuffix}
                    </div>
                  </div>
                  {errors.loadingArea && <p className="text-[10px] font-bold text-red-600">{errors.loadingArea}</p>}
                  <DualEquivalent value={formData.loadingArea} />
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Information Sources */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-[#172033]">Source of Area</label>
            <div className="flex flex-wrap gap-2">
              {INFORMATION_SOURCES.map(source => (
                <button
                  key={source}
                  type="button"
                  onClick={() => toggleSource(source)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    formData.sources.includes(source)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-[#64748B] hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {formData.sources.includes(source) && <Check className="w-3.5 h-3.5" />}
                    <span>{source}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Document Reference */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">Document / Reference Note <span className="text-slate-400 font-normal">(Optional)</span></label>
            <div className="relative">
              <div className="absolute top-4 left-4 text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <textarea 
                placeholder="e.g. Cost sheet dated 15 Sep 2026"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full h-24 pl-11 pr-4 py-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2457D6] flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <p className="text-xs text-blue-800 font-medium leading-relaxed">
            Enter the figures exactly as stated. Flatverify will compare these with your measurements in a later step.
          </p>
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
