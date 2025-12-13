import React, { useState } from 'react';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/input';
import { Sparkles, Image as ImageIcon, Hash, AtSign, Smile, Calendar } from 'lucide-react';

interface PostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  platform?: 'twitter' | 'linkedin' | 'instagram' | 'facebook';
  initialContent?: string;
}

export function PostEditor({ isOpen, onClose, platform = 'twitter', initialContent = '' }: PostEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);

  const platformConfig = {
    twitter: { name: 'Twitter/X', color: '#1DA1F2', maxLength: 280 },
    linkedin: { name: 'LinkedIn', color: '#0077B5', maxLength: 3000 },
    instagram: { name: 'Instagram', color: '#E4405F', maxLength: 2200 },
    facebook: { name: 'Facebook', color: '#1877F2', maxLength: 63206 }
  };

  const config = platformConfig[platform];
  const charCount = content.length;
  const percentage = (charCount / config.maxLength) * 100;

  const templateImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=400',
    'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?w=400',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400'
  ];

  const handleAIAssist = (action: string) => {
    console.log(`AI: ${action}`);
    // Simulate AI enhancement
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Edit ${config.name} Post`}
      size="large"
    >
      <ModalContent>
        <div className="space-y-6">
          {/* Platform Badge */}
          <div className="flex items-center justify-between">
            <Badge variant="platform" platform={platform}>
              {config.name}
            </Badge>
            <div className="text-sm">
              <span className={charCount > config.maxLength ? 'text-[#EF4444]' : 'text-[#6B7280]'}>
                {charCount} / {config.maxLength}
              </span>
            </div>
          </div>

          {/* Content Editor */}
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your ${config.name} post...`}
              rows={8}
              className="w-full"
            />
            
            {/* Character Progress Bar */}
            <div className="mt-2 h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  percentage > 90 ? 'bg-[#EF4444]' : 
                  percentage > 75 ? 'bg-[#F59E0B]' : 
                  'bg-[#8B5CF6]'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          {/* AI Tools */}
          <div className="p-4 bg-gradient-to-br from-[#DDD6FE] to-[#F3E8FF] rounded-lg">
            <h5 className="text-sm font-semibold text-[#7C3AED] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Writing Tools
            </h5>
            <div className="flex flex-wrap gap-2">
              {[
                'Make it engaging',
                'Add emojis',
                'Create hook',
                'Add hashtags',
                'Professional tone',
                'Casual tone'
              ].map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAIAssist(action)}
                  className="px-3 py-1.5 bg-white text-[#7C3AED] rounded-lg hover:shadow-md transition-all text-sm font-medium"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <h5 className="text-sm font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Add Image (Optional)
            </h5>
            <div className="grid grid-cols-4 gap-3">
              {templateImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(selectedImage === img ? null : img)}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-4 transition-all ${
                    selectedImage === img 
                      ? 'border-[#8B5CF6] shadow-lg' 
                      : 'border-transparent hover:border-[#E5E7EB]'
                  }`}
                >
                  <img src={img} alt={`Template ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <button className="mt-3 w-full py-2 border-2 border-dashed border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-colors">
              + Upload Custom Image
            </button>
          </div>

          {/* Hashtag Suggestions */}
          {(platform === 'instagram' || platform === 'twitter') && (
            <div>
              <h5 className="text-sm font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Suggested Hashtags
              </h5>
              <div className="flex flex-wrap gap-2">
                {['#SustainableFashion', '#EcoFriendly', '#GreenLiving', '#Sustainability', '#Fashion2025'].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!hashtags.includes(tag)) {
                        setHashtags([...hashtags, tag]);
                        setContent(content + ' ' + tag);
                      }
                    }}
                    className="px-3 py-1 bg-[#F3F4F6] text-[#8B5CF6] rounded-full text-sm hover:bg-[#DDD6FE] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="p-4 bg-[#F9FAFB] rounded-lg border-2 border-[#E5E7EB]">
            <h5 className="text-sm font-semibold text-[#1F2937] mb-3">Preview</h5>
            {selectedImage && (
              <img src={selectedImage} alt="Selected" className="w-full rounded-lg mb-3" />
            )}
            <p className="text-sm text-[#1F2937] whitespace-pre-wrap">{content || 'Your post will appear here...'}</p>
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="secondary">
          <Calendar className="w-4 h-4" />
          Schedule Post
        </Button>
        <Button variant="primary">
          <Sparkles className="w-4 h-4" />
          Save Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
}
