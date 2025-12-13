import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Linkedin, Twitter, Instagram, Edit, Eye, Check, Circle } from 'lucide-react';

interface ContentVariantCardProps {
  variant: {
    id: string;
    platform: string;
    content: string;
    selected: boolean;
    thumbnail?: string;
    type?: 'text' | 'visual';
  };
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onPreview: () => void;
}

const platformConfig: Record<string, { icon: any; color: string; label: string; bgGradient: string }> = {
  blog: {
    icon: FileText,
    color: '#8B5CF6',
    label: 'Blog Post',
    bgGradient: 'from-[#8B5CF6] to-[#7C3AED]'
  },
  linkedin: {
    icon: Linkedin,
    color: '#0077B5',
    label: 'LinkedIn',
    bgGradient: 'from-[#0077B5] to-[#0A66C2]'
  },
  twitter: {
    icon: Twitter,
    color: '#1DA1F2',
    label: 'Twitter',
    bgGradient: 'from-[#1DA1F2] to-[#0C8BD9]'
  },
  instagram: {
    icon: Instagram,
    color: '#E4405F',
    label: 'Instagram',
    bgGradient: 'from-[#F58529] via-[#DD2A7B] to-[#8134AF]'
  }
};

export function ContentVariantCard({ variant, isSelected, onToggleSelect, onEdit, onPreview }: ContentVariantCardProps) {
  const config = platformConfig[variant.platform] || platformConfig.blog;
  const Icon = config.icon;

  return (
    <Card
      hover={true}
      className={`group transition-all ${
        isSelected ? 'ring-2 ring-[#8B5CF6] shadow-xl' : ''
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg bg-gradient-to-br ${config.bgGradient}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h5 className="text-[#1F2937] mb-1">{config.label}</h5>
              <Badge variant="success">Ready</Badge>
            </div>
          </div>
          
          {/* Selection Toggle */}
          <button
            onClick={onToggleSelect}
            className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            {isSelected ? (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            ) : (
              <Circle className="w-5 h-5 text-[#D1D5DB]" />
            )}
          </button>
        </div>

        {/* Content Preview */}
        <div className="min-h-[80px] p-3 bg-[#F9FAFB] rounded-lg">
          {variant.thumbnail ? (
            <div className="space-y-2">
              <img 
                src={variant.thumbnail} 
                alt="Content thumbnail"
                className="w-full h-32 object-cover rounded-lg"
              />
              <p className="text-xs text-[#6B7280] line-clamp-2">
                {variant.content}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#6B7280] line-clamp-4">
              {variant.content}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#E5E7EB]">
          <Button
            variant="ghost"
            size="small"
            onClick={onPreview}
            className="flex-1"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={onEdit}
            className="flex-1"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
}