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
    'secondary': 'bg-secondary text-white font-normal',
    'soft-amber': 'bg-secondary/18 text-primary font-normal',
    'primary': 'bg-primary text-white font-normal',
    'negative': 'bg-white text-ink border border-ink font-normal',
    'outline': 'bg-white text-ink border border-primary/20 font-normal',
    'neutral': 'bg-neutral text-ink font-normal',
    'dark': 'bg-ink text-white font-normal',
  };

  const sizeStyles = {
    sm: 'font-sans text-[10px] px-2 py-[2px] rounded-[8px]',
    md: 'font-sans text-[12px] px-2.5 py-1 rounded-[8px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 leading-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon === 'up' && <TrendingUp className="w-2.5 h-2.5 inline" />}
      {icon === 'down' && <TrendingDown className="w-2.5 h-2.5 inline" />}
      {children}
    </span>
  );
};
