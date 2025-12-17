import { SectionEditor } from '@/components/custom/Admin/Sections/SectionEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminLayout } from '@/components/custom/Admin/AdminLayout';

export default function NewSectionPage() {
  return (
    <AdminLayout activeTab="sections">
      <div className="p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)] flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/sections">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New Section</h1>
            <p className="text-gray-500 text-sm">Design a reusable component for the builder.</p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <SectionEditor />
        </div>
      </div>
    </AdminLayout>
  );
}
