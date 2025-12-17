import { db } from '@/lib/db/drizzle';
import { templates } from '@/lib/db/schema';
import { desc, count } from 'drizzle-orm';
import { TemplateManagement } from '@/components/custom/Admin/TemplateManagement';
import { SeedButton } from './seed-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Admin pages should be dynamic to show latest data
export const dynamic = 'force-dynamic';

export default async function AdminTemplatesPage() {
  // Load only 20 templates initially for ultra-fast first paint
  const limit = 20;
  const allTemplates = await db.select().from(templates).orderBy(desc(templates.createdAt)).limit(limit);
  
  // Ensure templates match the expected type (handle nulls)
  const sanitizedTemplates = allTemplates.map(t => ({
    ...t,
    htmlTemplate: t.htmlTemplate || '',
    cssTemplate: t.cssTemplate || '',
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
        <div className="flex items-center space-x-2">
          <SeedButton />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Template Management</CardTitle>
          <CardDescription>
            Manage your AI templates, toggle their visibility, and monitor usage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateManagement 
            initialTemplates={sanitizedTemplates} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
