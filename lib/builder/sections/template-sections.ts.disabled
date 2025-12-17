/**
 * Reusable Template Sections organized by category
 * These sections are composed from imported templates and can be mixed/matched
 */

import { Section } from '../types';

// ============================================================================
// PRODUCT SECTIONS
// ============================================================================
export const PRODUCT_SECTIONS: Section[] = [
  {
    id: 'product-tech-laptop',
    name: 'Tech Laptop Product',
    category: 'product',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:linear-gradient(135deg,{{gradientStart}} 0%,{{gradientEnd}} 100%);position:relative;overflow:hidden;"><div style="position:absolute;top:80px;left:50%;transform:translateX(-50%);background:white;padding:18px 50px;border-radius:50px;box-shadow:0 15px 40px rgba(0,0,0,0.2);"><span style="font:bold 18px Arial;color:{{badgeColor}};text-transform:uppercase;letter-spacing:2px;">{{badge}}</span></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;"><h1 style="font:black 78px Impact;color:white;margin:0 0 50px 0;text-transform:uppercase;letter-spacing:4px;text-shadow:0 8px 25px rgba(0,0,0,0.3);">{{productName}}</h1><div style="margin-bottom:60px;"><img src="{{productImage}}" style="max-width:550px;max-height:380px;filter:drop-shadow(0 30px 70px rgba(0,0,0,0.4));"/></div></div><div style="position:absolute;bottom:0;left:0;right:0;background:{{bottomBg}};padding:60px 80px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;"><div><div style="background:{{priceBg}};width:140px;height:140px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 15px 40px rgba(0,0,0,0.3);"><h2 style="font:black 44px Impact;color:white;margin:0;">{{price}}</h2></div></div><div style="flex:1;padding:0 60px;"><h3 style="font:bold 22px Arial;color:{{featuresColor}};margin:0 0 20px 0;text-transform:uppercase;letter-spacing:1px;">{{featuresLabel}}</h3><div style="display:grid;grid-template-columns:1fr;gap:12px;"><div style="display:flex;align-items:center;gap:12px;"><span style="font:18px Arial;color:{{featureTextColor}};">• {{feature1}}</span></div><div style="display:flex;align-items:center;gap:12px;"><span style="font:18px Arial;color:{{featureTextColor}};">• {{feature2}}</span></div><div style="display:flex;align-items:center;gap:12px;"><span style="font:18px Arial;color:{{featureTextColor}};">• {{feature3}}</span></div></div></div><div style="text-align:right;"><p style="font:bold 18px Arial;color:{{brandColor}};margin:0;">{{brandLabel}} {{brandName}}</p></div></div></div></div>`,
    variables: {
      badge: 'Pro Series',
      price: '$1,899',
      priceBg: '#0284C7',
      bottomBg: '#F1F5F9',
      feature1: 'Intel i9 Processor',
      feature2: '32GB RAM',
      feature3: '4K Display',
      brandName: 'TechPro',
      badgeColor: '#0EA5E9',
      brandColor: '#0284C7',
      brandLabel: 'BRAND:',
      gradientEnd: '#1E293B',
      productName: 'WorkStation X1',
      productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a873',
      featuresColor: '#0C4A6E',
      featuresLabel: 'Features',
      gradientStart: '#475569',
      featureTextColor: '#1E293B'
    },
    metadata: { moods: ['minimalist', 'energetic'], purpose: ['conversion'], density: 'high', tags: ['urgent', 'laptop', 'computer', 'energetic'] },
    compatibleEffects: []
  }
];

// ============================================================================
// TESTIMONIAL SECTIONS
// ============================================================================
export const TESTIMONIAL_SECTIONS: Section[] = [
  {
    id: 'testimonial-coffee-review',
    name: 'Coffee Shop Review',
    category: 'testimonial',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:{{bgColor}};position:relative;overflow:hidden;"><svg style="position:absolute;inset:0;opacity:0.05;"><defs><pattern id="coffee" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 30 30 Q 30 25 35 25 L 50 25 Q 55 25 55 30 L 55 45 Q 55 50 50 50 L 35 50 Q 30 50 30 45 Z M 57 32 Q 62 32 62 37 Q 62 42 57 42" stroke="{{patternColor}}" stroke-width="2" fill="none"/></pattern></defs><rect width="100%" height="100%" fill="url(#coffee)"/></svg><div style="position:absolute;inset:0;padding:100px;display:flex;align-items:center;justify-content:center;"><div style="background:white;border-radius:30px;padding:60px 70px;max-width:750px;box-shadow:0 40px 100px rgba(0,0,0,0.2);border:6px solid {{borderColor}};"><div style="text-align:center;margin-bottom:40px;"><div style="width:110px;height:110px;border-radius:50%;overflow:hidden;border:5px solid {{avatarBorder}};margin:0 auto 25px auto;box-shadow:0 15px 40px rgba(0,0,0,0.2);"><img src="{{avatarImage}}" style="width:100%;height:100%;object-fit:cover;"/></div><h2 style="font:bold 30px Arial;color:{{nameColor}};margin:0 0 8px 0;">{{guestName}}</h2><p style="font:16px Arial;color:{{dateColor}};margin:0;">{{reviewDate}}</p></div><p style="font:22px Georgia,serif;color:{{reviewColor}};margin:0 0 40px 0;line-height:1.7;text-align:center;">{{reviewText}}</p><div style="background:{{starBg}};padding:25px;border-radius:15px;display:flex;justify-content:center;gap:18px;"><svg width="45" height="45"><path d="M 22.5 8 L 27 20 L 40 21 L 31 30 L 33 43 L 22.5 37 L 12 43 L 14 30 L 5 21 L 18 20 Z" fill="{{starColor}}"/></svg><svg width="45" height="45"><path d="M 22.5 8 L 27 20 L 40 21 L 31 30 L 33 43 L 22.5 37 L 12 43 L 14 30 L 5 21 L 18 20 Z" fill="{{starColor}}"/></svg><svg width="45" height="45"><path d="M 22.5 8 L 27 20 L 40 21 L 31 30 L 33 43 L 22.5 37 L 12 43 L 14 30 L 5 21 L 18 20 Z" fill="{{starColor}}"/></svg><svg width="45" height="45"><path d="M 22.5 8 L 27 20 L 40 21 L 31 30 L 33 43 L 22.5 37 L 12 43 L 14 30 L 5 21 L 18 20 Z" fill="{{starColor}}"/></svg><svg width="45" height="45"><path d="M 22.5 8 L 27 20 L 40 21 L 31 30 L 33 43 L 22.5 37 L 12 43 L 14 30 L 5 21 L 18 20 Z" fill="{{starColor}}"/></svg></div></div></div></div>`,
    variables: {
      starBg: '#8D6E63',
      bgColor: '#F5F3F0',
      dateColor: '#795548',
      guestName: 'Emma Watson',
      nameColor: '#5D4037',
      starColor: '#FFD54F',
      reviewDate: 'December 5, 2025',
      reviewText: 'Best coffee in town! The baristas are true artists and the atmosphere is so cozy. Their signature latte is absolutely perfect. My new favorite spot!',
      avatarImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
      borderColor: '#D7CCC8',
      reviewColor: '#6D4C41',
      patternColor: '#8D6E63',
      avatarBorder: '#8D6E63'
    },
    metadata: { moods: ['calm', 'friendly'], purpose: ['engagement'], density: 'medium', tags: ['testimonial', 'review', 'coffee', 'local'] },
    compatibleEffects: []
  }
];

// ============================================================================
// REAL ESTATE SECTIONS
// ============================================================================
export const REAL_ESTATE_SECTIONS: Section[] = [
  {
    id: 'realestate-luxury-property',
    name: 'Luxury Property Showcase',
    category: 'real-estate',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:{{bgColor}};position:relative;overflow:hidden;"><div style="position:absolute;inset:0;"><img src="{{propertyImage}}" style="width:100%;height:100%;object-fit:cover;"/><div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.7) 100%);"></div></div><div style="position:absolute;top:60px;left:60px;background:{{badgeBg}};padding:15px 40px;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.4);"><span style="font:bold 16px Arial;color:white;text-transform:uppercase;letter-spacing:2px;">{{badge}}</span></div><div style="position:absolute;bottom:0;left:0;right:0;padding:60px;"><h1 style="font:bold 58px Georgia,serif;color:white;margin:0 0 20px 0;text-shadow:0 4px 15px rgba(0,0,0,0.5);">{{address}}</h1><div style="display:flex;gap:40px;margin-bottom:35px;"><div style="text-align:center;"><h3 style="font:black 42px Impact;color:{{accentColor}};margin:0 0 8px 0;">{{beds}}</h3><p style="font:14px Arial;color:white;margin:0;text-transform:uppercase;letter-spacing:1px;">{{bedsLabel}}</p></div><div style="text-align:center;"><h3 style="font:black 42px Impact;color:{{accentColor}};margin:0 0 8px 0;">{{baths}}</h3><p style="font:14px Arial;color:white;margin:0;text-transform:uppercase;letter-spacing:1px;">{{bathsLabel}}</p></div><div style="text-align:center;"><h3 style="font:black 42px Impact;color:{{accentColor}};margin:0 0 8px 0;">{{sqft}}</h3><p style="font:14px Arial;color:white;margin:0;text-transform:uppercase;letter-spacing:1px;">{{sqftLabel}}</p></div></div><div style="display:flex;justify-content:space-between;align-items:center;"><h2 style="font:black 52px Impact;color:white;margin:0;text-shadow:0 4px 15px rgba(0,0,0,0.5);">{{price}}</h2><div style="background:white;padding:18px 50px;border-radius:50px;box-shadow:0 15px 40px rgba(0,0,0,0.4);"><span style="font:bold 18px Arial;color:{{ctaColor}};text-transform:uppercase;letter-spacing:1px;">{{ctaText}}</span></div></div></div></div>`,
    variables: {
      beds: '4',
      sqft: '3,200',
      badge: 'For Sale',
      baths: '3.5',
      price: '$2,850,000',
      address: 'Modern Waterfront Villa',
      badgeBg: '#DC2626',
      bgColor: '#1F2937',
      ctaText: 'Schedule Tour',
      ctaColor: '#1F2937',
      bedsLabel: 'Bedrooms',
      sqftLabel: 'Sq Ft',
      bathsLabel: 'Bathrooms',
      accentColor: '#FBBF24',
      propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'
    },
    metadata: { moods: ['luxury', 'premium'], purpose: ['conversion'], density: 'high', tags: ['real-estate', 'property', 'luxury', 'listing'] },
    compatibleEffects: []
  }
];

// ============================================================================
// PODCAST SECTIONS
// ============================================================================
export const PODCAST_SECTIONS: Section[] = [
  {
    id: 'podcast-finance-launch',
    name: 'Finance Podcast Launch',
    category: 'podcast',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:linear-gradient(135deg,{{gradientStart}} 0%,{{gradientEnd}} 100%);position:relative;overflow:hidden;"><svg style="position:absolute;inset:0;opacity:0.08;"><defs><pattern id="waves" width="200" height="100" patternUnits="userSpaceOnUse"><path d="M 0 50 Q 50 20 100 50 T 200 50" stroke="white" stroke-width="3" fill="none"/></pattern></defs><rect width="100%" height="100%" fill="url(#waves)"/></svg><div style="position:absolute;top:70px;left:70px;background:{{badgeBg}};padding:18px 45px;border-radius:10px;box-shadow:0 12px 35px rgba(0,0,0,0.3);transform:skewX(-5deg);"><span style="font:black 18px Impact;color:white;text-transform:uppercase;letter-spacing:3px;">{{badge}}</span></div><div style="position:absolute;top:50%;right:120px;transform:translateY(-50%);width:380px;height:480px;"><img src="{{micImage}}" style="width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 30px 70px rgba(0,0,0,0.5));"/></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:100px 120px;"><h1 style="font:black 72px Impact;color:white;margin:0 0 20px 0;text-transform:uppercase;letter-spacing:2px;line-height:1;max-width:550px;">{{title}}</h1><p style="font:600 28px Arial;color:{{subtitleColor}};margin:0 0 50px 0;max-width:500px;">{{subtitle}}</p><div style="display:flex;align-items:center;gap:15px;margin-bottom:40px;"><svg width="50" height="50" style="background:rgba(255,255,255,0.2);backdrop-filter:blur(10px);padding:10px;border-radius:8px;"><rect x="10" y="8" width="5" height="14" fill="white"/><rect x="17.5" y="8" width="5" height="14" fill="white"/><rect x="25" y="8" width="5" height="14" fill="white"/></svg><div><p style="font:bold 16px Arial;color:white;margin:0 0 5px 0;text-transform:uppercase;letter-spacing:2px;">{{scheduleLabel}}</p></div></div><div style="display:flex;gap:18px;"><div style="display:flex;align-items:center;gap:10px;background:white;padding:14px 32px;border-radius:50px;box-shadow:0 15px 40px rgba(0,0,0,0.3);"><svg width="20" height="20"><circle cx="10" cy="10" r="8" fill="{{iconColor}}"/></svg><span style="font:600 14px Arial;color:{{textColor}};text-transform:uppercase;letter-spacing:1px;">{{platform1}}</span></div><div style="display:flex;align-items:center;gap:10px;background:white;padding:14px 32px;border-radius:50px;box-shadow:0 15px 40px rgba(0,0,0,0.3);"><svg width="20" height="20"><circle cx="10" cy="10" r="8" fill="{{iconColor}}"/></svg><span style="font:600 14px Arial;color:{{textColor}};text-transform:uppercase;letter-spacing:1px;">{{platform2}}</span></div></div></div></div>`,
    variables: {
      badge: 'New Episode Available',
      title: 'Mastering Personal Finance',
      badgeBg: '#1F2937',
      subtitle: 'With Expert Financial Advisors',
      iconColor: '#10B981',
      platform1: 'Listen on Apple Podcasts',
      platform2: 'Listen on Spotify',
      textColor: '#1F2937',
      micImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
      gradientEnd: '#059669',
      scheduleLabel: 'New Episodes Every Week',
      gradientStart: '#10B981',
      subtitleColor: '#D1FAE5'
    },
    metadata: { moods: ['corporate', 'engaging'], purpose: ['awareness'], density: 'medium', tags: ['podcast', 'finance', 'education', 'audio'] },
    compatibleEffects: []
  }
];

// ============================================================================
// FOOD & RESTAURANT SECTIONS
// ============================================================================
export const FOOD_SECTIONS: Section[] = [
  {
    id: 'food-special-promotion',
    name: 'Restaurant Special Promotion',
    category: 'food',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:{{bgColor}};position:relative;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;width:100%;height:55%;background:{{bottomColor}};clip-path:polygon(0 15%,100% 0,100% 100%,0 100%);"></div><svg style="position:absolute;bottom:50px;right:50px;width:250px;height:250px;opacity:0.15;"><path d="M 125 0 L 175 75 L 125 150 L 75 75 Z M 0 125 L 75 175 L 150 125 L 75 75 Z" fill="{{accentColor}}"/></svg><div style="position:absolute;top:70px;left:50%;transform:translateX(-50%);text-align:center;"><p style="font:18px Arial;color:white;margin:0;letter-spacing:1px;">{{restaurantName}}</p></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100px;"><h1 style="font:black 72px Impact;color:{{titleColor}};margin:0 0 10px 0;text-transform:uppercase;letter-spacing:3px;text-align:center;">{{daySpecial}}</h1><h2 style="font:black 64px Impact;color:white;margin:0 0 50px 0;text-transform:uppercase;letter-spacing:2px;text-align:center;">{{dishName}}</h2><svg style="margin-bottom:40px;"><line x1="0" y1="5" x2="300" y2="5" stroke="{{accentColor}}" stroke-width="8"/></svg><div style="position:relative;width:600px;height:350px;margin-bottom:40px;"><img src="{{productImage}}" style="width:100%;height:100%;object-fit:cover;border-radius:15px;box-shadow:0 25px 60px rgba(0,0,0,0.4);"/><div style="position:absolute;top:-30px;right:-30px;width:140px;height:140px;background:white;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 15px 40px rgba(0,0,0,0.3);"><h3 style="font:black 20px Arial;color:{{priceColor}};margin:0 0 5px 0;text-transform:uppercase;">{{priceLabel}}</h3><p style="font:black 42px Impact;color:{{priceColor}};margin:0;">{{price}}</p></div></div><p style="font:bold 24px Arial;color:{{contactColor}};margin:0;text-align:center;letter-spacing:1px;">{{contactText}}</p></div></div>`,
    variables: {
      price: '$22',
      bgColor: '#2C2C2C',
      dishName: 'Ribeye Steak',
      daySpecial: 'Friday Special',
      priceColor: '#2C2C2C',
      priceLabel: 'Only',
      titleColor: '#F59E0B',
      accentColor: '#FCD34D',
      bottomColor: '#F59E0B',
      contactText: 'Call or message for reservations: +90 673 9485',
      contactColor: '#1F2937',
      productImage: 'https://images.unsplash.com/photo-1558030006-450675393462',
      restaurantName: 'The Baka Bar + Resto'
    },
    metadata: { moods: ['urgent', 'premium'], purpose: ['conversion'], density: 'high', tags: ['food', 'restaurant', 'promotion', 'special'] },
    compatibleEffects: []
  }
];

// ============================================================================
// EXPORT ALL SECTIONS
// ============================================================================
export const ALL_TEMPLATE_SECTIONS = [
  ...PRODUCT_SECTIONS,
  ...TESTIMONIAL_SECTIONS,
  ...REAL_ESTATE_SECTIONS,
  ...PODCAST_SECTIONS,
  ...FOOD_SECTIONS
];
