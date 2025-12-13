'use client';

import { DashboardLayout } from '@/components/custom/Dashboard/DashboardLayout';
import { WeeklyTimeline } from '@/components/custom/Dashboard/WeeklyTimeline';
import { QuickStats } from '@/components/custom/Dashboard/QuickStats';
import { ActivityFeed } from '@/components/custom/Dashboard/ActivityFeed';
import { useRouter } from 'next/navigation';

export default function CustomDashboardPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    switch(page) {
      case 'create':
        router.push('/radar');
        break;
      case 'templates':
        router.push('/templates');
        break;
      case 'calendar':
        router.push('/timeline');
        break;
      case 'drafts':
        router.push('/drafts');
        break;
      default:
        break;
    }
  };

  const handleViewCalendar = () => {
    router.push('/timeline');
  };

  const handleViewActivity = () => {
    router.push('/timeline');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Quick Stats */}
        <QuickStats onNavigate={handleNavigate} />

        {/* Weekly Timeline */}
        <WeeklyTimeline onViewCalendar={handleViewCalendar} />

        {/* Activity Feed */}
        <ActivityFeed onViewAll={handleViewActivity} />
      </div>
    </DashboardLayout>
  );
}
