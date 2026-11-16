import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'soft-amber' | 'primary' | 'secondary' | 'negative' | 'neutral' | 'dark' | 'outline';
  icon?: 'up' | 'down' | 'none';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  icon = 'none',
  className = '',
  size = 'sm',
}) => {
  const variantStyles = {
    'secondary': 'bg-secondary text-black font-normal',
    'soft-amber': 'bg-secondary text-black font-normal',
    'primary': 'bg-primary text-black font-normal',
    'negative': 'bg-white text-black border border-black font-normal',
    'outline': 'bg-white text-black border border-black/[0.12] font-normal',
    'neutral': 'bg-black/[0.06] text-black font-normal',
    'dark': 'bg-black text-white font-normal',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-[2px] rounded-[8px]',
    md: 'text-xs px-2.5 py-1 rounded-[8px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 leading-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon === 'up' && <TrendingUp className="w-2.5 h-2.5 text-black inline" />}
      {icon === 'down' && <TrendingDown className="w-2.5 h-2.5 text-black inline" />}
      {children}
    </span>
  );
};
