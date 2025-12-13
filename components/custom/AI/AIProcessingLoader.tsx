'use client';

import React from 'react';
import { Modal, ModalContent } from '@/components/ui/Modal';
import { Sparkles, CheckCircle, Loader2 } from 'lucide-react';

interface AIProcessingLoaderProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  steps?: string[];
  currentStep?: number;
  progress?: number;
  icon?: React.ReactNode;
}

export function AIProcessingLoader({
  isOpen,
  title = '⚡ AI is Working...',
  subtitle = 'Processing your content',
  steps = [],
  currentStep = 0,
  progress = 0,
  icon
}: AIProcessingLoaderProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="" size="large" showClose={false}>
      <ModalContent>
        <div className="min-h-[400px] flex flex-col items-center justify-center py-12">
          {/* Animated Circle */}
          <div className="relative mb-12">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center animate-pulse-glow">
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                {icon || <Sparkles className="w-12 h-12 text-[#8B5CF6] animate-spin" />}
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <h2 className="gradient-text mb-4 text-center text-2xl font-bold">{title}</h2>
          <p className="text-[#6B7280] text-center mb-8">{subtitle}</p>

          {/* Progress Steps */}
          {steps.length > 0 && (
            <div className="w-full max-w-md space-y-3 mb-8">
              {steps.map((step, idx) => {
                const isComplete = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 transition-all ${
                      isComplete ? 'opacity-50' : isCurrent ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        isCurrent ? 'text-[#1F2937] font-medium' : 'text-[#9CA3AF]'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full max-w-md mb-4">
            <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-[#9CA3AF]">
            {Math.round(progress)}% complete
            {progress < 100 &&
              ` • Expected: ${Math.max(0, Math.ceil((100 - progress) * 0.15))}s remaining`}
          </p>
        </div>
      </ModalContent>
    </Modal>
  );
}
