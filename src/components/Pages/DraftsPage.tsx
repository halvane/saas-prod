import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/button';
import { Badge } from '../ui/Badge';
import { Clock, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';

const mockDrafts = [
  {
    id: '1',
    title: 'LinkedIn Professional Post',
    platform: 'linkedin' as const,
    type: 'Article',
    created: 'Dec 8, 2025',
    lastEdited: '2 hours ago',
    bestTime: '9-11AM',
    engagement: '+35%'
  },
  {
    id: '2',
    title: 'Pinterest Pin - Eco Fashion',
    platform: 'pinterest' as const,
    type: 'Pin',
    created: 'Dec 7, 2025',
    lastEdited: '1 day ago',
    bestTime: '8PM',
    engagement: '+28%'
  },
  {
    id: '3',
    title: 'TikTok Video Script',
    platform: 'twitter' as const,
    type: 'Video',
    created: 'Dec 6, 2025',
    lastEdited: '2 days ago',
    bestTime: '7PM',
    engagement: '+42%'
  }
];

export function DraftsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="gradient-text mb-2">Draft Content</h2>
          <p className="text-[#6B7280]">Review and schedule your draft posts</p>
        </div>
        <Button variant="primary" size="medium">
          <Edit className="w-4 h-4" />
          Create New Draft
        </Button>
      </div>

      {/* AI Suggestion Banner */}
      <Card variant="glass" className="border-2 border-[#8B5CF6]">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-lg flex-shrink-0">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2">💡 Optimal Scheduling Available</h4>
            <p className="text-sm text-[#6B7280] mb-4">
              AI has detected the best times to publish your drafts based on your audience engagement patterns.
            </p>
            <Button variant="primary" size="small">
              Auto-Schedule All Drafts
            </Button>
          </div>
        </div>
      </Card>

      {/* Drafts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDrafts.map((draft) => (
          <Card key={draft.id} hover={true} variant="platform" platformColor={
            draft.platform === 'linkedin' ? '#0077B5' :
            draft.platform === 'pinterest' ? '#E60023' :
            '#1DA1F2'
          }>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Badge variant="platform" platform={draft.platform}>
                  {draft.platform}
                </Badge>
                <Badge variant="warning">
                  <Clock className="w-3 h-3" />
                  Draft
                </Badge>
              </div>

              <div>
                <h4 className="mb-2 line-clamp-2">{draft.title}</h4>
                <p className="text-sm text-[#6B7280]">{draft.type} • Created {draft.created}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">Last edited: {draft.lastEdited}</p>
              </div>

              <div className="p-3 bg-[#D1FAE5] rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-[#065F46] mb-1">Best time to post:</p>
                    <p className="font-semibold text-[#065F46]">{draft.bestTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#065F46] mb-1">Engagement:</p>
                    <p className="font-semibold text-[#10B981]">{draft.engagement}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-[#E5E7EB]">
                <Button variant="primary" size="small" className="flex-1">
                  <CalendarIcon className="w-4 h-4" />
                  Schedule
                </Button>
                <Button variant="ghost" size="small" className="flex-1">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="ghost" size="small">
                  <Trash2 className="w-4 h-4 text-[#EF4444]" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State (if no drafts) */}
      {mockDrafts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#F3F4F6] rounded-full flex items-center justify-center">
            <Edit className="w-10 h-10 text-[#9CA3AF]" />
          </div>
          <h3 className="mb-3 text-[#1F2937]">No Drafts Yet</h3>
          <p className="text-[#6B7280] mb-6 max-w-md mx-auto">
            Start creating content and save drafts to schedule them later at optimal times.
          </p>
          <Button variant="primary" size="large">
            Create Your First Draft
          </Button>
        </div>
      )}
    </div>
  );
}
