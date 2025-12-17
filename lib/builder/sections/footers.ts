import { Section } from '../types';

export const FOOTERS: Section[] = [
  {
    id: 'footer-social-minimal',
    name: 'Minimal Social Footer',
    category: 'footer',
    height: 150,
    html: `<div class="w-full h-full flex flex-col items-center justify-center z-10"><div class="flex gap-[3cqw] mb-[2cqw]"><div class="w-[4cqw] h-[4cqw] bg-[var(--brand-secondary)] rounded-full opacity-80"></div><div class="w-[4cqw] h-[4cqw] bg-[var(--brand-secondary)] rounded-full opacity-80"></div><div class="w-[4cqw] h-[4cqw] bg-[var(--brand-secondary)] rounded-full opacity-80"></div></div><div class="text-[var(--brand-secondary)] text-[1.8cqw] tracking-[0.2cqw] opacity-80 safe-text line-clamp-1">{{website}}</div></div>`,
    variables: { website: '@BRANDOFFICIAL' },
    metadata: {
      moods: ['minimalist', 'calm', 'corporate'],
      purpose: ['engagement', 'retention'],
      density: 'low',
      tags: ['social', 'icons', 'minimal', 'bottom']
    },
    compatibleEffects: ['highlight', 'shadow']
  },
  {
    id: 'footer-bold-cta',
    name: 'Bold CTA Footer',
    category: 'footer',
    height: 250,
    html: `<div class="w-full h-full flex items-center justify-center z-10"><button class="bg-[var(--brand-accent)] text-[var(--brand-secondary)] border-none px-[8cqw] py-[2.5cqw] text-[3cqw] font-extrabold rounded-[1.5cqw] cursor-pointer uppercase tracking-[0.2cqw] shadow-2xl transition-transform hover:scale-105 safe-text line-clamp-1">{{cta}}</button></div>`,
    variables: { cta: 'SHOP NOW' },
    metadata: {
      moods: ['energetic', 'urgent', 'playful'],
      purpose: ['conversion'],
      density: 'medium',
      tags: ['cta', 'button', 'urgent', 'action', 'conversion']
    },
    compatibleEffects: ['shadow', 'animation', 'highlight']
  },
  {
    id: 'footer-minimal',
    name: 'Minimal Copyright Footer',
    category: 'footer',
    height: 100,
    html: `<div class="w-full h-full flex items-center justify-between px-[5cqw] bg-white border-t border-gray-100"><div class="text-[1.2cqw] text-gray-500">© 2024 {{company}}. All rights reserved.</div><div class="flex gap-[2cqw] text-[1.2cqw] text-gray-500"><span class="cursor-pointer hover:text-gray-900">Privacy</span><span class="cursor-pointer hover:text-gray-900">Terms</span><span class="cursor-pointer hover:text-gray-900">Cookies</span></div></div>`,
    variables: { company: 'Acme Inc' },
    metadata: {
      moods: ['minimalist', 'calm'],
      purpose: ['engagement'],
      density: 'low',
      tags: ['copyright', 'engagement', 'minimal', 'bottom']
    },
    compatibleEffects: ['border']
  },
  {
    id: 'footer-newsletter',
    name: 'Newsletter Footer',
    category: 'footer',
    height: 300,
    html: `<div class="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white px-[4cqw]"><div class="text-[2.5cqw] font-bold mb-[1cqw]">{{heading}}</div><div class="text-[1.2cqw] text-gray-400 mb-[3cqw] max-w-[50cqw] text-center">{{subheading}}</div><div class="flex w-full max-w-[40cqw] gap-[1cqw]"><input type="email" placeholder="Enter your email" class="flex-1 bg-white/10 border border-white/20 rounded-[0.5cqw] px-[1.5cqw] py-[1cqw] text-white placeholder-gray-500 focus:outline-none focus:border-white"><button class="bg-white text-gray-900 px-[2cqw] py-[1cqw] rounded-[0.5cqw] font-bold hover:bg-gray-100 transition-colors">Subscribe</button></div></div>`,
    variables: { heading: 'Stay in the loop', subheading: 'Get the latest updates, news, and special offers directly in your inbox.' },
    metadata: {
      moods: ['minimalist', 'calm'],
      purpose: ['conversion', 'conversion'],
      density: 'medium',
      tags: ['newsletter', 'email', 'form', 'calm']
    },
    compatibleEffects: ['highlight']
  },
  {
    id: 'footer-social-links',
    name: 'Social Links Footer',
    category: 'footer',
    height: 200,
    html: `<div class="w-full h-full flex flex-col items-center justify-center bg-white gap-[2cqw]"><div class="flex gap-[2cqw]"><div class="w-[3cqw] h-[3cqw] bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[var(--brand-primary)] hover:text-white transition-colors cursor-pointer">TW</div><div class="w-[3cqw] h-[3cqw] bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[var(--brand-primary)] hover:text-white transition-colors cursor-pointer">IG</div><div class="w-[3cqw] h-[3cqw] bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[var(--brand-primary)] hover:text-white transition-colors cursor-pointer">LI</div><div class="w-[3cqw] h-[3cqw] bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[var(--brand-primary)] hover:text-white transition-colors cursor-pointer">YT</div></div><div class="flex gap-[3cqw] text-[1.2cqw] text-gray-500 font-medium"><span class="hover:text-[var(--brand-primary)] cursor-pointer">About</span><span class="hover:text-[var(--brand-primary)] cursor-pointer">Careers</span><span class="hover:text-[var(--brand-primary)] cursor-pointer">Blog</span><span class="hover:text-[var(--brand-primary)] cursor-pointer">Contact</span></div></div>`,
    variables: {},
    metadata: {
      moods: ['energetic', 'playful'],
      purpose: ['engagement', 'awareness'],
      density: 'medium',
      tags: ['social', 'links', 'icons', 'navigation']
    },
    compatibleEffects: ['highlight']
  }
];
