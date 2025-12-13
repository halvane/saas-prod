import React, { useState } from 'react';
import { Modal, ModalContent, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ContentVariantCard } from './ContentVariantCard';
import { PreviewPanel } from './PreviewPanel';
import { GenerateVariantsModal } from './GenerateVariantsModal';
import { BlogEditor } from './BlogEditor';
import { TwitterEditor } from './TwitterEditor';
import { LinkedInEditor } from './LinkedInEditor';
import { Sparkles, Calendar, Save, X, ArrowRight } from 'lucide-react';
import { WorkflowProgress } from '../ui/WorkflowProgress';

interface EditorPageProps {
  isOpen: boolean;
  generatedContent: any;
  onClose: () => void;
  onProceedToSchedule: (content: any) => void;
}

export function EditorPage({ isOpen, generatedContent, onClose, onProceedToSchedule }: EditorPageProps) {
  // Mock variants with thumbnails for visual content
  const mockVariants = [
    {
      id: '1',
      platform: 'blog',
      type: 'text' as const,
      content: 'Complete guide to sustainable living: 10 practical tips to reduce your environmental impact and live more mindfully...',
      selected: true
    },
    {
      id: '2',
      platform: 'instagram',
      type: 'visual' as const,
      content: '10 Sustainable Living Tips - Instagram Carousel (5 slides)',
      thumbnail: 'https://images.unsplash.com/photo-1758764052693-4c1c5f662bcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGxpZmVzdHlsZSUyMGdyZWVufGVufDF8fHx8MTc2NTYwMDA5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      selected: true
    },
    {
      id: '3',
      platform: 'linkedin',
      type: 'visual' as const,
      content: 'Professional guide to sustainability - LinkedIn Carousel (7 slides with actionable insights)',
      thumbnail: 'https://images.unsplash.com/photo-1758876022356-9e7597f556d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2R1Y3Rpdml0eSUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjU2MjA3NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      selected: true
    },
    {
      id: '4',
      platform: 'twitter',
      type: 'text' as const,
      content: '🌱 Thread: 10 sustainable living tips that actually make a difference. Let\'s talk about real change, not greenwashing. [1/11]',
      selected: false
    },
    {
      id: '5',
      platform: 'instagram',
      type: 'visual' as const,
      content: 'Quick tips for eco-friendly living - Instagram Story Series (10 stories)',
      thumbnail: 'https://images.unsplash.com/photo-1683721003111-070bcc053d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZ3xlbnwxfHx8fDE3NjU1ODc4NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      selected: false
    },
    {
      id: '6',
      platform: 'linkedin',
      type: 'text' as const,
      content: 'Sustainability isn\'t just a buzzword - it\'s a business imperative. Here are 10 actionable steps your company can take today...',
      selected: false
    }
  ];

  const [variants, setVariants] = useState(generatedContent?.variants || mockVariants);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('blog');
  const [advancedEditorOpen, setAdvancedEditorOpen] = useState(false);
  const [blogEditorOpen, setBlogEditorOpen] = useState(false);
  const [twitterEditorOpen, setTwitterEditorOpen] = useState(false);
  const [linkedInEditorOpen, setLinkedInEditorOpen] = useState(false);
  const [generateVariantsModalOpen, setGenerateVariantsModalOpen] = useState(false);

  const handleSaveDraft = () => {
    console.log('Saving drafts...');
    alert('Drafts saved successfully!');
  };

  const handleProceed = () => {
    const selectedVariants = variants.filter((v: any) => v.selected);
    onProceedToSchedule({ variants: selectedVariants });
  };

  const handleEditContent = (variant: any) => {
    setSelectedVariant(variant);
    setSelectedPlatform(variant.platform);
    
    // Open appropriate editor based on platform and type
    if (variant.platform === 'blog') {
      setBlogEditorOpen(true);
    } else if (variant.platform === 'twitter') {
      setTwitterEditorOpen(true);
    } else if (variant.platform === 'linkedin' && variant.type === 'text') {
      setLinkedInEditorOpen(true);
    } else if (variant.type === 'visual' || variant.thumbnail) {
      // Visual posts (Instagram, LinkedIn carousels) use visual editor
      setAdvancedEditorOpen(true);
    } else {
      // Fallback to visual editor
      setAdvancedEditorOpen(true);
    }
  };

  const handlePreviewContent = (variant: any) => {
    setSelectedVariant(variant);
    setSelectedPlatform(variant.platform);
  };

  const handleOpenAdvancedEditor = () => {
    setAdvancedEditorOpen(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="fullscreen" showClose={false}>
      {/* Workflow Progress */}
      <WorkflowProgress currentStep="editor" />

      <ModalContent>
        <div className="min-h-[700px]">
          {/* Header */}
          <div className="mb-6">
            <h2 className="gradient-text mb-2">✨ Review & Edit Your Content</h2>
            <p className="text-[#6B7280]">Select and customize your content before scheduling</p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="small">All ({variants.length})</Button>
              <Button variant="ghost" size="small">Blog</Button>
              <Button variant="ghost" size="small">Social</Button>
              <Button variant="ghost" size="small">Visual</Button>
            </div>
            
            <Button variant="secondary" size="small" onClick={() => setGenerateVariantsModalOpen(true)}>
              <Sparkles className="w-4 h-4" />
              Generate More Variants
            </Button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {variants.map((variant: any) => (
              <ContentVariantCard
                key={variant.id}
                variant={variant}
                isSelected={variant.selected}
                onToggleSelect={() => {
                  setVariants(variants.map((v: any) => 
                    v.id === variant.id ? { ...v, selected: !v.selected } : v
                  ));
                }}
                onEdit={() => handleEditContent(variant)}
                onPreview={() => handlePreviewContent(variant)}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
            <Button variant="ghost" size="medium" onClick={onClose}>
              ← Back
            </Button>
            
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="medium" onClick={handleSaveDraft}>
                <Save className="w-4 h-4" />
                Save as Draft
              </Button>
              <Button variant="primary" size="medium" onClick={handleProceed}>
                Proceed to Schedule
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <div className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
            <span className="ml-2 text-sm text-[#9CA3AF]">Step 3 of 4</span>
          </div>
        </div>
      </ModalContent>

      {/* Advanced Editor Modal (placeholder) */}
      {advancedEditorOpen && selectedVariant && (
        <Modal
          isOpen={advancedEditorOpen}
          onClose={() => setAdvancedEditorOpen(false)}
          size="fullscreen"
          title={`Visual Editor - ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}`}
        >
          <ModalContent>
            <div className="min-h-[600px]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Left Sidebar - Editing Tools */}
                <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
                  <div>
                    <h5 className="mb-4 text-[#1F2937]">🎨 Visual Elements</h5>
                    <div className="space-y-3">
                      <Button variant="ghost" className="w-full justify-start">
                        <Sparkles className="w-4 h-4" />
                        Add Text Layer
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Sparkles className="w-4 h-4" />
                        Add Image
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Sparkles className="w-4 h-4" />
                        Add Shape
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Sparkles className="w-4 h-4" />
                        Add Icon
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <h5 className="mb-4 text-[#1F2937]">🎭 Styles</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-[#6B7280] mb-2 block">Background</label>
                        <div className="flex gap-2">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] border-2 border-white shadow cursor-pointer" />
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] border-2 border-white shadow cursor-pointer" />
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#2563EB] border-2 border-white shadow cursor-pointer" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-[#6B7280] mb-2 block">Font Family</label>
                        <select className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm">
                          <option>Poppins</option>
                          <option>Inter</option>
                          <option>Roboto</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center - Canvas Preview */}
                <div className="bg-[#F9FAFB] rounded-xl p-8 flex items-center justify-center">
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ width: '400px', aspectRatio: '1/1' }}>
                    {selectedVariant.thumbnail ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={selectedVariant.thumbnail} 
                          alt="Content preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                          <div className="text-white">
                            <h3 className="mb-2">10 Sustainable Tips</h3>
                            <p className="text-sm opacity-90">Slide 1 of 5</p>
                          </div>
                        </div>
                        {/* Edit Overlay */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors">
                            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] p-8">
                        <div className="text-white text-center">
                          <h3 className="mb-3">{selectedVariant.content}</h3>
                          <p className="text-sm opacity-90">Click to edit text</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Sidebar - Layers & Settings */}
                <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
                  <div>
                    <h5 className="mb-4 text-[#1F2937]">📚 Layers</h5>
                    <div className="space-y-2">
                      {['Background', 'Main Image', 'Overlay', 'Title Text', 'Caption'].map((layer, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F9FAFB] cursor-pointer">
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#DDD6FE] to-[#F3E8FF] flex items-center justify-center text-xs">
                            {idx + 1}
                          </div>
                          <span className="text-sm flex-1">{layer}</span>
                          <span className="text-xs text-[#9CA3AF]">👁</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <h5 className="mb-4 text-[#1F2937]">⚙️ Settings</h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">Dimensions</span>
                        <span className="font-medium">1080×1080</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">Format</span>
                        <span className="font-medium">PNG</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">Quality</span>
                        <span className="font-medium">High</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <Button variant="primary" className="w-full mb-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => setAdvancedEditorOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}

      {/* Blog Editor Modal */}
      {blogEditorOpen && selectedVariant && (
        <BlogEditor
          isOpen={blogEditorOpen}
          onClose={() => setBlogEditorOpen(false)}
          variant={selectedVariant}
          onEdit={(newContent) => {
            setVariants(variants.map((v: any) => 
              v.id === selectedVariant.id ? { ...v, content: newContent } : v
            ));
            setBlogEditorOpen(false);
          }}
        />
      )}

      {/* Twitter Editor Modal */}
      {twitterEditorOpen && selectedVariant && (
        <TwitterEditor
          isOpen={twitterEditorOpen}
          onClose={() => setTwitterEditorOpen(false)}
          variant={selectedVariant}
          onEdit={(newContent) => {
            setVariants(variants.map((v: any) => 
              v.id === selectedVariant.id ? { ...v, content: newContent } : v
            ));
            setTwitterEditorOpen(false);
          }}
        />
      )}

      {/* LinkedIn Editor Modal */}
      {linkedInEditorOpen && selectedVariant && (
        <LinkedInEditor
          isOpen={linkedInEditorOpen}
          onClose={() => setLinkedInEditorOpen(false)}
          variant={selectedVariant}
          onEdit={(newContent) => {
            setVariants(variants.map((v: any) => 
              v.id === selectedVariant.id ? { ...v, content: newContent } : v
            ));
            setLinkedInEditorOpen(false);
          }}
        />
      )}

      {/* Generate Variants Modal */}
      {generateVariantsModalOpen && (
        <GenerateVariantsModal
          isOpen={generateVariantsModalOpen}
          onClose={() => setGenerateVariantsModalOpen(false)}
          onGenerate={(newVariants) => {
            setVariants([...variants, ...newVariants]);
            setGenerateVariantsModalOpen(false);
          }}
        />
      )}
    </Modal>
  );
}