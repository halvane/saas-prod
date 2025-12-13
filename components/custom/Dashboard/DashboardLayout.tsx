'use client';

import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  onCreateCampaign?: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-[#FAFAFA]">
      {children}
    </div>
  );
}