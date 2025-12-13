/**
 * Example AI Chat Component
 * Demonstrates how to use Vercel AI Gateway with useAI hook
 */

'use client';

import { useAI } from '@/lib/hooks/useAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

export function AIChat() {
  const { messages, isLoading, streamChat, clearMessages } = useAI();
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');

    try {
      await streamChat(message);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
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
        {isLoading && (
          <Card className="p-4 bg-gray-100 mr-12">
            <p className="text-sm text-gray-500">Thinking...</p>
          </Card>
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
