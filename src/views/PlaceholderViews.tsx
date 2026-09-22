import React from 'react';
import { ArrowLeft, UserPlus, LogIn, Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  onBack: () => void;
  icon: React.ElementType;
}

const PlaceholderBase: React.FC<PlaceholderProps> = ({ title, onBack, icon: Icon }) => (
  <div className="min-h-screen bg-[#F8F9FD] flex flex-col items-center justify-center p-6 text-center">
    <div className="max-w-md w-full space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
        <Icon className="w-8 h-8" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">{title}</h2>
        <div className="flex items-center justify-center gap-2 text-amber-600 font-bold text-sm">
          <Construction className="w-4 h-4" />
          <span>Coming Next</span>
        </div>
      </div>

      <p className="text-sm text-[#64748B] leading-relaxed">
        {title === 'Create Account' ? 'Account setup is coming next.' : 'Secure sign in is coming next.'}
      </p>

      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0F172A] border border-[#E2E8F0] rounded-2xl font-bold text-sm shadow-xs hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Welcome</span>
      </button>
    </div>
  </div>
);

export const SignUpPlaceholder: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <PlaceholderBase title="Create Account" onBack={onBack} icon={UserPlus} />
);

export const SignInPlaceholder: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <PlaceholderBase title="Sign In" onBack={onBack} icon={LogIn} />
);
