import React, { useState } from 'react';
import { Fingerprint, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BiometricDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  isEnrollment?: boolean;
}

export const BiometricDialog: React.FC<BiometricDialogProps> = ({
  isOpen,
  onClose,
  onVerify,
  title,
  description,
  confirmLabel,
  isEnrollment = false
}) => {
  const [step, setStep] = useState<'confirm' | 'verifying' | 'success'>('confirm');

  const handleConfirm = () => {
    setStep('verifying');
    // Simulate biometric delay
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onVerify();
        // Reset step for next time after a short delay
        setTimeout(() => setStep('confirm'), 500);
      }, 1000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <h3 className="text-lg font-extrabold text-[#172033]">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="p-8 flex flex-col items-center text-center">
            {step === 'confirm' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto">
                  <Fingerprint className="w-10 h-10 text-[#2457D6]" />
                </div>
                <p className="text-[#64748B] text-sm font-medium leading-relaxed">
                  {description}
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleConfirm}
                    className="w-full h-14 bg-[#2457D6] hover:bg-[#1D47B0] text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] cursor-pointer"
                  >
                    {confirmLabel}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-[#64748B] font-bold rounded-2xl transition-all cursor-pointer"
                  >
                    Not Now
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'verifying' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center relative z-10">
                    <Fingerprint className="w-12 h-12 text-[#2457D6] animate-pulse" />
                  </div>
                  <div className="absolute inset-0 border-4 border-blue-600/10 rounded-full animate-ping" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-[#172033]">Verify Identity</h4>
                  <p className="text-sm text-[#64748B] font-medium">Use your device biometric authentication.</p>
                </div>
                <div className="pt-4">
                  <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">Prototype Simulation</p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="py-8 space-y-6"
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-12 h-12 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-[#172033]">
                    {isEnrollment ? 'Successfully Enabled' : 'Identity Verified'}
                  </h4>
                  <p className="text-sm text-[#64748B] font-medium leading-relaxed">
                    {isEnrollment 
                      ? 'You can now use device biometrics to unlock Flatverify.' 
                      : 'Unlocking your property audits now...'}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Disclaimer */}
          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-medium">
              Native biometric authentication will be used in the Flutter mobile app.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
