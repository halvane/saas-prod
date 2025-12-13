/**
 * Example AI Chat Component
 * Demonstrates how to use Vercel AI Gateway with useAI hook
 * Uses standardized AIProcessingLoader for consistent loading state
 */

'use client';

import { useAI } from '@/lib/hooks/useAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AIProcessingLoader } from '@/components/custom/AI/AIProcessingLoader';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

const chatSteps = [
  'Processing your message...',
  'Analyzing context...',
  'Generating response...',
  'Finalizing output...'
];

export function AIChat() {
  const { messages, isLoading, streamChat, clearMessages } = useAI();
  const [input, setInput] = useState('');
  const [chatProgress, setChatProgress] = useState(0);
  const [chatStep, setChatStep] = useState(0);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');

    // Setup progress simulation
    setChatProgress(5);
    setChatStep(0);
    const progressInterval = setInterval(() => {
      setChatProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        const increment = Math.random() * 15 + 5;
        const newProgress = Math.min(prev + increment, 95);
        const stepIndex = Math.floor((newProgress / 100) * chatSteps.length);
        setChatStep(Math.min(stepIndex, chatSteps.length - 1));
        return newProgress;
      });
    }, 300);

    try {
      await streamChat(message);
      setChatProgress(100);
      setChatStep(chatSteps.length - 1);
      clearInterval(progressInterval);
      setTimeout(() => {
        setChatProgress(0);
        setChatStep(0);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setChatProgress(0);
      setChatStep(0);
      console.error('Chat error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* AI Processing Loader */}
      <AIProcessingLoader
        isOpen={isLoading}
        title="⚡ AI is Thinking..."
        subtitle="Analyzing your message and generating response"
        steps={chatSteps}
        currentStep={chatStep}
        progress={chatProgress}
        icon={<Sparkles className="w-12 h-12 text-[#8B5CF6] animate-spin" />}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Start a conversation with AI
          </div>
        ) : (
          messages.map((msg, i) => (
            <Card
              key={i}
              className={`p-4 ${
                msg.role === 'user'
                  ? 'bg-blue-100 ml-12'
                  : 'bg-gray-100 mr-12'
              }`}
            >
              <p className="text-sm font-semibold mb-2">
                {msg.role === 'user' ? 'You' : 'AI'}
              </p>
              <p className="text-gray-800">{msg.content}</p>
            </Card>
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 space-y-2">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
        {messages.length > 0 && (
          <Button
            variant="outline"
            onClick={clearMessages}
            disabled={isLoading}
            className="w-full"
          >
            Clear History
          </Button>
        )}
      </div>
    </div>
  );
}
