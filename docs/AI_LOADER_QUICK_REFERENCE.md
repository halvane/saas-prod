# AI Loader Quick Reference

## TL;DR - Copy & Paste Template

### 1. Import
```tsx
import { AIProcessingLoader } from '@/components/custom/AI/AIProcessingLoader';
import { Sparkles } from 'lucide-react';
```

### 2. Define Steps & State
```tsx
const processingSteps = ['Step 1...', 'Step 2...', 'Step 3...'];
const [isProcessing, setIsProcessing] = useState(false);
const [progress, setProgress] = useState(0);
const [step, setStep] = useState(0);
```

### 3. Add Handler with Progress
```tsx
const handleProcess = async () => {
  setIsProcessing(true);
  setProgress(5);
  setStep(0);

  const interval = setInterval(() => {
    setProgress(prev => {
      if (prev >= 95) { clearInterval(interval); return prev; }
      const newProg = Math.min(prev + Math.random() * 20 + 5, 95);
      setStep(Math.min(Math.floor((newProg / 100) * processingSteps.length), processingSteps.length - 1));
      return newProg;
    });
  }, 300);

  try {
    const res = await fetch('/api/endpoint', { method: 'POST', body: JSON.stringify(data) });
    const result = await res.json();
    setProgress(100);
    setStep(processingSteps.length - 1);
    clearInterval(interval);
    setTimeout(() => setIsProcessing(false), 500);
  } catch (err) {
    clearInterval(interval);
    setIsProcessing(false);
  }
};
```

### 4. Add Loader to JSX
```tsx
<AIProcessingLoader
  isOpen={isProcessing}
  title="⚡ Processing..."
  subtitle="Working on your request"
  steps={processingSteps}
  currentStep={step}
  progress={progress}
/>
```

---

## Predefined Loader Presets

Use these exact configurations for consistency:

### Brand Analysis
```tsx
<AIProcessingLoader
  isOpen={isAnalyzing}
  title="⚡ AI is Analyzing Your Brand..."
  subtitle={`Analyzing "${url}"`}
  steps={['Analyzing website content...', 'Extracting brand information...', 'Analyzing visual elements...', 'Generating strategic insights...', 'Finalizing brand analysis...']}
  currentStep={step}
  progress={progress}
/>
```

### Chat Processing
```tsx
<AIProcessingLoader
  isOpen={isLoading}
  title="⚡ AI is Thinking..."
  subtitle="Analyzing your message and generating response"
  steps={['Processing your message...', 'Analyzing context...', 'Generating response...', 'Finalizing output...']}
  currentStep={step}
  progress={progress}
/>
```

### Content Generation
```tsx
<AIProcessingLoader
  isOpen={isGenerating}
  title="⚡ Generating Your Content..."
  subtitle={`Working on: "${idea.substring(0, 40)}..."`}
  steps={['Analyzing your idea...', 'Generating content variations...', 'Optimizing for engagement...', 'Finalizing content...']}
  currentStep={step}
  progress={progress}
/>
```

---

## Files Already Using Loader

- ✅ `components/custom/Pages/SettingsPage.tsx` (Brand Analysis)
- ✅ `components/custom/AI/AIChat.tsx` (Chat)
- ✅ `components/custom/Radar/BrainDump.tsx` (Content Generation)
- ✅ `components/custom/Mixer/MixerPage.tsx` (Mixer Pattern - Reference)

---

## Color Codes

- **Purple (Primary):** `#8B5CF6`
- **Purple (Gradient Dark):** `#7C3AED`
- **Green (Complete):** `#10B981`
- **Light Background:** `#F9FAFB`
- **Text Primary:** `#1F2937`
- **Text Secondary:** `#6B7280`

---

## CSS Classes

- `animate-pulse-glow` - Pulsing circle
- `animate-spin` - Spinning icon
- `gradient-text` - Gradient text effect
- `animate-fadeIn` - Fade animation

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Loader not showing | Check `isProcessing` is `true` |
| Progress stuck | Verify `setProgress()` is called |
| Loader won't close | Always call `setIsProcessing(false)` in finally block |
| Steps not updating | Ensure step calculation: `Math.floor((progress / 100) * steps.length)` |
| Memory leak | Make sure to `clearInterval()` in try/catch/finally |

---

## Props Reference

```typescript
// Required
isOpen: boolean

// Optional (with defaults)
title?: string                      // default: "⚡ AI is Working..."
subtitle?: string                   // default: "Processing your content"
steps?: string[]                    // default: []
currentStep?: number                // default: 0
progress?: number                   // default: 0 (0-100)
icon?: React.ReactNode              // default: Sparkles spinning
```

---

## Example: Full Implementation

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AIProcessingLoader } from '@/components/custom/AI/AIProcessingLoader';
import { Sparkles } from 'lucide-react';

const STEPS = ['Step 1...', 'Step 2...', 'Step 3...', 'Step 4...'];

export function MyAIFeature() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  const handleSubmit = async () => {
    setIsProcessing(true);
    setProgress(5);
    setStep(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        const newProg = Math.min(prev + Math.random() * 20 + 5, 95);
        setStep(Math.min(Math.floor((newProg / 100) * STEPS.length), STEPS.length - 1));
        return newProg;
      });
    }, 300);

    try {
      const res = await fetch('/api/my-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      
      const data = await res.json();
      setProgress(100);
      setStep(STEPS.length - 1);
      clearInterval(interval);

      setTimeout(() => {
        setIsProcessing(false);
        // Use data...
      }, 500);
    } catch (error) {
      clearInterval(interval);
      setIsProcessing(false);
      console.error(error);
    }
  };

  return (
    <>
      <AIProcessingLoader
        isOpen={isProcessing}
        title="⚡ Processing..."
        subtitle="Working on your request"
        steps={STEPS}
        currentStep={step}
        progress={progress}
        icon={<Sparkles className="w-12 h-12 text-[#8B5CF6] animate-spin" />}
      />

      <div className="space-y-4">
        <Input
          placeholder="Enter your input..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
        />
        <Button onClick={handleSubmit} disabled={isProcessing || !input}>
          {isProcessing ? 'Processing...' : 'Submit'}
        </Button>
      </div>
    </>
  );
}
```

---

## Real Examples from Codebase

See these files for complete, working implementations:
- `components/custom/Pages/SettingsPage.tsx` (lines 400-465)
- `components/custom/AI/AIChat.tsx` (complete file)
- `components/custom/Radar/BrainDump.tsx` (complete file)

---

## Documentation

📖 Full guide: `docs/AI_PROCESSING_LOADER_INSTRUCTIONS.md`
📖 Implementation summary: `docs/AI_LOADER_IMPLEMENTATION_SUMMARY.md`
