import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import heroIllustration from '../assets/images/furnished_apartment_3d_hero_1790178368842.jpg';

export const PropertyIllustration: React.FC = () => {
  return (
    <div className="relative w-full flex flex-col items-center select-none pointer-events-none">
      {/* Main Illustration Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative w-full aspect-square flex items-center justify-center rounded-none shadow-none"
      >
        {/* Hero Image */}
        <img 
          src={heroIllustration} 
          alt="3D Property Area Illustration" 
          className="w-full h-full object-contain mix-blend-multiply opacity-95"
        />

        {/* Overlays: Badge & Checklist */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 120.5 m² Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute left-[5%] top-[60%] bg-[#2457D6] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-xl flex items-center gap-2 z-20"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                  <path d="M2 12V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
                  <path d="M6 5v4M10 5v2M14 5v4M18 5v2" />
                  <path d="M2 12c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5" />
               </svg>
            </div>
            <span className="font-bold text-[15px] sm:text-[18px] tracking-tight">120.5 m²</span>
          </motion.div>

          {/* Floating Verification Checklist Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute right-[2%] top-[44%] bg-white/25 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-900/10 p-3 sm:p-4 border border-white/50 flex flex-col gap-2 sm:gap-3 z-30 w-[115px] sm:w-[150px]"
          >
            {/* Header Icon - Detailed Floorplan thumbnail */}
            <div className="w-full aspect-[16/9] bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center overflow-hidden mb-0 relative">
               <svg className="w-full h-full p-2 text-[#2457D6]/40" viewBox="0 0 100 100">
                  <path d="M10 10h80v80h-80zM50 10v80M10 50h80" stroke="currentColor" fill="none" strokeWidth="2" />
                  <rect x="15" y="15" width="30" height="30" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="55" y="55" width="30" height="30" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M50 30h20M30 50v20" stroke="currentColor" strokeWidth="1.5" />
               </svg>
            </div>
            
            <div className="space-y-2 sm:space-y-2.5">
              {['Measure', 'Verify', 'Compare', 'Decide'].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#2457D6] flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-600/20">
                    <Check size={11} strokeWidth={4} />
                  </div>
                  <span className="text-[13px] sm:text-[15px] font-bold text-[#172033] tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

