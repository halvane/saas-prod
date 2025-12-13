'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TimelineCalendar } from './TimelineCalendar';
import { UnscheduledSidebar } from './UnscheduledSidebar';
import { Sparkles, X, TrendingUp, CheckCircle } from 'lucide-react';
import { WorkflowProgress } from '@/components/ui/WorkflowProgress';

interface TimelinePageProps {
  isOpen: boolean;
  content?: any;
  onClose: () => void;
  onActivate?: () => void;
}

export function TimelinePage({ isOpen, content, onClose, onActivate }: TimelinePageProps) {
  const [showOptimalSuggestion, setShowOptimalSuggestion] = useState(true);

  const handleApplyOptimalSchedule = () => {
    console.log('Applying optimal schedule...');
    alert('Optimal schedule applied!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="full" showClose={false}>
      {/* Workflow Progress */}
      <WorkflowProgress currentStep="timeline" />

      <ModalContent>
        <div className="min-h-[700px]">
          {/* Header */}
          <div className="mb-6">
            <h2 className="gradient-text mb-2">📅 Schedule Your Content</h2>
            <p className="text-[#6B7280]">Drag posts to optimal time slots or let AI schedule for you</p>
          </div>

          {/* AI Recommendations */}
          {showOptimalSuggestion && (
            <Card variant="glass" className="mb-6 border-2 border-[#8B5CF6] animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-lg flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h4 className="mb-2">💡 AI Recommendations</h4>
                  <p className="text-sm text-[#6B7280] mb-4">
                    We've detected peak engagement windows for your audience. Apply our suggested schedule for maximum reach.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <div className="w-2 h-2 rounded-full bg-[#0077B5]" />
                        <span className="font-medium text-[#1F2937]">LinkedIn</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">Mon-Wed 9-11AM</p>
                      <p className="text-xs text-[#10B981] font-medium">+35% engagement</p>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <div className="w-2 h-2 rounded-full bg-[#DD2A7B]" />
                        <span className="font-medium text-[#1F2937]">Instagram</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">Wed-Fri 6-8PM</p>
                      <p className="text-xs text-[#10B981] font-medium">+42% reach</p>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <div className="w-2 h-2 rounded-full bg-[#1DA1F2]" />
                        <span className="font-medium text-[#1F2937]">Twitter</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">Daily 12-2PM</p>
                      <p className="text-xs text-[#10B981] font-medium">+28% interactions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="primary" size="small" onClick={handleApplyOptimalSchedule}>
                      <TrendingUp className="w-4 h-4" />
                      Apply Optimal Schedule
                    </Button>
                    <Button variant="ghost" size="small" onClick={() => setShowOptimalSuggestion(false)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar - Left 3/4 */}
            <div className="lg:col-span-3">
              <TimelineCalendar />
            </div>

            {/* Unscheduled Sidebar - Right 1/4 */}
            <div className="lg:col-span-1">
              <UnscheduledSidebar />
            </div>
          </div>

          {/* Activate Panel */}
          <div className="mt-8 bg-gradient-to-br from-[#DDD6FE] to-[#F3E8FF] rounded-xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                  <h5 className="text-[#7C3AED]">Ready to Publish</h5>
                </div>
                <p className="text-sm text-[#7C3AED]">
                  ✅ <span className="font-semibold">7 posts</span> scheduled • 
                  <span className="font-semibold"> 4 platforms</span> • 
                  Est. reach: <span className="font-semibold">12.5K</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="medium" onClick={onClose}>
                  ← Back to Edit
                </Button>
                <Button variant="secondary" size="medium">
                  Save as Draft
                </Button>
                <Button variant="primary" size="medium" onClick={onActivate} className="animate-pulse-glow">
                  🚀 ACTIVATE
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <span className="ml-2 text-sm text-[#9CA3AF]">Step 4 of 4</span>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}