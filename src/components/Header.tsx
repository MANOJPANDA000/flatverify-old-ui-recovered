import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  ScanLine,
  FolderKanban,
  UserCheck,
  User,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AreaUnitControl } from './AreaUnitControl';
import { useSession } from '../context/SessionContext';

export type NavTab = 'welcome' | 'home' | 'calculator' | 'scanner' | 'audits' | 'account' | 'signup_placeholder' | 'signin_placeholder' | 'create_account' | 'sign_in' | 'forgot_password' | 'property_details' | 'builder_area' | 'your_measurements' | 'comparison';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { displayUnit, setDisplayUnit, user, audits } = useSession();

  const navItems: Array<{ key: NavTab; label: string; icon: React.ReactNode; badge?: number }> = [
    { key: 'home', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'calculator', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
    { key: 'scanner', label: 'Scan Blueprint', icon: <ScanLine className="w-4 h-4" /> },
    {
      key: 'audits',
      label: 'Saved Audits',
      icon: <FolderKanban className="w-4 h-4" />,
      badge: audits.length > 0 ? audits.length : undefined,
    },
    { key: 'account', label: 'Settings', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-shadow w-full">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:h-16 gap-3 sm:gap-4">
          {/* Row 1: Logo + Account icon (Mobile) or Logo (Desktop) */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            {/* Logo */}
            <div
              onClick={() => onTabChange('home')}
              className="cursor-pointer select-none shrink-0"
            >
              <BrandLogo size="md" />
            </div>

            {/* Mobile Account icon (Hidden on desktop) */}
            <div className="flex sm:hidden items-center">
              <button
                type="button"
                onClick={() => onTabChange('account')}
                className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'account'
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
                }`}
              >
                {user.isGuest ? (
                  <User className="w-5 h-5 text-[#94A3B8]" />
                ) : (
                  <UserCheck className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* Row 2 (Mobile only): Unit Selector */}
          <div className="flex sm:hidden w-full overflow-hidden">
            <AreaUnitControl
              value={displayUnit}
              onChanged={setDisplayUnit}
              size="md"
              className="w-full"
            />
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
            {navItems.map(item => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onTabChange(item.key)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#1D4ED8] shadow-xs ring-1 ring-black/5 font-extrabold'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Unit Toggle & User Status (Desktop/Tablet) */}
          <div className="hidden sm:flex items-center gap-3">
            <AreaUnitControl
              value={displayUnit}
              onChanged={setDisplayUnit}
              size="sm"
            />

            <button
              type="button"
              onClick={() => onTabChange('account')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                user.isGuest
                  ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-gray-400'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              } ${activeTab === 'account' ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
            >
              {user.isGuest ? (
                <User className="w-3.5 h-3.5 text-[#94A3B8]" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              )}
              <span className="hidden lg:inline">
                {user.isGuest ? 'Guest Mode' : user.displayName}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar (Bottom) - Now more robust and flexible */}
      <div className="md:hidden flex items-stretch border-t border-[#E2E8F0] bg-white w-full">
        {navItems.map(item => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange(item.key)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 text-[10px] font-bold transition-all border-b-2 ${
                isActive 
                  ? 'text-[#1D4ED8] border-[#1D4ED8] bg-blue-50/30' 
                  : 'text-[#64748B] border-transparent'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 rounded-full text-[9px] font-black bg-blue-600 text-white leading-none min-w-[14px] h-[14px] flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-center leading-tight break-words max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
