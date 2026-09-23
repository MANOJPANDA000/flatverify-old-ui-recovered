import React, { useState } from 'react';
import { Fingerprint, Lock, ShieldCheck, UserCircle, AlertCircle } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { BrandLogo } from '../components/BrandLogo';
import { motion, AnimatePresence } from 'motion/react';
import { BiometricDialog } from '../components/BiometricDialog';

export const BiometricUnlockView: React.FC = () => {
  const { user, unlockApp, logout } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  const handleUnlockClick = () => {
    setError(null);
    setIsDialogOpen(true);
  };

  const handleVerifySuccess = () => {
    setIsDialogOpen(false);
    unlockApp();
  };

  const handleUseAnotherMethod = () => {
    setShowFallback(true);
  };

  const handleSignOutAndSwitch = async () => {
    if (window.confirm('This will sign you out of your current session. Continue?')) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center justify-center p-6 sm:p-8">
      {/* Biometric Simulation Dialog */}
      <BiometricDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onVerify={handleVerifySuccess}
        title="Unlock Flatverify"
        description="Verify your identity using device biometrics."
        confirmLabel="Verify Identity"
      />

      <div className="max-w-md w-full flex flex-col items-center text-center">
        
        {/* Branding */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <BrandLogo size="lg" />
        </motion.div>

        {/* Lock Icon Section */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center border border-slate-100">
            <Fingerprint className="w-12 h-12 text-[#2457D6]" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#172033] rounded-full border-4 border-[#F6F7FB] flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-white" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-2 mb-10"
        >
          <p className="text-[14px] font-bold text-[#697386] uppercase tracking-widest">Welcome Back</p>
          <h1 className="text-[28px] font-black text-[#172033]">Unlock Flatverify</h1>
          <p className="text-[15px] text-[#697386] font-medium leading-relaxed px-4">
            Use your fingerprint or device biometrics to securely access your property audits.
          </p>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full mb-6"
            >
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full space-y-4"
        >
          <button
            onClick={handleUnlockClick}
            className="w-full h-[64px] bg-[#2457D6] hover:bg-[#1D47B0] text-white font-bold text-[18px] rounded-[24px] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6" />
              <span>Unlock with Biometrics</span>
            </div>
          </button>

          <div className="relative pt-4">
            {!showFallback ? (
              <button
                onClick={handleUseAnotherMethod}
                className="text-[#697386] text-[15px] font-bold hover:text-[#172033] transition-colors cursor-pointer"
              >
                Use another method
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[24px] shadow-lg border border-slate-100 space-y-4 w-full"
              >
                <button
                  onClick={handleSignOutAndSwitch}
                  className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-[#172033] font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Sign in with password</span>
                </button>
                <button
                  onClick={() => setShowFallback(false)}
                  className="text-xs font-bold text-[#64748B] hover:text-[#172033] cursor-pointer"
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Prototype Disclaimer */}
        <div className="mt-16 text-[11px] text-[#94A3B8] font-medium max-w-[280px] leading-relaxed">
          Web Prototype: Biometric hardware integration simulated. 
          Real Fingerprint/Face ID available in Flutter native app.
        </div>

      </div>
    </div>
  );
};
