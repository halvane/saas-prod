import React from 'react';
import { Check, Sparkles, Wand2, Edit, Calendar } from 'lucide-react';

interface WorkflowProgressProps {
  currentStep: 'radar' | 'mixer' | 'editor' | 'timeline';
}

const steps = [
  { id: 'radar', label: 'Detect Trends', icon: Sparkles },
  { id: 'mixer', label: 'Generate Content', icon: Wand2 },
  { id: 'editor', label: 'Edit & Review', icon: Edit },
  { id: 'timeline', label: 'Schedule', icon: Calendar }
];

export function WorkflowProgress({ currentStep }: WorkflowProgressProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="bg-white border-b border-[#E5E7EB] py-4 px-6 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            const isUpcoming = index > currentIndex;

            return (
              <React.Fragment key={step.id}>
                {/* Step */}
                <div className="flex flex-col items-center relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#10B981] to-[#059669] text-white shadow-lg'
                        : isActive
                        ? 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white shadow-xl ring-4 ring-[#8B5CF6]/20 animate-pulse-subtle'
                        : 'bg-[#F3F4F6] text-[#9CA3AF]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <p
                    className={`mt-2 text-xs font-medium whitespace-nowrap ${
                      isActive
                        ? 'text-[#8B5CF6]'
                        : isCompleted
                        ? 'text-[#10B981]'
                        : 'text-[#9CA3AF]'
                    }`}
                  >
                    {step.label}
                  </p>
                  
                  {/* Step number badge */}
                  <div
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-[#10B981] text-white'
                        : isActive
                        ? 'bg-[#8B5CF6] text-white'
                        : 'bg-[#E5E7EB] text-[#9CA3AF]'
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 relative">
                    <div className="absolute inset-0 bg-[#E5E7EB] rounded-full" />
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-500 ${
                        index < currentIndex
                          ? 'bg-gradient-to-r from-[#10B981] to-[#059669]'
                          : index === currentIndex
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] w-1/2'
                          : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress Percentage */}
        <div className="mt-4 text-center">
          <p className="text-sm text-[#6B7280]">
            Progress: <span className="font-semibold text-[#8B5CF6]">
              {Math.round(((currentIndex + 1) / steps.length) * 100)}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
