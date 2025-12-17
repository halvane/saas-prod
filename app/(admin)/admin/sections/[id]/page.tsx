import { getSection } from '../actions';
import { SectionEditor } from '@/components/custom/Admin/Sections/SectionEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminLayout } from '@/components/custom/Admin/AdminLayout';

export default async function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const section = await getSection(parseInt(id));

  if (!section) {
    notFound();
  }

  // Serialize section to ensure no non-serializable data is passed to client components
  const serializedSection = {
    ...section,
    createdAt: section.createdAt ? section.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: section.updatedAt ? section.updatedAt.toISOString() : new Date().toISOString(),
  };

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
            <h1 className="text-2xl font-bold tracking-tight">Edit Section</h1>
            <p className="text-gray-500 text-sm">Update {section.name}</p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <SectionEditor section={serializedSection} />
        </div>
      </div>
    </AdminLayout>
  );
}
