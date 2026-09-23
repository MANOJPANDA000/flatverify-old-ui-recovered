import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight 
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { motion } from 'motion/react';

interface CreateAccountViewProps {
  onBack: () => void;
  onSignIn: () => void;
}

export const CreateAccountView: React.FC<CreateAccountViewProps> = ({ 
  onBack, 
  onSignIn 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Simple Validation UI preparation (not full implementation)
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for validation UI would go here in the future
    console.log('Create account clicked', formData);
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center p-6 sm:p-8 overflow-y-auto">
      <div className="max-w-md w-full flex flex-col h-full">
        
        {/* Top Section */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 pt-2">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-white/50 rounded-full transition-colors cursor-pointer"
            aria-label="Back to Welcome"
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
            Create your account
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#697386] font-medium">
            Save your property audits and access them anytime.
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
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#172033] ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697386] group-focus-within:text-[#2457D6] transition-colors">
                <User size={20} />
              </div>
              <input 
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full h-[58px] bg-white border border-slate-200 rounded-[18px] pl-12 pr-4 text-[#172033] font-medium outline-none focus-visible:ring-4 focus-visible:ring-[#2457D6]/10 focus-visible:border-[#2457D6] transition-all placeholder:text-[#697386]/50"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName}</p>}
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#172033] ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697386] group-focus-within:text-[#2457D6] transition-colors">
                <Mail size={20} />
              </div>
              <input 
                type="email"
                placeholder="name@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full h-[58px] bg-white border border-slate-200 rounded-[18px] pl-12 pr-4 text-[#172033] font-medium outline-none focus-visible:ring-4 focus-visible:ring-[#2457D6]/10 focus-visible:border-[#2457D6] transition-all placeholder:text-[#697386]/50"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#172033] ml-1">Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697386] group-focus-within:text-[#2457D6] transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full h-[58px] bg-white border border-slate-200 rounded-[18px] pl-12 pr-12 text-[#172033] font-medium outline-none focus-visible:ring-4 focus-visible:ring-[#2457D6]/10 focus-visible:border-[#2457D6] transition-all placeholder:text-[#697386]/50"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697386] hover:text-[#2457D6] transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-[13px] text-[#697386] mt-1 ml-1 opacity-80">Use at least 8 characters.</p>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#172033] ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697386] group-focus-within:text-[#2457D6] transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full h-[58px] bg-white border border-slate-200 rounded-[18px] pl-12 pr-12 text-[#172033] font-medium outline-none focus-visible:ring-4 focus-visible:ring-[#2457D6]/10 focus-visible:border-[#2457D6] transition-all placeholder:text-[#697386]/50"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697386] hover:text-[#2457D6] transition-colors p-1"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
          </div>

          {/* Create Account Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-[60px] bg-[#2457D6] hover:bg-[#1D47B0] text-white font-bold text-[18px] rounded-[20px] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-between px-8 cursor-pointer"
            >
              <div className="w-5" />
              <span>Create Account</span>
              <ArrowRight className="w-6 h-6 stroke-[3px]" />
            </button>
          </div>

          {/* Existing Account Link */}
          <div className="flex items-center justify-center gap-1.5 pt-4 pb-10">
            <span className="text-[#697386] text-[16px]">Already have an account?</span>
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
