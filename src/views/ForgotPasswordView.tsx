import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  ArrowRight 
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { motion } from 'motion/react';

interface ForgotPasswordViewProps {
  onBack: () => void;
  onSignIn: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ 
  onBack, 
  onSignIn 
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validation Logic
    if (!email) {
      setError('Enter your email address.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    // 2. Simulated Backend Request (UI Only)
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      console.log('Simulated password reset link sent to:', email);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center p-6 sm:p-8">
        <div className="max-w-md w-full flex flex-col h-full items-center justify-center pt-20">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8"
          >
            <div className="w-12 h-12 bg-[#2457D6] rounded-full flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-3"
          >
            <h1 className="text-[28px] font-extrabold text-[#172033]">Check your email</h1>
            <p className="text-[16px] text-[#697386] leading-relaxed max-w-[320px] mx-auto">
              We've sent password reset instructions to <span className="font-bold text-[#172033]">{email}</span>.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 w-full space-y-4"
          >
            <button
              onClick={onSignIn}
              className="w-full h-[60px] bg-[#2457D6] text-white font-bold text-[18px] rounded-[20px] shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all"
            >
              Back to Sign In
            </button>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full text-[#697386] text-[15px] font-medium hover:text-[#172033] transition-colors"
            >
              Didn't receive the email? Try again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center p-6 sm:p-8 overflow-y-auto">
      <div className="max-w-md w-full flex flex-col h-full">
        
        {/* Top Section */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 pt-2">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-white/50 rounded-full transition-colors cursor-pointer"
            aria-label="Back to Sign In"
          >
            <ArrowLeft className="w-6 h-6 text-[#172033]" />
          </button>
          
          <BrandLogo size="lg" />
          <div className="w-10" /> {/* Spacer to balance the layout */}
        </div>

        {/* Heading Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#172033] leading-tight mb-2">
            Forgot your password?
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#697386] font-medium">
            Enter your registered email address and we'll help you reset your password.
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className={`text-[14px] font-bold ml-1 transition-colors ${error ? 'text-red-500' : 'text-[#172033]'}`}>
              Email Address
            </label>
            <motion.div 
              animate={error ? { x: [-2, 2, -2, 2, 0] } : {}}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative group"
            >
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400' : 'text-[#697386] group-focus-within:text-[#2457D6]'}`}>
                <Mail size={20} />
              </div>
              <input 
                type="email"
                placeholder="name@email.com"
                value={email}
                disabled={isLoading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full h-[58px] border rounded-[18px] pl-12 pr-4 font-medium outline-none transition-all placeholder:text-[#697386]/50 disabled:opacity-70 ${
                  error 
                    ? 'bg-red-50/50 border-red-400 text-red-900 focus-visible:ring-4 focus-visible:ring-red-500/10 focus-visible:border-red-500' 
                    : 'bg-white border-slate-200 text-[#172033] focus-visible:ring-4 focus-visible:ring-[#2457D6]/10 focus-visible:border-[#2457D6]'
                }`}
              />
            </motion.div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-[13px] font-medium mt-1 ml-1"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Reset Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[60px] bg-[#2457D6] hover:bg-[#1D47B0] disabled:bg-[#2457D6]/70 text-white font-bold text-[19px] rounded-[20px] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-between px-8 cursor-pointer"
            >
              <div className="w-5" />
              <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6 stroke-[3px]" />
              )}
            </button>
          </div>

          {/* Back to Sign In Link */}
          <div className="flex items-center justify-center gap-1.5 pt-4 pb-10">
            <span className="text-[#697386] text-[16px]">Remember your password?</span>
            <button
              type="button"
              onClick={onSignIn}
              className="text-[#2457D6] font-bold text-[16px] hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </motion.form>

      </div>
    </div>
  );
};
