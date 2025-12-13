/**
 * useAI Hook - React hook for Vercel AI Gateway integration
 * 
 * Provides easy integration with streaming and non-streaming AI responses
 * Handles loading states, errors, and message history
 */

'use client';

import { useState, useCallback } from 'react';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UseAIOptions {
  onStream?: (chunk: string) => void;
  onError?: (error: Error) => void;
  initialMessages?: AIMessage[];
}

export function useAI(options: UseAIOptions = {}) {
  const [messages, setMessages] = useState<AIMessage[]>(options.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Stream text from AI Gateway
   * Real-time chunks sent back via Server-Sent Events
   */
  const streamChat = useCallback(
    async (message: string, model?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, model }),
        });

        if (!response.ok) throw new Error('Failed to stream chat');

        let fullResponse = '';

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            fullResponse += chunk;
            options.onStream?.(chunk);
          }
        }

        // Update messages after stream completes
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: message },
          { role: 'assistant', content: fullResponse },
        ]);

        return fullResponse;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  /**
   * Generate non-streaming response
   * Use for quick responses where streaming isn't needed
   */
  const generate = useCallback(
    async (prompt: string, model?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model }),
        });

        if (!response.ok) throw new Error('Failed to generate text');

        const data = await response.json();

        return {
          text: data.text,
          usage: data.usage,
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  /**
   * Clear message history
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    streamChat,
    generate,
    clearMessages,
  };
}
