import React from 'react';
import { TimelineCalendar } from '../Timeline/TimelineCalendar';
import { UnscheduledSidebar } from '../Timeline/UnscheduledSidebar';
import { Button } from '../ui/button';
import { FileText } from 'lucide-react';

interface CalendarViewProps {
  onNavigate?: (page: string) => void;
}

export function CalendarView({ onNavigate }: CalendarViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="gradient-text mb-2">Content Calendar</h2>
          <p className="text-[#6B7280]">View and manage your scheduled content</p>
        </div>
        <Button 
          variant="secondary" 
          size="medium"
          onClick={() => onNavigate?.('drafts')}
        >
          <FileText className="w-4 h-4" />
          View All Drafts
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <TimelineCalendar />
        </div>
        <div className="lg:col-span-1">
          <UnscheduledSidebar onViewAllDrafts={() => onNavigate?.('drafts')} />
        </div>
      </div>
    </div>
  );
}