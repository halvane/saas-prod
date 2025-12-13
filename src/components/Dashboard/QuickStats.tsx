import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, Zap, Calendar, FileText } from 'lucide-react';

interface QuickStatsProps {
  onNavigate?: (page: string) => void;
}

const stats = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    label: 'Trending Topics',
    value: '5',
    description: 'Topics detected',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    link: 'create'
  },
  {
    icon: <FileText className="w-6 h-6" />,
    label: 'Templates Ready',
    value: '12',
    description: 'Ready to use',
    color: '#8B5CF6',
    bgColor: '#DDD6FE',
    link: 'templates'
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    label: 'Scheduled',
    value: '7',
    description: 'This week',
    color: '#10B981',
    bgColor: '#D1FAE5',
    link: 'calendar'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    label: 'Pending Review',
    value: '3',
    description: 'Drafts waiting',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    link: 'drafts'
  }
];

export function QuickStats({ onNavigate }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <Card
          key={idx}
          hover={true}
          className="animate-fadeIn cursor-pointer"
          style={{ animationDelay: `${idx * 50}ms` }}
          onClick={() => onNavigate?.(stat.link)}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: stat.bgColor }}
            >
              <div style={{ color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div className="text-xs text-[#10B981] font-semibold">
              +12% ↑
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-3xl font-bold text-[#1F2937]">{stat.value}</div>
            <div className="font-medium text-[#1F2937]">{stat.label}</div>
            <div className="text-sm text-[#9CA3AF]">{stat.description}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}