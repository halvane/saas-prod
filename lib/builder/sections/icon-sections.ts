import { Section } from '../types';

export const ICON_SECTIONS: Section[] = [
  {
    id: 'icon-grid-four',
    name: 'Four Icon Grid',
    category: 'icon',
    height: 220,
    html: `<div style="width:100%;height:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:40px;padding:40px 80px;align-items:center;"><div style="text-align:center;"><div style="width:70px;height:70px;border-radius:50%;background:{{iconBackground}};display:flex;align-items:center;justify-content:center;margin:0 auto 20px auto;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="{{iconColor}}" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div><h4 style="font:bold 20px Arial;color:{{titleColor}};margin:0 0 10px 0;">{{icon1Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.5;">{{icon1Text}}</p></div><div style="text-align:center;"><div style="width:70px;height:70px;border-radius:50%;background:{{iconBackground}};display:flex;align-items:center;justify-content:center;margin:0 auto 20px auto;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="{{iconColor}}" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div><h4 style="font:bold 20px Arial;color:{{titleColor}};margin:0 0 10px 0;">{{icon2Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.5;">{{icon2Text}}</p></div><div style="text-align:center;"><div style="width:70px;height:70px;border-radius:50%;background:{{iconBackground}};display:flex;align-items:center;justify-content:center;margin:0 auto 20px auto;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="{{iconColor}}" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg></div><h4 style="font:bold 20px Arial;color:{{titleColor}};margin:0 0 10px 0;">{{icon3Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.5;">{{icon3Text}}</p></div><div style="text-align:center;"><div style="width:70px;height:70px;border-radius:50%;background:{{iconBackground}};display:flex;align-items:center;justify-content:center;margin:0 auto 20px auto;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="{{iconColor}}" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div><h4 style="font:bold 20px Arial;color:{{titleColor}};margin:0 0 10px 0;">{{icon4Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.5;">{{icon4Text}}</p></div></div>`,
    variables: {
      icon1Title: 'User Focused',
      icon1Text: 'Built for your needs',
      icon2Title: 'High Performance',
      icon2Text: 'Lightning fast results',
      icon3Title: 'Scalable',
      icon3Text: 'Grows with you',
      icon4Title: 'Reliable',
      icon4Text: 'Trust you can count on',
      iconBackground: 'rgba(255,107,53,0.1)',
      iconColor: '#FF6B35',
      titleColor: '#1F2937',
      textColor: '#6B7280'
    },
    metadata: { moods: ['corporate', 'minimalist'], purpose: ['engagement'], density: 'high', tags: ['icons', 'features', 'benefits', 'grid'] },
    compatibleEffects: []
  },
  {
    id: 'icon-list-vertical',
    name: 'Vertical Icon List',
    category: 'icon',
    height: 260,
    html: `<div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;padding:40px 100px;gap:28px;"><div style="display:flex;align-items:start;gap:25px;"><div style="width:50px;height:50px;border-radius:12px;background:{{iconBackground}};display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="{{iconColor}}" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div><div><h4 style="font:bold 22px Arial;color:{{titleColor}};margin:0 0 8px 0;">{{feature1Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.6;">{{feature1Text}}</p></div></div><div style="display:flex;align-items:start;gap:25px;"><div style="width:50px;height:50px;border-radius:12px;background:{{iconBackground}};display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="{{iconColor}}" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div><div><h4 style="font:bold 22px Arial;color:{{titleColor}};margin:0 0 8px 0;">{{feature2Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.6;">{{feature2Text}}</p></div></div><div style="display:flex;align-items:start;gap:25px;"><div style="width:50px;height:50px;border-radius:12px;background:{{iconBackground}};display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="{{iconColor}}" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div><div><h4 style="font:bold 22px Arial;color:{{titleColor}};margin:0 0 8px 0;">{{feature3Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.6;">{{feature3Text}}</p></div></div></div>`,
    variables: {
      feature1Title: 'Easy Setup',
      feature1Text: 'Get started in minutes with our simple onboarding',
      feature2Title: 'Powerful Features',
      feature2Text: 'Everything you need to succeed in one place',
      feature3Title: 'Expert Support',
      feature3Text: '24/7 assistance from our dedicated team',
      iconBackground: 'rgba(255,107,53,0.1)',
      iconColor: '#FF6B35',
      titleColor: '#1F2937',
      textColor: '#6B7280'
    },
    metadata: { moods: ['trustworthy', 'minimalist'], purpose: ['engagement'], density: 'medium', tags: ['icons', 'list', 'features', 'checklist'] },
    compatibleEffects: []
  }
];
