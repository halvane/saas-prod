'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/custom/Admin/AdminLayout';
import { AdminDashboard } from '@/components/custom/Admin/AdminDashboard';
import { UserManagement } from '@/components/custom/Admin/UserManagement';
import { TemplateManagement } from '@/components/custom/Admin/TemplateManagement';

interface AdminClientPageProps {
  stats: any;
  users: any[];
  templates: any[];
}

export function AdminClientPage({ stats, users, templates }: AdminClientPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard stats={stats} />;
      case 'users':
        return <UserManagement users={users} />;
      case 'templates':
        return <TemplateManagement initialTemplates={templates} />;
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
