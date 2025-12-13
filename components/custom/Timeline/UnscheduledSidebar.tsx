import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles } from 'lucide-react';

const unscheduledPosts = [
  {
    id: 'draft-1',
    platform: 'linkedin' as const,
    title: 'Draft #2',
    bestTime: '9-11AM',
    engagement: '+35%'
  },
  {
    id: 'draft-2',
    platform: 'pinterest' as const,
    title: 'Eco Fashion Tips',
    bestTime: '8PM',
    engagement: '+28%'
  },
  {
    id: 'draft-3',
    platform: 'twitter' as const,
    title: 'Tech Thread',
    bestTime: '12-2PM',
    engagement: '+42%'
  }
];

interface UnscheduledSidebarProps {
  onViewAllDrafts?: () => void;
}

export function UnscheduledSidebar({ onViewAllDrafts }: UnscheduledSidebarProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h4>📦 Ready to Schedule</h4>
        <span className="text-sm text-[#9CA3AF]">{unscheduledPosts.length} drafts</span>
      </div>

      <p className="text-sm text-[#6B7280] mb-4">
        Drag to timeline →
      </p>

      <div className="space-y-3">
        {unscheduledPosts.map((post) => (
          <Card
            key={post.id}
            variant="standard"
            hover={true}
            className="cursor-move border-2 border-dashed border-[#E5E7EB] hover:border-[#8B5CF6] transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Badge variant="platform" platform={post.platform}>
                  {post.platform}
                </Badge>
              </div>
              
              <p className="font-medium text-[#1F2937] text-sm">{post.title}</p>
              
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-[#10B981]">
                  <Clock className="w-3 h-3" />
                  <span>Best: {post.bestTime}</span>
                </div>
                <span className="text-[#9CA3AF]">•</span>
                <span className="text-[#9CA3AF]">{post.engagement} engagement</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <button 
        onClick={onViewAllDrafts}
        className="w-full mt-4 px-4 py-2 text-sm text-[#8B5CF6] hover:bg-[#F3F4F6] rounded-lg transition-colors font-medium"
      >
        View All Drafts (12)
      </button>
    </div>
  );
}