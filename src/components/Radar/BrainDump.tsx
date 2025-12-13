import React, { useState } from 'react';
import { Textarea } from '../ui/Input';
import { Button } from '../ui/button';
import { Sparkles, Lightbulb } from 'lucide-react';

const examples = [
  '5 productivity hacks for remote workers',
  'Vegan recipes under 30 minutes',
  'How to start a podcast in 2025',
  'Best AI tools for content creators',
  'Instagram growth strategies that actually work'
];

interface BrainDumpProps {
  onProceed: (data: any) => void;
}

export function BrainDump({ onProceed }: BrainDumpProps) {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!idea) return;
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onProceed({ idea, topic: idea });
    setIsGenerating(false);
  };

  const handleExampleClick = (example: string) => {
    setIdea(example);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3>✍️ Free-Form Idea</h3>
          <p className="text-sm text-[#6B7280]">Describe your content idea in your own words</p>
        </div>
      </div>

      {/* Idea Input */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <Textarea
          label="Write Your Idea"
          placeholder="I want to create content about..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={6}
          maxLength={500}
        />
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-[#9CA3AF]">{idea.length}/500 characters</span>
        </div>

        <div className="mt-4">
          <Button
            variant="primary"
            size="large"
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!idea || idea.length < 10}
            className="w-full"
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? 'Generating Content...' : 'Generate Content →'}
          </Button>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
          <h5 className="text-[#1F2937]">💡 Example Ideas</h5>
        </div>
        <div className="space-y-2">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(example)}
              className="w-full text-left px-4 py-3 rounded-lg bg-[#F9FAFB] hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6] border-2 border-transparent transition-all group"
            >
              <p className="text-sm text-[#6B7280] group-hover:text-[#8B5CF6] transition-colors">
                "{example}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] rounded-xl p-6">
        <h5 className="mb-3 text-[#1E40AF]">✨ Tips for Best Results:</h5>
        <ul className="space-y-2 text-sm text-[#1E40AF]">
          <li className="flex items-start gap-2">
            <span className="text-[#3B82F6] mt-0.5">•</span>
            <span>Be specific about your topic and target audience</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#3B82F6] mt-0.5">•</span>
            <span>Include the type of content you want (tips, guide, tutorial, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#3B82F6] mt-0.5">•</span>
            <span>Mention any specific angle or unique perspective</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#3B82F6] mt-0.5">•</span>
            <span>Add keywords you want to target for SEO</span>
          </li>
        </ul>
      </div>
    </div>
  );
}