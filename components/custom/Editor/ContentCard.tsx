import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Linkedin, Twitter, Instagram, Edit, Eye, Clock } from 'lucide-react';

interface ContentCardProps {
  platform: 'blog' | 'linkedin' | 'twitter' | 'instagram';
  data: any;
  onEdit: () => void;
  onPreview: () => void;
}

const platformConfig = {
  blog: {
    icon: FileText,
    color: '#8B5CF6',
    label: 'Blog Post'
  },
  linkedin: {
    icon: Linkedin,
    color: '#0077B5',
    label: 'LinkedIn'
  },
  twitter: {
    icon: Twitter,
    color: '#1DA1F2',
    label: 'Twitter'
  },
  instagram: {
    icon: Instagram,
    color: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)',
    label: 'Instagram'
  }
};

export function ContentCard({ platform, data, onEdit, onPreview }: ContentCardProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  const getPreviewContent = () => {
    switch (platform) {
      case 'blog':
        return (
          <>
            <p className="font-medium text-[#1F2937] mb-3 line-clamp-2">{data.title}</p>
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <span>{data.wordCount} words</span>
              <span>•</span>
              <span>{data.readingTime} read</span>
            </div>
          </>
        );
      case 'linkedin':
        return (
          <>
            <p className="text-sm text-[#6B7280] mb-3 line-clamp-3">{data.text}</p>
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <span>{data.characterCount} chars</span>
              <span>•</span>
              <span>PDF: {data.pdfSlides} slides</span>
            </div>
          </>
        );
      case 'twitter':
        return (
          <>
            <p className="text-sm text-[#6B7280] mb-3">Thread with {data.threadCount} tweets</p>
            <div className="flex flex-wrap gap-1">
              {data.hashtags.map((tag: string, idx: number) => (
                <span key={idx} className="text-xs px-2 py-1 bg-[#DBEAFE] text-[#1E40AF] rounded">
                  {tag}
                </span>
              ))}
            </div>
          </>
        );
      case 'instagram':
        return (
          <>
            <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{data.caption}</p>
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <span>Carousel: {data.slides} slides</span>
              <span>•</span>
              <span>{data.hashtags.length} hashtags</span>
            </div>
          </>
        );
    }
  };

  return (
    <Card
      variant="platform"
      platformColor={config.color}
      hover={true}
      className="group"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{
                background: typeof config.color === 'string' && config.color.includes('gradient')
                  ? config.color
                  : `${config.color}20`
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{
                  color: typeof config.color === 'string' && !config.color.includes('gradient')
                    ? config.color
                    : '#DD2A7B'
                }}
              />
            </div>
            <div>
              <CardTitle className="text-base">{config.label}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="success">
                  <Clock className="w-3 h-3" />
                  Ready
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="min-h-[80px]">
          {getPreviewContent()}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="ghost"
            size="small"
            onClick={onPreview}
            className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
      </CardFooter>
    </Card>
  );
}
