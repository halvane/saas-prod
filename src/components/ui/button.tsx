import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white shadow-md hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-white border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white',
    ghost: 'bg-transparent text-[#6B7280] hover:bg-[#F3F4F6]',
    icon: 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#8B5CF6] hover:text-white rounded-full'
  };
  
  const sizes = {
    small: variant === 'icon' ? 'w-8 h-8' : 'px-4 py-2 text-sm rounded-md',
    medium: variant === 'icon' ? 'w-10 h-10' : 'px-6 py-3 text-base rounded-lg',
    large: variant === 'icon' ? 'w-12 h-12' : 'px-8 py-4 text-lg rounded-xl'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
