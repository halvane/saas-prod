import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'glass' | 'platform';
  platformColor?: string;
  hover?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = 'standard',
  platformColor,
  hover = true,
  children,
  className = '',
  onClick,
  style,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-xl p-6 transition-all duration-300';
  
  const variants = {
    standard: 'bg-white shadow-md',
    glass: 'glass-effect shadow-lg',
    platform: 'bg-white shadow-md relative overflow-hidden'
  };
  
  const hoverStyles = hover ? 'hover:scale-[1.02] hover:shadow-xl cursor-pointer' : '';
  
  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      {variant === 'platform' && platformColor && (
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{ background: platformColor }}
        />
      )}
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h4 className={className}>{children}</h4>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mt-4 pt-4 border-t border-[#E5E7EB] ${className}`}>{children}</div>;
}



