import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || user.role !== 'admin') {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-gray-900">Admin Dashboard</span>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Switch to Dashboard
          </Link>
        </Button>
      </header>
      {children}
    </div>
  );
}
