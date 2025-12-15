/**
 * Vercel AI Gateway Configuration
 * 
 * This module provides a unified interface to Vercel's AI Gateway,
 * allowing seamless access to multiple AI models with caching,
 * rate limiting, and observability features.
 * 
 * Features:
 * - Unified API across providers
 * - Request caching
 * - Rate limiting & spending control
 * - Automatic retries with fallbacks
 * - OpenAI compatibility
 * - Full observability with headers
 */

import { createGateway } from '@ai-sdk/gateway';
import { LanguageModel, EmbeddingModel } from 'ai';

export interface AIGatewayConfig {
  apiKey: string;
  baseURL?: string;
  defaultModel?: string;
  maxTokens?: number;
  temperature?: number;
}

class AIGateway {
  private apiKey: string;
  private baseURL?: string;
  private defaultModel: string;
  private maxTokens: number;
  private temperature: number;
  private provider: ReturnType<typeof createGateway>;

  constructor(config: AIGatewayConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || process.env.AI_GATEWAY_URL;
    this.defaultModel = config.defaultModel || process.env.AI_MODEL_CHAT || 'openai/gpt-4o-mini';
    this.maxTokens = config.maxTokens || parseInt(process.env.AI_MAX_TOKENS || '4096');
    this.temperature = config.temperature ?? parseFloat(process.env.AI_TEMPERATURE || '0.7');

    // Initialize the Vercel Gateway provider
    this.provider = createGateway({
      baseURL: this.baseURL,
      apiKey: this.apiKey,
    });
  }

  /**
   * Get a configured language model
   * Uses OpenAI SDK with Vercel AI Gateway endpoint
   */
  getModel(model: string = this.defaultModel): LanguageModel {
    return this.provider(model);
  }

  /**
   * Get a configured embedding model
   */
  getEmbeddingModel(model: string = 'text-embedding-3-small'): EmbeddingModel<string> {
    return this.provider.textEmbeddingModel(model);
  }

  /**
   * Get the configured provider instance
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Get configuration object for use with generateText, streamText, etc.
   */
  getConfig() {
    return {
      model: this.getModel(),
      maxTokens: this.maxTokens,
      temperature: this.temperature,
    };
  }

  /**
   * Validate gateway is properly configured
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey && process.env.AI_ENABLED !== 'false');
  }
}

// Initialize gateway with environment variables
const gateway = new AIGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY || '',
  baseURL: process.env.AI_GATEWAY_URL,
  defaultModel: process.env.AI_MODEL_CHAT,
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4096'),
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
});

export { gateway, AIGateway };
