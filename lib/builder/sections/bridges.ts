import { Section } from '../types';

export const BRIDGES: Section[] = [
  {
    id: 'bridge-review-card',
    name: 'Floating Review Card (Bridge)',
    category: 'footer',
    height: 380,
    html: `<div class="w-full h-full flex items-end justify-center pb-[5cqw] -mt-[6cqw] z-20 relative"><div class="bg-white rounded-[3cqw] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-[4cqw] max-w-[65cqw] mx-[5cqw] border border-gray-100"><div class="flex items-center gap-[2cqw] mb-[2cqw]"><img src="{{reviewer_avatar}}" class="w-[6cqw] h-[6cqw] rounded-full object-cover ring-2 ring-gray-100"/><div><div class="font-bold text-[2.2cqw] text-gray-900 font-heading">{{reviewer_name}}</div><div class="flex gap-[0.5cqw] mt-[0.5cqw]"><span class="text-yellow-400 text-[2cqw]">★</span><span class="text-yellow-400 text-[2cqw]">★</span><span class="text-yellow-400 text-[2cqw]">★</span><span class="text-yellow-400 text-[2cqw]">★</span><span class="text-yellow-400 text-[2cqw]">★</span></div></div><div class="ml-auto bg-green-100 text-green-700 px-[2cqw] py-[0.8cqw] rounded-full text-[1.4cqw] font-bold tracking-wide uppercase">Verified</div></div><p class="text-gray-600 text-[2cqw] leading-relaxed safe-text line-clamp-3 font-body">{{review_text}}</p></div></div>`,
    variables: {
      reviewer_name: 'Sarah Johnson',
      reviewer_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      review_text: 'This product completely changed my routine. Best purchase I\'ve made this year!'
    },
    metadata: {
      moods: ['trustworthy', 'energetic'],
      purpose: ['conversion'],
      density: 'medium',
      tags: ['review', 'testimonial', 'bridge', 'overlap', 'social-proof']
    },
    compatibleEffects: ['shadow']
  },
  {
    id: 'bridge-price-bubble',
    name: 'Price Bubble Overlay (Bridge)',
    category: 'footer',
    height: 200,
    html: `<div class="w-full h-full flex items-start justify-end pr-[8cqw] -mt-[5cqw] z-20 relative"><div class="bg-[var(--brand-accent)] text-white rounded-[2.5cqw] px-[5cqw] py-[3cqw] shadow-[0_20px_40px_rgba(0,0,0,0.2)] transform hover:scale-105 transition-transform duration-300 border-4 border-white"><div class="text-center"><div class="text-[1.6cqw] font-bold opacity-90 font-body tracking-wider uppercase mb-[0.5cqw]">ONLY</div><div class="text-[5.5cqw] font-black font-heading leading-none">{{price}}</div><div class="text-[1.6cqw] opacity-90 font-body mt-[0.5cqw]">{{price_suffix}}</div></div></div></div>`,
    variables: {
      price: '$99',
      price_suffix: 'Limited Time'
    },
    metadata: {
      moods: ['urgent', 'energetic'],
      purpose: ['conversion'],
      density: 'low',
      tags: ['price', 'cta', 'bridge', 'floating', 'urgent']
    },
    compatibleEffects: ['shadow', 'animation']
  },
  {
    id: 'bridge-product-overlap',
    name: 'Product Card Overlap (Bridge)',
    category: 'product',
    height: 450,
    html: `<div class="w-full h-full flex items-center justify-center -mt-[8cqw] z-20 relative"><div class="bg-white/80 backdrop-blur-xl rounded-[3cqw] shadow-[0_25px_50px_rgba(0,0,0,0.1)] p-[3cqw] max-w-[50cqw] mx-[5cqw] border border-white/50"><img src="{{product_image}}" class="w-full h-[25cqw] object-cover rounded-[2cqw] mb-[2.5cqw] shadow-md"/><div class="flex justify-between items-center"><h3 class="text-[2.5cqw] font-bold text-[var(--brand-primary)] font-heading safe-text line-clamp-1">{{product_name}}</h3><div class="bg-[var(--brand-accent)] text-white px-[3cqw] py-[1.5cqw] rounded-full font-bold text-[2cqw] shadow-lg">{{price}}</div></div></div></div>`,
    variables: {
      product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      product_name: 'Premium Watch',
      price: '$299'
    },
    metadata: {
      moods: ['luxury', 'minimalist'],
      purpose: ['conversion', 'engagement'],
      density: 'medium',
      tags: ['urgent', 'overlap', 'bridge', 'glassmorphism']
    },
    compatibleEffects: ['shadow', 'filter']
  }
];
