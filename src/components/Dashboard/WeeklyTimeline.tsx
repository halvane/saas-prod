import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Linkedin, Twitter, Instagram, FileText, PinIcon as Pinterest } from 'lucide-react';

interface ScheduledPost {
  day: string;
  platform: 'instagram' | 'linkedin' | 'twitter' | 'blog' | 'pinterest';
  title: string;
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const mockPosts: ScheduledPost[] = [
  { day: 'Mon', platform: 'linkedin', title: '10 Sustainable Tips' },
  { day: 'Tue', platform: 'instagram', title: 'Fashion Carousel' },
  { day: 'Wed', platform: 'twitter', title: 'Eco Thread' },
  { day: 'Thu', platform: 'blog', title: 'Full Guide' }
];

const platformConfig = {
  instagram: { icon: Instagram, gradient: 'from-[#F58529] via-[#DD2A7B] to-[#8134AF]' },
  linkedin: { icon: Linkedin, gradient: 'from-[#0077B5] to-[#006399]' },
  twitter: { icon: Twitter, gradient: 'from-[#1DA1F2] to-[#0c85d0]' },
  blog: { icon: FileText, gradient: 'from-[#8B5CF6] to-[#7C3AED]' },
  pinterest: { icon: Pinterest, gradient: 'from-[#E60023] to-[#bd001c]' }
};

interface WeeklyTimelineProps {
  onViewCalendar?: () => void;
}

export function WeeklyTimeline({ onViewCalendar }: WeeklyTimelineProps) {
  return (
    <div className="mb-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h2 className="gradient-text">✨ This Week's Content Pipeline</h2>
        <div className="text-sm text-[#6B7280]">Dec 9 - Dec 15, 2025</div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          {daysOfWeek.map((day, idx) => (
            <div key={day} className="text-center">
              <div className="font-semibold text-[#1F2937] mb-2">{day}</div>
              <div className="text-xs text-[#9CA3AF]">
                {new Date(2025, 11, 9 + daysOfWeek.indexOf(day)).getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Posts Timeline */}
        <div className="grid grid-cols-7 gap-4 min-h-[120px]">
          {daysOfWeek.map((day) => {
            const dayPosts = mockPosts.filter((post) => post.day === day);
            
            return (
              <div key={day} className="border-l-2 border-[#E5E7EB] pl-3 space-y-3">
                {dayPosts.map((post, idx) => {
                  const config = platformConfig[post.platform];
                  const Icon = config.icon;
                  
                  return (
                    <div
                      key={idx}
                      className="group cursor-pointer"
                    >
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${config.gradient} hover:shadow-lg transition-all`}>
                        <Icon className="w-5 h-5 text-white mb-1" />
                        <span className="text-white text-xs font-medium capitalize">
                          {post.platform}
                        </span>
                      </div>
                      <div className="text-xs text-[#6B7280] mt-2 opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                        {post.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div className="mt-6 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
          <div className="text-sm text-[#6B7280]">
            📊 <span className="font-semibold text-[#1F2937]">7 posts</span> scheduled • 
            <span className="font-semibold text-[#1F2937]"> 4 platforms</span> • 
            Est. reach: <span className="font-semibold text-[#8B5CF6]">12.5K</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="small"
              onClick={onViewCalendar}
            >
              View Calendar →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}