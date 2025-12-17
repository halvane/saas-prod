'use client';

import { useState, useTransition } from 'react';
import { TemplateSection } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionPreview } from './SectionPreview';
import { createSection, updateSection } from '@/app/(admin)/admin/sections/actions';
import Editor, { OnMount } from '@monaco-editor/react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Wand2 } from 'lucide-react';
import { useRef } from 'react';

type SerializedTemplateSection = Omit<TemplateSection, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

interface SectionEditorProps {
  section?: SerializedTemplateSection;
}

const CATEGORIES = ['header', 'hero', 'features', 'testimonials', 'cta', 'footer', 'pricing', 'gallery', 'text', 'overlay', 'product', 'effect'];

export function SectionEditor({ section }: SectionEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [name, setName] = useState(section?.name || '');
  const [category, setCategory] = useState(section?.category || 'hero');
  const [html, setHtml] = useState(section?.html || '<div class="section">\n  <h1>Hello World</h1>\n</div>');
  const [css, setCss] = useState(section?.css || '.section {\n  padding: 20px;\n  text-align: center;\n}');
  const [tags, setTags] = useState(section?.tags?.join(', ') || '');

  const editorRefHtml = useRef<any>(null);
  const editorRefCss = useRef<any>(null);

  const handleEditorDidMountHtml: OnMount = (editor, monaco) => {
    editorRefHtml.current = editor;
    // Format on load
    setTimeout(() => {
      editor.getAction('editor.action.formatDocument')?.run();
    }, 500);
  };

  const handleEditorDidMountCss: OnMount = (editor, monaco) => {
    editorRefCss.current = editor;
    // Format on load
    setTimeout(() => {
      editor.getAction('editor.action.formatDocument')?.run();
    }, 500);
  };

  const handleFormat = () => {
    editorRefHtml.current?.getAction('editor.action.formatDocument')?.run();
    editorRefCss.current?.getAction('editor.action.formatDocument')?.run();
  };

  // Auto-detect variables
  const detectedVariables = (html + css).match(/\{\{([^}]+)\}\}/g)?.map(v => v.replace(/\{\{|\}\}/g, '').trim()) || [];
  const uniqueVariables = Array.from(new Set(detectedVariables));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('html', html);
    formData.append('css', css);
    formData.append('tags', tags);
    formData.append('variables', JSON.stringify(uniqueVariables));

    startTransition(async () => {
      if (section) {
        formData.append('id', section.id.toString());
        await updateSection({ ...section, id: section.id.toString() } as any, formData);
      } else {
        await createSection({} as any, formData);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-100px)]">
      {/* Left: Form */}
      <div className="flex flex-col gap-4 overflow-y-auto p-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Modern Hero" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags (comma separated)</Label>
          <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="dark, minimal, startup" />
        </div>

        <div className="space-y-2 flex-1 flex flex-col min-h-[300px]">
          <Label>HTML</Label>
          <div className="border rounded-md overflow-hidden flex-1">
            <Editor
              height="100%"
              defaultLanguage="html"
              value={html}
              onChange={(value) => setHtml(value || '')}
              onMount={handleEditorDidMountHtml}
              theme="vs-dark"
              options={{ 
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 10 },
                scrollBeyondLastLine: false,
                formatOnPaste: true,
                formatOnType: true,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        <div className="space-y-2 flex-1 flex flex-col min-h-[300px]">
          <Label>CSS (Scoped)</Label>
          <div className="border rounded-md overflow-hidden flex-1">
            <Editor
              height="100%"
              defaultLanguage="css"
              value={css}
              onChange={(value) => setCss(value || '')}
              onMount={handleEditorDidMountCss}
              theme="vs-dark"
              options={{ 
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 10 },
                scrollBeyondLastLine: false,
                formatOnPaste: true,
                formatOnType: true,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
          <strong>Detected Variables:</strong> {uniqueVariables.length > 0 ? uniqueVariables.join(', ') : 'None'}
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleFormat} className="flex-1">
            <Wand2 className="w-4 h-4 mr-2" />
            Format Code
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} className="flex-1">
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {section ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="bg-gray-100 rounded-xl border shadow-inner overflow-hidden flex flex-col">
        <div className="bg-white border-b px-4 py-2 text-xs font-medium text-gray-500 flex justify-between items-center">
          <span>Live Preview</span>
          <span>1080px Width</span>
        </div>
        <div className="flex-1 relative overflow-y-auto">
          <SectionPreview 
            html={html} 
            css={css} 
            className="w-full min-h-full bg-white"
          />
        </div>
      </div>
    </div>
  );
}
