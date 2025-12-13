import React, { ReactNode } from 'react';
import { Sparkles, Calendar, Layout, Settings, LogOut, Menu, X, Plus, FileText, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { NotificationCenter } from '../ui/NotificationCenter';

interface DashboardLayoutProps {
  children: ReactNode;
  onCreateCampaign?: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function DashboardLayout({ children, onCreateCampaign, onNavigate, currentPage = 'dashboard' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-[#F3F4F6]"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h5 className="gradient-text">Viral Loop Engine</h5>
                </div>
              </div>
            </div>

            {/* Action Buttons & User Menu */}
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => onNavigate?.('calendar')}
                className="hidden md:inline-flex"
              >
                <Eye className="w-4 h-4" />
                View Calendar
              </Button>
              
              <Button 
                variant="primary" 
                size="medium"
                onClick={onCreateCampaign}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create New Campaign</span>
                <span className="sm:hidden">Create</span>
              </Button>

              {/* Notification Center */}
              <NotificationCenter />
              
              <div className="relative">
                <div 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">ST</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-[#1F2937]">Sarah Thompson</p>
                    <p className="text-xs text-[#6B7280]">Pro Plan</p>
                  </div>
                </div>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E5E7EB] animate-fadeIn z-50">
                    <div className="p-4 border-b border-[#E5E7EB]">
                      <p className="font-medium text-[#1F2937]">Sarah Thompson</p>
                      <p className="text-sm text-[#6B7280]">sarah@example.com</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          onNavigate?.('profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm text-[#1F2937]"
                      >
                        👤 View Profile
                      </button>
                      <button
                        onClick={() => {
                          onNavigate?.('settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm text-[#1F2937]"
                      >
                        ⚙️ Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FEE2E2] transition-colors text-sm text-[#EF4444]">
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:block fixed left-0 top-16 bottom-0 bg-white border-r border-[#E5E7EB] overflow-y-auto custom-scrollbar transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-[#E5E7EB] flex justify-end">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
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
            onClick={() => onNavigate?.('dashboard')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<Sparkles />} 
            label="Create Content" 
            active={currentPage === 'create'}
            onClick={() => onNavigate?.('create')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<FileText />} 
            label="Content Library" 
            active={currentPage === 'content'}
            onClick={() => onNavigate?.('content')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<Calendar />} 
            label="Calendar" 
            active={currentPage === 'calendar'}
            onClick={() => onNavigate?.('calendar')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<Layout />} 
            label="Templates" 
            active={currentPage === 'templates'}
            onClick={() => onNavigate?.('templates')}
            collapsed={sidebarCollapsed}
          />
          <NavItem 
            icon={<Settings />} 
            label="Settings" 
            active={currentPage === 'settings'}
            onClick={() => onNavigate?.('settings')}
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-[#E5E7EB] animate-slideInRight">
            <nav className="p-4 space-y-1">
              <NavItem 
                icon={<Layout />} 
                label="Dashboard" 
                active={currentPage === 'dashboard'}
                onClick={() => { onNavigate?.('dashboard'); setSidebarOpen(false); }}
                collapsed={false}
              />
              <NavItem 
                icon={<Sparkles />} 
                label="Create Content" 
                active={currentPage === 'create'}
                onClick={() => { onNavigate?.('create'); setSidebarOpen(false); }}
                collapsed={false}
              />
              <NavItem 
                icon={<FileText />} 
                label="Content Library" 
                active={currentPage === 'content'}
                onClick={() => { onNavigate?.('content'); setSidebarOpen(false); }}
                collapsed={false}
              />
              <NavItem 
                icon={<Calendar />} 
                label="Calendar" 
                active={currentPage === 'calendar'}
                onClick={() => { onNavigate?.('calendar'); setSidebarOpen(false); }}
                collapsed={false}
              />
              <NavItem 
                icon={<Layout />} 
                label="Templates" 
                active={currentPage === 'templates'}
                onClick={() => { onNavigate?.('templates'); setSidebarOpen(false); }}
                collapsed={false}
              />
              <NavItem 
                icon={<Settings />} 
                label="Settings" 
                active={currentPage === 'settings'}
                onClick={() => { onNavigate?.('settings'); setSidebarOpen(false); }}
                collapsed={false}
              />
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={`pt-6 min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {children}
        </div>
      </main>
    </div>
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