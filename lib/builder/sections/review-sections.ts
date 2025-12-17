import { Section } from '../types';

export const REVIEW_SECTIONS: Section[] = [
  {
    id: 'review-star-card',
    name: 'Star Rating Review Card',
    category: 'overlay',
    height: 250,
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:40px;"><div style="background:white;border-radius:20px;padding:40px;max-width:600px;box-shadow:0 20px 50px rgba(0,0,0,0.15);text-align:center;"><div style="display:flex;align-items:center;justify-content:center;gap:15px;margin-bottom:25px;"><img src="{{reviewerImage}}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;border:3px solid {{accentColor}};"/><div style="text-align:left;"><h4 style="font:bold 16px Arial;color:{{titleColor}};margin:0;line-clamp:1;">{{reviewerName}}</h4><div style="display:flex;gap:3px;margin-top:5px;">{{stars}}</div></div></div><p style="font:18px Georgia,serif;color:{{textColor}};margin:0;line-height:1.6;font-style:italic;">"{{reviewText}}"</p></div></div>`,
    variables: {
      reviewerName: 'Sarah Johnson',
      reviewerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      stars: '★★★★★',
      reviewText: 'An exceptional experience from start to finish. Highly recommend!',
      titleColor: '#1F2937',
      textColor: '#4B5563',
      accentColor: '#FF6B35'
    },
    metadata: { moods: ['trustworthy', 'calm'], purpose: ['engagement'], density: 'medium', tags: ['review', 'testimonial', 'rating', 'social-proof'] },
    compatibleEffects: []
  },
  {
    id: 'review-minimal-quote',
    name: 'Minimal Quote Review',
    category: 'overlay',
    height: 180,
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:40px 60px;"><div style="text-align:center;border-left:5px solid {{accentColor}};padding-left:30px;"><p style="font:20px Georgia,serif;color:{{textColor}};margin:0 0 15px 0;line-height:1.7;font-style:italic;">"{{quoteText}}"</p><p style="font:14px Arial;color:{{authorColor}};margin:0;text-transform:uppercase;letter-spacing:1px;">{{authorName}}</p></div></div>`,
    variables: {
      quoteText: 'This product changed everything for me.',
      authorName: 'John Doe',
      textColor: '#1F2937',
      authorColor: '#6B7280',
      accentColor: '#FF6B35'
    },
    metadata: { moods: ['minimalist', 'luxury'], purpose: ['engagement'], density: 'low', tags: ['review', 'quote', 'minimal', 'testimonial'] },
    compatibleEffects: []
  }
];
