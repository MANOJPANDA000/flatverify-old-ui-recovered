import React from 'react';
import { Check, Ruler, Layout } from 'lucide-react';
import { motion } from 'motion/react';

export const PropertyIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none pointer-events-none">
      {/* Background Decorative Accent - Subtle Blue Circles */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-blue-100/20 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-[340px] aspect-[4/3] flex items-center justify-center">
        
        {/* 1. Rolled Blueprint Underneath */}
        <div className="absolute -left-12 -bottom-2 w-48 h-8 bg-slate-50 border border-slate-200 rounded-full shadow-sm transform -rotate-[15deg] z-0 overflow-hidden">
          <div className="w-full h-full flex items-center px-4">
            <div className="w-full h-[1px] bg-slate-200" />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-slate-200/50" />
        </div>

        {/* 2. Main Architectural Blueprint Sheet */}
        <div className="absolute inset-0 bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden transform -rotate-1 z-10">
          <svg className="w-full h-full text-slate-100" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid-pattern)" />
            
            {/* Blueprint Floorplan Lines */}
            <g className="text-slate-200" stroke="currentColor" strokeWidth="0.8" fill="none">
              <path d="M 20 20 L 80 20 L 80 80 L 20 80 Z" />
              <path d="M 50 20 L 50 80" />
              <path d="M 20 50 L 50 50" />
              <path d="M 50 45 L 80 45" />
            </g>
          </svg>
        </div>

        {/* 3. Detailed Isometric Furnished Apartment */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-[85%] h-[85%] z-20"
        >
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl">
            {/* Isometric Shadow */}
            <path d="M 200 40 L 340 110 L 200 180 L 60 110 Z" fill="rgba(0,0,0,0.03)" transform="translate(5, 10)" />
            
            {/* Base Floor Plate */}
            <path d="M 200 40 L 340 110 L 200 180 L 60 110 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            
            {/* Room Areas - Light Blue tints */}
            <path d="M 200 40 L 270 75 L 200 110 L 130 75 Z" fill="#F8FAFC" /> {/* Bed 1 */}
            <path d="M 130 75 L 200 110 L 130 145 L 60 110 Z" fill="#F1F5F9" /> {/* Living */}
            <path d="M 200 110 L 270 145 L 200 180 L 130 145 Z" fill="#F8FAFC" /> {/* Kitchen/Bath */}
            
            {/* Internal Walls */}
            <g stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 200 40 L 60 110 L 200 180 L 340 110 L 200 40" strokeWidth="3.5" /> {/* Outer */}
              <path d="M 200 40 L 200 180" />
              <path d="M 130 75 L 270 145" />
            </g>

            {/* Furniture Details - Abstract Isometric */}
            {/* Bedroom - Bed */}
            <g transform="translate(180, 60)">
              <rect x="0" y="0" width="40" height="50" fill="#E2E8F0" rx="3" transform="skewY(26) rotate(-15)" />
              <rect x="5" y="5" width="30" height="20" fill="#CBD5E1" rx="2" transform="skewY(26) rotate(-15)" />
              <rect x="8" y="28" width="24" height="15" fill="#CBD5E1" rx="1" transform="skewY(26) rotate(-15)" />
            </g>
            
            {/* Living Room - Sofa & Table */}
            <g transform="translate(85, 100)">
              <path d="M 0 0 L 35 15 L 35 35 L 0 20 Z" fill="#CBD5E1" />
              <path d="M 0 0 L 20 -10 L 55 5 L 35 15 Z" fill="#E2E8F0" />
              {/* Coffee Table */}
              <path d="M 40 25 L 60 35 L 45 42 L 25 32 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
            </g>

            {/* Kitchen/Bath - Counters & Plants */}
            <g transform="translate(210, 130)">
               <rect x="0" y="0" width="30" height="10" fill="#E2E8F0" transform="skewY(-26)" />
               <circle cx="45" cy="15" r="4" fill="#10B981" opacity="0.4" /> {/* Plant */}
            </g>

            {/* Bathroom - Fixture */}
            <g transform="translate(230, 140)">
               <ellipse cx="0" cy="0" rx="8" ry="5" fill="white" stroke="#CBD5E1" strokeWidth="1" />
               <circle cx="0" cy="-2" r="3" fill="#F1F5F9" />
            </g>

            {/* Blue Target Pulse */}
            <g transform="translate(240, 110)">
              <motion.circle 
                cx="0" cy="0" r="4" fill="#3B82F6" 
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }} 
              />
              <circle cx="0" cy="0" r="10" stroke="#3B82F6" strokeWidth="1.5" fill="none" opacity="0.4" />
              <circle cx="0" cy="0" r="1" fill="white" />
            </g>

            {/* Measurement Dimension Lines */}
            <g stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 3">
              {/* Width Line 1 */}
              <path d="M 140 30 L 260 90" />
              {/* Width Line 2 */}
              <path d="M 80 130 L 180 180" />
              {/* Height Line */}
              <path d="M 320 80 L 320 140" />
            </g>

            {/* Dimension Labels */}
            <foreignObject x="180" y="35" width="50" height="20">
              <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded px-1 text-[9px] font-black text-blue-600 shadow-sm text-center">3.6 m</div>
            </foreignObject>
            <foreignObject x="85" y="140" width="50" height="20">
              <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded px-1 text-[9px] font-black text-blue-600 shadow-sm text-center">2.8 m</div>
            </foreignObject>
            <foreignObject x="250" y="150" width="50" height="20">
              <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded px-1 text-[9px] font-black text-blue-600 shadow-sm text-center">4.2 m</div>
            </foreignObject>
          </svg>
        </motion.div>

        {/* 4. Area Measurement Badge - 120.5 m² */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute left-[15%] bottom-[35%] bg-[#2457D6] text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 z-30"
        >
          <Ruler size={16} className="text-blue-100" />
          <span className="font-black text-base tracking-tight">120.5 m²</span>
        </motion.div>

        {/* 5. Verification Checklist Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute right-0 top-1/4 bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 z-40 w-[140px]"
        >
          {/* Header Icon - Floorplan thumbnail */}
          <div className="w-full aspect-video bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-center overflow-hidden mb-1">
             <Layout size={24} className="text-blue-200" />
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                   <path d="M10 10h80v80h-80zM50 10v80M10 50h80" stroke="currentColor" fill="none" />
                </svg>
             </div>
          </div>
          
          <div className="space-y-2.5">
            {['Measure', 'Verify', 'Compare', 'Decide'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2457D6] flex items-center justify-center text-white shrink-0">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-[13px] font-bold text-[#172033] tracking-tight">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

