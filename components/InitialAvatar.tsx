'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface InitialAvatarProps {
  name?: string | null;
  className?: string;
}

const getInitials = (name?: string | null) => {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (words.length === 0) return 'GU';

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

export const InitialAvatar = ({ name, className }: InitialAvatarProps) => (
  <Avatar className={className} aria-label={`${name || 'Guest customer'} avatar`}>
    <AvatarFallback>{getInitials(name)}</AvatarFallback>
  </Avatar>
);
