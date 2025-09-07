"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import Image from 'next/image';

export function ChatAvatar({ user = {}, size = 'md', showStatus = true }) {
  // Size variants
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  // Status indicator position based on size
  const statusSizes = {
    sm: 'w-2.5 h-2.5 right-0 bottom-0',
    md: 'w-3 h-3 right-0 bottom-0',
    lg: 'w-3.5 h-3.5 right-0.5 bottom-0.5',
    xl: 'w-4 h-4 right-1 bottom-1'
  };
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Determine the background color based on user id
  const getBgColor = (id) => {
    const colors = [
      'bg-primary-soft text-primary-dark',
      'bg-green-soft text-green-dark',
      'bg-orange-soft text-orange-dark',
      'bg-yellow-soft text-yellow-dark',
      'bg-violate-50 text-white',
      'bg-blue-100 text-blue',
    ];
    
    // Hash the id to get a consistent color
    const hash = id?.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };
  
  return (
    <div className="relative">
      <Avatar className={`${sizes[size]} border-2 border-background`}>
        {/* Default to profile.png, with user avatar as priority if available */}
        <AvatarImage 
          src={user?.avatar || '/profile.png'}
          alt={user?.name || 'User'}
        />
        {/* Fallback with initials if images fail to load */}
        <AvatarFallback className={`${getBgColor(user?.id)} font-semibold`}>
          {getInitials(user?.name)}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && user?.status && (
        <div 
          className={`absolute ${statusSizes[size]} rounded-full border-2 border-background ${user.status === 'online' ? 'bg-green' : 'bg-gray-400'}`}
        />
      )}
      
      {user?.isGroup && (
        <div className="absolute -bottom-1 -right-1 text-xs font-medium bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center border border-background">
          {user.members > 99 ? '99+' : user.members}
        </div>
      )}
    </div>
  );
}
