import React, { useState } from 'react';
import { Modal, ModalContent } from '../ui/Modal';
import { Button } from '../ui/button';
import { Card } from '../ui/Card';
import { Sparkles, Zap, TrendingUp, Wand2 } from 'lucide-react';

interface GenerateVariantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: any) => void;
}

export function GenerateVariantsModal({ isOpen, onClose, onGenerate }: GenerateVariantsModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'linkedin']);
  const [tone, setTone] = useState('professional');
  const [contentType, setContentType] = useState('visual');
  const [numVariants, setNumVariants] = useState(3);

  const platforms = [
    { id: 'blog', name: 'Blog Post', icon: '📝', color: 'from-[#8B5CF6] to-[#7C3AED]' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-[#E1306C] to-[#C13584]' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-[#0A66C2] to-[#004182]' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'from-[#1DA1F2] to-[#0C85D0]' },
  ];

  const tones = [
    { id: 'professional', name: 'Professional', icon: '💼' },
    { id: 'casual', name: 'Casual', icon: '😊' },
    { id: 'educational', name: 'Educational', icon: '📚' },
    { id: 'inspirational', name: 'Inspirational', icon: '✨' },
    { id: 'humorous', name: 'Humorous', icon: '😄' },
  ];

  const contentTypes = [
    { id: 'visual', name: 'Visual Posts', description: 'Carousels, infographics, stories', icon: '🎨' },
    { id: 'text', name: 'Text Posts', description: 'Threads, captions, articles', icon: '📝' },
    { id: 'mixed', name: 'Mixed', description: 'Both visual and text content', icon: '🔀' },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = () => {
    onGenerate({
      platforms: selectedPlatforms,
      tone,
      contentType,
      numVariants
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✨ Generate More Variants" size="large">
      <ModalContent>
        <div className="space-y-6">
          {/* Platforms */}
          <div>
            <h4 className="mb-3 text-[#1F2937]">Select Platforms</h4>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map(platform => (
                <Card
                  key={platform.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? 'ring-2 ring-[#8B5CF6] bg-gradient-to-br ' + platform.color + ' text-white'
                      : 'hover:border-[#8B5CF6]'
                  }`}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <div className="flex items-center gap-3 p-4">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <p className={`font-medium ${selectedPlatforms.includes(platform.id) ? 'text-white' : 'text-[#1F2937]'}`}>
                        {platform.name}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <h4 className="mb-3 text-[#1F2937]">Content Type</h4>
            <div className="grid grid-cols-3 gap-3">
              {contentTypes.map(type => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all ${
                    contentType === type.id
                      ? 'ring-2 ring-[#8B5CF6] bg-[#F3E8FF]'
                      : 'hover:border-[#8B5CF6]'
                  }`}
                  onClick={() => setContentType(type.id)}
                >
                  <div className="text-center p-4">
                    <span className="text-3xl mb-2 block">{type.icon}</span>
                    <p className="font-medium text-[#1F2937] mb-1">{type.name}</p>
                    <p className="text-xs text-[#6B7280]">{type.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <h4 className="mb-3 text-[#1F2937]">Tone of Voice</h4>
            <div className="flex flex-wrap gap-2">
              {tones.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    tone === t.id
                      ? 'bg-[#8B5CF6] text-white'
                      : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3E8FF]'
                  }`}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Variants */}
          <div>
            <h4 className="mb-3 text-[#1F2937]">Number of Variants</h4>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={numVariants}
                onChange={(e) => setNumVariants(Number(e.target.value))}
                className="flex-1 h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${numVariants * 10}%, #E5E7EB ${numVariants * 10}%, #E5E7EB 100%)`
                }}
              />
              <div className="w-16 text-center">
                <span className="text-2xl font-bold gradient-text">{numVariants}</span>
              </div>
            </div>
          </div>

          {/* Generation Summary */}
          <Card className="bg-gradient-to-br from-[#F3E8FF] to-[#EDE9FE] border-[#8B5CF6]">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="text-[#1F2937] mb-2">Ready to Generate</h5>
                  <p className="text-sm text-[#6B7280]">
                    You'll receive <strong>{numVariants} {contentType}</strong> variants in a <strong>{tone}</strong> tone 
                    for <strong>{selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}</strong>.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleGenerate}
              disabled={selectedPlatforms.length === 0}
            >
              <Zap className="w-4 h-4" />
              Generate Variants
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
