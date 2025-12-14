'use client';

import React, { ReactNode } from 'react';
import { Calendar, Layout, Settings, FileText, Sparkles, ChevronLeft, ChevronRight, Palette } from 'lucide-react';

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: (open: boolean) => void;
  sidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ 
  currentPage = 'dashboard', 
  onNavigate, 
  sidebarOpen = false,
  onToggleSidebar,
  sidebarCollapsed = false,
  onToggleSidebarCollapse
}: SidebarProps) {
  
  const handleNavItem = (page: string) => {
    onNavigate?.(page);
  };

  const handleMobileNavItem = (page: string) => {
    onNavigate?.(page);
    onToggleSidebar?.(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block fixed left-0 top-16 bottom-0 bg-white border-r border-[#E5E7EB] overflow-y-auto custom-scrollbar transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-[#E5E7EB] flex justify-end">
          <button
            onClick={() => onToggleSidebarCollapse?.(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-[#6B7280]" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
            )}
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <NavItem 
            icon={<Layout />} 
            label="Dashboard" 
            active={currentPage === 'dashboard'}
            onClick={() => handleNavItem('dashboard')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<Sparkles />} 
            label="Create Content" 
            active={currentPage === 'create'}
            onClick={() => handleNavItem('create')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<FileText />} 
            label="Content Library" 
            active={currentPage === 'content'}
            onClick={() => handleNavItem('content')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<Calendar />} 
            label="Calendar" 
            active={currentPage === 'calendar'}
            onClick={() => handleNavItem('calendar')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<Layout />} 
            label="Templates" 
            active={currentPage === 'templates'}
            onClick={() => handleNavItem('templates')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<Palette />} 
            label="Brand DNA" 
            active={currentPage === 'brand'}
            onClick={() => handleNavItem('brand')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<Settings />} 
            label="Settings" 
            active={currentPage === 'settings'}
            onClick={() => handleNavItem('settings')}
            collapsed={sidebarCollapsed}
          />
        </nav>
        
        {!sidebarCollapsed && (
          <div className="p-4 mt-8 border-t border-[#E5E7EB]">
            <div className="bg-gradient-to-br from-[#DDD6FE] to-[#F3E8FF] rounded-lg p-4">
              <h5 className="text-sm font-semibold text-[#7C3AED] mb-2">Usage This Month</h5>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#6B7280]">Posts Created</span>
                    <span className="font-medium text-[#1F2937]">450/500</span>
                  </div>
                  <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 top-16">
          <div className="absolute inset-0 bg-black/50" onClick={() => onToggleSidebar?.(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-[#E5E7EB] animate-slideInRight">
            <nav className="p-4 space-y-1">
              <NavItem 
                icon={<Layout />} 
                label="Dashboard" 
                active={currentPage === 'dashboard'}
                onClick={() => handleMobileNavItem('dashboard')}
                collapsed={false}
              />
              <NavItem 
                icon={<Sparkles />} 
                label="Create Content" 
                active={currentPage === 'create'}
                onClick={() => handleMobileNavItem('create')}
                collapsed={false}
              />
              <NavItem 
                icon={<FileText />} 
                label="Content Library" 
                active={currentPage === 'content'}
                onClick={() => handleMobileNavItem('content')}
                collapsed={false}
              />
              <NavItem 
                icon={<Calendar />} 
                label="Calendar" 
                active={currentPage === 'calendar'}
                onClick={() => handleMobileNavItem('calendar')}
                collapsed={false}
              />
              <NavItem 
                icon={<Layout />} 
                label="Templates" 
                active={currentPage === 'templates'}
                onClick={() => handleMobileNavItem('templates')}
                collapsed={false}
              />
              <NavItem 
                icon={<Settings />} 
                label="Settings" 
                active={currentPage === 'settings'}
                onClick={() => handleMobileNavItem('settings')}
                collapsed={false}
              />
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

function NavItem({ 
  icon, 
  label, 
  active = false,
  onClick,
  collapsed = false
}: { 
  icon: ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg font-medium transition-all ${
        active
          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-md'
          : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
      }`}
      title={collapsed ? label : undefined}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
