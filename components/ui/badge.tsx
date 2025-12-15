import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'platform' | 'default' | 'secondary' | 'outline';
  platform?: 'instagram' | 'linkedin' | 'twitter' | 'pinterest' | 'tiktok' | 'youtube' | 'blog' | 'facebook';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'info', platform, children, className = '' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold';
  
  const variants = {
    success: 'bg-[#D1FAE5] text-[#065F46]',
    warning: 'bg-[#FEF3C7] text-[#92400E]',
    error: 'bg-[#FEE2E2] text-[#991B1B]',
    info: 'bg-[#DBEAFE] text-[#1E40AF]',
    platform: '',
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground'
  };
  
  const platformStyles = {
    instagram: 'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white',
    linkedin: 'bg-[#0077B5] text-white',
    twitter: 'bg-[#1DA1F2] text-white',
    pinterest: 'bg-[#E60023] text-white',
    tiktok: 'bg-[#000000] text-white',
    youtube: 'bg-[#FF0000] text-white',
    blog: 'bg-[#8B5CF6] text-white',
    facebook: 'bg-[#1877F2] text-white'
  };
  
  const appliedStyle = variant === 'platform' && platform ? platformStyles[platform] : variants[variant];
  
  return (
    <span className={`${baseStyles} ${appliedStyle} ${className}`}>
      {children}
    </span>
  );
}



