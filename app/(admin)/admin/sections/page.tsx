import { getSections } from './actions';
import { SectionCard } from '@/components/custom/Admin/Sections/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { AdminLayout } from '@/components/custom/Admin/AdminLayout';
import { SectionFilters } from '@/components/custom/Admin/Sections/SectionFilters';

import { SectionGenerator } from '@/components/custom/Admin/Sections/SectionGenerator';
import { SectionImageGenerator } from '@/components/custom/Admin/Sections/SectionImageGenerator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const sections = await getSections(q, category);

  // Serialize sections to ensure no non-serializable data is passed to client components
  const serializedSections = sections.map(section => {
    const safeVariables = Array.isArray(section.variables) ? section.variables : [];
    const safeTags = Array.isArray(section.tags) ? section.tags : [];
    
    return {
      id: section.id,
      name: section.name,
      category: section.category,
      html: section.html || '',
      css: section.css || '',
      variables: safeVariables,
      tags: safeTags,
      thumbnailUrl: section.thumbnailUrl || '',
      isActive: section.isActive ?? true,
      createdAt: section.createdAt ? section.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: section.updatedAt ? section.updatedAt.toISOString() : new Date().toISOString(),
    };
  });

  console.log(`Rendering ${serializedSections.length} sections`);
  if (serializedSections.length > 0) {
    console.log('Sample section:', JSON.stringify(serializedSections[0], null, 2));
  }

  return (
    <AdminLayout activeTab="sections">
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sections Manager</h1>
            <p className="text-gray-500 mt-1">Manage dynamic HTML/CSS building blocks for the builder.</p>
          </div>
          <div className="flex gap-2">
            <SectionImageGenerator />
            <SectionGenerator />
            <Button asChild>
              <Link href="/admin/sections/new">
                <Plus className="w-4 h-4 mr-2" />
                Create New Section
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <form>
              <Input 
                name="q" 
                placeholder="Search sections..." 
                className="pl-9" 
                defaultValue={q}
              />
            </form>
          </div>
          <SectionFilters />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serializedSections.map((section) => (
            <SectionCard key={section.id} section={section as any} />
          ))}
          
          {serializedSections.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
              No sections found. Create one to get started.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
