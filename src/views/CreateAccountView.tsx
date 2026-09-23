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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
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
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Validation UI state
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: '', email: '', password: '', confirmPassword: '', general: '' };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;

      // Update Firebase Auth Profile
      await updateProfile(user, {
        displayName: formData.fullName
      });

      // Mirror to Firestore for consistency with blueprint
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: formData.email,
        displayName: formData.fullName,
        createdAt: new Date().toISOString()
      });

      console.log('Account created successfully');
    } catch (error: any) {
      console.error('Firebase Auth Error:', error);
      let message = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'The password is too weak.';
      } else if (error.code === 'auth/operation-not-allowed') {
        message = 'Email/password accounts are not enabled. Please contact support.';
      } else {
        message = `Registration failed: ${error.code || error.message}`;
      }
      
      setErrors(prev => ({ ...prev, general: message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center p-6 sm:p-8 overflow-y-auto">
      <div className="max-w-md w-full flex flex-col h-full">
        
        {/* Top Section */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 pt-2">
          <button 
            onClick={onBack}
            disabled={isLoading}
            className="p-2 -ml-2 hover:bg-white/50 rounded-full transition-colors cursor-pointer disabled:opacity-50"
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
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-[18px] text-sm font-medium">
              {errors.general}
            </div>
          )}

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
                disabled={isLoading}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full h-[58px] bg-white border border-slate-200 rounded-[18px] pl-12 pr-4 text-[#172033] font-medium outline-none focus-visible:ring-4 focus-visible:ring-[#2457D6]/10 focus-visible:border-[#2457D6] transition-all placeholder:text-[#697386]/50 disabled:opacity-70"
              />
              {errors.fullName && <p className="text-red-500 text-[11px] mt-1 ml-1 font-bold">{errors.fullName}</p>}
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
                disabled={isLoading}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full h-[58px] bg-white border border-slate-200 rounded-[18px] pl-12 pr-4 text-[#172033] font-medium outline-none focus-visible:ring-4 focus-visible:ring-[#2457D6]/10 focus-visible:border-[#2457D6] transition-all placeholder:text-[#697386]/50 disabled:opacity-70"
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1 ml-1 font-bold">{errors.email}</p>}
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
                disabled={isLoading}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full h-[58px] bg-white border border-slate-200 rounded-[18px] pl-12 pr-12 text-[#172033] font-medium outline-none focus-visible:ring-4 focus-visible:ring-[#2457D6]/10 focus-visible:border-[#2457D6] transition-all placeholder:text-[#697386]/50 disabled:opacity-70"
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
            {!errors.password && <p className="text-[13px] text-[#697386] mt-1 ml-1 opacity-80">Use at least 8 characters.</p>}
            {errors.password && <p className="text-red-500 text-[11px] mt-1 ml-1 font-bold">{errors.password}</p>}
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
                disabled={isLoading}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full h-[58px] bg-white border border-slate-200 rounded-[18px] pl-12 pr-12 text-[#172033] font-medium outline-none focus-visible:ring-4 focus-visible:ring-[#2457D6]/10 focus-visible:border-[#2457D6] transition-all placeholder:text-[#697386]/50 disabled:opacity-70"
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
            {errors.confirmPassword && <p className="text-red-500 text-[11px] mt-1 ml-1 font-bold">{errors.confirmPassword}</p>}
          </div>

          {/* Create Account Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[60px] bg-[#2457D6] hover:bg-[#1D47B0] disabled:bg-[#2457D6]/70 text-white font-bold text-[18px] rounded-[20px] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center px-8 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="w-5" />
                  <span>Create Account</span>
                  <ArrowRight className="w-6 h-6 stroke-[3px]" />
                </div>
              )}
            </button>
          </div>

          {/* Existing Account Link */}
          <div className="flex items-center justify-center gap-1.5 pt-4 pb-10">
            <span className="text-[#697386] text-[16px]">Already have an account?</span>
            <button
              type="button"
              onClick={onSignIn}
              disabled={isLoading}
              className="text-[#2457D6] font-bold text-[16px] hover:underline cursor-pointer disabled:opacity-50"
            >
              Sign In
            </button>
          </div>
        </motion.form>

      </div>
    </div>
  );
};
