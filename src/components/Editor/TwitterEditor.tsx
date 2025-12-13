import React, { useState } from 'react';
import { Modal, ModalContent } from '../ui/Modal';
import { Button } from '../ui/button';
import { Card } from '../ui/Card';
import { Save, X, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';

interface TwitterEditorProps {
  isOpen: boolean;
  variant: any;
  onClose: () => void;
  onEdit: (content: any) => void;
}

export function TwitterEditor({ isOpen, variant, onClose, onEdit }: TwitterEditorProps) {
  const [tweets, setTweets] = useState(variant?.tweets || [
    '🌱 Thread: 10 sustainable living tips that actually make a difference. Let\'s talk about real change, not greenwashing. [1/11]',
    'Tip #1: Reduce single-use plastics. Start small - reusable water bottles, shopping bags, and food containers. The average person uses 156 plastic bottles per year. 🚫🥤',
    'Tip #2: Switch to LED bulbs. They use 75% less energy and last 25x longer than traditional bulbs. Your electricity bill will thank you. 💡',
  ]);

  const addTweet = () => {
    setTweets([...tweets, '']);
  };

  const updateTweet = (index: number, value: string) => {
    const newTweets = [...tweets];
    newTweets[index] = value;
    setTweets(newTweets);
  };

  const deleteTweet = (index: number) => {
    setTweets(tweets.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onEdit({ tweets: tweets.filter(t => t.trim()) });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🐦 Twitter Thread Editor" size="large">
      <ModalContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-[#1F2937]">Thread Composer</h4>
                <p className="text-sm text-[#6B7280]">{tweets.length} tweets in thread</p>
              </div>
              <Button variant="secondary" size="small" onClick={addTweet}>
                <Plus className="w-4 h-4" />
                Add Tweet
              </Button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {tweets.map((tweet, index) => (
                <Card key={index} className="relative">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0C85D0] flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-[#1F2937]">Your Brand</span>
                          <span className="text-sm text-[#6B7280]">@yourbrand</span>
                        </div>
                      </div>
                      {tweets.length > 1 && (
                        <button
                          onClick={() => deleteTweet(index)}
                          className="p-1 rounded hover:bg-[#FEE2E2] text-[#EF4444] transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <textarea
                      value={tweet}
                      onChange={(e) => updateTweet(index, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] focus:border-[#1DA1F2] focus:ring-2 focus:ring-[#1DA1F2]/20 outline-none transition-all resize-none text-sm"
                      rows={4}
                      maxLength={280}
                      placeholder="What's happening?"
                    />

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button className="p-1 rounded hover:bg-[#F9FAFB] transition-colors">
                          <ImageIcon className="w-4 h-4 text-[#1DA1F2]" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#F9FAFB] transition-colors">
                          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                        </button>
                      </div>
                      <span className={`text-sm ${tweet.length > 260 ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>
                        {tweet.length}/280
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* AI Suggestions */}
            <Card className="bg-gradient-to-br from-[#F3E8FF] to-[#EDE9FE] border-[#8B5CF6]">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                  <h5 className="text-[#1F2937]">AI Suggestions</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="small">Improve Engagement</Button>
                  <Button variant="ghost" size="small">Add Hashtags</Button>
                  <Button variant="ghost" size="small">Rewrite</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <div className="mb-4">
              <h4 className="text-[#1F2937] mb-2">Preview</h4>
              <p className="text-sm text-[#6B7280]">How your thread will appear on Twitter</p>
            </div>

            <div className="bg-[#F9FAFB] rounded-xl p-6 max-h-[600px] overflow-y-auto">
              <div className="space-y-4">
                {tweets.map((tweet, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0C85D0]" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-[#1F2937]">Your Brand</span>
                          <span className="text-sm text-[#6B7280]">@yourbrand · now</span>
                        </div>
                        <p className="text-[#1F2937] whitespace-pre-wrap mb-3">
                          {tweet || <span className="text-[#9CA3AF] italic">Empty tweet</span>}
                        </p>
                        <div className="flex items-center gap-6 text-[#6B7280]">
                          <span className="text-sm hover:text-[#1DA1F2] cursor-pointer">💬 Reply</span>
                          <span className="text-sm hover:text-[#10B981] cursor-pointer">🔁 Retweet</span>
                          <span className="text-sm hover:text-[#EF4444] cursor-pointer">❤️ Like</span>
                          <span className="text-sm hover:text-[#1DA1F2] cursor-pointer">📤 Share</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <Button variant="primary" className="w-full" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save Thread
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