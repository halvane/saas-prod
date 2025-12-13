import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Clock, Edit, Trash2, Sparkles } from 'lucide-react';

interface ScheduledPost {
  id: string;
  platform: 'instagram' | 'linkedin' | 'twitter' | 'blog' | 'pinterest';
  title: string;
  day: number;
  hour: number;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 24 }, (_, i) => i);

const mockScheduledPosts: ScheduledPost[] = [
  { id: '1', platform: 'linkedin', title: '10 Tips...', day: 0, hour: 9 },
  { id: '2', platform: 'twitter', title: 'Thread...', day: 1, hour: 12 },
  { id: '3', platform: 'instagram', title: 'Carousel', day: 2, hour: 15 },
  { id: '4', platform: 'blog', title: 'Full Guide', day: 3, hour: 18 }
];

export function TimelineCalendar() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(mockScheduledPosts);
  const [currentWeek, setCurrentWeek] = useState(0);

  const getPostsForDayAndHour = (day: number, hour: number) => {
    return scheduledPosts.filter(post => post.day === day && post.hour === hour);
  };

  const isOptimalTime = (day: number, hour: number) => {
    // Mock optimal times
    if (day < 3 && hour >= 9 && hour <= 11) return true; // LinkedIn morning
    if (day >= 2 && day <= 4 && hour >= 18 && hour <= 20) return true; // Instagram evening
    if (hour >= 12 && hour <= 14) return true; // Twitter lunch
    return false;
  };

  const handleDeletePost = (id: string) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="mb-1">Content Calendar</h3>
          <p className="text-sm text-[#6B7280]">Week of Dec 9 - Dec 15, 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="small">
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Button>
          <Button variant="secondary" size="small">
            Today
          </Button>
          <Button variant="ghost" size="small">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex items-center gap-2">
        <Button variant="primary" size="small">Week</Button>
        <Button variant="ghost" size="small">Month</Button>
        <Button variant="ghost" size="small">List</Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-8 border-b border-[#E5E7EB]">
          <div className="p-3 bg-[#F9FAFB]" />
          {daysOfWeek.map((day, idx) => (
            <div key={day} className="p-3 bg-[#F9FAFB] border-l border-[#E5E7EB]">
              <div className="font-semibold text-sm text-[#1F2937]">{day.slice(0, 3)}</div>
              <div className="text-xs text-[#9CA3AF]">{9 + idx}</div>
            </div>
          ))}
        </div>

        {/* Timeline Grid - Showing key hours only for better UX */}
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {[9, 12, 15, 18, 21].map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-[#E5E7EB] hover:bg-[#FAFAFA] transition-colors">
              {/* Hour Label */}
              <div className="p-3 bg-[#F9FAFB] border-r border-[#E5E7EB] sticky left-0">
                <div className="text-sm font-medium text-[#6B7280]">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
              </div>

              {/* Day Cells */}
              {daysOfWeek.map((_, dayIdx) => {
                const posts = getPostsForDayAndHour(dayIdx, hour);
                const isOptimal = isOptimalTime(dayIdx, hour);

                return (
                  <div
                    key={dayIdx}
                    className={`p-2 border-l border-[#E5E7EB] min-h-[80px] transition-colors ${
                      isOptimal ? 'bg-[#D1FAE5]/20' : ''
                    }`}
                  >
                    {posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onDelete={handleDeletePost}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, onDelete }: { post: ScheduledPost; onDelete: (id: string) => void }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="group mb-2 last:mb-0"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-2 rounded-lg bg-white border-2 border-[#E5E7EB] hover:border-[#8B5CF6] shadow-sm hover:shadow-md transition-all cursor-move">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Badge variant="platform" platform={post.platform} className="text-xs">
            {post.platform}
          </Badge>
          {showActions && (
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-[#F3F4F6] rounded transition-colors">
                <Edit className="w-3 h-3 text-[#8B5CF6]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post.id);
                }}
                className="p-1 hover:bg-[#FEE2E2] rounded transition-colors"
              >
                <Trash2 className="w-3 h-3 text-[#EF4444]" />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-[#1F2937] font-medium truncate">{post.title}</p>
      </div>
    </div>
  );
}
