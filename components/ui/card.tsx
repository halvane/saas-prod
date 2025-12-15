import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'glass' | 'platform';
  platformColor?: string;
  hover?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'standard',
  platformColor,
  hover = true,
  children,
  className = '',
  onClick,
  style,
  ...props
}, ref) => {
  const baseStyles = 'rounded-xl p-6 transition-all duration-300';
  
  const variants = {
    standard: 'bg-white shadow-md',
    glass: 'glass-effect shadow-lg',
    platform: 'bg-white shadow-md relative overflow-hidden'
  };
  
  const hoverStyles = hover ? 'hover:scale-[1.02] hover:shadow-xl cursor-pointer' : '';
  
  return (
    <div
      ref={ref}
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
});
Card.displayName = "Card";

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode; className?: string }) {
  return <h4 className={className} {...props}>{children}</h4>;
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-gray-500 ${className}`} {...props}>{children}</p>;
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; className?: string }) {
  return <div className={className} {...props}>{children}</div>;
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; className?: string }) {
  return <div className={`mt-4 pt-4 border-t border-[#E5E7EB] ${className}`} {...props}>{children}</div>;
}



