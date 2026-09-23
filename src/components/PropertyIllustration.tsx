import React from 'react';
import { motion } from 'motion/react';
import heroIllustration from '../assets/images/hero_illustration.jpg';

export const PropertyIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 select-none pointer-events-none">
      {/* Background Decorative Accent - Subtle Blue Circle Glow */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50/40 rounded-full blur-3xl opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative w-full max-w-[420px] aspect-square flex items-center justify-center z-10"
      >
        <img 
          src={heroIllustration} 
          alt="3D Property Area Illustration" 
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
};

