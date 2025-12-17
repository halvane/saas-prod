import { Effect, EffectCategory } from './types';

export class EffectRegistry {
  private static effects: Map<string, Effect> = new Map();

  static register(effect: Effect) {
    this.effects.set(effect.id, effect);
  }

  static get(id: string): Effect | undefined {
    return this.effects.get(id);
  }

  static getAll(): Effect[] {
    return Array.from(this.effects.values());
  }

  static getByCategory(category: EffectCategory): Effect[] {
    return this.getAll().filter(e => e.category === category);
  }
}

// --- Predefined Effects ---

// Shadows & Depth
EffectRegistry.register({
  id: 'effect-shadow-soft',
  name: 'Soft Drop Shadow',
  category: 'shadow',
  className: 'shadow-lg',
});

EffectRegistry.register({
  id: 'effect-shadow-long',
  name: 'Long Shadow',
  category: 'shadow',
  className: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]',
});

EffectRegistry.register({
  id: 'effect-shadow-inner',
  name: 'Inner Shadow',
  category: 'shadow',
  className: 'shadow-inner',
});

EffectRegistry.register({
  id: 'effect-shadow-ambient',
  name: 'Ambient Shadow',
  category: 'shadow',
  className: 'shadow-[0_0_15px_rgba(0,0,0,0.1)]',
});

EffectRegistry.register({
  id: 'effect-shadow-text',
  name: 'Text Shadow',
  category: 'shadow',
  className: 'drop-shadow-md',
});

EffectRegistry.register({
  id: 'effect-glow-soft',
  name: 'Soft Glow',
  category: 'shadow',
  className: 'shadow-[0_0_20px_rgba(255,255,255,0.5)]',
});

EffectRegistry.register({
  id: 'effect-glow-neon',
  name: 'Neon Glow',
  category: 'shadow',
  className: 'shadow-[0_0_10px_#00ff00,0_0_20px_#00ff00]', // Example green neon, should be dynamic
});

EffectRegistry.register({
  id: 'effect-reflection',
  name: 'Soft Reflection',
  category: 'shadow',
  className: 'after:content-[""] after:absolute after:top-full after:left-0 after:w-full after:h-1/2 after:bg-gradient-to-b after:from-white/20 after:to-transparent after:scale-y-[-1]',
  requiresWrapper: true,
});

EffectRegistry.register({
  id: 'effect-depth-layering',
  name: 'Depth Layering',
  category: 'shadow',
  className: 'z-10 shadow-2xl transform hover:-translate-y-1 transition-transform',
});

// Borders & Strokes
EffectRegistry.register({
  id: 'effect-stroke-outer',
  name: 'Outer Stroke',
  category: 'border',
  className: 'border-2 border-current',
});

EffectRegistry.register({
  id: 'effect-stroke-inner',
  name: 'Inner Stroke',
  category: 'border',
  className: 'ring-2 ring-inset ring-current',
});

EffectRegistry.register({
  id: 'effect-stroke-gradient',
  name: 'Gradient Stroke',
  category: 'border',
  className: 'p-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg', // Requires content inside to have bg-white
  requiresWrapper: true,
});

EffectRegistry.register({
  id: 'effect-corner-rounded',
  name: 'Rounded Corners',
  category: 'border',
  className: 'rounded-lg',
});

EffectRegistry.register({
  id: 'effect-corner-soft',
  name: 'Soft Corners',
  category: 'border',
  className: 'rounded-xl',
});

EffectRegistry.register({
  id: 'effect-corner-hard',
  name: 'Hard Corners',
  category: 'border',
  className: 'rounded-none',
});

EffectRegistry.register({
  id: 'effect-border-minimal',
  name: 'Minimal Border',
  category: 'border',
  className: 'border border-gray-200',
});

// Backgrounds & Fills
EffectRegistry.register({
  id: 'effect-bg-solid',
  name: 'Solid Fill',
  category: 'background',
  className: 'bg-white',
});

EffectRegistry.register({
  id: 'effect-bg-gradient-linear',
  name: 'Linear Gradient',
  category: 'background',
  className: 'bg-gradient-to-r from-blue-500 to-purple-600',
});

EffectRegistry.register({
  id: 'effect-bg-gradient-radial',
  name: 'Radial Gradient',
  category: 'background',
  className: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-300 to-gray-500',
});

EffectRegistry.register({
  id: 'effect-bg-mesh',
  name: 'Mesh Gradient',
  category: 'background',
  className: 'bg-[radial-gradient(at_40%_20%,hsla(28,100%,74%,1)_0px,transparent_50%),radial-gradient(at_80%_0%,hsla(189,100%,56%,1)_0px,transparent_50%),radial-gradient(at_0%_50%,hsla(355,100%,93%,1)_0px,transparent_50%)]',
});

EffectRegistry.register({
  id: 'effect-bg-split',
  name: 'Split Background',
  category: 'background',
  className: 'bg-gradient-to-b from-white from-50% to-gray-100 to-50%',
});

// Filters
EffectRegistry.register({
  id: 'effect-filter-duotone',
  name: 'Duotone',
  category: 'filter',
  className: 'mix-blend-multiply bg-indigo-500', // Simplified approximation
});

EffectRegistry.register({
  id: 'effect-filter-monotone',
  name: 'Monotone',
  category: 'filter',
  className: 'grayscale sepia hue-rotate-180',
});

EffectRegistry.register({
  id: 'effect-filter-bw',
  name: 'Black & White',
  category: 'filter',
  className: 'grayscale',
});

EffectRegistry.register({
  id: 'effect-filter-sepia',
  name: 'Sepia',
  category: 'filter',
  className: 'sepia',
});

EffectRegistry.register({
  id: 'effect-filter-contrast-high',
  name: 'High Contrast',
  category: 'filter',
  className: 'contrast-125 brightness-110',
});

EffectRegistry.register({
  id: 'effect-filter-matte',
  name: 'Matte',
  category: 'filter',
  className: 'contrast-75 brightness-110 saturate-75',
});

EffectRegistry.register({
  id: 'effect-filter-vibrance',
  name: 'Vibrance Boost',
  category: 'filter',
  className: 'saturate-150',
});

EffectRegistry.register({
  id: 'effect-filter-blur',
  name: 'Blur Background',
  category: 'filter',
  className: 'backdrop-blur-sm',
});

EffectRegistry.register({
  id: 'effect-glass',
  name: 'Frosted Glass',
  category: 'filter',
  className: 'bg-white/30 backdrop-blur-md border border-white/20',
});

// Textures & Overlays
EffectRegistry.register({
  id: 'effect-texture-grain',
  name: 'Grain Texture',
  category: 'texture',
  className: 'before:content-[""] before:absolute before:inset-0 before:bg-[url("/textures/grain.png")] before:opacity-10 before:pointer-events-none',
  requiresWrapper: true,
});

EffectRegistry.register({
  id: 'effect-texture-paper',
  name: 'Paper Texture',
  category: 'texture',
  className: 'before:content-[""] before:absolute before:inset-0 before:bg-[url("/textures/paper.png")] before:opacity-20 before:mix-blend-multiply before:pointer-events-none',
  requiresWrapper: true,
});

EffectRegistry.register({
  id: 'effect-overlay-vignette',
  name: 'Vignette',
  category: 'overlay',
  className: 'after:content-[""] after:absolute after:inset-0 after:bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.5)_100%)] after:pointer-events-none',
  requiresWrapper: true,
});

EffectRegistry.register({
  id: 'effect-overlay-tint',
  name: 'Color Tint',
  category: 'overlay',
  className: 'relative after:content-[""] after:absolute after:inset-0 after:bg-blue-500/20 after:pointer-events-none',
  requiresWrapper: true,
});

EffectRegistry.register({
  id: 'effect-overlay-dark',
  name: 'Dark Overlay',
  category: 'overlay',
  className: 'relative after:content-[""] after:absolute after:inset-0 after:bg-black/40 after:pointer-events-none',
  requiresWrapper: true,
});

// Shapes & Masks
EffectRegistry.register({
  id: 'effect-mask-circle',
  name: 'Circle Mask',
  category: 'shape',
  className: 'rounded-full overflow-hidden aspect-square',
});

EffectRegistry.register({
  id: 'effect-mask-blob',
  name: 'Blob Mask',
  category: 'shape',
  className: 'rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] overflow-hidden',
});

EffectRegistry.register({
  id: 'effect-frame-polaroid',
  name: 'Polaroid Frame',
  category: 'shape',
  className: 'bg-white p-4 pb-12 shadow-lg rotate-2',
});

EffectRegistry.register({
  id: 'effect-shape-ribbon',
  name: 'Ribbon Badge',
  category: 'shape',
  className: 'relative after:content-[""] after:absolute after:top-0 after:right-0 after:border-[20px] after:border-transparent after:border-t-red-500 after:border-r-red-500',
});

// Highlights
EffectRegistry.register({
  id: 'effect-text-gradient',
  name: 'Gradient Text',
  category: 'highlight',
  className: 'bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500',
});

EffectRegistry.register({
  id: 'effect-highlight-underline',
  name: 'Highlight Underline',
  category: 'highlight',
  className: 'decoration-4 decoration-yellow-400 underline underline-offset-4',
});

EffectRegistry.register({
  id: 'effect-highlight-pill',
  name: 'Pill Highlight',
  category: 'highlight',
  className: 'bg-yellow-200 px-2 rounded-full',
});
