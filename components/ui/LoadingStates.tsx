import React from 'react';

export function Spinner({ size = 'medium', className = '' }: { size?: 'small' | 'medium' | 'large'; className?: string }) {
  const sizes = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={`${sizes[size]} border-[#F3F4F6] border-t-[#8B5CF6] rounded-full animate-spin ${className}`}
    />
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-[#F3F4F6] via-[#E5E7EB] to-[#F3F4F6] bg-[length:200%_100%] rounded animate-shimmer ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

export function ProgressBar({ progress, className = '' }: { progress: number; className?: string }) {
  return (
    <div className={`w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] transition-all duration-300 relative"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

export function PulseLoader() {
  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 bg-[#8B5CF6] rounded-full animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-20 h-20 border-4 border-[#DDD6FE] border-t-[#8B5CF6] rounded-full animate-spin mb-4" />
      <p className="text-[#6B7280] text-lg">{message}</p>
    </div>
  );
}



