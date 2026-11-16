import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'soft-amber' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'dark';
  icon?: 'up' | 'down' | 'none';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'soft-amber',
  icon = 'none',
  className = '',
  size = 'sm',
}) => {
  const variantStyles = {
    'soft-amber': 'bg-[#FCE8A3] text-[#8A6500] font-medium',
    'primary': 'bg-[#F5B800] text-[#222026] font-semibold',
    'success': 'bg-[#E7F8F0] text-[#0D824B] font-medium border border-[#C6F0DC]',
    'warning': 'bg-[#FFF8E6] text-[#B26B00] font-medium border border-[#FCE8A3]',
    'danger': 'bg-[#FDECEC] text-[#D32F2F] font-medium border border-[#FACDCD]',
    'neutral': 'bg-[#F1F1F4] text-[#63636E] font-medium border border-[#E4E4E9]',
    'dark': 'bg-[#222026] text-white font-medium',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full',
    md: 'text-sm px-3 py-1 rounded-full',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 leading-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon === 'up' && <TrendingUp className="w-3 h-3 text-current inline" />}
      {icon === 'down' && <TrendingDown className="w-3 h-3 text-current inline" />}
      {children}
    </span>
  );
};
