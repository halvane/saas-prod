import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, Zap, Wand2, Check, CheckCircle, Loader2, FileText, Linkedin, Instagram, Twitter } from 'lucide-react';
import { WorkflowProgress } from '../ui/WorkflowProgress';

interface MixerPageProps {
  isOpen: boolean;
  sourceData: any;
  onComplete: (content: any) => void;
}

const contentFormats = [
  { id: 'blog', label: 'Blog Post', icon: FileText, color: '#8B5CF6' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'twitter', label: 'Twitter', icon: Twitter, color: '#1DA1F2' }
];

const steps = [
  { id: '1', label: 'Analyzing source content...' },
  { id: '2', label: 'Extracting key insights...' },
  { id: '3', label: 'Generating platform-specific variants...' },
  { id: '4', label: 'Optimizing for engagement...' },
  { id: '5', label: 'Finalizing content...' }
];

export function MixerPage({ isOpen, sourceData, onComplete }: MixerPageProps) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedFormats, setCompletedFormats] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && sourceData) {
      startGeneration();
    }
  }, [isOpen, sourceData]);

  const startGeneration = () => {
    setGenerating(true);
    setProgress(0);
    setCurrentStep(0);
    setCompletedFormats([]);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        
        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        // Mark formats as complete based on progress
        if (newProgress > 25 && !completedFormats.includes('blog')) {
          setCompletedFormats(prev => [...prev, 'blog']);
        }
        if (newProgress > 50 && !completedFormats.includes('linkedin')) {
          setCompletedFormats(prev => [...prev, 'linkedin']);
        }
        if (newProgress > 75 && !completedFormats.includes('instagram')) {
          setCompletedFormats(prev => [...prev, 'instagram']);
        }
        if (newProgress > 90 && !completedFormats.includes('twitter')) {
          setCompletedFormats(prev => [...prev, 'twitter']);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setTimeout(() => {
            onComplete({
              variants: [
                { id: '1', platform: 'blog', content: '10 Sustainable Tips...', selected: true },
                { id: '2', platform: 'linkedin', content: 'Professional post...', selected: true },
                { id: '3', platform: 'instagram', content: 'Visual carousel...', selected: true },
                { id: '4', platform: 'twitter', content: 'Thread starter...', selected: true }
              ]
            });
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="" size="large" showClose={false}>
      {/* Workflow Progress */}
      <WorkflowProgress currentStep="mixer" />

      <ModalContent>
        <div className="min-h-[600px] flex flex-col items-center justify-center">
          {/* Animated Circle */}
          <div className="relative mb-12">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center animate-pulse-glow">
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-[#8B5CF6] animate-spin" />
              </div>
            </div>
            
            {/* Orbiting Icons */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
              {contentFormats.map((format, idx) => {
                const angle = (idx * 360) / contentFormats.length;
                const Icon = format.icon;
                const isComplete = completedFormats.includes(format.id);
                
                return (
                  <div
                    key={format.id}
                    className="absolute top-1/2 left-1/2 w-12 h-12"
                    style={{
                      transform: `rotate(${angle}deg) translateX(80px) rotate(-${angle}deg)`,
                      marginLeft: '-24px',
                      marginTop: '-24px'
                    }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        isComplete
                          ? 'bg-green-500 scale-110'
                          : 'bg-white border-2 border-[#E5E7EB]'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className="w-6 h-6" style={{ color: format.color }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <h2 className="gradient-text mb-4 text-center">⚡ AI is Working...</h2>
          <p className="text-[#6B7280] text-center mb-8">
            {sourceData?.title 
              ? `Analyzing "${sourceData.title}"`
              : 'Processing your content'}
          </p>

          {/* Progress Steps */}
          <div className="w-full max-w-md space-y-3 mb-8">
            {steps.map((step, idx) => {
              const isComplete = idx < currentStep;
              const isCurrent = idx === currentStep;
              
              return (
                <div
                  key={step.id}
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
                  <span className={`text-sm ${isCurrent ? 'text-[#1F2937] font-medium' : 'text-[#9CA3AF]'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mb-4">
            <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-[#9CA3AF]">
            {progress}% complete • Expected: {Math.max(0, Math.ceil((100 - progress) * 0.15))}s remaining
          </p>

          {/* Completed Formats Preview */}
          {completedFormats.length > 0 && (
            <div className="w-full max-w-md mt-8 bg-[#F9FAFB] rounded-xl p-6 animate-fadeIn">
              <h5 className="mb-4 text-[#1F2937]">✓ Generated Content:</h5>
              <div className="grid grid-cols-2 gap-3">
                {contentFormats.map((format) => {
                  const Icon = format.icon;
                  const isComplete = completedFormats.includes(format.id);
                  
                  return (
                    <div
                      key={format.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isComplete
                          ? 'border-[#10B981] bg-[#D1FAE5]'
                          : 'border-[#E5E7EB] bg-white opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4" style={{ color: isComplete ? '#10B981' : format.color }} />
                        <span className={`text-sm font-medium ${isComplete ? 'text-[#065F46]' : 'text-[#9CA3AF]'}`}>
                          {format.label}
                        </span>
                      </div>
                      {isComplete && (
                        <div className="flex items-center gap-1 text-xs text-[#065F46]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Ready</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ModalContent>

      <ModalFooter>
        <Button
          variant="ghost"
          onClick={() => {}}
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Close'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}