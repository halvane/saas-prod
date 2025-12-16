'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
  previewImage?: string;
}

export default function CustomTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/admin/templates/${id}`);
        if (!response.ok) {
          router.push('/admin/templates');
          return;
        }
        const data = await response.json();
        setTemplate(data);
      } catch (error) {
        console.error('Failed to fetch template:', error);
        router.push('/admin/templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="text-center">Loading template...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex-1 p-8">
        <div className="text-center">Template not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Header with Back Button */}
      <div className="border-b border-gray-200 bg-white px-8 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/admin/templates">
              <ArrowLeft className="w-4 h-4" />
              Back to Templates
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <p className="text-sm text-gray-500">{template.category}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Template Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">ID</label>
              <p className="text-gray-900">{template.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-gray-900">{template.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Category</label>
              <p className="text-gray-900">{template.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="text-gray-900">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        {template.previewImage && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <img
              src={template.previewImage}
              alt={template.name}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
