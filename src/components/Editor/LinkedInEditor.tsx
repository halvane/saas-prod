import React, { useState } from 'react';
import { Modal, ModalContent } from '../ui/Modal';
import { Button } from '../ui/button';
import { Card } from '../ui/Card';
import { Save, Sparkles, Image as ImageIcon, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

interface LinkedInEditorProps {
  isOpen: boolean;
  variant: any;
  onClose: () => void;
  onEdit: (content: any) => void;
}

export function LinkedInEditor({ isOpen, variant, onClose, onEdit }: LinkedInEditorProps) {
  const [postContent, setPostContent] = useState(variant?.content || `Sustainability isn't just a buzzword - it's a business imperative. 

Here are 10 actionable steps your company can take today to build a more sustainable future:

✅ Conduct an environmental impact assessment
✅ Set measurable sustainability goals
✅ Implement energy-efficient practices
✅ Reduce waste and promote recycling
✅ Partner with sustainable suppliers

The journey to sustainability starts with a single step. What's your company doing to make a difference?

#Sustainability #CorporateResponsibility #GreenBusiness #ESG`);
  const [hashtags, setHashtags] = useState(['Sustainability', 'CorporateResponsibility', 'GreenBusiness', 'ESG']);

  const handleSave = () => {
    onEdit({ content: postContent, hashtags });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="💼 LinkedIn Post Editor" size="large">
      <ModalContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div>
              <h4 className="text-[#1F2937] mb-2">Post Content</h4>
              <p className="text-sm text-[#6B7280] mb-4">Share your professional insights</p>
            </div>

            <Card>
              <div className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#004182]" />
                  <div>
                    <p className="font-medium text-[#1F2937]">Your Name</p>
                    <p className="text-sm text-[#6B7280]">Your Professional Title</p>
                  </div>
                </div>

                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20 outline-none transition-all resize-none"
                  rows={12}
                  maxLength={3000}
                  placeholder="What do you want to talk about?"
                />

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded hover:bg-[#F9FAFB] transition-colors">
                      <ImageIcon className="w-4 h-4 text-[#6B7280]" />
                    </button>
                    <button className="p-2 rounded hover:bg-[#F9FAFB] transition-colors">
                      <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                    </button>
                  </div>
                  <span className="text-sm text-[#6B7280]">{postContent.length}/3000</span>
                </div>
              </div>
            </Card>

            {/* Hashtags */}
            <Card>
              <div className="p-4 space-y-3">
                <h5 className="text-[#1F2937]">Hashtags</h5>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#E7F0FA] text-[#0A66C2] rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm"
                  placeholder="Add hashtag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        setHashtags([...hashtags, value]);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>
            </Card>

            {/* AI Writing Assistant */}
            <Card className="bg-gradient-to-br from-[#F3E8FF] to-[#EDE9FE] border-[#8B5CF6]">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                  <h5 className="text-[#1F2937]">AI Writing Assistant</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="small">Make Professional</Button>
                  <Button variant="ghost" size="small">Add Hook</Button>
                  <Button variant="ghost" size="small">Suggest Hashtags</Button>
                  <Button variant="ghost" size="small">Improve Engagement</Button>
                </div>
              </div>
            </Card>

            {/* Post Settings */}
            <Card>
              <div className="p-4 space-y-3">
                <h5 className="text-[#1F2937]">Post Settings</h5>
                
                <div>
                  <label className="text-sm text-[#6B7280] mb-2 block">Who can see this post?</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm">
                    <option>Anyone</option>
                    <option>Connections only</option>
                    <option>Custom</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="comments" className="rounded" />
                  <label htmlFor="comments" className="text-sm text-[#6B7280]">Allow comments</label>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="repost" className="rounded" defaultChecked />
                  <label htmlFor="repost" className="text-sm text-[#6B7280]">Allow resharing</label>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <div className="mb-4">
              <h4 className="text-[#1F2937] mb-2">Preview</h4>
              <p className="text-sm text-[#6B7280]">How your post will appear on LinkedIn</p>
            </div>

            <div className="bg-[#F9FAFB] rounded-xl p-6">
              <Card className="bg-white">
                <div className="p-6">
                  {/* Profile Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#004182]" />
                    <div className="flex-1">
                      <p className="font-medium text-[#1F2937]">Your Name</p>
                      <p className="text-sm text-[#6B7280]">Your Professional Title</p>
                      <p className="text-xs text-[#9CA3AF]">Just now · 🌎</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-[#1F2937] whitespace-pre-wrap">
                      {postContent || <span className="text-[#9CA3AF] italic">Your post content will appear here...</span>}
                    </p>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between py-3 border-y border-[#E5E7EB]">
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xs">👍</div>
                        <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xs">💡</div>
                        <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-xs">❤️</div>
                      </div>
                      <span>127</span>
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      <span>23 comments · 12 reposts</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-around pt-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-[#F9FAFB] transition-colors text-[#6B7280]">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-[#F9FAFB] transition-colors text-[#6B7280]">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-[#F9FAFB] transition-colors text-[#6B7280]">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Repost</span>
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <Button variant="primary" className="w-full" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save Post
              </Button>
              <Button variant="ghost" className="w-full" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}