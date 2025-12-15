import { ChevronLeft, Type, Box, Upload, LayoutTemplate, ImageIcon as ImageIconLucide, Search, Wand2, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { TEXT_EFFECTS, SHAPE_PRESETS } from '../constants';
import type { CustomTemplate, VisualElement } from '../types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeSidebarTab: 'templates' | 'text' | 'elements' | 'photos' | 'uploads' | 'ai' | 'versions';
  setActiveSidebarTab: (tab: 'templates' | 'text' | 'elements' | 'photos' | 'uploads' | 'ai' | 'versions') => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  addElement: (type: VisualElement['type'], props?: Partial<VisualElement>) => void;
  templates: CustomTemplate[];
  parseHTMLToVisualElements: (template: CustomTemplate) => void;
  toast: any;
}

export function Sidebar({
  activeSidebarTab,
  setActiveSidebarTab,
  isSidebarOpen,
  setIsSidebarOpen,
  addElement,
  templates,
  parseHTMLToVisualElements,
  toast,
}: SidebarProps) {
  const router = useRouter();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const tabs = [
    { id: 'versions', icon: GitBranch, label: 'Versions', color: 'from-indigo-500 to-blue-500' },
    { id: 'ai', icon: Wand2, label: 'AI', color: 'from-purple-500 to-pink-500' },
    { id: 'uploads', icon: Upload, label: 'Import', color: 'from-blue-500 to-cyan-500' },
    { id: 'templates', icon: LayoutTemplate, label: 'Brand', color: 'from-teal-500 to-emerald-500' },
    { id: 'elements', icon: Box, label: 'Colors', color: 'from-orange-500 to-red-500' },
    { id: 'text', icon: Type, label: 'Text', color: 'from-slate-500 to-gray-600' },
  ] as const;

  return (
    <div className="flex h-full z-30 pointer-events-none">
      {/* 3D Floating Icon Strip */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0 pointer-events-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className="relative group"
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              transform: `translateZ(${hoveredTab === tab.id ? '20px' : '0px'})`,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Button with 3D effect */}
            <button
              onClick={() => {
                if (activeSidebarTab === tab.id && isSidebarOpen) {
                  setIsSidebarOpen(false);
                } else {
                  setActiveSidebarTab(tab.id);
                  setIsSidebarOpen(true);
                }
              }}
              className={`
                relative flex flex-col items-center justify-center w-14 h-14 
                transition-all duration-200 cursor-pointer
                ${activeSidebarTab === tab.id && isSidebarOpen 
                  ? `bg-gradient-to-br ${tab.color} text-white` 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }
                ${index !== tabs.length - 1 ? 'border-b border-gray-100' : ''}
              `}
              style={{
                filter: 'none',
              }}
            >
              {/* Icon */}
              <tab.icon className="h-5 w-5 mb-0.5" />
              
              {/* Label */}
              <span className="text-[9px] font-semibold text-center leading-none">
                {tab.label}
              </span>

              {/* 3D Shine effect */}
              <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-10
                transition-opacity duration-200
                ${activeSidebarTab === tab.id && isSidebarOpen ? 'bg-white' : ''}
              `} />
            </button>

            {/* Floating label on hover - removed for cleaner look */}
          </div>
        ))}
      </div>

      {/* Content Drawer */}
      {isSidebarOpen && (
        <>
          {/* Overlay to close on click outside */}
          <div 
            className="absolute inset-0 z-10"
            onClick={() => setIsSidebarOpen(false)}
            style={{ pointerEvents: 'auto' }}
          />
          
          {/* Sidebar content */}
          <div 
            className="absolute left-20 top-0 bottom-0 w-80 bg-white border border-gray-200 flex flex-col h-full z-20 animate-in slide-in-from-left duration-200 shadow-2xl rounded-r-xl"
            onClick={(e) => e.stopPropagation()}
            style={{ pointerEvents: 'auto' }}
          >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h3 className="font-bold text-lg capitalize text-slate-800">{activeSidebarTab}</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)} className="h-8 w-8 p-0 rounded-full hover:bg-slate-100">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeSidebarTab === 'text' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-14 justify-start px-4 text-left font-bold text-2xl bg-slate-50 hover:bg-slate-100 border-slate-200"
                    onClick={() => {
                      addElement('text', { fontSize: 64, fontWeight: 'bold', content: 'Add a heading' });
                      toast({ title: 'Heading added' });
                    }}
                  >
                    Add a heading
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start px-4 text-left font-semibold text-lg bg-slate-50 hover:bg-slate-100 border-slate-200"
                    onClick={() => {
                      addElement('text', { fontSize: 32, fontWeight: '600', content: 'Add a subheading' });
                      toast({ title: 'Subheading added' });
                    }}
                  >
                    Add a subheading
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-10 justify-start px-4 text-left text-sm bg-slate-50 hover:bg-slate-100 border-slate-200"
                    onClick={() => addElement('text')}
                  >
                    Add a little bit of body text
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 text-sm text-slate-500">Font Effects</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {TEXT_EFFECTS.map((effect) => (
                      <button
                        key={effect.name}
                        className="aspect-video bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-center overflow-hidden p-2"
                        onClick={() => {
                          addElement('text', { content: effect.name, ...effect.style });
                          toast({ title: `Added ${effect.name} text` });
                        }}
                      >
                        <span style={{ ...effect.style, fontSize: '20px' }}>{effect.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSidebarTab === 'elements' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-slate-500">Shapes</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {SHAPE_PRESETS.map((shape, i) => (
                      <button
                        key={i}
                        className="aspect-square bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 p-2"
                        onClick={() => addElement(shape.type as any, { borderRadius: shape.borderRadius, backgroundColor: shape.backgroundColor, borderWidth: shape.borderWidth, borderColor: shape.borderColor })}
                      >
                        <div
                          className="w-8 h-8 bg-slate-400"
                          style={{
                            borderRadius: shape.borderRadius,
                            border: shape.borderWidth ? `${shape.borderWidth}px solid ${shape.borderColor}` : 'none',
                            backgroundColor: shape.backgroundColor || '#94a3b8'
                          }}
                        />
                        <span className="text-[10px] text-slate-600">{shape.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 text-sm text-slate-500">Frames</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['Circle', 'Square', 'Rounded'].map((frame) => (
                      <button
                        key={frame}
                        className="aspect-square bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 p-2"
                        onClick={() => addElement('image', {
                          isFrame: true,
                          borderRadius: frame === 'Circle' ? 1000 : frame === 'Rounded' ? 20 : 0,
                          backgroundColor: '#e0f2fe',
                          width: 300,
                          height: 300,
                          src: 'https://placehold.co/600x600/e0f2fe/7dd3fc?text=Drop+Image',
                          objectFit: 'cover'
                        })}
                      >
                        <div className="w-full h-full bg-sky-100 relative overflow-hidden" style={{ borderRadius: frame === 'Circle' ? '50%' : frame === 'Rounded' ? '8px' : '0' }}>
                          <ImageIconLucide className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-300 h-8 w-8" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSidebarTab === 'photos' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search photos..." className="pl-9 bg-slate-50" />
                </div>
                <div className="text-center py-8 text-slate-400 text-sm">
                  Search for millions of photos
                </div>
              </div>
            )}

            {activeSidebarTab === 'uploads' && (
              <div className="space-y-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Upload className="mr-2 h-4 w-4" /> Upload files
                </Button>
                <div className="text-center py-8 text-slate-400 text-sm">
                  No uploads yet
                </div>
              </div>
            )}

            {activeSidebarTab === 'ai' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-900 font-medium">AI Assistant</p>
                  <p className="text-xs text-purple-700 mt-2">Generate designs and content with AI</p>
                </div>
                <div className="text-center py-8 text-slate-400 text-sm">
                  Coming soon...
                </div>
              </div>
            )}

            {activeSidebarTab === 'versions' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-900 font-medium">Editor Versions</p>
                  <p className="text-xs text-indigo-700 mt-2">Switch between different editor interfaces</p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-slate-700">Infinite Canvas (New)</p>
                    <p className="text-xs text-slate-600 mb-2">Modern modular design with infinite panning canvas, interactive element editing, and visual feedback.</p>
                    <Button 
                      variant="default"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => {
                        toast({ title: '✅ Already using Infinite Canvas (New) version' });
                        setIsSidebarOpen(false);
                      }}
                    >
                      ✓ Currently Active
                    </Button>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-slate-700">Classic Editor (Old)</p>
                    <p className="text-xs text-slate-600 mb-2">Original comprehensive editor with all features in a single file (4033 lines). Full-featured but monolithic.</p>
                    <Button 
                      variant="outline"
                      className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                      onClick={() => {
                        router.push('/template-builder-old');
                        toast({ title: 'Switching to Classic Editor...' });
                      }}
                    >
                      Switch to Classic Editor
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSidebarTab === 'templates' && (
              <div className="space-y-4">
                <Input placeholder="Search templates..." className="bg-slate-50" />
                <div className="grid grid-cols-1 gap-3">
                  {templates.map(t => (
                    <button
                      key={t.id}
                      className="w-full aspect-[2/3] bg-slate-100 rounded-lg overflow-hidden hover:ring-2 ring-blue-500 transition-all relative group"
                      onClick={() => {
                        if (confirm('Replace current design?')) {
                          parseHTMLToVisualElements(t);
                        }
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                        {t.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        </>
      )}
    </div>
  );
}
