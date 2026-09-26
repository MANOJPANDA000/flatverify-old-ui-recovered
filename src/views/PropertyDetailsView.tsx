import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  MapPin, 
  Layout, 
  Home, 
  Info,
  ChevronDown,
  X,
  Search
} from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { NavTab } from '../components/Header';
import { ReraPropertyType } from '../types';
import { INDIAN_STATES, INDIA_LOCATIONS } from '../data/indiaLocations';

interface PropertyDetailsViewProps {
  onBack: () => void;
  onContinue: () => void;
}

export const PropertyDetailsView: React.FC<PropertyDetailsViewProps> = ({ onBack, onContinue }) => {
  const { user, verificationDraft, setVerificationDraft, displayUnit } = useSession();

  // Local form state initialized from draft if it exists
  const [formData, setFormData] = useState({
    auditName: verificationDraft?.auditName || '',
    builder: verificationDraft?.builder || '',
    locality: (verificationDraft as any)?.locality || '',
    propertyType: (verificationDraft?.propertyType as string) || 'apartment',
    configuration: verificationDraft?.configuration || '2 BHK',
    flat: verificationDraft?.flat || '',
    floor: verificationDraft?.floor || '',
    city: verificationDraft?.city || '',
    state: verificationDraft?.state || '',
    preferredUnit: verificationDraft?.rawText || (displayUnit === 'metric' ? 'metric' : 'imperial') // Reusing rawText temporarily or just local state
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Suggestion History State
  const [propertyHistory, setPropertyHistory] = useState<string[]>([]);
  const [builderHistory, setBuilderHistory] = useState<string[]>([]);
  const [customCityHistory, setCustomCityHistory] = useState<Record<string, string[]>>({});
  const [localityHistory, setLocalityHistory] = useState<Record<string, string[]>>({});
  
  const [showPropSuggestions, setShowPropSuggestions] = useState(false);
  const [showBuilderSuggestions, setShowBuilderSuggestions] = useState(false);

  // Location State
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showLocalitySuggestions, setShowLocalitySuggestions] = useState(false);
  const [isOtherCity, setIsOtherCity] = useState(() => {
    if (!formData.city || !formData.state) return false;
    const cities = INDIA_LOCATIONS[formData.state] || [];
    return formData.city !== '' && !cities.includes(formData.city);
  });

  const propSuggestionsRef = useRef<HTMLDivElement>(null);
  const builderSuggestionsRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const localitySuggestionsRef = useRef<HTMLDivElement>(null);

  // Field Refs for focusing errors
  const auditNameRef = useRef<HTMLInputElement>(null);
  const propertyTypeRef = useRef<HTMLSelectElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const preferredUnitRef = useRef<HTMLDivElement>(null);

  // Helper for capitalization
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Load history from localStorage
  useEffect(() => {
    if (!user.uid) return;
    
    try {
      const pStored = localStorage.getItem(`flatverify_prop_history_${user.uid}`);
      if (pStored) setPropertyHistory(JSON.parse(pStored));
      
      const bStored = localStorage.getItem(`flatverify_builder_history_${user.uid}`);
      if (bStored) setBuilderHistory(JSON.parse(bStored));

      const cStored = localStorage.getItem(`flatverify_custom_cities_${user.uid}`);
      if (cStored) setCustomCityHistory(JSON.parse(cStored));

      const lStored = localStorage.getItem(`flatverify_localities_${user.uid}`);
      if (lStored) setLocalityHistory(JSON.parse(lStored));
    } catch (e) {
      console.error('Error loading history', e);
    }
  }, [user.uid]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (propSuggestionsRef.current && !propSuggestionsRef.current.contains(event.target as Node)) {
        setShowPropSuggestions(false);
      }
      if (builderSuggestionsRef.current && !builderSuggestionsRef.current.contains(event.target as Node)) {
        setShowBuilderSuggestions(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (localitySuggestionsRef.current && !localitySuggestionsRef.current.contains(event.target as Node)) {
        setShowLocalitySuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync city search query with form data
  useEffect(() => {
    if (!isOtherCity && formData.city) {
      setCitySearchQuery(formData.city);
    }
  }, [formData.city, isOtherCity]);

  const handleStateChange = (newState: string) => {
    // If State changes: CLEAR City and Locality always
    setFormData({ ...formData, state: newState, city: '', locality: '' });
    setCitySearchQuery('');
    setIsOtherCity(false);
    
    // Clear errors immediately
    const newErrors = { ...errors };
    delete newErrors.state;
    delete newErrors.city;
    setErrors(newErrors);
  };

  const handleCityChange = (newCity: string, isOther: boolean = false) => {
    // If City changes: CLEAR Locality
    setFormData({ ...formData, city: newCity, locality: '' });
    setIsOtherCity(isOther);
    if (!isOther) setCitySearchQuery(newCity);
    
    // Clear error immediately
    if (newCity.trim() || !isOther) {
      const newErrors = { ...errors };
      delete newErrors.city;
      setErrors(newErrors);
    }
  };

  const saveToHistory = () => {
    if (!user.uid) return;

    const updateHistoryList = (current: string[], newValue: string) => {
      const trimmed = newValue.trim();
      if (!trimmed) return current;
      
      const normalized = toTitleCase(trimmed);
      const searchVal = normalized.toLowerCase();
      
      const filtered = current.filter(item => item.toLowerCase() !== searchVal);
      return [normalized, ...filtered];
    };

    // 1. Property Name
    const newPropHistory = updateHistoryList(propertyHistory, formData.auditName);
    localStorage.setItem(`flatverify_prop_history_${user.uid}`, JSON.stringify(newPropHistory));
    setPropertyHistory(newPropHistory);

    // 2. Builder Name
    const newBuilderHistory = updateHistoryList(builderHistory, formData.builder);
    localStorage.setItem(`flatverify_builder_history_${user.uid}`, JSON.stringify(newBuilderHistory));
    setBuilderHistory(newBuilderHistory);

    // 3. Custom City (if "Other" was used)
    if (isOtherCity && formData.city.trim() && formData.state) {
      const stateKey = formData.state;
      const currentCustoms = customCityHistory[stateKey] || [];
      const updatedCustoms = updateHistoryList(currentCustoms, formData.city);
      const newCustomCityHistory = { ...customCityHistory, [stateKey]: updatedCustoms };
      localStorage.setItem(`flatverify_custom_cities_${user.uid}`, JSON.stringify(newCustomCityHistory));
      setCustomCityHistory(newCustomCityHistory);
    }

    // 4. Locality
    if (formData.locality.trim() && formData.state && formData.city) {
      const locKey = `${formData.state}_${formData.city}`;
      const currentLocs = localityHistory[locKey] || [];
      const updatedLocs = updateHistoryList(currentLocs, formData.locality);
      const newLocalityHistory = { ...localityHistory, [locKey]: updatedLocs };
      localStorage.setItem(`flatverify_localities_${user.uid}`, JSON.stringify(newLocalityHistory));
      setLocalityHistory(newLocalityHistory);
    }
  };

  const removeHistoryItem = (e: React.MouseEvent, type: 'prop' | 'builder' | 'city' | 'locality', item: string) => {
    e.stopPropagation();
    if (!user.uid) return;

    if (type === 'prop') {
      const updated = propertyHistory.filter(i => i !== item);
      localStorage.setItem(`flatverify_prop_history_${user.uid}`, JSON.stringify(updated));
      setPropertyHistory(updated);
    } else if (type === 'builder') {
      const updated = builderHistory.filter(i => i !== item);
      localStorage.setItem(`flatverify_builder_history_${user.uid}`, JSON.stringify(updated));
      setBuilderHistory(updated);
    } else if (type === 'city' && formData.state) {
      const current = customCityHistory[formData.state] || [];
      const updated = current.filter(i => i !== item);
      const newHistory = { ...customCityHistory, [formData.state]: updated };
      localStorage.setItem(`flatverify_custom_cities_${user.uid}`, JSON.stringify(newHistory));
      setCustomCityHistory(newHistory);
    } else if (type === 'locality' && formData.state && formData.city) {
      const locKey = `${formData.state}_${formData.city}`;
      const current = localityHistory[locKey] || [];
      const updated = current.filter(i => i !== item);
      const newHistory = { ...localityHistory, [locKey]: updated };
      localStorage.setItem(`flatverify_localities_${user.uid}`, JSON.stringify(newHistory));
      setLocalityHistory(newHistory);
    }
  };

  // Helper for searching/filtering
  const filterSuggestions = (list: string[], query: string) => {
    if (!query) return [...list].sort();
    const q = query.toLowerCase();
    
    return list
      .filter(item => item.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStart = a.toLowerCase().startsWith(q);
        const bStart = b.toLowerCase().startsWith(q);
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        return a.localeCompare(b);
      });
  };

  // Update draft in context whenever local state changes
  useEffect(() => {
    setVerificationDraft({
      ...verificationDraft,
      auditName: formData.auditName,
      project: formData.auditName,
      builder: formData.builder,
      locality: formData.locality,
      propertyType: formData.propertyType as ReraPropertyType,
      configuration: formData.configuration,
      flat: formData.flat,
      floor: formData.floor,
      city: formData.city,
      state: formData.state,
      rawText: formData.preferredUnit
    } as any);
  }, [formData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.auditName.trim()) {
      newErrors.auditName = 'Please enter property name';
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Please select property type';
    }
    if (!formData.state) {
      newErrors.state = 'Please select state';
    }
    if ((!formData.city && !isOtherCity) || (isOtherCity && !formData.city.trim())) {
      newErrors.city = 'Please select city';
    }
    if (!formData.preferredUnit) {
      newErrors.preferredUnit = 'Please select area unit';
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus the first error field
      if (newErrors.auditName) {
        auditNameRef.current?.focus();
        auditNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.propertyType) {
        propertyTypeRef.current?.focus();
        propertyTypeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.state) {
        stateRef.current?.focus();
        stateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.city) {
        cityRef.current?.focus();
        cityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.preferredUnit) {
        preferredUnitRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validate()) {
      saveToHistory();
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
          <span className="text-sm font-bold tracking-tight">Back</span>
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
        <p className="text-[11px] font-bold text-[#64748B] mt-4 uppercase tracking-wider">* Required fields</p>
      </div>

      <div className="space-y-6">
        {/* Property Name */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#172033]">Property / Project Name *</label>
          <div className="relative" ref={propSuggestionsRef}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              ref={auditNameRef}
              placeholder="e.g. Green Heights"
              value={formData.auditName}
              autoCapitalize="words"
              onFocus={() => setShowPropSuggestions(true)}
              onBlur={() => {
                if (formData.auditName.trim()) {
                  setFormData(prev => ({ ...prev, auditName: toTitleCase(prev.auditName) }));
                }
              }}
              onChange={(e) => {
                setFormData({ ...formData, auditName: e.target.value });
                if (errors.auditName) {
                  const next = { ...errors };
                  delete next.auditName;
                  setErrors(next);
                }
                if (!showPropSuggestions) setShowPropSuggestions(true);
              }}
              className={`w-full h-14 pl-11 pr-4 bg-white border ${errors.auditName ? 'border-red-500 bg-red-50' : 'border-[#E2E8F0]'} rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none`}
            />

            {/* Suggestions Dropdown */}
            {showPropSuggestions && propertyHistory.length > 0 && (
              <>
                {(() => {
                  const filtered = propertyHistory.filter(item => 
                    !formData.auditName || item.toLowerCase().includes(formData.auditName.toLowerCase())
                  );
                  if (filtered.length === 0) return null;
                  return (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                      {filtered.map((item, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, auditName: item }));
                            setShowPropSuggestions(false);
                          }}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                          <span className="text-sm font-medium text-[#172033]">{item}</span>
                          <button
                            type="button"
                            onClick={(e) => removeHistoryItem(e, 'prop', item)}
                            className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
          {errors.auditName && (
            <p className="text-xs font-bold text-red-600 mt-1">{errors.auditName}</p>
          )}
        </div>

        {/* Builder Name */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#172033]">Builder / Developer Name</label>
          <div className="relative" ref={builderSuggestionsRef}>
            <input 
              type="text" 
              placeholder="e.g. ABC Developers"
              value={formData.builder}
              autoCapitalize="words"
              onFocus={() => setShowBuilderSuggestions(true)}
              onBlur={() => {
                if (formData.builder.trim()) {
                  setFormData(prev => ({ ...prev, builder: toTitleCase(prev.builder) }));
                }
              }}
              onChange={(e) => {
                setFormData({ ...formData, builder: e.target.value });
                if (!showBuilderSuggestions) setShowBuilderSuggestions(true);
              }}
              className="w-full h-14 px-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none"
            />

            {/* Suggestions Dropdown */}
            {showBuilderSuggestions && builderHistory.length > 0 && (
              <>
                {(() => {
                  const filtered = builderHistory.filter(item => 
                    !formData.builder || item.toLowerCase().includes(formData.builder.toLowerCase())
                  );
                  if (filtered.length === 0) return null;
                  return (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                      {filtered.map((item, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, builder: item }));
                            setShowBuilderSuggestions(false);
                          }}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                          <span className="text-sm font-medium text-[#172033]">{item}</span>
                          <button
                            type="button"
                            onClick={(e) => removeHistoryItem(e, 'builder', item)}
                            className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>

        {/* Row: Property Type & Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">Property Type *</label>
            <div className="relative">
              <select 
                value={formData.propertyType}
                ref={propertyTypeRef}
                onChange={(e) => {
                  setFormData({ ...formData, propertyType: e.target.value });
                  if (errors.propertyType) {
                    const next = { ...errors };
                    delete next.propertyType;
                    setErrors(next);
                  }
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

        {/* Row: State & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">State *</label>
            <div className="relative">
              <select 
                value={formData.state}
                ref={stateRef}
                onChange={(e) => handleStateChange(e.target.value)}
                className={`w-full h-14 pl-4 pr-10 bg-white border ${errors.state ? 'border-red-500 bg-red-50' : 'border-[#E2E8F0]'} rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none appearance-none cursor-pointer`}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {errors.state && (
              <p className="text-xs font-bold text-red-600 mt-1">{errors.state}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#172033]">City *</label>
            {!isOtherCity ? (
              <div className="relative" ref={cityDropdownRef}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  ref={cityRef}
                  placeholder="Search or select city"
                  value={citySearchQuery}
                  disabled={!formData.state}
                  onFocus={() => formData.state && setShowCityDropdown(true)}
                  onChange={(e) => {
                    setCitySearchQuery(e.target.value);
                    if (!showCityDropdown) setShowCityDropdown(true);
                    if (errors.city) {
                      const next = { ...errors };
                      delete next.city;
                      setErrors(next);
                    }
                  }}
                  className={`w-full h-14 pl-11 pr-10 bg-white border ${errors.city ? 'border-red-500 bg-red-50' : 'border-[#E2E8F0]'} rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none disabled:opacity-50 disabled:bg-slate-50`}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>

                {/* Searchable Dropdown */}
                {showCityDropdown && formData.state && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1 max-h-60 overflow-y-auto">
                    {filterSuggestions([...(INDIA_LOCATIONS[formData.state] || []), ...(customCityHistory[formData.state] || [])], citySearchQuery)
                      .map((city, idx) => {
                        const isCustom = customCityHistory[formData.state]?.includes(city);
                        return (
                          <div 
                            key={idx}
                            onClick={() => {
                              handleCityChange(city, false);
                              setShowCityDropdown(false);
                            }}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                          >
                            <span className="text-sm font-medium text-[#172033]">{city}</span>
                            {isCustom && (
                              <button
                                type="button"
                                onClick={(e) => removeHistoryItem(e, 'city', city)}
                                className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    <div 
                      onClick={() => {
                        handleCityChange('', true);
                        setShowCityDropdown(false);
                        setCitySearchQuery('');
                      }}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer border-t border-slate-50"
                    >
                      <span className="text-sm font-bold text-[#2457D6]">Other (Manual Entry)</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <input 
                  type="text" 
                  ref={cityRef}
                  placeholder="Enter city"
                  value={formData.city}
                  autoCapitalize="words"
                  autoFocus
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value, locality: '' });
                    if (errors.city) {
                      const next = { ...errors };
                      delete next.city;
                      setErrors(next);
                    }
                  }}
                  className={`w-full h-14 px-4 pr-10 bg-white border ${errors.city ? 'border-red-500 bg-red-50' : 'border-[#E2E8F0]'} rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none`}
                />
                <button 
                  onClick={() => {
                    handleCityChange('', false);
                    setCitySearchQuery('');
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {errors.city && (
              <p className="text-xs font-bold text-red-600 mt-1">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Locality */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#172033]">Locality</label>
          <div className="relative" ref={localitySuggestionsRef}>
            <input 
              type="text" 
              placeholder="Enter or select locality"
              value={formData.locality}
              autoCapitalize="words"
              disabled={!formData.city}
              onFocus={() => formData.city && setShowLocalitySuggestions(true)}
              onChange={(e) => {
                setFormData({ ...formData, locality: e.target.value });
                if (formData.city && !showLocalitySuggestions) setShowLocalitySuggestions(true);
              }}
              className="w-full h-14 px-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all outline-none disabled:opacity-50 disabled:bg-slate-50"
            />

            {/* Locality Suggestions Dropdown */}
            {showLocalitySuggestions && formData.state && formData.city && (localityHistory[`${formData.state}_${formData.city}`] || []).length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1 max-h-60 overflow-y-auto">
                {filterSuggestions(localityHistory[`${formData.state}_${formData.city}`] || [], formData.locality)
                  .map((loc, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setFormData({ ...formData, locality: loc });
                        setShowLocalitySuggestions(false);
                      }}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <span className="text-sm font-medium text-[#172033]">{loc}</span>
                      <button
                        type="button"
                        onClick={(e) => removeHistoryItem(e, 'locality', loc)}
                        className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Area Unit Selector */}
        <div className="space-y-3" ref={preferredUnitRef}>
          <label className="block text-sm font-bold text-[#172033]">Preferred Area Unit *</label>
          <div className={`flex p-1 rounded-2xl transition-all ${errors.preferredUnit ? 'bg-red-50 border border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : 'bg-slate-100 border border-transparent'}`}>
            <button
              onClick={() => {
                setFormData({ ...formData, preferredUnit: 'imperial' });
                if (errors.preferredUnit) {
                  const next = { ...errors };
                  delete next.preferredUnit;
                  setErrors(next);
                }
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${formData.preferredUnit === 'imperial' ? 'bg-white text-[#2457D6] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              Sq. Ft.
            </button>
            <button
              onClick={() => {
                setFormData({ ...formData, preferredUnit: 'metric' });
                if (errors.preferredUnit) {
                  const next = { ...errors };
                  delete next.preferredUnit;
                  setErrors(next);
                }
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${formData.preferredUnit === 'metric' ? 'bg-white text-[#2457D6] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              Sq. Meters
            </button>
            <button
              onClick={() => {
                setFormData({ ...formData, preferredUnit: 'hybrid' });
                if (errors.preferredUnit) {
                  const next = { ...errors };
                  delete next.preferredUnit;
                  setErrors(next);
                }
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
