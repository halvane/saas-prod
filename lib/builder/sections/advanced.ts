import { Section } from '../types';

export const ADVANCED: Section[] = [
  {
    id: 'advanced-feature-anatomy',
    name: 'Feature Anatomy (Product Focus)',
    category: 'product',
    height: 1080,
    html: `<div class="relative w-full h-full flex items-center justify-center p-[5cqw]"><img src="{{product_image}}" class="w-[45cqw] h-[45cqw] object-contain z-10" style="filter: drop-shadow(0 25px 50px rgba(0,0,0,0.3))"/><div class="absolute top-[12cqw] left-[6cqw] bg-white/20 backdrop-blur-lg rounded-[2cqw] px-[2.5cqw] py-[1.5cqw] border border-white/30 shadow-xl z-20 transform -rotate-6"><div class="text-[var(--brand-primary)] font-bold text-[2cqw] font-heading safe-text line-clamp-1">{{feature_1}}</div></div><div class="absolute top-[15cqw] right-[8cqw] bg-white/20 backdrop-blur-lg rounded-[2cqw] px-[2.5cqw] py-[1.5cqw] border border-white/30 shadow-xl z-20 transform rotate-6"><div class="text-[var(--brand-primary)] font-bold text-[2cqw] font-heading safe-text line-clamp-1">{{feature_2}}</div></div><div class="absolute bottom-[12cqw] left-[10cqw] bg-white/20 backdrop-blur-lg rounded-[2cqw] px-[2.5cqw] py-[1.5cqw] border border-white/30 shadow-xl z-20 transform rotate-3"><div class="text-[var(--brand-primary)] font-bold text-[2cqw] font-heading safe-text line-clamp-1">{{feature_3}}</div></div><div class="absolute bottom-[15cqw] right-[6cqw] bg-white/20 backdrop-blur-lg rounded-[2cqw] px-[2.5cqw] py-[1.5cqw] border border-white/30 shadow-xl z-20 transform -rotate-3"><div class="text-[var(--brand-primary)] font-bold text-[2cqw] font-heading safe-text line-clamp-1">{{feature_4}}</div></div><div class="absolute bottom-[6cqw] left-1/2 transform -translate-x-1/2 bg-[var(--brand-accent)] text-[var(--brand-secondary)] px-[4cqw] py-[1.5cqw] rounded-full font-bold text-[2.5cqw] shadow-2xl z-30">{{price}}</div></div>`,
    variables: {
      product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      feature_1: 'Premium Quality',
      feature_2: 'Fast Shipping',
      feature_3: 'Eco-Friendly',
      feature_4: 'Warranty Included',
      price: '$149'
    },
    metadata: {
      moods: ['energetic', 'luxury'],
      purpose: ['conversion'],
      density: 'high',
      tags: ['urgent', 'features', 'anatomy', 'ecommerce', 'glassmorphism']
    },
    compatibleEffects: ['shadow', 'filter']
  },
  {
    id: 'advanced-versus-split',
    name: 'Versus Comparison Split',
    category: 'hero',
    height: 1080,
    html: `<div class="relative w-full h-full"><div class="absolute inset-0 left-0 w-[47%] bg-gray-300 flex flex-col items-center justify-center p-[5cqw]" style="filter: grayscale(100%)"><img src="{{before_image}}" class="w-full h-[25cqw] object-cover mb-[3cqw] opacity-60"/><div class="text-[4cqw] font-bold text-gray-600 mb-[1.5cqw] font-heading">BEFORE</div><div class="w-[6cqw] h-[6cqw] bg-red-500 rounded-full flex items-center justify-center"><svg class="w-[4cqw] h-[4cqw] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg></div></div><div class="absolute inset-0 right-0 w-[53%] left-[47%] flex flex-col items-center justify-center p-[5cqw]" style="background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%)"><img src="{{after_image}}" class="w-full h-[25cqw] object-cover mb-[3cqw] rounded-[1cqw] shadow-2xl"/><div class="text-[4cqw] font-bold text-[var(--brand-secondary)] mb-[1.5cqw] font-heading">AFTER</div><div class="w-[6cqw] h-[6cqw] bg-green-500 rounded-full flex items-center justify-center"><svg class="w-[4cqw] h-[4cqw] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div></div><div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white rounded-full px-[3cqw] py-[1.5cqw] shadow-2xl"><div class="text-[3cqw] font-extrabold text-gray-900 font-heading">VS</div></div></div>`,
    variables: {
      before_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
      after_image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600'
    },
    metadata: {
      moods: ['energetic', 'urgent'],
      purpose: ['conversion', 'education'],
      density: 'high',
      tags: ['comparison', 'before-after', 'versus', 'split', 'contrast']
    },
    compatibleEffects: ['filter']
  },
  {
    id: 'advanced-data-insight',
    name: 'Big Data Statistic',
    category: 'text',
    height: 540,
    html: `<div class="w-full h-full flex flex-col items-center justify-center p-[5cqw] text-center"><div class="text-[12cqw] font-extrabold mb-[1.5cqw] font-heading" style="background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">{{statistic}}</div><div class="text-[3cqw] font-semibold text-gray-700 mb-[2.5cqw] font-heading safe-text line-clamp-2">{{stat_label}}</div><div class="text-[2cqw] text-gray-500 w-[70cqw] font-body safe-text line-clamp-2">{{stat_context}}</div></div>`,
    variables: {
      statistic: '+400%',
      stat_label: 'Growth in 6 Months',
      stat_context: 'Average increase for our clients using the new system'
    },
    metadata: {
      moods: ['trustworthy', 'corporate'],
      purpose: ['education', 'conversion'],
      density: 'low',
      tags: ['statistics', 'data', 'proof', 'numbers', 'results']
    },
    compatibleEffects: ['highlight']
  },
  {
    id: 'advanced-checklist',
    name: 'Checklist Layout',
    category: 'text',
    height: 700,
    html: `<div class="w-full h-full flex flex-col p-[5cqw]"><div class="text-[4cqw] font-extrabold mb-[5cqw] text-center text-[var(--brand-primary)] font-heading uppercase safe-text line-clamp-2">{{title}}</div><div class="space-y-[2.5cqw] w-[70cqw] mx-auto"><div class="flex items-center gap-[2.5cqw] transform hover:translate-x-2 transition-transform"><div class="w-[5cqw] h-[5cqw] bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"><svg class="w-[3cqw] h-[3cqw] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><div class="text-[2.5cqw] font-semibold text-gray-800 font-body safe-text line-clamp-1">{{item_1}}</div></div><div class="flex items-center gap-[2.5cqw] transform hover:translate-x-2 transition-transform"><div class="w-[5cqw] h-[5cqw] bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"><svg class="w-[3cqw] h-[3cqw] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><div class="text-[2.5cqw] font-semibold text-gray-800 font-body safe-text line-clamp-1">{{item_2}}</div></div><div class="flex items-center gap-[2.5cqw] transform hover:translate-x-2 transition-transform"><div class="w-[5cqw] h-[5cqw] bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"><svg class="w-[3cqw] h-[3cqw] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><div class="text-[2.5cqw] font-semibold text-gray-800 font-body safe-text line-clamp-1">{{item_3}}</div></div><div class="flex items-center gap-[2.5cqw] transform hover:translate-x-2 transition-transform"><div class="w-[5cqw] h-[5cqw] bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"><svg class="w-[3cqw] h-[3cqw] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><div class="text-[2.5cqw] font-semibold text-gray-800 font-body safe-text line-clamp-1">{{item_4}}</div></div><div class="flex items-center gap-[2.5cqw] transform hover:translate-x-2 transition-transform"><div class="w-[5cqw] h-[5cqw] bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"><svg class="w-[3cqw] h-[3cqw] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><div class="text-[2.5cqw] font-semibold text-gray-800 font-body safe-text line-clamp-1">{{item_5}}</div></div></div></div>`,
    variables: {
      title: 'The Ultimate Checklist',
      item_1: 'Crystal clear value proposition',
      item_2: 'Compelling social proof',
      item_3: 'Friction-free checkout',
      item_4: 'Strategic urgency triggers',
      item_5: 'Mobile-optimized experience'
    },
    metadata: {
      moods: ['trustworthy', 'corporate'],
      purpose: ['education'],
      density: 'medium',
      tags: ['checklist', 'list', 'benefits', 'educational', 'steps']
    },
    compatibleEffects: ['shadow']
  }
];
