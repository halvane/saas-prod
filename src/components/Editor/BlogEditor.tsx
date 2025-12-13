import React, { useState } from 'react';
import { Modal, ModalContent } from '../ui/Modal';
import { Button } from '../ui/button';
import { Card } from '../ui/Card';
import { Save, Eye, Sparkles, Type, Image as ImageIcon, Code } from 'lucide-react';

interface BlogEditorProps {
  isOpen: boolean;
  variant: any;
  onClose: () => void;
  onEdit: (content: any) => void;
}

export function BlogEditor({ isOpen, variant, onClose, onEdit }: BlogEditorProps) {
  const [title, setTitle] = useState(variant?.title || 'Complete Guide to Sustainable Living');
  const [body, setBody] = useState(variant?.content || `In today's world, sustainable living is more important than ever. Here are 10 practical tips to reduce your environmental impact...

## 1. Reduce Single-Use Plastics

Start by eliminating single-use plastics from your daily routine. Invest in reusable water bottles, shopping bags, and food containers.

## 2. Embrace Energy Efficiency

Switch to LED bulbs, unplug devices when not in use, and consider renewable energy sources for your home.`);
  const [metaDescription, setMetaDescription] = useState(variant?.metaDescription || 'Discover 10 practical tips for sustainable living and reducing your environmental impact.');
  const [tags, setTags] = useState(variant?.tags || ['sustainability', 'eco-friendly', 'green-living']);
  const [featuredImage, setFeaturedImage] = useState(variant?.featuredImage || 'https://images.unsplash.com/photo-1638342863994-ae4eee256688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwd3JpdGluZyUyMGNvbnRlbnR8ZW58MXx8fHwxNzY1NTE4Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080');
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    onEdit({
      title,
      content: body,
      metaDescription,
      tags,
      featuredImage
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📝 Blog Post Editor" size="fullscreen">
      <ModalContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm text-[#6B7280] mb-2 block">Post Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 outline-none transition-all"
                placeholder="Enter your blog post title..."
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-[#6B7280]">Content</label>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors" title="Bold">
                    <Type className="w-4 h-4 text-[#6B7280]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors" title="Add Image">
                    <ImageIcon className="w-4 h-4 text-[#6B7280]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors" title="Code Block">
                    <Code className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-[500px] px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 outline-none transition-all resize-none font-mono text-sm"
                placeholder="Write your blog post content in Markdown..."
              />
            </div>

            {/* AI Assistant */}
            <Card className="bg-gradient-to-br from-[#F3E8FF] to-[#EDE9FE] border-[#8B5CF6]">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h5 className="text-[#1F2937]">AI Writing Assistant</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="small">
                    <Sparkles className="w-3 h-3" />
                    Improve Writing
                  </Button>
                  <Button variant="ghost" size="small">
                    <Sparkles className="w-3 h-3" />
                    Make Shorter
                  </Button>
                  <Button variant="ghost" size="small">
                    <Sparkles className="w-3 h-3" />
                    Add Section
                  </Button>
                  <Button variant="ghost" size="small">
                    <Sparkles className="w-3 h-3" />
                    Fix Grammar
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-4">
            {/* Featured Image */}
            <Card>
              <div className="p-4">
                <h5 className="text-[#1F2937] mb-3">Featured Image</h5>
                <div className="mb-3">
                  <img src={featuredImage} alt="Featured" className="w-full h-40 object-cover rounded-lg" />
                </div>
                <Button variant="ghost" size="small" className="w-full">
                  <ImageIcon className="w-4 h-4" />
                  Change Image
                </Button>
              </div>
            </Card>

            {/* SEO Settings */}
            <Card>
              <div className="p-4 space-y-3">
                <h5 className="text-[#1F2937]">SEO Settings</h5>
                
                <div>
                  <label className="text-sm text-[#6B7280] mb-2 block">Meta Description</label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm resize-none"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-[#9CA3AF] mt-1">{metaDescription.length}/160</p>
                </div>

                <div>
                  <label className="text-sm text-[#6B7280] mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#F3E8FF] text-[#8B5CF6] rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm"
                    placeholder="Add tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          setTags([...tags, value]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Publishing */}
            <Card>
              <div className="p-4 space-y-3">
                <h5 className="text-[#1F2937]">Publishing</h5>
                
                <div>
                  <label className="text-sm text-[#6B7280] mb-2 block">Status</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm">
                    <option>Draft</option>
                    <option>Scheduled</option>
                    <option>Published</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-[#6B7280] mb-2 block">Category</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm">
                    <option>Lifestyle</option>
                    <option>Business</option>
                    <option>Technology</option>
                    <option>Health</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button variant="primary" className="w-full" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              <Button variant="ghost" className="w-full" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <h4 className="mb-4 text-[#1F2937]">Preview</h4>
            <Card className="bg-white">
              <div className="p-8 prose prose-purple max-w-none">
                <h1>{title}</h1>
                <img src={featuredImage} alt="Featured" className="w-full h-64 object-cover rounded-xl mb-6" />
                <div className="whitespace-pre-wrap">{body}</div>
              </div>
            </Card>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}