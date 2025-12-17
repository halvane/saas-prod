import { Section } from '../types';

export const TEXT_SECTIONS: Section[] = [
  {
    id: 'testimonial-modern-card',
    name: 'Modern Testimonial Card',
    category: 'text',
    height: 400,
    html: `<div class="w-full h-full flex items-center justify-center p-[4cqw]"><div class="bg-white p-[4cqw] rounded-[3cqw] shadow-2xl w-[80cqw] text-center"><div class="text-[var(--brand-accent)] text-[6cqw] leading-none mb-[2cqw]">"</div><p class="text-[2.8cqw] italic text-[var(--brand-primary)] mb-[3cqw] leading-[1.4] safe-text line-clamp-3">{{quote}}</p><div class="flex items-center justify-center gap-[1.5cqw]"><img src="{{avatar}}" class="w-[6cqw] h-[6cqw] rounded-full object-cover"/><div class="text-left"><div class="font-bold text-[1.8cqw] text-[var(--brand-primary)] safe-text line-clamp-1">{{author}}</div><div class="text-[var(--brand-primary-light)] text-[1.4cqw] safe-text line-clamp-1">{{role}}</div></div></div></div></div>`,
    variables: {
      quote: 'This product completely changed my workflow. Highly recommended!',
      author: 'Sarah Jenkins',
      role: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    metadata: {
      moods: ['trustworthy', 'calm', 'corporate'],
      purpose: ['retention', 'conversion'],
      density: 'medium',
      tags: ['testimonial', 'quote', 'social-proof', 'review']
    },
    compatibleEffects: ['shadow', 'border']
  },
  {
    id: 'text-features-grid',
    name: 'Four Column Features',
    category: 'text',
    height: 300,
    html: `<div class="w-full h-full flex items-center justify-between px-[6cqw] gap-[2cqw]"><div class="text-center flex-1"><div class="text-[4cqw] mb-[1.5cqw]">🚀</div><h3 class="text-[2cqw] font-bold text-[var(--brand-primary)] mb-[1cqw] safe-text line-clamp-1">{{feat1_title}}</h3><p class="text-[1.4cqw] text-[var(--brand-primary-light)] safe-text line-clamp-2">{{feat1_desc}}</p></div><div class="text-center flex-1"><div class="text-[4cqw] mb-[1.5cqw]">⚡</div><h3 class="text-[2cqw] font-bold text-[var(--brand-primary)] mb-[1cqw] safe-text line-clamp-1">{{feat2_title}}</h3><p class="text-[1.4cqw] text-[var(--brand-primary-light)] safe-text line-clamp-2">{{feat2_desc}}</p></div><div class="text-center flex-1"><div class="text-[4cqw] mb-[1.5cqw]">🛡️</div><h3 class="text-[2cqw] font-bold text-[var(--brand-primary)] mb-[1cqw] safe-text line-clamp-1">{{feat3_title}}</h3><p class="text-[1.4cqw] text-[var(--brand-primary-light)] safe-text line-clamp-2">{{feat3_desc}}</p></div><div class="text-center flex-1"><div class="text-[4cqw] mb-[1.5cqw]">💎</div><h3 class="text-[2cqw] font-bold text-[var(--brand-primary)] mb-[1cqw] safe-text line-clamp-1">{{feat4_title}}</h3><p class="text-[1.4cqw] text-[var(--brand-primary-light)] safe-text line-clamp-2">{{feat4_desc}}</p></div></div>`,
    variables: {
      feat1_title: 'Fast', feat1_desc: 'Lightning speed',
      feat2_title: 'Powerful', feat2_desc: 'Do more',
      feat3_title: 'Secure', feat3_desc: 'Bank-grade',
      feat4_title: 'Premium', feat4_desc: 'Top quality'
    },
    metadata: {
      moods: ['energetic', 'corporate', 'minimalist'],
      purpose: ['education', 'awareness'],
      density: 'medium',
      tags: ['grid', 'features', 'icons', 'list']
    },
    compatibleEffects: ['highlight', 'animation']
  },
  {
    id: 'tailwind-stats-simple',
    name: 'Simple Stats (Tailwind Style)',
    category: 'text',
    height: 200,
    html: `<div class="w-full h-full flex items-center justify-center bg-gray-50"><div class="flex gap-[8cqw] text-center"><div class="flex flex-col"><span class="text-[4.8cqw] font-extrabold text-[var(--brand-primary)] safe-text line-clamp-1">{{stat1_val}}</span><span class="text-[1.6cqw] font-medium text-[var(--brand-primary-light)] uppercase tracking-wider safe-text line-clamp-1">{{stat1_label}}</span></div><div class="w-[0.1cqw] h-[6cqw] bg-gray-200"></div><div class="flex flex-col"><span class="text-[4.8cqw] font-extrabold text-[var(--brand-primary)] safe-text line-clamp-1">{{stat2_val}}</span><span class="text-[1.6cqw] font-medium text-[var(--brand-primary-light)] uppercase tracking-wider safe-text line-clamp-1">{{stat2_label}}</span></div><div class="w-[0.1cqw] h-[6cqw] bg-gray-200"></div><div class="flex flex-col"><span class="text-[4.8cqw] font-extrabold text-[var(--brand-primary)] safe-text line-clamp-1">{{stat3_val}}</span><span class="text-[1.6cqw] font-medium text-[var(--brand-primary-light)] uppercase tracking-wider safe-text line-clamp-1">{{stat3_label}}</span></div></div></div>`,
    variables: {
      stat1_val: '100%', stat1_label: 'Uptime',
      stat2_val: '24/7', stat2_label: 'Support',
      stat3_val: '100k+', stat3_label: 'Users'
    },
    metadata: {
      moods: ['trustworthy', 'corporate', 'minimalist'],
      purpose: ['awareness', 'conversion'],
      density: 'low',
      tags: ['stats', 'numbers', 'data', 'proof']
    },
    compatibleEffects: ['background', 'border']
  },
  {
    id: 'tailwind-pricing-card',
    name: 'Pricing Card (Tailwind Style)',
    category: 'text',
    height: 500,
    html: `<div class="w-full h-full flex items-center justify-center p-[4cqw]"><div class="w-[40cqw] bg-[var(--brand-secondary)] rounded-[2cqw] shadow-xl p-[4cqw] border border-[var(--brand-primary)]"><div class="text-center mb-[3cqw]"><h3 class="text-[2.4cqw] font-semibold text-[var(--brand-primary)] mb-[1cqw] safe-text line-clamp-1">{{plan_name}}</h3><div class="flex items-baseline justify-center"><span class="text-[4.8cqw] font-extrabold text-[var(--brand-primary)]">{{price}}</span><span class="text-[1.8cqw] text-[var(--brand-primary-light)] ml-[0.5cqw]">/mo</span></div></div><ul class="list-none p-0 m-0 mb-[3cqw]"><li class="flex items-center mb-[1.5cqw] text-[var(--brand-primary-light)] text-[1.6cqw] safe-text line-clamp-1"><span class="text-[var(--brand-accent)] mr-[1cqw]">✓</span>{{feat1}}</li><li class="flex items-center mb-[1.5cqw] text-[var(--brand-primary-light)] text-[1.6cqw] safe-text line-clamp-1"><span class="text-[var(--brand-accent)] mr-[1cqw]">✓</span>{{feat2}}</li><li class="flex items-center mb-[1.5cqw] text-[var(--brand-primary-light)] text-[1.6cqw] safe-text line-clamp-1"><span class="text-[var(--brand-accent)] mr-[1cqw]">✓</span>{{feat3}}</li></ul><button class="w-full p-[1.5cqw] bg-[var(--brand-accent)] text-[var(--brand-secondary)] border-none rounded-[1cqw] font-semibold text-[1.6cqw] cursor-pointer transition-opacity hover:opacity-90">{{cta}}</button></div></div>`,
    variables: {
      plan_name: 'Pro Plan',
      price: '$49',
      feat1: 'Unlimited Access',
      feat2: 'Priority Support',
      feat3: 'Advanced Analytics',
      cta: 'Get Started'
    },
    metadata: {
      moods: ['urgent', 'corporate', 'trustworthy'],
      purpose: ['conversion'],
      density: 'high',
      tags: ['pricing', 'card', 'plan', 'cta', 'sales']
    },
    compatibleEffects: ['shadow', 'border', 'highlight']
  },
  {
    id: 'text-minimal-heading',
    name: 'Minimal Section Heading',
    category: 'text',
    height: 150,
    html: `<div class="w-full h-full flex flex-col items-center justify-center px-[4cqw] text-center"><div class="text-[1cqw] font-bold tracking-[0.2cqw] text-[var(--brand-accent)] uppercase mb-[1cqw]">{{kicker}}</div><h2 class="text-[3cqw] font-bold text-[var(--brand-primary)] max-w-[60cqw] leading-tight">{{heading}}</h2></div>`,
    variables: { kicker: 'Features', heading: 'Everything you need to succeed' },
    metadata: {
      moods: ['minimalist', 'calm'],
      purpose: ['introduction', 'transition'],
      density: 'low',
      tags: ['heading', 'title', 'minimal', 'text']
    },
    compatibleEffects: ['highlight']
  },
  {
    id: 'text-faq-accordion',
    name: 'FAQ Accordion',
    category: 'text',
    height: 400,
    html: `<div class="w-full h-full flex flex-col items-center justify-center px-[4cqw] bg-white"><div class="w-full max-w-[60cqw] space-y-[1cqw]"><div class="border border-gray-200 rounded-[1cqw] overflow-hidden"><div class="p-[1.5cqw] bg-gray-50 flex justify-between items-center cursor-pointer"><span class="font-bold text-[1.2cqw] text-gray-900">How does it work?</span><span class="text-[1.5cqw] text-gray-400">+</span></div></div><div class="border border-gray-200 rounded-[1cqw] overflow-hidden"><div class="p-[1.5cqw] bg-gray-50 flex justify-between items-center cursor-pointer"><span class="font-bold text-[1.2cqw] text-gray-900">Can I cancel anytime?</span><span class="text-[1.5cqw] text-gray-400">+</span></div></div><div class="border border-gray-200 rounded-[1cqw] overflow-hidden"><div class="p-[1.5cqw] bg-gray-50 flex justify-between items-center cursor-pointer"><span class="font-bold text-[1.2cqw] text-gray-900">Do you offer support?</span><span class="text-[1.5cqw] text-gray-400">+</span></div></div></div></div>`,
    variables: {},
    metadata: {
      moods: ['trustworthy', 'calm'],
      purpose: ['education', 'support'],
      density: 'medium',
      tags: ['faq', 'accordion', 'questions', 'list']
    },
    compatibleEffects: ['border']
  }
];
