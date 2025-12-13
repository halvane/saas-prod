# Vercel AI Gateway Integration Guide

Complete integration of Vercel's AI Gateway for Purlema SaaS Platform.

## 🎯 Quick Start

### 1. Get API Keys

**Vercel AI Gateway Token:**
1. Go to [vercel.com/ai-gateway](https://vercel.com/ai-gateway)
2. Sign in with GitHub
3. Create new gateway
4. Copy token

**OpenAI API Key:**
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy key

### 2. Configure Environment Variables

Add to `.env` locally:
```
# Vercel AI Gateway Key (starts with vck_) OR OpenAI Key (starts with sk-)
AI_GATEWAY_API_KEY=vck_your_key_here
# OR
OPENAI_API_KEY=sk_your_key_here

# Optional: Custom Gateway URL (defaults to https://gateway.ai.vercel.com/openai/v1 for vck_ keys)
# AI_GATEWAY_URL=https://gateway.ai.vercel.com/openai/v1

AI_MODEL_CHAT=openai/gpt-4o-mini
AI_MODEL_EMBEDDING=text-embedding-3-small
AI_ENABLED=true
AI_MAX_TOKENS=4096
AI_TEMPERATURE=0.7
```

### 3. Add to GitHub Secrets

For **saas-dev** repo:
- Settings → Secrets and variables → Actions
- Add `OPENAI_API_KEY` (dev key)
- Add `AI_GATEWAY_TOKEN` (dev token)

For **saas-prod** repo:
- Same as above but with production keys

---

## 📚 Architecture

### Core Files

**`lib/ai/gateway.ts`**
- Initializes Vercel AI Gateway
- Manages model selection
- Handles configuration

**`app/api/ai/chat/route.ts`**
- POST endpoint for streaming responses
- Real-time text generation
- Use for long-form content

**`app/api/ai/generate/route.ts`**
- POST endpoint for non-streaming responses
- Quick responses
- Use for tweets, summaries, etc.

**`lib/hooks/useAI.ts`**
- React hook for frontend integration
- Message management
- Loading/error states

### Component Example

**`components/custom/AI/AIChat.tsx`**
- Full chat interface example
- Demonstrates useAI hook usage
- Ready to extend for your needs

---

## 🔌 API Endpoints

### Stream Chat
**POST** `/api/ai/chat`

Request:
```json
{
  "message": "What are the top social media trends?",
  "model": "gpt-4o-mini"
}
```

Response: Streaming text chunks
```
What are the...
top social media...
trends right now...
```

### Generate Text
**POST** `/api/ai/generate`

Request:
```json
{
  "prompt": "Create a catchy tweet about AI",
  "model": "gpt-4o-mini",
  "maxTokens": 280,
  "temperature": 0.8
}
```

Response:
```json
{
  "text": "🤖 AI is reshaping how we create. What's your next big idea?",
  "usage": {
    "promptTokens": 15,
    "completionTokens": 18,
    "totalTokens": 33
  },
  "finishReason": "stop"
}
```

---

## 💻 Usage Examples

### In React Components

```typescript
'use client';
import { useAI } from '@/lib/hooks/useAI';

export function MyComponent() {
  const { messages, isLoading, streamChat, error } = useAI();

  const handleGenerate = async () => {
    try {
      await streamChat('Write a blog post about AI');
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  return (
    <div>
      {error && <p>Error: {error.message}</p>}
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
      {messages.map((msg, i) => (
        <p key={i}>{msg.role}: {msg.content}</p>
      ))}
    </div>
  );
}
```

### In Server Actions

```typescript
'use server';
import { gateway } from '@/lib/ai/gateway';
import { generateText } from 'ai';

export async function generatePostCaption(topic: string) {
  if (!gateway.isConfigured()) {
    throw new Error('AI Gateway not configured');
  }

  const result = await generateText({
    model: gateway.getModel('gpt-4o-mini'),
    prompt: `Create a LinkedIn post about ${topic}`,
    maxTokens: 300,
  });

  return result.text;
}
```

### In API Routes

```typescript
import { streamText } from 'ai';
import { gateway } from '@/lib/ai/gateway';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: gateway.getModel(),
    system: 'You are a helpful content creator',
    messages: [{ role: 'user', content: prompt }],
  });

  return result.toTextStreamResponse();
}
```

---

## 🎛️ Configuration Options

### Model Selection

**Available Models:**
- `gpt-4o` - Latest, best reasoning
- `gpt-4o-mini` - Fast, cheaper, default
- `gpt-3.5-turbo` - Legacy, cheapest
- `claude-3-opus` - Advanced reasoning
- `claude-3-sonnet` - Balanced

Set default in `.env`:
```
AI_MODEL_CHAT=gpt-4o-mini
AI_MODEL_EMBEDDING=text-embedding-3-small
```

Override at runtime:
```typescript
await streamChat(message, 'gpt-4');
```

### Token Limits

```
AI_MAX_TOKENS=4096  // Maximum completion length
AI_TEMPERATURE=0.7  // Creativity (0=deterministic, 2=random)
```

Lower temperature = more consistent
Higher temperature = more creative

---

## 💰 Cost Management

### No Markup
- 0% markup on tokens vs direct provider API
- Same price as using OpenAI directly

### Spend Monitoring
1. Go to [vercel.com/ai-gateway](https://vercel.com/ai-gateway)
2. View usage dashboard
3. Set budget alerts
4. Monitor cost per model

### Cost Optimization
1. Use `gpt-4o-mini` for most tasks
2. Use `gpt-4` only for complex reasoning
3. Batch requests when possible
4. Cache results appropriately
5. Set reasonable `maxTokens`

---

## 🔒 Security

### ✅ Do
- Store API keys in `.env` (local) and GitHub Secrets (CI/CD)
- Validate user input before sending to AI
- Rate limit API endpoints
- Use HTTPS only
- Rotate keys periodically

### ❌ Don't
- Expose API keys in client code
- Store keys in git history
- Log full API responses
- Send sensitive user data to AI
- Trust AI outputs without validation

---

## 🚨 Error Handling

```typescript
try {
  await streamChat(message);
} catch (error) {
  if (error.message.includes('not configured')) {
    // AI Gateway not set up
  } else if (error.message.includes('rate limit')) {
    // Too many requests
  } else {
    // Generic error
  }
}
```

Check `gateway.isConfigured()` before making requests:
```typescript
if (!gateway.isConfigured()) {
  return Response.json(
    { error: 'AI Gateway not configured' },
    { status: 503 }
  );
}
```

---

## 📊 Monitoring

### Vercel Dashboard
- Usage by model
- Cost tracking
- Request metrics
- Error rates

### Application Logs
- Check `/api/ai/chat` and `/api/ai/generate` logs
- Monitor streaming response times
- Track token usage

### Best Practices
1. Log all API calls with metadata
2. Track generation latency
3. Monitor error rates
4. Alert on budget thresholds
5. Review usage weekly

---

## 🔄 Deployment

### Development (saas-dev)
- Use development API keys
- No rate limits (for testing)
- Unlimited token usage
- Cost: ~$0/month

### Production (saas-prod)
- Use production API keys
- Enable rate limiting
- Set token budgets
- Cost: $0 (no markup) + provider costs

### Vercel Deployment
1. Add `OPENAI_API_KEY` to Vercel Secrets
2. Add `AI_GATEWAY_TOKEN` to Vercel Secrets
3. Deploy normally with `git push prod production:main`
4. Monitor usage on [vercel.com/ai-gateway](https://vercel.com/ai-gateway)

---

## 📖 Resources

- [Vercel AI Gateway Docs](https://vercel.com/docs/ai-gateway)
- [AI SDK Docs](https://sdk.vercel.ai/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Pricing & Models](https://vercel.com/ai-gateway/models)

---

## ❓ FAQ

**Q: How much does it cost?**
A: Only provider costs (OpenAI, etc.). Vercel adds 0% markup.

**Q: Can I use other AI providers?**
A: Yes! Switch providers via AI Gateway with minimal code changes.

**Q: How do I cache responses?**
A: Store generated content in database or Redis. AI Gateway also provides caching.

**Q: What if API is down?**
A: AI Gateway automatically retries with fallback providers.

**Q: How do I limit costs?**
A: Set `AI_MAX_TOKENS`, use cheaper models, set spending alerts.

**Q: Can I use this in production?**
A: Yes! Full production support. Use separate keys for dev/prod.

**Q: Do I need to modify existing code?**
A: No! AI features are entirely new. Existing code is unaffected.

---

**Last updated: December 13, 2025**
