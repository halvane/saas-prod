# AI Processing Loader Instructions

## Overview
All AI processing activities across the application must use a **consistent, unified loader component** to maintain visual consistency and provide users with clear feedback about ongoing operations.

## Reference Implementation: Mixer Process

The **Mixer component** (`components/custom/Mixer/MixerPage.tsx`) contains the standard AI processing loader that should be reused everywhere AI is processing.

### Key Components:

#### 1. **WorkflowProgress Component**
**Location:** `components/ui/WorkflowProgress.tsx`

A sticky header that shows overall workflow progress across multiple steps (Detect Trends → Generate Content → Edit & Review → Schedule).

```tsx
import { WorkflowProgress } from '@/components/ui/WorkflowProgress';

// Usage in any page
<WorkflowProgress currentStep="mixer" />
```

**Available Steps:**
- `'radar'` - Detect Trends
- `'mixer'` - Generate Content
- `'editor'` - Edit & Review
- `'timeline'` - Schedule

#### 2. **AI Processing Loader UI**
**Location:** `components/custom/Mixer/MixerPage.tsx` (lines 96-195)

The standardized loading animation with:
- **Animated Circle**: Pulsing purple gradient circle with center Sparkles icon
- **Orbiting Icons**: Platform-specific icons rotating around the center (transitions to green checkmarks as items complete)
- **Step Progress**: Multi-step progress tracking with status indicators
- **Progress Bar**: Visual percentage bar with remaining time estimate

### Core UI Pattern

```tsx
// 1. Animated center circle
<div className="relative mb-12">
  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center animate-pulse-glow">
    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
      <Sparkles className="w-12 h-12 text-[#8B5CF6] animate-spin" />
    </div>
  </div>
</div>

// 2. Title and description
<h2 className="gradient-text mb-4 text-center">⚡ AI is Working...</h2>
<p className="text-[#6B7280] text-center mb-8">Processing your content</p>

// 3. Step tracking (from steps array)
{steps.map((step, idx) => {
  const isComplete = idx < currentStep;
  const isCurrent = idx === currentStep;
  
  return (
    <div className={`flex items-center gap-3 transition-all ...`}>
      {isComplete ? (
        <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" />
      ) : isCurrent ? (
        <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] flex-shrink-0" />
      )}
      <span>{step.label}</span>
    </div>
  );
})}

// 4. Progress bar
<div className="w-full max-w-md mb-4">
  <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] transition-all duration-300 rounded-full"
      style={{ width: `${progress}%` }}
    />
  </div>
</div>
<p className="text-sm text-[#9CA3AF]">
  {progress}% complete • Expected: {Math.max(0, Math.ceil((100 - progress) * 0.15))}s remaining
</p>
```

## Color Scheme (Must Use Consistently)

| Element | Color | Hex |
|---------|-------|-----|
| Primary/Active | Purple | #8B5CF6 |
| Accent/Completed | Green | #10B981 |
| Background | Light Gray | #F9FAFB |
| Border | Gray | #E5E7EB |
| Text Primary | Dark Gray | #1F2937 |
| Text Secondary | Medium Gray | #6B7280 |

## Implementation Guide for AI Processing Endpoints

### Pattern 1: Simple Modal/Dialog Loader

**Use Case:** When AI processing occurs in a modal or dialog overlay (e.g., Brand Analysis, Chat)

**Files to Modify:**
- `components/custom/Pages/SettingsPage.tsx` (Brand Intelligence Analysis)
- `components/custom/AI/AIChat.tsx` (Chat Processing)
- `components/custom/Radar/BrainDump.tsx` (Content Generation)

**Implementation Steps:**

1. **Create a separate loader component or modal state**
   ```tsx
   const [isProcessing, setIsProcessing] = useState(false);
   const [processingStep, setProcessingStep] = useState(0);
   const [processingProgress, setProcessingProgress] = useState(0);
   
   // Define steps array for this specific operation
   const processingSteps = [
     { label: 'Analyzing source content...' },
     { label: 'Extracting key insights...' },
     { label: 'Generating variants...' },
     { label: 'Finalizing output...' }
   ];
   ```

2. **Trigger the loader when API call starts**
   ```tsx
   const handleAnalyze = async () => {
     setIsProcessing(true);
     setProcessingProgress(0);
     setProcessingStep(0);
     
     try {
       const response = await fetch('/api/brand/scrape', {
         method: 'POST',
         body: JSON.stringify(payload)
       });
       
       // ... handle response
     } finally {
       setIsProcessing(false);
     }
   };
   ```

3. **Render the loader overlay**
   ```tsx
   {isProcessing && (
     <Modal isOpen={true} onClose={() => {}}>
       <ModalContent>
         <div className="min-h-[400px] flex flex-col items-center justify-center">
           {/* Copy the loading UI pattern from Mixer */}
           <div className="relative mb-8">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] ...">
               <Sparkles className="w-8 h-8 text-[#8B5CF6] animate-spin" />
             </div>
           </div>
           
           <h2 className="gradient-text mb-2">Processing...</h2>
           <p className="text-[#6B7280] text-center mb-6">
             {processingSteps[processingStep]?.label}
           </p>
           
           {/* Progress bar */}
           <div className="w-full max-w-xs h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
             <div
               className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]"
               style={{ width: `${processingProgress}%`, transition: 'width 0.3s' }}
             />
           </div>
         </div>
       </ModalContent>
     </Modal>
   )}
   ```

### Pattern 2: Button Loading State

**Use Case:** For quick AI operations in buttons (inline processing)

**Implementation:**
```tsx
<Button
  onClick={handleGenerate}
  disabled={isProcessing}
  className="gap-2"
>
  {isProcessing ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      Processing...
    </>
  ) : (
    <>
      <Sparkles className="w-4 h-4" />
      Generate AI Content
    </>
  )}
</Button>
```

### Pattern 3: Inline Loader Card

**Use Case:** For non-blocking AI operations (background processing, preview generation)

**Implementation:**
```tsx
{isProcessing && (
  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 p-6">
    <div className="flex items-center gap-4">
      <Loader2 className="w-6 h-6 text-[#8B5CF6] animate-spin flex-shrink-0" />
      <div>
        <h4 className="font-medium text-[#1F2937]">⚡ AI is Working...</h4>
        <p className="text-sm text-[#6B7280]">
          {processingSteps[processingStep]?.label}
        </p>
      </div>
    </div>
  </Card>
)}
```

## API Routes Using AI Processing

### Current AI Processing Endpoints

| Route | Purpose | Component | Status |
|-------|---------|-----------|--------|
| `/api/ai/generate` | Text generation | Mixer, Editor | ✅ Active |
| `/api/ai/chat` | Chat completion | AIChat | ✅ Active |
| `/api/ai/stream` | Streaming completion | AIChat | ✅ Active |
| `/api/ai/variations` | Content variations | Mixer | ✅ Active |
| `/api/brand/scrape` | Brand intelligence | Settings | ✅ Active |

### Checklist for New AI Features

When adding new AI processing functionality:

- [ ] **Add loader UI** using one of the patterns above
- [ ] **Use consistent colors** (purple for active, green for complete)
- [ ] **Define clear steps** array describing the operation phases
- [ ] **Track progress state** (0-100%)
- [ ] **Handle errors gracefully** (show error toast, exit loader)
- [ ] **Set appropriate timeout** for long operations (show estimated time)
- [ ] **Use WorkflowProgress** header if part of multi-step workflow
- [ ] **Test loader visibility** on mobile devices (ensure responsive)

## CSS Classes Used

### Reusable Animation Classes

From `globals.css`:
```css
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-pulse-glow {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}

.gradient-text {
  @apply bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] bg-clip-text text-transparent;
}
```

## Troubleshooting

### Loader Not Showing
- Check that `isProcessing` state is properly set to `true`
- Verify Modal/Dialog wrapper is visible and not behind other elements
- Check z-index (WorkflowProgress uses `z-50`)

### Progress Not Updating
- Ensure you're using `setProcessingProgress()` to update the progress value
- Consider using `setInterval()` for simulated progress while waiting for API response
- Clear interval on cleanup to prevent memory leaks

### Loader Hangs
- Implement a timeout mechanism to auto-close loader after max duration
- Always set `isProcessing(false)` in `finally` block of try-catch
- Test error scenarios to ensure loader exits on failure

## Examples

### Example 1: Brand Analysis (SettingsPage.tsx)
See lines 380-455 for the Brand Intelligence Analysis loader pattern.

### Example 2: Mixer Content Generation (MixerPage.tsx)
See lines 30-91 for the complete progress-tracking loader pattern.

### Example 3: AI Chat (AIChat.tsx)
See lines 15-85 for inline loader button pattern.

## Future Enhancements

- [ ] Create reusable `AIProcessingLoader` component for consistency
- [ ] Add sound notification when processing completes
- [ ] Implement error logging for failed AI operations
- [ ] Add analytics tracking for processing times
- [ ] Create dark mode variants for loaders
