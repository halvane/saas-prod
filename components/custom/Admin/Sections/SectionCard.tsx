'use client';

import { TemplateSection } from '@/lib/db/schema';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Code } from 'lucide-react';
import Link from 'next/link';
import { SectionPreview } from './SectionPreview';
import { deleteSection } from '@/app/(admin)/admin/sections/actions';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

type SerializedTemplateSection = Omit<TemplateSection, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

interface SectionCardProps {
  section: SerializedTemplateSection;
}

export function SectionCard({ section }: SectionCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this section?')) {
      const formData = new FormData();
      formData.append('id', section.id.toString());
      startTransition(async () => {
        await deleteSection({ id: section.id.toString() }, formData);
      });
    }
  };

  return (
    <Link href={`/admin/sections/${section.id}`} className="block group h-full">
      <Card className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:border-blue-500/50 border-gray-200 bg-white">
        {/* Preview Area */}
        <div className="h-[200px] bg-gray-50 relative border-b border-gray-100 overflow-hidden group-hover:bg-gray-100 transition-colors">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/5 backdrop-blur-[1px]">
            <Button variant="secondary" size="sm" className="shadow-lg pointer-events-none">
              <Edit className="w-4 h-4 mr-2" />
              Edit Section
            </Button>
          </div>
          
          <SectionPreview 
            html={section.html} 
            css={section.css} 
            scale={0.4} 
            className="w-full h-full"
          />
          
          <div className="absolute top-3 right-3 z-20">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 font-medium text-xs uppercase tracking-wider">
              {section.category}
            </Badge>
          </div>
        </div>
        
        {/* Content Area */}
        <CardContent className="p-5 flex-1 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg text-gray-900 truncate leading-tight group-hover:text-blue-600 transition-colors" title={section.name}>
              {section.name}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {section.tags?.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200">
                {tag}
              </Badge>
            ))}
            {section.tags && section.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 border-gray-200">
                +{section.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-50 bg-gray-50/50 mt-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Code className="w-3.5 h-3.5" />
            <span>{(Array.isArray(section.variables) ? section.variables.length : 0)} vars</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={handleDelete}
            disabled={isPending}
            title="Delete Section"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
