import { Section } from '../types';

export const TEXT_SECTIONS: Section[] = [
  {
    id: 'text-description-block',
    name: 'Description Text Block',
    category: 'text',
    height: 150,
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:40px 80px;"><div style="text-align:center;"><h2 style="font:bold 36px Arial;color:{{titleColor}};margin:0 0 20px 0;letter-spacing:1px;">{{blockTitle}}</h2><p style="font:20px Arial;color:{{textColor}};margin:0;line-height:1.7;max-width:700px;">{{blockText}}</p></div></div>`,
    variables: {
      blockTitle: 'Why Choose Us',
      blockText: 'Describe the value proposition, benefits, or key features in a clear and compelling way.',
      titleColor: '#1F2937',
      textColor: '#6B7280'
    },
    metadata: { moods: ['trustworthy'], purpose: ['engagement'], density: 'medium', tags: ['text', 'description', 'body', 'engagement'] },
    compatibleEffects: []
  },
  {
    id: 'text-three-column',
    name: 'Three Column Feature Text',
    category: 'text',
    height: 200,
    html: `<div style="width:100%;height:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:40px;padding:40px 60px;align-items:center;"><div style="text-align:center;"><h3 style="font:bold 28px Arial;color:{{accentColor}};margin:0 0 15px 0;">{{feature1Title}}</h3><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.6;">{{feature1Text}}</p></div><div style="text-align:center;"><h3 style="font:bold 28px Arial;color:{{accentColor}};margin:0 0 15px 0;">{{feature2Title}}</h3><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.6;">{{feature2Text}}</p></div><div style="text-align:center;"><h3 style="font:bold 28px Arial;color:{{accentColor}};margin:0 0 15px 0;">{{feature3Title}}</h3><p style="font:16px Arial;color:{{textColor}};margin:0;line-height:1.6;">{{feature3Text}}</p></div></div>`,
    variables: {
      feature1Title: 'Feature One',
      feature1Text: 'Description of first benefit',
      feature2Title: 'Feature Two',
      feature2Text: 'Description of second benefit',
      feature3Title: 'Feature Three',
      feature3Text: 'Description of third benefit',
      accentColor: '#FF6B35',
      textColor: '#6B7280'
    },
    metadata: { moods: ['corporate', 'minimalist'], purpose: ['engagement'], density: 'high', tags: ['text', 'features', 'benefits', 'columns'] },
    compatibleEffects: []
  },
  {
    id: 'text-quote-prominent',
    name: 'Prominent Quote',
    category: 'text',
    height: 200,
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:60px 100px;text-align:center;"><div><p style="font:italic 32px Georgia,serif;color:{{quoteColor}};margin:0 0 25px 0;line-height:1.7;max-width:800px;\">"{{quoteText}}"</p><p style="font:bold 18px Arial;color:{{authorColor}};margin:0;text-transform:uppercase;letter-spacing:1px;">— {{authorName}}</p></div></div>`,
    variables: {
      quoteText: 'This is an inspiring quote that captures the essence of your message.',
      authorName: 'Author Name',
      quoteColor: '#1F2937',
      authorColor: '#FF6B35'
    },
    metadata: { moods: ['trustworthy', 'calm'], purpose: ['engagement', 'engagement'], density: 'low', tags: ['text', 'quote', 'testimonial', 'social-proof'] },
    compatibleEffects: []
  }
];
