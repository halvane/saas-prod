import { Section } from '../types';

export const CTA_SECTIONS: Section[] = [
  {
    id: 'cta-primary-button',
    name: 'Primary CTA Button',
    category: 'badge',
    height: 100,
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:0 40px;"><div style="background:{{ctaBg}};padding:22px 65px;border-radius:50px;box-shadow:0 15px 40px rgba(0,0,0,0.3);"><span style="font:bold 20px Arial;color:white;text-transform:uppercase;letter-spacing:2px;">{{ctaText}}</span></div></div>`,
    variables: {
      ctaText: 'Get Started',
      ctaBg: '#FF6B35'
    },
    metadata: { moods: ['urgent'], purpose: ['conversion'], density: 'low', tags: ['button', 'cta', 'conversion', 'action'] },
    compatibleEffects: ['highlight', 'shadow']
  },
  {
    id: 'cta-dual-buttons',
    name: 'Dual CTA Buttons',
    category: 'badge',
    height: 100,
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;gap:25px;padding:0 40px;"><div style="background:{{primaryBg}};padding:18px 45px;border-radius:50px;box-shadow:0 12px 30px rgba(0,0,0,0.2);"><span style="font:bold 18px Arial;color:white;text-transform:uppercase;letter-spacing:1px;">{{primaryText}}</span></div><div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);padding:18px 45px;border-radius:50px;border:2px solid rgba(255,255,255,0.3);"><span style="font:bold 18px Arial;color:white;text-transform:uppercase;letter-spacing:1px;">{{secondaryText}}</span></div></div>`,
    variables: {
      primaryText: 'Get Started',
      secondaryText: 'Learn More',
      primaryBg: '#FF6B35'
    },
    metadata: { moods: ['corporate'], purpose: ['awareness', 'conversion'], density: 'low', tags: ['button', 'cta', 'dual', 'choice'] },
    compatibleEffects: ['highlight']
  },
  {
    id: 'cta-badge-announcement',
    name: 'Announcement Badge',
    category: 'badge',
    height: 80,
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><div style="background:{{badgeBg}};padding:16px 45px;border-radius:50px;box-shadow:0 10px 25px rgba(0,0,0,0.2);"><span style="font:bold 16px Arial;color:white;text-transform:uppercase;letter-spacing:2px;">{{badgeText}}</span></div></div>`,
    variables: {
      badgeText: 'New Feature Available',
      badgeBg: '#1F2937'
    },
    metadata: { moods: ['trustworthy'], purpose: ['awareness'], density: 'low', tags: ['badge', 'announcement', 'label', 'tag'] },
    compatibleEffects: []
  }
];
