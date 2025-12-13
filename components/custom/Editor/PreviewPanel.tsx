import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Palette, Type, Image as ImageIcon } from 'lucide-react';

interface PreviewPanelProps {
  selectedPlatform: string;
  content: any;
  onOpenAdvancedEditor: () => void;
}

export function PreviewPanel({ selectedPlatform, content, onOpenAdvancedEditor }: PreviewPanelProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = content?.slides || 5;

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'blog', label: 'Blog' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
      <div className="mb-6">
        <h4 className="mb-4">Live Preview</h4>
        
        <Select
          label="Platform"
          options={platforms}
          defaultValue={selectedPlatform}
        />
      </div>

      {/* Preview Area */}
      <div className="mb-6">
        <Card variant="glass" hover={false} className="aspect-square flex items-center justify-center bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB]">
          <div className="text-center p-8">
            <div className="w-full h-64 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-lg mb-4 flex items-center justify-center">
              <div className="text-white text-center">
                <h3 className="mb-2">10 Sustainable Tips</h3>
                <p className="text-sm opacity-90">Tip #{currentSlide}: Choose Quality Over Quantity</p>
                <div className="mt-4 text-xs opacity-75">@purlema</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Slide Navigation */}
        {selectedPlatform === 'instagram' && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="icon"
              size="small"
              onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
              disabled={currentSlide === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-[#6B7280]">
              {currentSlide} / {totalSlides}
            </span>
            
            <Button
              variant="icon"
              size="small"
              onClick={() => setCurrentSlide(Math.min(totalSlides, currentSlide + 1))}
              disabled={currentSlide === totalSlides}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Quick Edit Options */}
      <div className="space-y-4 mb-6">
        <h5 className="text-sm font-semibold text-[#1F2937]">Quick Edit:</h5>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer group">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-sm text-[#6B7280] group-hover:text-[#1F2937]">Background Color</span>
            </div>
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] border-2 border-white shadow-sm" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer group">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-sm text-[#6B7280] group-hover:text-[#1F2937]">Font</span>
            </div>
            <span className="text-sm font-medium text-[#1F2937]">Poppins</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer group">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-sm text-[#6B7280] group-hover:text-[#1F2937]">Logo Position</span>
            </div>
            <span className="text-sm font-medium text-[#1F2937]">Bottom Right</span>
          </div>
        </div>
      </div>

      {/* Advanced Editor Button */}
      <Button
        variant="primary"
        size="medium"
        onClick={onOpenAdvancedEditor}
        className="w-full"
      >
        Open Advanced Editor →
      </Button>
    </div>
  );
}
