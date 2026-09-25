import React from 'react';
import { useSession } from '../context/SessionContext';
import { BUILTIN_AVATARS } from '../data/avatars';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  avatarId?: string;
  displayName?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  size = 'md', 
  className = '',
  avatarId: propAvatarId,
  displayName: propDisplayName,
}) => {
  const { user } = useSession();
  
  // Use props if provided, otherwise fall back to session user
  const avatarId = propAvatarId !== undefined ? propAvatarId : user.avatarId;
  const displayName = propDisplayName !== undefined ? propDisplayName : user.displayName;
  const photoURL = user.photoURL;
  
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const selectedAvatar = BUILTIN_AVATARS.find(a => a.id === avatarId);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-14 h-14 text-xl rounded-2xl',
    xl: 'w-20 h-20 text-3xl rounded-[32px]',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
  };

  // PRIORITY 1: User-selected custom/built-in avatar
  if (selectedAvatar) {
    const Icon = selectedAvatar.icon;
    return (
      <div 
        className={`${sizeClasses[size]} flex items-center justify-center shrink-0 text-white transition-transform ${className}`}
        style={{ backgroundColor: selectedAvatar.color }}
      >
        <Icon className={iconSizes[size]} />
      </div>
    );
  }

  // PRIORITY 2: Google/Firebase photoURL if available and NOT explicitly choosing initials
  if (photoURL && avatarId !== 'initials') {
    return (
      <div className={`${sizeClasses[size]} shrink-0 overflow-hidden shadow-md ${className}`}>
        <img 
          src={photoURL} 
          alt={displayName} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // PRIORITY 3: User initials fallback
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 font-black ${className}`}>
      {initials || '?'}
    </div>
  );
};
