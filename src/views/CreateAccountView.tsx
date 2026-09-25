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
import { useSession } from '../context/SessionContext';
import { motion } from 'motion/react';

interface CreateAccountViewProps {
  onBack: () => void;
  onSignIn: () => void;
}

export const CreateAccountView: React.FC<CreateAccountViewProps> = ({ 
  onBack, 
  onSignIn 
}) => {
  const { signInWithGoogle } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
    if (isLoading || isGoogleLoading) return;

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

  const handleGoogleSignIn = async () => {
    if (isLoading || isGoogleLoading) return;
    
    setIsGoogleLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));
    
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.message !== 'Sign-in cancelled.') {
        console.error('Google Sign In Error:', error);
        setErrors(prev => ({ ...prev, general: error.message || 'Google sign-in failed.' }));
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center p-6 sm:p-8 overflow-y-auto">
      <div className="max-w-md w-full flex flex-col h-full">
        
        {/* Top Section */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 pt-2">
          <button 
            onClick={onBack}
            disabled={isLoading || isGoogleLoading}
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

        {/* Google Sign In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            className="w-full h-[58px] bg-white border border-slate-200 rounded-[18px] flex items-center justify-center gap-3 px-6 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm disabled:opacity-70 cursor-pointer"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c1.73-1.58 2.72-3.9 2.72-6.62z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span className="text-[#172033] font-bold text-[16px]">
              {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
            </span>
          </button>
        </motion.div>

        {/* Separator */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-slate-200" />
          <span className="text-[12px] font-black text-[#697386] uppercase tracking-widest">or</span>
          <div className="flex-1 h-[1px] bg-slate-200" />
        </div>

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
                disabled={isLoading || isGoogleLoading}
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
                disabled={isLoading || isGoogleLoading}
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
                disabled={isLoading || isGoogleLoading}
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
                disabled={isLoading || isGoogleLoading}
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
              disabled={isLoading || isGoogleLoading}
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
              disabled={isLoading || isGoogleLoading}
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
