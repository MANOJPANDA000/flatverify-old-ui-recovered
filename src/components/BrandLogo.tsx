import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : size === 'xl' ? 56 : size === '2xl' ? 76 : 36;

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {/* Original App Logo matching favicon.svg */}
      <div
        className="relative flex items-center justify-center shrink-0 drop-shadow-sm transition-transform group-hover:scale-105"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect width="64" height="64" rx="16" fill="#1D4ED8" />
          <path
            d="M16 44V20L32 12L48 20V44L32 52L16 44Z"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 12V52"
            stroke="white"
            strokeWidth="2.5"
            strokeDasharray="3 3"
          />
          <path
            d="M16 28L48 28"
            stroke="white"
            strokeWidth="2.5"
            strokeDasharray="3 3"
          />
          <circle cx="32" cy="32" r="4.5" fill="#60A5FA" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${
            size === '2xl' ? 'text-[28px] sm:text-[34px]' : 
            size === 'xl' ? 'text-[23px]' : 
            size === 'lg' ? 'text-[20px]' : 'text-[18px]'
          } font-bold tracking-tight text-[#172033]`}>
            Flatverify<span className="text-[#2457D6]">.ai</span>
          </span>
          <span className={`${
            size === '2xl' ? 'text-[15px] sm:text-[17px]' :
            size === 'xl' ? 'text-[12px]' : 'text-[11px]'
          } font-medium text-[#697386] tracking-tight mt-1 sm:mt-1.5`}>
            Understand your property
          </span>
        </div>
      )}
    </div>
  );
};

