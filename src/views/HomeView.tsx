import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ScanLine,
  Calculator,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  Building,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { DimensionParser } from '../utils/dimensionParser';
import { PropertyAudit } from '../types';
import { PdfViewerModal } from '../components/PdfViewerModal';
import { NavTab } from '../components/Header';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { audits, displayUnit } = useSession();
  const [selectedAuditForPdf, setSelectedAuditForPdf] = useState<PropertyAudit | null>(null);
  const [activeInfo, setActiveInfo] = useState<'carpet' | 'builtup' | 'super' | null>(null);

  const recentAudits = audits.slice(0, 3);

  const definitions = {
    carpet: "Net usable floor area inside your home. It doesn't include the thickness of outer walls or common areas like lobbies.",
    builtup: "The total area covered by your home, including the thickness of both internal and external walls.",
    super: "The area the builder sells to you. It includes your home's built-up area plus a share of common spaces like corridors, lifts, and clubhouses."
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero Section - Simple & Impactful */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#172033] text-white p-8 sm:p-12 shadow-2xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-[#2457D6]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-wrap-balance">
            Understand the area <span className="text-[#93C5FD]">you're buying</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100/80 mt-4 leading-relaxed font-medium">
            Check the builder's area, measure your home and see the difference.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => onNavigate('property_details')}
              className="px-8 py-4 bg-[#2457D6] hover:bg-blue-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
            >
              <FileCheck2 className="w-5 h-5" />
              <span>Check My Property</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('scanner')}
              className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-lg rounded-2xl backdrop-blur-md flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
            >
              <ScanLine className="w-5 h-5 text-blue-300" />
              <span>Scan Floor Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Area Basics Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Layers className="w-4 h-4 text-[#2457D6]" />
          <h2 className="text-lg font-black text-[#172033] tracking-tight">Area Basics</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Carpet Area Card */}
          <div className="relative bg-white rounded-2xl p-5 border border-[#E4E7EC] shadow-xs flex flex-col gap-3 overflow-hidden min-h-[140px]">
            <AnimatePresence>
              {activeInfo === 'carpet' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-0 bg-[#F8FAFC]/95 backdrop-blur-sm z-30 p-5 flex flex-col justify-center"
                >
                  <button 
                    onClick={() => setActiveInfo(null)}
                    className="absolute top-3 right-3 p-1 text-[#697386] hover:text-[#172033] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] font-bold text-[#172033] leading-relaxed pr-4">
                    {definitions.carpet}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2457D6] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <button 
                onClick={() => setActiveInfo(activeInfo === 'carpet' ? null : 'carpet')}
                className="p-1 -mr-1 text-[#697386] hover:text-[#2457D6] transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#172033]">Carpet Area</h3>
              <p className="text-xs font-medium text-[#697386]">Space you actually use</p>
            </div>
          </div>

          {/* Built-Up Area Card */}
          <div className="relative bg-white rounded-2xl p-5 border border-[#E4E7EC] shadow-xs flex flex-col gap-3 overflow-hidden min-h-[140px]">
            <AnimatePresence>
              {activeInfo === 'builtup' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-0 bg-[#F8FAFC]/95 backdrop-blur-sm z-30 p-5 flex flex-col justify-center"
                >
                  <button 
                    onClick={() => setActiveInfo(null)}
                    className="absolute top-3 right-3 p-1 text-[#697386] hover:text-[#172033] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] font-bold text-[#172033] leading-relaxed pr-4">
                    {definitions.builtup}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <button 
                onClick={() => setActiveInfo(activeInfo === 'builtup' ? null : 'builtup')}
                className="p-1 -mr-1 text-[#697386] hover:text-[#2457D6] transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#172033]">Built-Up Area</h3>
              <p className="text-xs font-medium text-[#697386]">Carpet area + walls</p>
            </div>
          </div>

          {/* Super Built-Up Area Card */}
          <div className="relative bg-white rounded-2xl p-5 border border-[#E4E7EC] shadow-xs flex flex-col gap-3 overflow-hidden min-h-[140px]">
            <AnimatePresence>
              {activeInfo === 'super' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-0 bg-[#F8FAFC]/95 backdrop-blur-sm z-30 p-5 flex flex-col justify-center"
                >
                  <button 
                    onClick={() => setActiveInfo(null)}
                    className="absolute top-3 right-3 p-1 text-[#697386] hover:text-[#172033] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] font-bold text-[#172033] leading-relaxed pr-4">
                    {definitions.super}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#A85C00] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <button 
                onClick={() => setActiveInfo(activeInfo === 'super' ? null : 'super')}
                className="p-1 -mr-1 text-[#697386] hover:text-[#2457D6] transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#172033]">Super Built-Up Area</h3>
              <p className="text-xs font-medium text-[#697386]">Built-up area + share of common areas</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Recent Area Checks Section */}
      <section className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E4E7EC] shadow-xs">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#172033] tracking-tight">Recent Area Checks</h2>
            <p className="text-sm text-[#697386]">Review your verified reports</p>
          </div>

          {recentAudits.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigate('audits')}
              className="text-xs font-bold text-[#2457D6] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {recentAudits.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F6F7FB] flex items-center justify-center">
              <Building className="w-8 h-8 text-[#E4E7EC]" />
            </div>
            <p className="text-sm font-bold text-[#697386]">No property checks yet.</p>
            <button
              onClick={() => onNavigate('property_details')}
              className="px-6 py-2.5 bg-[#2457D6] text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
            >
              Start Your First Check
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAudits.map(audit => (
              <div
                key={audit.id}
                className="p-4 sm:p-5 rounded-2xl border border-[#F1F5F9] hover:border-blue-200 hover:bg-[#F8FAFC] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 space-y-1">
                  <h3 className="font-black text-[#172033] truncate">
                    {audit.auditName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#697386]">
                    <span>{new Date(audit.timestamp).toLocaleDateString()}</span>
                    <span className="w-1 h-1 rounded-full bg-[#E4E7EC]" />
                    <span>{audit.project || 'Untitled Project'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#697386]">Builder Area</p>
                    <p className="text-sm font-bold text-[#172033]">
                      {audit.builderSuperBuiltUpArea 
                        ? DimensionParser.formatArea(audit.builderSuperBuiltUpArea, displayUnit)
                        : '—'}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#2457D6]">Verified Area</p>
                    <p className="text-sm font-black text-[#2457D6]">
                      {DimensionParser.formatArea(audit.carpetArea, displayUnit)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedAuditForPdf(audit)}
                    className="p-2.5 rounded-xl bg-white border border-[#E4E7EC] hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group"
                  >
                    <ArrowRight className="w-4 h-4 text-[#697386] group-hover:text-[#2457D6]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PDF Modal */}
      <PdfViewerModal
        isOpen={selectedAuditForPdf !== null}
        audit={selectedAuditForPdf}
        displayUnit={displayUnit}
        onClose={() => setSelectedAuditForPdf(null)}
      />
    </div>
  );
};
