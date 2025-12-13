'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, Eye, Heart, MessageCircle, ArrowRight } from 'lucide-react';

const activities = [
  {
    status: 'published',
    title: '10 Sustainable Fashion Tips',
    platform: 'linkedin' as const,
    time: '2 hours ago',
    stats: { views: 156, engagements: 12 },
    icon: CheckCircle,
    iconColor: '#10B981'
  },
  {
    status: 'scheduled',
    title: 'Instagram Carousel for tomorrow 10AM',
    platform: 'instagram' as const,
    time: 'Draft ready',
    actions: ['Preview', 'Edit'],
    icon: Clock,
    iconColor: '#F59E0B'
  },
  {
    status: 'failed',
    title: 'Twitter thread (API limit reached)',
    platform: 'twitter' as const,
    time: 'Retry scheduled for 6PM',
    actions: ['View Details'],
    icon: AlertCircle,
    iconColor: '#EF4444'
  }
];

interface ActivityFeedProps {
  onViewAll?: () => void;
}

export function ActivityFeed({ onViewAll }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h3>📰 Recent Activity</h3>
        <button 
          onClick={onViewAll}
          className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] font-medium transition-colors flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, idx) => {
          const Icon = activity.icon;
          
          return (
            <div
              key={idx}
              className="p-4 rounded-lg hover:bg-[#F9FAFB] transition-colors border border-transparent hover:border-[#E5E7EB]"
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${activity.iconColor}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: activity.iconColor }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="platform" platform={activity.platform}>
                          {activity.platform.charAt(0).toUpperCase() + activity.platform.slice(1)}
                        </Badge>
                        {activity.status === 'published' && (
                          <span className="text-xs text-[#10B981] font-medium">Published</span>
                        )}
                        {activity.status === 'scheduled' && (
                          <span className="text-xs text-[#F59E0B] font-medium">Scheduled</span>
                        )}
                        {activity.status === 'failed' && (
                          <span className="text-xs text-[#EF4444] font-medium">Failed</span>
                        )}
                      </div>
                      <p className="font-medium text-[#1F2937] mb-1">{activity.title}</p>
                      <p className="text-sm text-[#6B7280]">{activity.time}</p>
                    </div>
                  </div>

                  {activity.stats && (
                    <div className="flex items-center gap-4 text-sm text-[#6B7280] mt-2">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{activity.stats.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{activity.stats.engagements} engagements</span>
                      </div>
                    </div>
                  )}

                  {activity.actions && (
                    <div className="flex items-center gap-2 mt-3">
                      {activity.actions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          className="px-3 py-1 text-sm font-medium text-[#8B5CF6] hover:bg-[#DDD6FE]/20 rounded-md transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}