'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea } from '@/components/ui/input';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Upload, Plus, Edit, Trash2, Copy, Star } from 'lucide-react';

const mockTemplates = [
  {
    id: '1',
    name: 'Instagram Quote - Minimalist',
    platform: 'instagram' as const,
    category: 'Quote',
    uses: 1247,
    rating: 4.8
  },
  {
    id: '2',
    name: 'LinkedIn Article Header',
    platform: 'linkedin' as const,
    category: 'Article',
    uses: 890,
    rating: 4.6
  },
  {
    id: '3',
    name: 'Twitter Thread Starter',
    platform: 'twitter' as const,
    category: 'Thread',
    uses: 2340,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Blog Post Header',
    platform: 'blog' as const,
    category: 'Header',
    uses: 567,
    rating: 4.7
  }
];

export function TemplatesPage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [templateHTML, setTemplateHTML] = useState('');
  const [templateCSS, setTemplateCSS] = useState('');
  const [templateVariables, setTemplateVariables] = useState('');

  const handleImportTemplate = () => {
    // Handle template import
    console.log('Importing template:', { templateHTML, templateCSS, templateVariables });
    setShowImportModal(false);
  };

  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="gradient-text mb-2">Templates Library</h2>
            <p className="text-[#6B7280]">Browse and manage your content templates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="medium" onClick={() => setShowImportModal(true)}>
              <Upload className="w-4 h-4" />
              Import Template
            </Button>
            <Button variant="primary" size="medium">
              <Plus className="w-4 h-4" />
              Create Template
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockTemplates.map((template) => (
            <Card key={template.id} hover={true}>
              <div className="space-y-4">
                {/* Preview */}
                <div className="aspect-square bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-lg flex items-center justify-center">
                      <span className="text-white text-2xl">T</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">Template Preview</p>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="platform" platform={template.platform}>
                      {template.platform}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
                      <span className="text-[#1F2937] font-medium">{template.rating}</span>
                    </div>
                  </div>
                  <h5 className="mb-1">{template.name}</h5>
                  <p className="text-sm text-[#6B7280]">{template.category} • {template.uses.toLocaleString()} uses</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#E5E7EB]">
                  <Button variant="primary" size="small" className="flex-1">
                    Use Template
                  </Button>
                  <Button variant="ghost" size="small">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="small">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Import Template Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Template"
        size="large"
      >
        <ModalContent>
          <div className="space-y-4">
            <p className="text-[#6B7280]">
              Import a custom template by providing HTML, CSS, and variable definitions.
            </p>

            <Input
              label="Template Name"
              placeholder="e.g., Instagram Quote - Dark Mode"
            />

            <Textarea
              label="HTML Template"
              placeholder='<div class="template">{{quote}}</div>'
              value={templateHTML}
              onChange={(e) => setTemplateHTML(e.target.value)}
              rows={6}
            />

            <Textarea
              label="CSS Styles"
              placeholder='.template { background: #000; }'
              value={templateCSS}
              onChange={(e) => setTemplateCSS(e.target.value)}
              rows={6}
            />

            <Textarea
              label="Variables (JSON)"
              placeholder='{"quote": "string", "author": "string"}'
              value={templateVariables}
              onChange={(e) => setTemplateVariables(e.target.value)}
              rows={4}
            />

            <div className="p-4 bg-[#DBEAFE] rounded-lg">
              <h5 className="text-sm font-semibold text-[#1E40AF] mb-2">💡 Variable Syntax</h5>
              <ul className="text-xs text-[#1E40AF] space-y-1">
                <li>• Use double curly braces: {`{{variable_name}}`}</li>
                <li>• AI will automatically fill variables from generated content</li>
                <li>• Example: {`{{Hook}}, {{Key_Takeaway}}, {{CTA}}`}</li>
              </ul>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowImportModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImportTemplate}>
            <Upload className="w-4 h-4" />
            Import Template
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
