import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, DollarSign, FileText, Zap, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface AdminDashboardProps {
  stats: {
    totalUsers: number;
    totalTeams: number;
    mrr: number;
    recentActivity: any[];
    planDistribution: any[];
  };
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const metrics = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%', // This would need historical data to be real
      trend: 'up',
      icon: Users,
      color: '#8B5CF6'
    },
    {
      label: 'MRR',
      value: `$${stats.mrr.toLocaleString()}`,
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: '#10B981'
    },
    {
      label: 'Teams',
      value: stats.totalTeams.toLocaleString(),
      change: '+23%',
      trend: 'up',
      icon: FileText,
      color: '#3B82F6'
    },
    {
      label: 'API Uptime',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: Zap,
      color: '#F59E0B'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="gradient-text mb-2">Dashboard Overview</h2>
        <p className="text-[#6B7280]">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={idx} hover={true} className="animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: metric.color }} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  metric.trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{metric.change}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#1F2937]">{metric.value}</div>
                <div className="text-sm text-[#6B7280]">{metric.label}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-around gap-2">
              {[15, 18, 16, 20, 22, 21, 24].map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-[#8B5CF6] to-[#A78BFA] rounded-t-lg transition-all hover:from-[#7C3AED] hover:to-[#8B5CF6]"
                    style={{ height: `${(value / 24) * 100}%` }}
                  />
                  <span className="text-xs text-[#9CA3AF]">
                    {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Dec'][idx]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Current: <span className="font-semibold text-[#1F2937]">${stats.mrr.toLocaleString()}</span></span>
              <span className="text-[#6B7280]">Target: <span className="font-semibold text-[#8B5CF6]">$30,000</span></span>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.planDistribution.map((plan, idx) => {
                const percentage = stats.totalUsers > 0 ? (plan.users / stats.totalUsers) * 100 : 0;
                
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-[#1F2937]">{plan.plan}</span>
                        <span className="text-sm text-[#6B7280]">{plan.users} users</span>
                      </div>
                      <span className="font-semibold text-[#8B5CF6]">{plan.revenue}</span>
                    </div>
                    <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-sm text-[#6B7280]">
              Total MRR: <span className="font-semibold text-[#1F2937]">${stats.mrr.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#8B5CF6]" />
              Recent Activity
            </CardTitle>
            <button className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] font-medium transition-colors">
              View All
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? stats.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div className="flex-1">
                  <p className="text-sm text-[#1F2937] mb-1">{activity.message}</p>
                  <p className="text-xs text-[#9CA3AF]">{activity.time}</p>
                </div>
                {activity.action && (
                  <button className="px-3 py-1 text-sm font-medium text-[#8B5CF6] hover:bg-[#DDD6FE]/20 rounded-md transition-colors">
                    {activity.action}
                  </button>
                )}
              </div>
            )) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
