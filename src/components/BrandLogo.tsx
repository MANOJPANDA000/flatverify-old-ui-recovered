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
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Brand Icon: 3D Faceted House + Checkmark matching uploaded reference */}
      <div
        className="relative flex items-center justify-center shrink-0 drop-shadow-md transition-transform"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Main House Shape with Facets */}
          <path
            d="M50 10L15 35V75L50 90L85 75V35L50 10Z"
            fill="#2457D6"
          />
          {/* Top Left Facet (Highlight) */}
          <path
            d="M50 10L15 35L25 40L50 22V10Z"
            fill="white"
            fillOpacity="0.2"
          />
          {/* Bottom Right Facet (Shadow) */}
          <path
            d="M85 35V75L50 90V78L75 68V35L85 35Z"
            fill="black"
            fillOpacity="0.15"
          />
          
          {/* Inner White Space */}
          <path
            d="M50 22L25 40V68L50 78L75 68V40L50 22Z"
            fill="white"
          />
          
          {/* Central Blue Checkmark */}
          <path
            d="M38 52L46 60L62 42"
            stroke="#2457D6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-[1.1]">
          <div className="flex items-baseline">
            <span className={`${
              size === '2xl' ? 'text-[30px] sm:text-[34px]' : 
              size === 'xl' ? 'text-[24px]' : 'text-[20px]'
            } font-[800] tracking-tight text-[#172033]`}>
              Flatverify
            </span>
            <span className={`${
              size === '2xl' ? 'text-[30px] sm:text-[34px]' : 
              size === 'xl' ? 'text-[24px]' : 'text-[20px]'
            } font-[800] tracking-tight text-[#2457D6]`}>
              .ai
            </span>
          </div>
          <span className={`${
            size === '2xl' ? 'text-[15px] sm:text-[17px]' :
            size === 'xl' ? 'text-[13px]' : 'text-[12px]'
          } font-medium text-[#697386] tracking-tight mt-0.5`}>
            Understand your property
          </span>
        </div>
      )}
    </div>
  );
};

