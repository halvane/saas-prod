import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ExternalLink, Heart, MessageCircle, Share2, Hash } from 'lucide-react';

interface TrendSurferProps {
  onProceed: (data: any) => void;
  filters?: {
    searchQuery: string;
    selectedDomain: string;
    selectedCategory: string;
  };
}

const allTrends = [
  {
    id: '1',
    title: 'Sustainable Fashion Goes Mainstream',
    description: 'Eco-friendly fashion brands seeing 300% growth',
    engagement: '45.2K',
    domain: 'lifestyle',
    category: 'viral',
    source: 'Twitter',
    trending: '+245%',
    keywords: ['sustainable', 'fashion', 'eco']
  },
  {
    id: '2',
    title: 'AI Tools Revolutionizing Productivity',
    description: 'New AI assistants boost team efficiency by 60%',
    engagement: '32.1K',
    domain: 'technology',
    category: 'breaking',
    source: 'LinkedIn',
    trending: '+180%',
    keywords: ['AI', 'productivity', 'tools']
  },
  {
    id: '3',
    title: 'Remote Work: The New Normal',
    description: 'Companies embrace permanent remote policies',
    engagement: '28.5K',
    domain: 'business',
    category: 'evergreen',
    source: 'Medium',
    trending: '+120%',
    keywords: ['remote', 'work', 'hybrid']
  },
  {
    id: '4',
    title: 'Plant-Based Diet Benefits',
    description: 'Latest research on health improvements',
    engagement: '21.3K',
    domain: 'health',
    category: 'evergreen',
    source: 'Instagram',
    trending: '+95%',
    keywords: ['plant-based', 'health', 'diet']
  },
  {
    id: '5',
    title: 'Crypto Market Recovery',
    description: 'Bitcoin hits new highs this quarter',
    engagement: '52.8K',
    domain: 'business',
    category: 'breaking',
    source: 'Twitter',
    trending: '+310%',
    keywords: ['crypto', 'bitcoin', 'finance']
  }
];

export function TrendSurfer({ onProceed, filters }: TrendSurferProps) {
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);

  // Filter trends based on search query and filters
  const filteredTrends = allTrends.filter(trend => {
    const matchesSearch = !filters?.searchQuery || 
      trend.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      trend.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      trend.keywords.some(kw => kw.toLowerCase().includes(filters.searchQuery.toLowerCase()));
    
    const matchesDomain = !filters?.selectedDomain || filters.selectedDomain === 'all' || 
      trend.domain === filters.selectedDomain;
    
    const matchesCategory = !filters?.selectedCategory || filters.selectedCategory === 'all' || 
      trend.category === filters.selectedCategory;
    
    return matchesSearch && matchesDomain && matchesCategory;
  });

  const handleProceed = () => {
    const trend = allTrends.find(t => t.id === selectedTrend);
    if (trend) {
      onProceed(trend);
    }
  };

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B7280]">
          Showing <span className="font-semibold text-[#1F2937]">{filteredTrends.length}</span> trending topics
        </p>
      </div>

      {/* Trending Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrends.map((trend) => (
          <Card
            key={trend.id}
            hover={true}
            onClick={() => setSelectedTrend(trend.id)}
            className={`cursor-pointer transition-all ${
              selectedTrend === trend.id
                ? 'ring-2 ring-[#8B5CF6] shadow-xl'
                : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="mb-2 group-hover:text-[#8B5CF6] transition-colors">
                      {trend.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-[#10B981] font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        <span>{trend.trending}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#6B7280]">
                        <Heart className="w-4 h-4" />
                        <span>{trend.engagement}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleProceed}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Select
                  </Button>
                </div>

                {/* Description */}
                <p className="text-sm text-[#6B7280]">{trend.description}</p>

                {/* Keywords */}
                <div className="flex items-start gap-2">
                  <Hash className="w-4 h-4 text-[#9CA3AF] mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-2">
                    {trend.keywords.map((keyword, kidx) => (
                      <span
                        key={kidx}
                        className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] text-xs rounded-md"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9CA3AF]">Popular on:</span>
                  <div className="flex gap-1">
                    <span
                      className="px-2 py-1 bg-[#DDD6FE] text-[#7C3AED] text-xs rounded-md font-medium"
                    >
                      {trend.source}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="ghost" size="medium">
          Load More Trends
        </Button>
      </div>
    </div>
  );
}