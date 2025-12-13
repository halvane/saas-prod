import React, { ReactNode, useState } from 'react';
import { BarChart3, Users, CreditCard, FileText, Key, TrendingUp, Mail, MessageCircle, Settings, Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
  { id: 'users', icon: Users, label: 'Users' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
  { id: 'templates', icon: FileText, label: 'Templates' },
  { id: 'api-keys', icon: Key, label: 'API Keys' },
  { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
  { id: 'marketing', icon: Mail, label: 'Marketing' },
  { id: 'support', icon: MessageCircle, label: 'Support' },
  { id: 'settings', icon: Settings, label: 'Settings' }
];

export function AdminLayout({ children, activeTab = 'dashboard', onTabChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Bar */}
      <nav className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h5 className="text-white">VIRAL LOOP ENGINE</h5>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">Admin Panel</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#8B5CF6] font-semibold text-sm">MW</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Marcus Williams</p>
                  <p className="text-xs opacity-75">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-[#E5E7EB] min-h-screen">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange?.(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-md'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 top-16">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-[#E5E7EB] animate-slideInRight">
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange?.(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-md'
                          : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
