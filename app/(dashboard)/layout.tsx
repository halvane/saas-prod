'use client';

import Link from 'next/link';
import { use, useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CircleIcon, Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BottomNavigation } from '@/components/custom/BottomNavigation';
import { Header } from '@/components/custom/Dashboard/Header';
import { Sidebar } from '@/components/custom/Dashboard/Sidebar';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  if (!user) {
    return (
      <>
        <Link
          href="/pricing"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Pricing
        </Link>
        <Button asChild className="rounded-full">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>
            {user.email
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigate = (page: string) => {
    switch(page) {
      case 'editor':
        router.push('/editor');
        break;
      case 'calendar':
        router.push('/timeline');
        break;
      case 'brand':
        router.push('/brand');
        break;
      case 'radar':
        router.push('/radar');
        break;
      case 'mixer':
        router.push('/mixer');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'templates':
        router.push('/templates');
        break;
      case 'library':
        router.push('/library');
        break;
      case 'drafts':
        router.push('/drafts');
        break;
      case 'create':
        router.push('/radar');
        break;
      case 'content':
        router.push('/library');
        break;
      case 'dashboard':
        router.push('/dashboard');
        break;
      default:
        router.push('/dashboard');
    }
  };

  const handleCreateCampaign = () => {
    router.push('/mixer');
  };

  const getActiveTab = () => {
    if (pathname === '/dashboard') return 'home';
    if (pathname?.includes('/editor') || pathname?.includes('/radar') || pathname?.includes('/mixer')) return 'create';
    if (pathname?.includes('/calendar') || pathname?.includes('/timeline')) return 'calendar';
    if (pathname?.includes('/settings')) return 'profile';
    return 'home';
  };

  const getCurrentPage = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname?.includes('/editor')) return 'editor';
    if (pathname?.includes('/radar')) return 'radar';
    if (pathname?.includes('/mixer')) return 'mixer';
    if (pathname?.includes('/timeline') || pathname?.includes('/calendar')) return 'calendar';
    if (pathname?.includes('/settings')) return 'settings';
    if (pathname?.includes('/templates')) return 'templates';
    if (pathname?.includes('/library')) return 'content';
    if (pathname?.includes('/drafts')) return 'drafts';
    return 'dashboard';
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        router.push('/dashboard');
        break;
      case 'create':
        router.push('/radar');
        break;
      case 'calendar':
        router.push('/timeline');
        break;
      case 'profile':
        router.push('/settings');
        break;
    }
  };

  return (
    <section className="flex flex-col min-h-screen">
      <Header 
        onNavigate={handleNavigate}
        onCreateCampaign={handleCreateCampaign}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={setSidebarOpen}
      />
      <div className="flex flex-1">
        <Sidebar 
          currentPage={getCurrentPage()}
          onNavigate={handleNavigate}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebarCollapse={setSidebarCollapsed}
        />
        <main className={`flex-1 pb-20 lg:pb-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
      <BottomNavigation activeTab={getActiveTab()} onTabChange={handleTabChange} />
    </section>
  );
}
