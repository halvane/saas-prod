'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/custom/Admin/AdminLayout';
import { AdminDashboard } from '@/components/custom/Admin/AdminDashboard';
import { UserManagement } from '@/components/custom/Admin/UserManagement';

interface AdminClientPageProps {
  stats: any;
  users: any[];
}

export function AdminClientPage({ stats, users }: AdminClientPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard stats={stats} />;
      case 'users':
        return <UserManagement users={users} />;
      default:
        return <AdminDashboard stats={stats} />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
}
