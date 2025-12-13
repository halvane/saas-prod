import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, Eye, Heart, MessageCircle, Share2, TrendingUp, Trash2 } from 'lucide-react';

const activities = [
  {
    id: '1',
    status: 'published',
    title: '10 Sustainable Fashion Tips',
    platform: 'linkedin' as const,
    time: '2 hours ago',
    stats: { views: 156, likes: 12, comments: 3, shares: 2 },
    icon: CheckCircle,
    iconColor: '#10B981'
  },
  {
    id: '2',
    status: 'published',
    title: 'Fashion Carousel',
    platform: 'instagram' as const,
    time: '5 hours ago',
    stats: { views: 2890, likes: 342, comments: 45, shares: 12 },
    icon: CheckCircle,
    iconColor: '#10B981'
  },
  {
    id: '3',
    status: 'scheduled',
    title: 'Instagram Carousel for tomorrow 10AM',
    platform: 'instagram' as const,
    time: 'Tomorrow at 10:00 AM',
    actions: ['Preview', 'Edit'],
    icon: Clock,
    iconColor: '#F59E0B'
  },
  {
    id: '4',
    status: 'failed',
    title: 'Twitter thread (API limit reached)',
    platform: 'twitter' as const,
    time: 'Retry scheduled for 6PM',
    actions: ['View Details', 'Retry Now'],
    icon: AlertCircle,
    iconColor: '#EF4444'
  },
  {
    id: '5',
    status: 'published',
    title: 'AI Productivity Tools Guide',
    platform: 'blog' as const,
    time: '1 day ago',
    stats: { views: 1245, likes: 89, comments: 23, shares: 15 },
    icon: CheckCircle,
    iconColor: '#10B981'
  },
  {
    id: '6',
    status: 'published',
    title: 'Weekly Newsletter',
    platform: 'linkedin' as const,
    time: '2 days ago',
    stats: { views: 567, likes: 45, comments: 8, shares: 6 },
    icon: CheckCircle,
    iconColor: '#10B981'
  },
  {
    id: '7',
    status: 'scheduled',
    title: 'Product Launch Announcement',
    platform: 'twitter' as const,
    time: 'Dec 15 at 9:00 AM',
    actions: ['Preview', 'Edit', 'Reschedule'],
    icon: Clock,
    iconColor: '#F59E0B'
  },
  {
    id: '8',
    status: 'published',
    title: 'Behind the Scenes',
    platform: 'instagram' as const,
    time: '3 days ago',
    stats: { views: 3456, likes: 456, comments: 67, shares: 23 },
    icon: CheckCircle,
    iconColor: '#10B981'
  }
];

export function AllActivity() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [activityList, setActivityList] = useState(activities);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setActivityList(activityList.filter(activity => activity.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="gradient-text mb-2">All Activity</h2>
        <p className="text-[#6B7280]">Complete history of your content activity</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'published', label: 'Published' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'failed', label: 'Failed' }
          ]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        />
        <Select
          options={[
            { value: 'all', label: 'All Platforms' },
            { value: 'instagram', label: 'Instagram' },
            { value: 'linkedin', label: 'LinkedIn' },
            { value: 'twitter', label: 'Twitter' },
            { value: 'blog', label: 'Blog' }
          ]}
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
        />
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activityList.map((activity) => {
          const Icon = activity.icon;
          
          return (
            <Card key={activity.id} hover={true}>
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${activity.iconColor}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: activity.iconColor }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="platform" platform={activity.platform}>
                          {activity.platform.charAt(0).toUpperCase() + activity.platform.slice(1)}
                        </Badge>
                        {activity.status === 'published' && (
                          <span className="text-xs text-[#10B981] font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Published
                          </span>
                        )}
                        {activity.status === 'scheduled' && (
                          <span className="text-xs text-[#F59E0B] font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Scheduled
                          </span>
                        )}
                        {activity.status === 'failed' && (
                          <span className="text-xs text-[#EF4444] font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Failed
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-[#1F2937] mb-1">{activity.title}</p>
                      <p className="text-sm text-[#6B7280]">{activity.time}</p>
                    </div>

                    {/* Delete button for non-published posts */}
                    {activity.status !== 'published' && (
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleDelete(activity.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-[#EF4444]" />
                      </Button>
                    )}
                  </div>

                  {activity.stats && (
                    <div className="flex items-center gap-6 text-sm text-[#6B7280] mt-3 pt-3 border-t border-[#E5E7EB]">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium text-[#1F2937]">{activity.stats.views.toLocaleString()}</span>
                        <span className="text-xs">views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span className="font-medium text-[#1F2937]">{activity.stats.likes}</span>
                        <span className="text-xs">likes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium text-[#1F2937]">{activity.stats.comments}</span>
                        <span className="text-xs">comments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        <span className="font-medium text-[#1F2937]">{activity.stats.shares}</span>
                        <span className="text-xs">shares</span>
                      </div>
                    </div>
                  )}

                  {activity.actions && (
                    <div className="flex items-center gap-2 mt-3">
                      {activity.actions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          className="px-3 py-1.5 text-sm font-medium text-[#8B5CF6] hover:bg-[#DDD6FE]/20 rounded-md transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <button className="px-6 py-3 text-sm font-medium text-[#8B5CF6] hover:bg-[#F3F4F6] rounded-lg transition-colors">
          Load More Activity
        </button>
      </div>
    </div>
  );
}