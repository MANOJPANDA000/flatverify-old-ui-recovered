import React, { useState } from 'react';
import {
  ShieldCheck,
  Sliders,
  Database,
  Trash2,
  LogOut,
  Fingerprint,
} from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { AreaUnitControl } from '../components/AreaUnitControl';
import { BiometricDialog } from '../components/BiometricDialog';

export const AccountSettingsView: React.FC = () => {
  const {
    user,
    logout,
    displayUnit,
    setDisplayUnit,
    defaultInternalWallPercent,
    setDefaultInternalWallPercent,
    defaultLoadingPercent,
    setDefaultLoadingPercent,
    clearAllData,
    audits,
    biometricEnabled,
    setBiometricEnabled,
  } = useSession();

  const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);

  const handleClearData = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete all saved audits and floor plan records from your account? This cannot be undone.'
      )
    ) {
      await clearAllData();
      alert('All your audit records have been cleared.');
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
    }
  };

  const handleToggleBiometric = () => {
    if (biometricEnabled) {
      setIsDisableDialogOpen(true);
    } else {
      setIsEnrollmentDialogOpen(true);
    }
  };

  const handleConfirmEnable = () => {
    setBiometricEnabled(true);
    setIsEnrollmentDialogOpen(false);
  };

  const handleConfirmDisable = () => {
    setBiometricEnabled(false);
    setIsDisableDialogOpen(false);
  };

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8 pb-16 px-4 sm:px-0">
      {/* Biometric Enrollment Dialog */}
      <BiometricDialog
        isOpen={isEnrollmentDialogOpen}
        onClose={() => setIsEnrollmentDialogOpen(false)}
        onVerify={handleConfirmEnable}
        isEnrollment={true}
        title="Enable Biometric Unlock"
        description="Use your fingerprint or device biometrics to unlock Flatverify faster on this device. Your account will continue to use Firebase authentication."
        confirmLabel="Enable"
      />

      {/* Biometric Disable Confirmation */}
      {isDisableDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
              <Fingerprint className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-[#172033]">Disable Biometric?</h3>
              <p className="text-sm text-[#64748B] font-medium leading-relaxed">
                You'll use your normal account access instead. This won't sign you out.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleConfirmDisable}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] cursor-pointer"
              >
                Disable
              </button>
              <button
                onClick={() => setIsDisableDialogOpen(false)}
                className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-[#64748B] font-bold rounded-2xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
          Settings & Account
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Configure default measurement units, audit calculation assumptions, and manage your account.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 font-black text-xl shadow-md shadow-blue-500/20">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold text-[#0F172A] truncate">
                {user.displayName}
              </h2>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800`}
              >
                Account Active
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">
              {user.email}
            </p>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 bg-[#F1F5F9] hover:bg-red-50 text-[#64748B] hover:text-red-700 text-xs font-bold rounded-xl border border-[#E2E8F0] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-6">
        <h2 className="text-base font-bold text-[#0F172A] pb-3 border-b border-[#F1F5F9] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Security & Privacy</span>
        </h2>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Fingerprint className="w-5 h-5 text-[#2457D6]" />
            </div>
            <div className="pr-4">
              <label className="block text-sm font-bold text-[#0F172A]">
                Biometric Unlock
              </label>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Use your device biometrics to securely unlock Flatverify.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleBiometric}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2457D6] focus:ring-offset-2 ${
              biometricEnabled ? 'bg-[#2457D6]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                biometricEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        
        <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
          <p className="text-[11px] text-blue-800 leading-relaxed">
            <strong>Device Specific:</strong> This setting applies only to this device. You will still need your account password to sign in on new devices.
          </p>
        </div>
      </div>

      {/* Preferences & Defaults */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-6">
        <h2 className="text-base font-bold text-[#0F172A] pb-3 border-b border-[#F1F5F9] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Audit & Calculation Preferences</span>
        </h2>

        {/* Default Unit Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-sm font-bold text-[#0F172A]">
              Default Display Unit
            </label>
            <p className="text-xs text-[#64748B]">
              Preferred unit for showing areas on screen and exported PDFs
            </p>
          </div>

          <AreaUnitControl
            value={displayUnit}
            onChanged={setDisplayUnit}
            size="md"
          />
        </div>

        <hr className="border-[#F1F5F9]" />

        {/* Default Internal Wall Assumption */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
            <span>Default Internal Wall Thickness</span>
            <span className="text-blue-700 font-extrabold">{defaultInternalWallPercent}%</span>
          </div>
          <p className="text-xs text-[#64748B]">
            Applied automatically to convert usable room areas to Built-up Area.
          </p>
          <input
            type="range"
            min="5"
            max="20"
            step="0.5"
            value={defaultInternalWallPercent}
            onChange={e => setDefaultInternalWallPercent(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#94A3B8]">
            <span>5%</span>
            <span>12% (Recommended)</span>
            <span>20%</span>
          </div>
        </div>

        <hr className="border-[#F1F5F9]" />

        {/* Default Loading Assumption */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
            <span>Default Developer Common Loading Factor</span>
            <span className="text-blue-700 font-extrabold">{defaultLoadingPercent}%</span>
          </div>
          <p className="text-xs text-[#64748B]">
            Estimated share of common areas (corridors, lifts, lobbies) in Super Built-up area.
          </p>
          <input
            type="range"
            min="15"
            max="50"
            step="1"
            value={defaultLoadingPercent}
            onChange={e => setDefaultLoadingPercent(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#94A3B8]">
            <span>15%</span>
            <span>30% (Standard Multi-Storey)</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* RERA Regulatory Compliance Reference Card */}
      <div className="bg-[#FFFDF7] rounded-3xl p-6 border border-[#FDE68A] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <span>RERA Section 2(k) Carpet Area Norms</span>
        </div>
        <p className="text-xs text-[#78350F] leading-relaxed">
          The Real Estate (Regulation and Development) Act mandates that developers market and sell properties strictly on <strong>Carpet Area</strong>.
          Balconies, private terraces, external walls, and common areas must be billed transparently and cannot be surreptitiously blended into usable carpet area.
        </p>
        <div className="text-xs text-[#92400E] font-medium pt-1">
          Flatverify.ai calculations adhere to the legal RERA carpet area computation model.
        </div>
      </div>

      {/* Data Management Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#0F172A] pb-3 border-b border-[#F1F5F9] flex items-center gap-2">
          <Database className="w-4 h-4 text-gray-500" />
          <span>Cloud Storage & Privacy</span>
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-[#0F172A]">
              Saved Account Audits ({audits.length} Records)
            </h3>
            <p className="text-xs text-[#64748B]">
              Your audits are securely stored in the cloud and accessible from any device.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearData}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Account Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
