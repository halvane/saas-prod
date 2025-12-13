'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';
import { TrendSurfer } from './TrendSurfer';
import { URLThief } from './URLThief';
import { BrainDump } from './BrainDump';
import { TrendingUp, Link as LinkIcon, Brain, Sparkles, Search, Filter, X } from 'lucide-react';
import { WorkflowProgress } from '@/components/ui/WorkflowProgress';

interface RadarPageProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (mode: string, data: any) => void;
}

export function RadarPage({ isOpen, onClose, onProceed }: RadarPageProps) {
  const [selectedMode, setSelectedMode] = useState<'surfer' | 'thief' | 'brain' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const modes = [
    {
      id: 'surfer' as const,
      title: '🌊 Trend Surfer',
      description: 'Discover what\'s trending across platforms',
      icon: TrendingUp,
      color: '#F59E0B'
    },
    {
      id: 'thief' as const,
      title: '🔗 URL Thief',
      description: 'Extract content from any URL',
      icon: LinkIcon,
      color: '#3B82F6'
    },
    {
      id: 'brain' as const,
      title: '🧠 Brain Dump',
      description: 'Start from your own ideas',
      icon: Brain,
      color: '#8B5CF6'
    }
  ];

  const handleSelectMode = (mode: typeof selectedMode) => {
    setSelectedMode(mode);
  };

  const handleProceed = (data: any) => {
    if (selectedMode) {
      onProceed(selectedMode, data);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="full" showClose={false}>
      {/* Workflow Progress */}
      <WorkflowProgress currentStep="radar" />

      <ModalContent>
        {!selectedMode ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <h2 className="gradient-text mb-3">Choose Your Content Source</h2>
              <p className="text-[#6B7280] max-w-2xl mx-auto">
                Select how you'd like to begin your content creation journey. Each path is optimized for different workflows.
              </p>
            </div>

            {/* Mode Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <Card
                    key={mode.id}
                    hover={true}
                    onClick={() => handleSelectMode(mode.id)}
                    className="cursor-pointer group"
                  >
                    <div className="text-center space-y-4">
                      <div
                        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${mode.color}20` }}
                      >
                        <Icon className="w-8 h-8" style={{ color: mode.color }} />
                      </div>
                      <div>
                        <h3 className="mb-2">{mode.title}</h3>
                        <p className="text-sm text-[#6B7280]">{mode.description}</p>
                      </div>
                      <Button variant="ghost" className="w-full group-hover:bg-[#F3F4F6]">
                        Select {mode.title.split(' ')[1]}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => setSelectedMode(null)}>
              ← Back to Selection
            </Button>

            {/* Trend Surfer with Search & Filters */}
            {selectedMode === 'surfer' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="gradient-text mb-2">🌊 Trending Now</h2>
                    <p className="text-[#6B7280]">Discover what's capturing attention across the web</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4" />
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </Button>
                </div>

                {/* Search & Filter Bar */}
                <Card>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          placeholder="Search trending topics..."
                          icon={<Search className="w-5 h-5" />}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          onClick={() => setSearchQuery('')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Filters (collapsible) */}
                    {showFilters && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB] animate-fadeIn">
                        <Select
                          label="Domain"
                          options={[
                            { value: 'all', label: 'All Domains' },
                            { value: 'technology', label: 'Technology' },
                            { value: 'business', label: 'Business' },
                            { value: 'lifestyle', label: 'Lifestyle' },
                            { value: 'health', label: 'Health & Wellness' },
                            { value: 'entertainment', label: 'Entertainment' }
                          ]}
                          value={selectedDomain}
                          onChange={(e) => setSelectedDomain(e.target.value)}
                        />
                        <Select
                          label="Category"
                          options={[
                            { value: 'all', label: 'All Categories' },
                            { value: 'viral', label: 'Viral Content' },
                            { value: 'breaking', label: 'Breaking News' },
                            { value: 'evergreen', label: 'Evergreen Topics' },
                            { value: 'seasonal', label: 'Seasonal Trends' }
                          ]}
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Active Filters Display */}
                    {(selectedDomain !== 'all' || selectedCategory !== 'all' || searchQuery) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-[#6B7280]">Active filters:</span>
                        {searchQuery && (
                          <span className="px-2 py-1 bg-[#DDD6FE] text-[#7C3AED] rounded-full text-xs font-medium flex items-center gap-1">
                            Search: {searchQuery}
                            <button onClick={() => setSearchQuery('')} className="hover:bg-[#C4B5FD] rounded-full p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {selectedDomain !== 'all' && (
                          <span className="px-2 py-1 bg-[#DBEAFE] text-[#1E40AF] rounded-full text-xs font-medium flex items-center gap-1">
                            {selectedDomain}
                            <button onClick={() => setSelectedDomain('all')} className="hover:bg-[#BFDBFE] rounded-full p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {selectedCategory !== 'all' && (
                          <span className="px-2 py-1 bg-[#FEF3C7] text-[#92400E] rounded-full text-xs font-medium flex items-center gap-1">
                            {selectedCategory}
                            <button onClick={() => setSelectedCategory('all')} className="hover:bg-[#FDE68A] rounded-full p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Card>

                <TrendSurfer onProceed={handleProceed} filters={{ searchQuery, selectedDomain, selectedCategory }} />
              </>
            )}

            {selectedMode === 'thief' && <URLThief onProceed={handleProceed} />}
            {selectedMode === 'brain' && <BrainDump onProceed={handleProceed} />}
          </div>
        )}
      </ModalContent>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel Campaign
        </Button>
      </ModalFooter>
    </Modal>
  );
}