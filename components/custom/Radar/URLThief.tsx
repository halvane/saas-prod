import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, Youtube, FileText, Image, CheckCircle } from 'lucide-react';

const supportedPlatforms = [
  { name: 'YouTube', icon: Youtube, example: 'youtube.com/watch?v=...' },
  { name: 'Medium', icon: FileText, example: 'medium.com/@user/article' },
  { name: 'Substack', icon: FileText, example: 'newsletter.substack.com/p/...' },
  { name: 'Any Blog', icon: Link, example: 'yourblog.com/post' }
];

interface URLThiefProps {
  onProceed: (data: any) => void;
}

export function URLThief({ onProceed }: URLThiefProps) {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onProceed({ url, extractedContent: 'Sample content from URL' });
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-lg">
          <Link className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3>🔗 URL Analyzer</h3>
          <p className="text-sm text-[#6B7280]">Extract content from any URL</p>
        </div>
      </div>

      {/* URL Input */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <Input
          label="Paste a URL to Analyze"
          placeholder="https://example.com/blog/amazing-post"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          icon={<Link className="w-5 h-5" />}
        />
        
        <div className="mt-4">
          <Button
            variant="primary"
            size="large"
            onClick={handleAnalyze}
            loading={isAnalyzing}
            disabled={!url}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze URL →'}
          </Button>
        </div>
      </div>

      {/* Supported Platforms */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h5 className="mb-4 text-[#1F2937]">Supported Platforms</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {supportedPlatforms.map((platform, idx) => {
            const Icon = platform.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Icon className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1F2937] mb-1">{platform.name}</p>
                  <p className="text-xs text-[#9CA3AF] truncate">{platform.example}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What We Extract */}
      <div className="bg-gradient-to-br from-[#DDD6FE] to-[#F3E8FF] rounded-xl p-6">
        <h5 className="mb-4 text-[#7C3AED]">✓ AI Will Extract:</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: FileText, text: 'Title & Main Content' },
            { icon: CheckCircle, text: 'Key Points & Highlights' },
            { icon: Image, text: 'Images & Media' },
            { icon: CheckCircle, text: 'Tone & Writing Style' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2 text-[#7C3AED]">
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}