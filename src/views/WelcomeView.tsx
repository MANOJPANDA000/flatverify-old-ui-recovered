import React from 'react';
import { 
  ArrowRight
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { PropertyIllustration } from '../components/PropertyIllustration';
import { motion } from 'motion/react';

interface WelcomeViewProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ 
  onGetStarted, 
  onSignIn
}) => {
  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col items-center overflow-x-hidden p-6 sm:p-8 lg:p-12">
      <div className="max-w-md w-full flex flex-col flex-1">
        
        {/* 1. Branding - Horizontal Block */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-start items-center mb-10 sm:mb-12"
        >
          <BrandLogo size="2xl" />
        </motion.div>

        <div className="flex-1 flex flex-col justify-between">
          {/* 2. Headline & Description Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-5 px-1"
          >
            <h1 className="text-[32px] sm:text-[36px] font-black text-[#172033] leading-[1.1] tracking-tight">
              Know the area you're<br />actually getting.
            </h1>
            
            <p className="text-[17px] sm:text-[18px] text-[#697386] font-medium leading-[1.4] max-w-[340px] mx-auto">
              Measure, verify and understand your<br className="hidden sm:block" /> property area before you make a decision.
            </p>

            <div className="pt-2">
              <span className="text-[22px] sm:text-[24px] font-bold text-[#2457D6] tracking-tight">
                Know • Compare • Decide
              </span>
            </div>
          </motion.div>

          {/* 3. Main Property Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 min-h-[300px] sm:min-h-[360px] relative flex items-center justify-center my-4"
          >
            <PropertyIllustration />
          </motion.div>

          {/* 4. Action Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 pb-6"
          >
            <button
              onClick={onGetStarted}
              className="w-full h-[62px] sm:h-[68px] bg-[#2457D6] hover:bg-[#1D47B0] text-white font-bold text-[20px] sm:text-[22px] rounded-[20px] shadow-xl shadow-blue-600/25 transition-all active:scale-[0.98] flex items-center justify-between px-8 cursor-pointer"
            >
              <div className="w-6" /> {/* Spacer for centering text */}
              <span>Get Started</span>
              <ArrowRight className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center gap-1.5 pt-1">
              <span className="text-[#697386] text-[16px]">Already have an account?</span>
              <button
                onClick={onSignIn}
                className="text-[#2457D6] font-bold text-[18px] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
