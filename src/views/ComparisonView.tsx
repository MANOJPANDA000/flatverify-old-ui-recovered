import React from 'react';
import { ArrowLeft, ArrowRight, Construction } from 'lucide-react';

interface ComparisonViewProps {
  onBack: () => void;
  onContinue: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ onBack, onContinue }) => {
  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 sm:px-0">
      {/* Navigation & Progress */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors mb-6 group cursor-pointer"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-tight">Back</span>
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2457D6] bg-blue-50 px-2 py-0.5 rounded-full">Step 4 of 5</span>
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-[#2457D6] rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">Comparison</h1>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[32px] border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-[28px] bg-amber-50 text-amber-600 flex items-center justify-center">
          <Construction className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-[#172033]">Comparison Step Placeholder</h2>
          <p className="text-sm text-[#64748B] font-medium max-w-sm">
            This step will compare Builder-Stated Area vs Your Measurements to calculate shortfalls and loading differences.
          </p>
        </div>
        
        <div className="pt-4 w-full">
          <button
            onClick={onContinue}
            className="w-full h-14 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Final Result</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
