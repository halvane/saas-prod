import { Section } from '../types';

export const TIMELINE_SECTIONS: Section[] = [
  {
    id: 'timeline-three-step',
    name: 'Three Step Timeline',
    category: 'timeline',
    height: 250,
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:40px 60px;"><div style="display:flex;gap:40px;align-items:center;max-width:900px;"><div style="flex:1;text-align:center;"><div style="width:60px;height:60px;border-radius:50%;background:{{accentColor}};color:white;display:flex;align-items:center;justify-content:center;margin:0 auto 20px auto;font:black 32px Impact;">1</div><h4 style="font:bold 22px Arial;color:{{titleColor}};margin:0 0 12px 0;">{{step1Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.6;">{{step1Text}}</p></div><div style="width:80px;height:4px;background:{{accentColor}};margin-top:-60px;"></div><div style="flex:1;text-align:center;"><div style="width:60px;height:60px;border-radius:50%;background:{{accentColor}};color:white;display:flex;align-items:center;justify-content:center;margin:0 auto 20px auto;font:black 32px Impact;">2</div><h4 style="font:bold 22px Arial;color:{{titleColor}};margin:0 0 12px 0;">{{step2Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.6;">{{step2Text}}</p></div><div style="width:80px;height:4px;background:{{accentColor}};margin-top:-60px;"></div><div style="flex:1;text-align:center;"><div style="width:60px;height:60px;border-radius:50%;background:{{accentColor}};color:white;display:flex;align-items:center;justify-content:center;margin:0 auto 20px auto;font:black 32px Impact;">3</div><h4 style="font:bold 22px Arial;color:{{titleColor}};margin:0 0 12px 0;">{{step3Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.6;">{{step3Text}}</p></div></div></div>`,
    variables: {
      step1Title: 'Step One',
      step1Text: 'Begin your journey',
      step2Title: 'Step Two',
      step2Text: 'Take action',
      step3Title: 'Step Three',
      step3Text: 'Achieve results',
      accentColor: '#FF6B35',
      titleColor: '#1F2937',
      textColor: '#6B7280'
    },
    metadata: { moods: ['corporate', 'energetic'], purpose: ['engagement'], density: 'high', tags: ['timeline', 'process', 'steps', 'workflow'] },
    compatibleEffects: []
  },
  {
    id: 'timeline-vertical',
    name: 'Vertical Timeline',
    category: 'timeline',
    height: 280,
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:40px 80px;"><div style="position:relative;padding-left:40px;"><div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:{{lineColor}};"></div><div style="margin-bottom:35px;position:relative;"><div style="position:absolute;left:-50px;top:5px;width:20px;height:20px;border-radius:50%;background:{{accentColor}};"></div><h4 style="font:bold 24px Arial;color:{{titleColor}};margin:0 0 10px 0;">{{event1Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0 0 8px 0;line-height:1.6;">{{event1Text}}</p><span style="font:bold 14px Arial;color:{{accentColor}};text-transform:uppercase;letter-spacing:1px;">{{event1Date}}</span></div><div style="margin-bottom:35px;position:relative;"><div style="position:absolute;left:-50px;top:5px;width:20px;height:20px;border-radius:50%;background:{{accentColor}};"></div><h4 style="font:bold 24px Arial;color:{{titleColor}};margin:0 0 10px 0;">{{event2Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0 0 8px 0;line-height:1.6;">{{event2Text}}</p><span style="font:bold 14px Arial;color:{{accentColor}};text-transform:uppercase;letter-spacing:1px;">{{event2Date}}</span></div><div style="position:relative;"><div style="position:absolute;left:-50px;top:5px;width:20px;height:20px;border-radius:50%;background:{{accentColor}};"></div><h4 style="font:bold 24px Arial;color:{{titleColor}};margin:0 0 10px 0;">{{event3Title}}</h4><p style="font:16px Arial;color:{{textColor}};margin:0 0 8px 0;line-height:1.6;">{{event3Text}}</p><span style="font:bold 14px Arial;color:{{accentColor}};text-transform:uppercase;letter-spacing:1px;">{{event3Date}}</span></div></div></div>`,
    variables: {
      event1Title: 'Launch',
      event1Text: 'Product released to market',
      event1Date: 'Jan 2024',
      event2Title: 'Growth',
      event2Text: 'Reached 10K users',
      event2Date: 'Mar 2024',
      event3Title: 'Expansion',
      event3Text: 'International markets',
      event3Date: 'Jun 2024',
      accentColor: '#FF6B35',
      titleColor: '#1F2937',
      textColor: '#6B7280',
      lineColor: 'rgba(255,107,53,0.3)'
    },
    metadata: { moods: ['corporate', 'trustworthy'], purpose: ['engagement'], density: 'high', tags: ['timeline', 'history', 'milestones', 'events'] },
    compatibleEffects: []
  }
];
