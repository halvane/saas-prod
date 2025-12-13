# 🎯 AI Processing Loader - Quick Reference Card

## COMPONENT LOCATION
```
components/custom/AI/AIProcessingLoader.tsx
```

## BASIC IMPORT
```tsx
import { AIProcessingLoader } from '@/components/custom/AI/AIProcessingLoader';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
```

## STATE SETUP (3 lines)
```tsx
const [isProcessing, setIsProcessing] = useState(false);
const [progress, setProgress] = useState(0);
const [step, setStep] = useState(0);
```

## STEPS ARRAY
```tsx
const steps = [
  'Step 1 description...',
  'Step 2 description...',
  'Step 3 description...',
  'Step 4 description...'
];
```

## HANDLER TEMPLATE
```tsx
const handleProcess = async () => {
  setIsProcessing(true);
  setProgress(5);
  setStep(0);

  const interval = setInterval(() => {
    setProgress(prev => {
      if (prev >= 95) { clearInterval(interval); return prev; }
      const newProg = Math.min(prev + Math.random() * 20 + 5, 95);
      setStep(Math.min(Math.floor((newProg / 100) * steps.length), steps.length - 1));
      return newProg;
    });
  }, 300);

  try {
    const res = await fetch('/api/endpoint', { method: 'POST', body: JSON.stringify(data) });
    const result = await res.json();
    setProgress(100);
    setStep(steps.length - 1);
    clearInterval(interval);
    setTimeout(() => setIsProcessing(false), 500);
  } catch (err) {
    clearInterval(interval);
    setIsProcessing(false);
  }
};
```

## JSX COMPONENT
```tsx
<AIProcessingLoader
  isOpen={isProcessing}
  title="⚡ Your Custom Title..."
  subtitle="Your description"
  steps={steps}
  currentStep={step}
  progress={progress}
  icon={<Sparkles className="w-12 h-12 text-[#8B5CF6] animate-spin" />}
/>
```

## PRESET TITLES

### Brand Analysis
```
Title: "⚡ AI is Analyzing Your Brand..."
Subtitle: Show the URL being analyzed
```

### Chat
```
Title: "⚡ AI is Thinking..."
Subtitle: "Analyzing your message and generating response"
```

### Content Generation
```
Title: "⚡ Generating Your Content..."
Subtitle: Show partial input description
```

## COLORS (MUST USE)
```
Active:     #8B5CF6 (Purple)
Gradient:   #7C3AED (Dark Purple)
Complete:   #10B981 (Green)
Pending:    #E5E7EB (Light Gray)
Text Dark:  #1F2937
Text Light: #6B7280
```

## CRITICAL REQUIREMENTS
✅ Always `clearInterval()` in finally block
✅ Progress capped at 95% in interval
✅ Step calculation: `Math.floor((progress / 100) * steps.length)`
✅ Random increment: `Math.random() * 20 + 5`
✅ Interval duration: 300ms
✅ Cleanup delay: 500ms

## DO NOT
❌ Use Loader2 directly
❌ Create custom loaders
❌ Skip interval cleanup
❌ Have progress > 100%
❌ Use different colors
❌ Forget error handling

## FILES USING LOADER
✅ `components/custom/Pages/SettingsPage.tsx` (Brand Analysis)
✅ `components/custom/AI/AIChat.tsx` (Chat)
✅ `components/custom/Radar/BrainDump.tsx` (Generation)
✅ `components/custom/Mixer/MixerPage.tsx` (Reference)

## PROPS INTERFACE
```typescript
interface AIProcessingLoaderProps {
  isOpen: boolean;
  title?: string;        // default: "⚡ AI is Working..."
  subtitle?: string;     // default: "Processing your content"
  steps?: string[];
  currentStep?: number;
  progress?: number;     // 0-100
  icon?: React.ReactNode;
}
```

## DOCUMENTATION
📖 Quick Ref: `docs/AI_LOADER_QUICK_REFERENCE.md`
📖 Complete: `docs/AI_PROCESSING_LOADER_INSTRUCTIONS.md`
📖 Technical: `docs/AI_LOADER_IMPLEMENTATION_SUMMARY.md`
📖 System: `docs/AI_LOADER_SYSTEM_INDEX.md`
📖 Copilot: `docs/COPILOT_INSTRUCTION_AI_LOADER.md`

## ONE-MINUTE TEST
1. Import component & useState
2. Click button to trigger handler
3. Verify loader appears
4. Watch progress bar fill 0→100%
5. Watch steps progress
6. Verify loader closes on complete
7. ✅ Done!

---

**THIS IS THE STANDARD FOR ALL AI PROCESSING**
Use consistently. Always follow the template. Never skip cleanup.

For full details, read the documentation files above.
