# Vercel AI Gateway - Quick Reference

## 🔑 Setup (5 minutes)

```bash
# 1. Get keys
# - AI Gateway: https://vercel.com/ai-gateway
# - OpenAI: https://platform.openai.com/api-keys

# 2. Add to .env
OPENAI_API_KEY=sk_your_key
AI_GATEWAY_TOKEN=your_token
AI_MODEL_CHAT=gpt-4o-mini

# 3. Test API
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello AI"}'
```

---

## 💻 Usage in Components

### Streaming Chat
```typescript
'use client';
import { useAI } from '@/lib/hooks/useAI';

export function Chat() {
  const { messages, streamChat, isLoading } = useAI();
  
  return (
    <div>
      {messages.map(m => <p key={m.content}>{m.role}: {m.content}</p>)}
      <button onClick={() => streamChat('Hello!')}>Send</button>
    </div>
  );
}
```

### Text Generation
```typescript
'use client';
import { useAI } from '@/lib/hooks/useAI';

export function Generate() {
  const { generate, isLoading } = useAI();
  
  const handleGenerate = async () => {
    const { text } = await generate('Create a tweet');
    console.log(text);
  };
  
  return <button onClick={handleGenerate}>Generate</button>;
}
```

---

## 🔌 API Endpoints

### Chat (Streaming)
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is AI?",
    "model": "gpt-4o-mini"
  }'
```

### Generate (Non-Streaming)
```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a tweet",
    "maxTokens": 280
  }'
```

---

## 🎛️ Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `OPENAI_API_KEY` | - | Your OpenAI API key |
| `AI_GATEWAY_TOKEN` | - | Vercel AI Gateway token |
| `AI_MODEL_CHAT` | gpt-4o-mini | Default chat model |
| `AI_MAX_TOKENS` | 4096 | Max response length |
| `AI_TEMPERATURE` | 0.7 | Creativity (0=precise, 2=random) |
| `AI_ENABLED` | true | Enable/disable AI features |

---

## 📊 Models

| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| gpt-4o-mini | ⚡⚡⚡ | $ | Default, fast tasks |
| gpt-4o | ⚡⚡ | $$ | Complex reasoning |
| gpt-3.5-turbo | ⚡⚡⚡ | $ | Simple tasks |
| claude-3-sonnet | ⚡⚡ | $$ | Nuanced writing |

---

## 🚨 Error Handling

```typescript
try {
  await streamChat('message');
} catch (error) {
  if (error.message.includes('not configured')) {
    // Setup AI Gateway
  } else if (error.message.includes('rate limit')) {
    // Wait before retrying
  } else {
    console.error(error);
  }
}
```

---

## 💰 Cost Optimization

```typescript
// ✅ Good: specific tokens
await streamChat(message, undefined, { maxTokens: 500 });

// ❌ Bad: unlimited
await streamChat(message); // Uses 4096 tokens

// ✅ Good: cheap model for simple tasks
await streamChat(message, 'gpt-4o-mini');

// ❌ Bad: expensive model for simple tasks
await streamChat(message, 'gpt-4');
```

---

## 📚 Resources

- **Docs**: https://vercel.com/docs/ai-gateway
- **Models**: https://vercel.com/ai-gateway/models
- **Pricing**: https://vercel.com/docs/ai-gateway/usage
- **AI SDK**: https://sdk.vercel.ai/

---

## ✅ Checklist

- [ ] API keys added to `.env`
- [ ] GitHub Secrets configured
- [ ] Test endpoints working
- [ ] useAI hook imported correctly
- [ ] Streaming responses working
- [ ] Error handling in place
- [ ] Rate limiting configured
- [ ] Monitoring setup

---

**Last updated: December 13, 2025**
