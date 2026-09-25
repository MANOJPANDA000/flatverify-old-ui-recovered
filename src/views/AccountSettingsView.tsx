import React, { useState } from 'react';
import {
  ShieldCheck,
  Sliders,
  Database,
  Trash2,
  LogOut,
  Fingerprint,
  Pencil,
  Check,
  X,
  UserCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession } from '../context/SessionContext';
import { AreaUnitControl } from '../components/AreaUnitControl';
import { BiometricDialog } from '../components/BiometricDialog';
import { UserAvatar } from '../components/UserAvatar';
import { BUILTIN_AVATARS } from '../data/avatars';

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
    setProfileAvatar,
  } = useSession();

  const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarView, setAvatarView] = useState<'menu' | 'grid'>('menu');
  const [pendingAvatarId, setPendingAvatarId] = useState<string | undefined>(user.avatarId);

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
    try {
      await logout();
    } catch (error) {
      console.error('AccountSettingsView: Logout failed', error);
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

  const handleOpenAvatarModal = () => {
    setAvatarView('menu');
    setPendingAvatarId(user.avatarId);
    setIsAvatarModalOpen(true);
  };

  const handleSaveAvatar = () => {
    setProfileAvatar(pendingAvatarId);
    setIsAvatarModalOpen(false);
  };

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8 pb-16 px-4 sm:px-0">
      {/* Avatar Selection Modal / Bottom Sheet */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-[2px]">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl flex flex-col"
            >
              {avatarView === 'menu' ? (
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#172033]">Change profile picture</h3>
                    <button 
                      onClick={() => setIsAvatarModalOpen(false)}
                      className="p-1 hover:bg-slate-50 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-[#64748B]" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="py-2">
                    {user.photoURL && (
                      <button 
                        onClick={() => {
                          setProfileAvatar(undefined);
                          setIsAvatarModalOpen(false);
                        }}
                        className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group text-left cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
                          <img src={user.photoURL} alt="Google" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm font-bold text-[#172033]">Use Google Photo</p>
                      </button>
                    )}

                    <button 
                      onClick={() => setAvatarView('grid')}
                      className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group text-left cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-sm font-bold text-[#172033]">Choose Avatar</p>
                    </button>

                    <button 
                      onClick={() => {
                        setProfileAvatar('initials');
                        setIsAvatarModalOpen(false);
                      }}
                      className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group text-left cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-sm">
                        {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <p className="text-sm font-bold text-[#172033]">Use Initials</p>
                    </button>
                  </div>

                  <div className="p-4 sm:hidden">
                    <button 
                      onClick={() => setIsAvatarModalOpen(false)}
                      className="w-full h-12 bg-slate-50 text-[#64748B] font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#172033]">Choose Avatar</h3>
                    <button 
                      onClick={() => setAvatarView('menu')}
                      className="p-1 hover:bg-slate-50 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-[#64748B]" />
                    </button>
                  </div>

                  {/* Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-4 gap-3">
                      {BUILTIN_AVATARS.map((avatar) => {
                        const Icon = avatar.icon;
                        const isSelected = pendingAvatarId === avatar.id;
                        return (
                          <button
                            key={avatar.id}
                            onClick={() => setPendingAvatarId(avatar.id)}
                            className={`relative aspect-square flex items-center justify-center rounded-2xl transition-all hover:scale-105 active:scale-95 group cursor-pointer ${
                              isSelected ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                            }`}
                            style={{ backgroundColor: avatar.color }}
                          >
                            <Icon className="w-5 h-5 text-white" />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button
                      onClick={handleSaveAvatar}
                      className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setAvatarView('menu')}
                      className="flex-1 h-12 bg-white border border-slate-200 hover:bg-slate-50 text-[#64748B] font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          <div className="relative group shrink-0">
            <UserAvatar 
              size="lg" 
              className="cursor-pointer hover:scale-105 active:scale-95" 
              avatarId={user.avatarId}
              displayName={user.displayName}
            />
            <button 
              onClick={handleOpenAvatarModal}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
            </button>
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
          <span>Your Data & Privacy</span>
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-[#0F172A]">
              Your Saved Checks
            </h3>
            {audits.length > 0 ? (
              <p className="text-xs text-[#64748B]">
                {audits.length} {audits.length === 1 ? 'saved property' : 'saved properties'}
              </p>
            ) : (
              <p className="text-xs text-[#64748B]">
                Your saved property checks will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
