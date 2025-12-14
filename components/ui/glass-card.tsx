'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  className?: string;
  children?: React.ReactNode;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: boolean;
}

export function GlassCard({ 
  className, 
  children, 
  blur = 'md',
  gradient = true,
}: GlassCardProps) {
  const blurMap = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative rounded-3xl border border-white/30",
        blurMap[blur],
        "bg-white/60 backdrop-saturate-150",
        "shadow-2xl shadow-purple-500/10",
        gradient && "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/40 before:via-white/20 before:to-transparent before:opacity-70",
        "transition-all duration-300",
        className
      )}
    >
      <div className="relative z-10 h-full p-1">
        {children}
      </div>
    </motion.div>
  );
}
