import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  X
} from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { BrandLogo } from '../components/BrandLogo';
import { useSession } from '../context/SessionContext';
import { motion } from 'motion/react';

interface SignInViewProps {
  onBack: () => void;
  onCreateAccount: () => void;
  onForgotPassword?: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ 
  onBack, 
  onCreateAccount,
  onForgotPassword = () => console.log('Forgot password clicked')
}) => {
  const { signInWithGoogle } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [recentEmails, setRecentEmails] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Load recent emails on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('flatverify_recent_emails');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentEmails(parsed);
          setFormData(prev => ({ ...prev, email: parsed[0] }));
        }
      }
    } catch (e) {
      console.error('Error loading recent emails', e);
    }
  }, []);

  // Handle clicks outside suggestions to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveEmailLocally = (email: string) => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const currentEmails = [...recentEmails];
      
      // Remove existing if any (case-insensitive)
      const filtered = currentEmails.filter(e => e.toLowerCase().trim() !== normalizedEmail);
      
      // Add to front
      filtered.unshift(normalizedEmail);
      
      // Keep max 3
      const updated = filtered.slice(0, 3);
      
      localStorage.setItem('flatverify_recent_emails', JSON.stringify(updated));
      setRecentEmails(updated);
    } catch (e) {
      console.error('Error saving email locally', e);
    }
  };

  const removeEmailLocally = (e: React.MouseEvent, emailToRemove: string) => {
    e.stopPropagation(); // Prevent selecting the email
    try {
      const updated = recentEmails.filter(email => email !== emailToRemove);
      localStorage.setItem('flatverify_recent_emails', JSON.stringify(updated));
      setRecentEmails(updated);
      
      // If current email matches removed, clear it
      if (formData.email === emailToRemove) {
        setFormData(prev => ({ ...prev, email: '' }));
      }
    } catch (err) {
      console.error('Error removing email locally', err);
    }
  };

  // Validation UI state
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', general: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      saveEmailLocally(formData.email);
      console.log('Signed in successfully');
    } catch (error: any) {
      console.error('Firebase Auth Error:', error);
      let message = 'An error occurred during sign in.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      } else {
        message = `Sign in failed: ${error.code || error.message}`;
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
            aria-label="Back"
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
            Welcome back
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#697386] font-medium">
            Sign in to access your property audits and reports.
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

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#172033] ml-1">Email Address</label>
            <div className="relative group" ref={suggestionsRef}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697386] group-focus-within:text-[#2457D6] transition-colors pointer-events-none z-10">
                <Mail size={20} />
              </div>
              <input 
                type="email"
                placeholder="name@email.com"
                value={formData.email}
                disabled={isLoading || isGoogleLoading}
                onFocus={() => recentEmails.length > 0 && setShowSuggestions(true)}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  if (showSuggestions) setShowSuggestions(false);
                }}
                className="w-full h-[58px] bg-white border border-slate-200 rounded-[18px] pl-12 pr-4 text-[#172033] font-medium outline-none focus-visible:ring-4 focus-visible:ring-[#2457D6]/10 focus-visible:border-[#2457D6] transition-all placeholder:text-[#697386]/50 disabled:opacity-70"
              />
              
              {/* Recent Email Suggestions Dropdown */}
              {showSuggestions && recentEmails.length > 0 && (
                <div className="absolute left-0 right-0 top-[64px] bg-white border border-slate-100 rounded-[18px] shadow-xl z-50 overflow-hidden py-1">
                  {recentEmails.map((email, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, email }));
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group/item"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-[#172033]">{email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => removeEmailLocally(e, email)}
                        className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                        aria-label="Remove remembered email"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

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
            
            {/* Forgot Password */}
            <div className="flex justify-end pt-1">
              <button 
                type="button"
                onClick={onForgotPassword}
                disabled={isLoading || isGoogleLoading}
                className="text-[#2457D6] text-[14px] font-semibold hover:underline cursor-pointer disabled:opacity-50"
              >
                Forgot Password?
              </button>
            </div>
            
            {errors.password && <p className="text-red-500 text-[11px] mt-1 ml-1 font-bold">{errors.password}</p>}
          </div>

          {/* Sign In Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-[60px] bg-[#2457D6] hover:bg-[#1D47B0] disabled:bg-[#2457D6]/70 text-white font-bold text-[20px] rounded-[20px] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center px-8 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="w-5" />
                  <span>Sign In</span>
                  <ArrowRight className="w-6 h-6 stroke-[3px]" />
                </div>
              )}
            </button>
          </div>

          {/* Create Account Link */}
          <div className="flex items-center justify-center gap-1.5 pt-4 pb-10">
            <span className="text-[#697386] text-[16px]">Don't have an account?</span>
            <button
              type="button"
              onClick={onCreateAccount}
              disabled={isLoading || isGoogleLoading}
              className="text-[#2457D6] font-bold text-[16px] hover:underline cursor-pointer disabled:opacity-50"
            >
              Create Account
            </button>
          </div>
        </motion.form>

      </div>
    </div>
  );
};
