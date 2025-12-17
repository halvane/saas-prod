import { Section } from '../types';

export const IMAGE_SECTIONS: Section[] = [
  {
    id: 'image-full-width',
    name: 'Full Width Image',
    category: 'product',
    height: 400,
    html: `<div style="width:100%;height:100%;overflow:hidden;"><img src="{{imageUrl}}" style="width:100%;height:100%;object-fit:cover;"/></div>`,
    variables: {
      imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926'
    },
    metadata: { moods: ['energetic'], purpose: ['engagement'], density: 'high', tags: ['image', 'background', 'energetic', 'full-width'] },
    compatibleEffects: ['overlay', 'filter']
  },
  {
    id: 'image-centered-card',
    name: 'Centered Image Card',
    category: 'product',
    height: 350,
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:40px;"><div style="max-width:500px;border-radius:20px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.2);"><img src="{{imageUrl}}" style="width:100%;height:100%;object-fit:cover;"/></div></div>`,
    variables: {
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a873'
    },
    metadata: { moods: ['corporate', 'luxury'], purpose: ['engagement'], density: 'medium', tags: ['image', 'urgent', 'centered', 'card'] },
    compatibleEffects: ['shadow', 'border']
  },
  {
    id: 'image-split-layout',
    name: 'Split Image Layout',
    category: 'product',
    height: 400,
    html: `<div style="width:100%;height:100%;display:flex;gap:20px;padding:30px;"><div style="flex:1;border-radius:15px;overflow:hidden;"><img src="{{image1}}" style="width:100%;height:100%;object-fit:cover;"/></div><div style="flex:1;border-radius:15px;overflow:hidden;"><img src="{{image2}}" style="width:100%;height:100%;object-fit:cover;"/></div></div>`,
    variables: {
      image1: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a873',
      image2: 'https://images.unsplash.com/photo-1557683316-973673baf926'
    },
    metadata: { moods: ['minimalist', 'calm'], purpose: ['engagement'], density: 'high', tags: ['image', 'split', 'layout', 'comparison'] },
    compatibleEffects: []
  }
];
