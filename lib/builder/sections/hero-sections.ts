import { Section } from '../types';

export const HERO_SECTIONS: Section[] = [
  {
    id: 'hero-title-accent',
    name: 'Hero Title with Accent',
    category: 'hero',
    height: 300,
    html: `<div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:0 60px;text-align:center;position:relative;"><div style="margin-bottom:20px;"><svg width="60" height="4" style="margin:0 auto;"><rect width="60" height="4" fill="{{accentColor}}"/></svg></div><h1 style="font:black 72px Impact;color:white;margin:0 0 25px 0;text-transform:uppercase;letter-spacing:3px;line-height:1.1;">{{mainTitle}}</h1><p style="font:24px Arial;color:{{subtitleColor}};margin:0;line-height:1.6;max-width:800px;">{{subtitle}}</p></div>`,
    variables: {
      mainTitle: 'Your Headline Here',
      subtitle: 'Supporting text to engage your audience',
      accentColor: '#FF6B35',
      subtitleColor: '#E8E8E8'
    },
    metadata: { moods: ['energetic', 'corporate'], purpose: ['awareness'], density: 'low', tags: ['title', 'hero', 'typography', 'statement'] },
    compatibleEffects: []
  },
  {
    id: 'hero-image-overlay',
    name: 'Hero Image with Text Overlay',
    category: 'hero',
    height: 600,
    html: `<div style="width:100%;height:100%;position:relative;overflow:hidden;"><img src="{{heroImage}}" style="width:100%;height:100%;object-fit:cover;"/><div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.7) 100%);"></div><div style="position:absolute;bottom:60px;left:60px;right:60px;"><h2 style="font:bold 52px Georgia,serif;color:white;margin:0 0 20px 0;text-shadow:0 4px 15px rgba(0,0,0,0.5);">{{imageTitle}}</h2><p style="font:20px Arial;color:rgba(255,255,255,0.95);margin:0;max-width:600px;text-shadow:0 2px 8px rgba(0,0,0,0.5);">{{imageDescription}}</p></div></div>`,
    variables: {
      heroImage: 'https://images.unsplash.com/photo-1557683316-973673baf926',
      imageTitle: 'Stunning Imagery',
      imageDescription: 'Tell your story with powerful visuals'
    },
    metadata: { moods: ['energetic', 'trustworthy'], purpose: ['awareness'], density: 'high', tags: ['image', 'hero', 'background', 'energetic'] },
    compatibleEffects: ['overlay', 'filter']
  }
];
