'use client';

import { useState, useTransition, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Image as ImageIcon, Upload, X, Save, Check, Plus, Trash2 } from 'lucide-react';
import { generateSectionsFromImages, createSection } from '@/app/(admin)/admin/sections/actions';
import { SectionPreview } from './SectionPreview';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';

const DEFAULT_SYSTEM_PROMPT = `You are an expert UI/UX designer and frontend developer.
Your task is to analyze the provided website screenshot(s) and recreate the visible sections as clean, responsive HTML/CSS components.

CRITICAL: If the image contains multiple distinct elements (like multiple social media posts, cards, or widgets arranged in a grid or list), generate a SEPARATE object for EACH element. Do not combine them into one large section.

Requirements:
1. **Identify Sections**: Break down the image into logical sections.
2. **Recreate Design**: Write semantic HTML5 and Tailwind CSS to match the visual design as closely as possible.
3. **Styling**:
   - Use Tailwind CSS for layout, spacing, typography, and colors.
   - Use CSS variables for brand colors if they seem consistent: --brand-primary, --brand-secondary.
4. **Content**: Use the actual text from the image if readable, otherwise use realistic placeholders.
5. **Images**: Use placeholder images (Unsplash) that match the context.

Output Format:
Return a JSON array of objects. Do NOT escape HTML.
[
  {
    "name": "Hero Section",
    "category": "Hero", // Use one of: Header, Hero, Features, Testimonials, Cta, Footer, Pricing, Gallery, Text, Overlay, Product, Effect
    "html": "...",
    "css": "...",
    "tags": ["modern", "dark"]
  }
]`;

const CATEGORIES = [
  "Header", "Hero", "Features", "Testimonials", "Cta", 
  "Footer", "Pricing", "Gallery", "Text", "Overlay", 
  "Product", "Effect"
];

export function SectionImageGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [model, setModel] = useState('claude-3-7-sonnet-20250219');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [files, setFiles] = useState<File[]>([]);
  const [generatedSections, setGeneratedSections] = useState<any[]>([]);
  const [savedIndices, setSavedIndices] = useState<number[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    console.log('handleGenerate called with files:', files.length);
    if (files.length === 0) {
      console.warn('No files selected');
      return;
    }
    
    startTransition(async () => {
      try {
        console.log('Starting transition...');
        const formData = new FormData();
        formData.append('prompt', systemPrompt);
        formData.append('model', model);
        
        files.forEach((file) => {
          console.log('Appending file:', file.name, file.size, file.type);
          formData.append('images', file);
        });

        console.log('Calling generateSectionsFromImages server action...');
        const result = await generateSectionsFromImages({
          prompt: systemPrompt,
          model
        }, formData);

        console.log('Server action returned:', result);

        if (result?.error) {
          console.error('Server returned error:', result.error);
          toast.error(result.error);
        } else if (result && 'sections' in result && result.sections) {
          console.log('Sections generated successfully:', result.sections);
          setGeneratedSections(result.sections);
          setSavedIndices([]);
          toast.success(`Generated ${result.sections.length} sections`);
        } else {
          console.warn('Unexpected result format:', result);
          toast.error('Received unexpected response from server');
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
      if (!result?.error) {
        setSavedIndices(prev => [...prev, index]);
        toast.success('Section saved');
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
        await handleSave(generatedSections[i], i);
        successCount++;
      }
      if (successCount > 0) {
        toast.success(`Saved ${successCount} sections`);
      }
    });
  };

  const handleCategoryChange = (index: number, value: string) => {
    setGeneratedSections(prev => {
      const newSections = [...prev];
      newSections[index] = { ...newSections[index], category: value };
      return newSections;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ImageIcon className="w-4 h-4" />
          Image to Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[95vw] w-[95vw] h-[95vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Image to Section Generator</DialogTitle>
          <DialogDescription>
            Upload screenshots to generate code using Vision AI.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar: Controls */}
          <div className="w-[400px] border-r p-6 flex flex-col gap-6 overflow-y-auto bg-gray-50">
            
            {/* Dropzone */}
            <div className="space-y-2">
              <Label>Upload Screenshots</Label>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isDragActive ? "Drop images here..." : "Drag & drop images, or click to select"}
                </p>
              </div>
              
              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-md border text-sm">
                      <span className="truncate max-w-[200px]">{file.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removeFile(idx); }}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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

            <Button onClick={handleGenerate} disabled={isPending || files.length === 0} className="w-full" size="lg">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Images...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Generate Sections
                </>
              )}
            </Button>
          </div>

          {/* Right Content: Results */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
            {generatedSections.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">Upload an image to start generating</p>
              </div>
            ) : (
              <div className="space-y-8 max-w-5xl mx-auto">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Generated Results</h2>
                  <Button onClick={handleSaveAll} disabled={isPending || generatedSections.length === savedIndices.length}>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Remaining
                  </Button>
                </div>
                
                {generatedSections.map((section, idx) => (
                  <div key={idx} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                      <div>
                        <h3 className="font-medium text-lg">{section.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Select 
                            value={CATEGORIES.includes(section.category) ? section.category : 'custom'} 
                            onValueChange={(val) => {
                              if (val !== 'custom') handleCategoryChange(idx, val);
                              else handleCategoryChange(idx, ''); 
                            }}
                          >
                            <SelectTrigger className="h-8 w-[140px] bg-white">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                              <SelectItem value="custom">Custom...</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {(!CATEGORIES.includes(section.category) || section.category === '') && (
                            <Input 
                              className="h-8 w-[140px] bg-white" 
                              placeholder="Custom Category"
                              value={section.category}
                              onChange={(e) => handleCategoryChange(idx, e.target.value)}
                            />
                          )}

                          {section.tags?.map((tag: string) => (
                            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border">
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
                          aria-label={savedIndices.includes(idx) ? "Section saved" : "Save section to library"}
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
                    <div className="h-[500px] relative border-b bg-gray-50/50">
                      <SectionPreview 
                        html={section.html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')} 
                        css={section.css} 
                      />
                    </div>
                    <div className="p-4 bg-gray-50 text-xs font-mono text-gray-500 overflow-hidden h-32">
                      {section.html.slice(0, 300)}...
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
