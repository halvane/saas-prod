'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, Eye, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/ui/NotificationCenter';
import { useRouter } from 'next/navigation';
import { signOut } from '@/app/(login)/actions';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface HeaderProps {
  onNavigate?: (page: string) => void;
  onCreateCampaign?: () => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: (open: boolean) => void;
}

export function Header({ onNavigate, onCreateCampaign, sidebarOpen, onToggleSidebar }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const { data: user } = useSWR<User>('/api/user', fetcher);

  const handleCreateCampaign = () => {
    if (onCreateCampaign) {
      onCreateCampaign();
    } else {
      router.push('/mixer');
    }
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      switch (page) {
        case 'calendar':
          router.push('/timeline');
          break;
        case 'settings':
          router.push('/settings');
          break;
        default:
          break;
      }
    }
    setShowProfileMenu(false);
  };

  const handleSignOut = async () => {
    await signOut();
    // The server action will handle the redirect
  };

  return (
    <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleSidebar?.(!sidebarOpen)}
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
            {user?.role === 'admin' && (
              <Button 
                asChild 
                variant="ghost" 
                size="small"
                className="hidden md:inline-flex text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Link href="/admin">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => handleNavigate('calendar')}
              className="hidden md:inline-flex"
            >
              <Eye className="w-4 h-4" />
              View Calendar
            </Button>
            
            <Button 
              variant="primary" 
              size="medium"
              onClick={handleCreateCampaign}
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
                      onClick={() => handleNavigate('profile')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm text-[#1F2937]"
                    >
                      👤 View Profile
                    </button>
                    <button
                      onClick={() => handleNavigate('settings')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm text-[#1F2937]"
                    >
                      ⚙️ Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FEE2E2] transition-colors text-sm text-[#EF4444]"
                    >
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
  );
}
