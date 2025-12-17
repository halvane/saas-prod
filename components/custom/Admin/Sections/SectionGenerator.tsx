'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Plus, Trash2, Save, Check, RefreshCw, Upload, Image as ImageIcon, X } from 'lucide-react';
import { generateSectionsAI, createSection, generateSectionsFromImages } from '@/app/(admin)/admin/sections/actions';
import { SectionPreview } from './SectionPreview';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useRef } from 'react';

const DEFAULT_PROMPT = `You are an expert UI/UX designer and frontend developer specializing in high-conversion SaaS landing pages.
Your task is to generate distinct website sections based on the user's request.

Requirements:
1. **HTML Structure**: Use semantic HTML5. Use Tailwind CSS classes for styling.
2. **CSS Styling**: 
   - Use Tailwind CSS for layout, spacing, typography, and colors where possible.
   - For custom styles, use the provided CSS variables:
     - --brand-primary
     - --brand-secondary
     - --brand-accent
     - --font-heading
     - --font-body
   - Ensure the design is responsive (mobile-first).
3. **Variables**: Use {{variable_name}} syntax for dynamic content (e.g., {{title}}, {{image}}, {{price}}).
4. **Categories**: Assign each section to one of: header, hero, features, testimonials, cta, footer, pricing, gallery, text, overlay, product, effect.

Output Format:
Return ONLY a JSON array of objects. 
IMPORTANT: Do NOT escape HTML tags. Return raw HTML strings.
Example: "html": "<div class='p-4'>...</div>" (NOT "&lt;div...")

[
  {
    "name": "Section Name",
    "category": "hero",
    "html": "...",
    "css": "...",
    "tags": ["tag1", "tag2"]
  }
]`;

export function SectionGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('text');
  
  // Text Generation State
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(3);
  const [model, setModel] = useState('claude-3-7-sonnet-20250219');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT);
  
  // Image Generation State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [generatedSections, setGeneratedSections] = useState<any[]>([]);
  const [savedIndices, setSavedIndices] = useState<number[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      // Create previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateImage = () => {
    if (selectedFiles.length === 0) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('images', file);
        });
        formData.append('prompt', topic || "Generate sections from these images.");
        formData.append('model', 'gpt-4o'); // Use vision model

        const result = await generateSectionsFromImages({
          prompt: topic,
          model: 'gpt-4o'
        }, formData);

        if (result?.error) {
          toast.error(result.error);
        } else if (result && 'sections' in result && result.sections) {
          setGeneratedSections(result.sections);
          setSavedIndices([]);
          toast.success(`Generated ${result.sections.length} sections from images`);
        }
      } catch (error) {
        console.error('Image generation error:', error);
        toast.error('Failed to generate from images');
      }
    });
  };

  const handleGenerate = () => {
    if (activeTab === 'image') {
      handleGenerateImage();
      return;
    }

    if (!topic) return;
    
    console.log('Generating sections for topic:', topic);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('prompt', `Topic: ${topic}\nCount: ${count}\n\n${systemPrompt}`);
        formData.append('count', count.toString());
        formData.append('model', model);

        const result = await generateSectionsAI({
          prompt: `Topic: ${topic}\nCount: ${count}\n\n${systemPrompt}`,
          count,
          model
        }, formData);

        console.log('Generation result:', result);

        if (result?.error) {
          toast.error(result.error);
        } else if (result && 'sections' in result && result.sections) {
          setGeneratedSections(result.sections);
          setSavedIndices([]);
          toast.success(`Generated ${result.sections.length} sections`);
        }
      } catch (error) {
        console.error('Client-side generation error:', error);
        toast.error('Failed to generate sections');
      }
    });
  };

  const handleSave = async (section: any, index: number) => {
    const formData = new FormData();
    formData.append('name', section.name);
    formData.append('category', section.category);
    formData.append('html', section.html);
    formData.append('css', section.css || '');
    formData.append('tags', section.tags?.join(', ') || '');
    formData.append('variables', JSON.stringify(section.variables || []));

    try {
      const result = await createSection({} as any, formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Section saved');
        setSavedIndices(prev => [...prev, index]);
      }
    } catch (error) {
      toast.error('Failed to save section');
    }
  };

  const handleSaveAll = async () => {
    startTransition(async () => {
      let successCount = 0;
      for (let i = 0; i < generatedSections.length; i++) {
        if (savedIndices.includes(i)) continue;
        
        const section = generatedSections[i];
        const formData = new FormData();
        formData.append('name', section.name);
        formData.append('category', section.category);
        formData.append('html', section.html);
        formData.append('css', section.css || '');
        formData.append('tags', section.tags?.join(', ') || '');
        formData.append('variables', JSON.stringify(section.variables || []));

        try {
          const result = await createSection({} as any, formData);
          if (!result?.error) {
            setSavedIndices(prev => [...prev, i]);
            successCount++;
          }
        } catch (error) {
          console.error('Failed to save section', i);
        }
      }
      if (successCount > 0) {
        toast.success(`Saved ${successCount} sections to library`);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>AI Section Generator</DialogTitle>
          <DialogDescription>
            Bulk generate sections using Claude 3.7 Sonnet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar: Controls */}
          <div className="w-80 border-r p-6 flex flex-col gap-6 overflow-y-auto bg-gray-50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="text">Text to Code</TabsTrigger>
                <TabsTrigger value="image">Image to Code</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label>Topic / Theme</Label>
                  <Input 
                    placeholder="e.g. Modern SaaS Pricing" 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Number of Sections</Label>
                  <Select value={count.toString()} onValueChange={v => setCount(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Section</SelectItem>
                      <SelectItem value="3">3 Sections</SelectItem>
                      <SelectItem value="5">5 Sections</SelectItem>
                      <SelectItem value="10">10 Sections</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                  <Label>System Prompt (Editable)</Label>
                  <Textarea 
                    className="flex-1 min-h-[200px] font-mono text-xs"
                    value={systemPrompt}
                    onChange={e => setSystemPrompt(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label>Upload Screenshots</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload images</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP supported</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      multiple 
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative group aspect-video bg-gray-200 rounded-md overflow-hidden">
                        <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Additional Instructions (Optional)</Label>
                  <Textarea 
                    placeholder="e.g. Make the buttons rounded, use blue as primary color..." 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button onClick={handleGenerate} disabled={isPending || (activeTab === 'text' ? !topic : selectedFiles.length === 0)} className="w-full mt-auto">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {activeTab === 'text' ? 'Generate Sections' : 'Convert Images to Code'}
                </>
              )}
            </Button>
          </div>

          {/* Right Content: Results */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
            {generatedSections.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p>Enter a topic and click generate to start</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-end px-4">
                  <Button onClick={handleSaveAll} disabled={isPending || generatedSections.length === savedIndices.length}>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Remaining
                  </Button>
                </div>
                {generatedSections.map((section, idx) => (
                  <div key={idx} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                      <div>
                        <h3 className="font-medium">{section.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            {section.category}
                          </span>
                          {section.tags?.map((tag: string) => (
                            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={savedIndices.includes(idx) ? "secondary" : "default"}
                          onClick={() => handleSave(section, idx)}
                          disabled={savedIndices.includes(idx)}
                        >
                          {savedIndices.includes(idx) ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Saved
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save to Library
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="h-[400px] relative border-b">
                      <SectionPreview 
                        html={section.html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')} 
                        css={section.css} 
                      />
                    </div>
                    <div className="p-4 bg-gray-50 text-xs font-mono text-gray-500 overflow-hidden h-24">
                      {section.html.slice(0, 200)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
