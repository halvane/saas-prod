import { getTemplate } from '../../actions';
import { VisualEditor } from '@/components/custom/Admin/VisualEditor';
import { notFound } from 'next/navigation';

export default async function VisualEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = await getTemplate(id);

  if (!template) {
    notFound();
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <VisualEditor template={template} />
    </div>
  );
}
