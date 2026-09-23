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
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center overflow-x-hidden px-5 py-6 sm:p-8 lg:p-12">
      <div className="max-w-md w-full flex flex-col flex-1">
        
        {/* 1. Branding - Horizontal Block */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-start items-center mb-2 sm:mb-4"
        >
          <BrandLogo size="2xl" />
        </motion.div>

        <div className="flex-1 flex flex-col">
          {/* 2. Headline & Description Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-3 pt-0"
          >
            <h1 className="w-full flex flex-col items-center text-center text-[31px] sm:text-[40px] md:text-[42px] font-[800] text-[#172033] leading-[1.1] tracking-[-0.025em]">
              <span className="whitespace-nowrap">Know the area you're</span>
              <span className="whitespace-nowrap">actually getting.</span>
            </h1>
            
            <p className="text-[17px] sm:text-[20px] text-[#697386] font-medium leading-[1.45] max-w-[360px] sm:max-w-[420px] mx-auto opacity-80">
              Measure, verify and understand your<br className="hidden sm:block" /> property area before you make a decision.
            </p>

            <div className="mt-[-1%]">
              <span className="text-[22px] sm:text-[26px] font-bold text-[#2457D6] tracking-tight">
                Know • Compare • Decide
              </span>
            </div>
          </motion.div>

          {/* 3. Main Property Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="welcome-illustration-container flex-1 min-h-[380px] sm:min-h-[500px] relative flex items-center justify-center w-full"
          >
            <PropertyIllustration />
          </motion.div>

          {/* 4. Action Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 pb-8 px-4 mt-auto"
          >
            <button
              onClick={onGetStarted}
              className="w-full h-[62px] sm:h-[68px] bg-[#2457D6] hover:bg-[#1D47B0] text-white font-bold text-[20px] sm:text-[22px] rounded-[22px] sm:rounded-[24px] shadow-2xl shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-between px-10 cursor-pointer"
            >
              <div className="w-6" /> {/* Spacer for centering text */}
              <span>Get Started</span>
              <ArrowRight className="w-7 h-7 stroke-[3px]" />
            </button>

            <div className="flex flex-row items-center justify-center gap-1.5 pt-1">
              <span className="text-[#697386] text-[16px] sm:text-[17px]">Already have an account?</span>
              <button
                onClick={onSignIn}
                className="text-[#2457D6] font-bold text-[17px] sm:text-[18px] hover:underline cursor-pointer"
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
