import { Section } from '../types';

export const COMPARISON_SECTIONS: Section[] = [
  {
    id: 'comparison-before-after',
    name: 'Before & After Comparison',
    category: 'comparison',
    height: 300,
    html: `<div style="width:100%;height:100%;display:grid;grid-template-columns:1fr 1fr;gap:0;"><div style="background:{{beforeBackground}};padding:50px 60px;display:flex;flex-direction:column;justify-content:center;border-right:3px solid {{dividerColor}};"><div style="text-align:center;margin-bottom:25px;"><span style="font:bold 16px Arial;color:{{beforeLabelColor}};background:{{beforeBadgeBackground}};padding:8px 20px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;">Before</span></div><h3 style="font:bold 32px Arial;color:{{beforeTextColor}};margin:0 0 18px 0;text-align:center;">{{beforeTitle}}</h3><ul style="list-style:none;padding:0;margin:0;"><li style="font:18px Arial;color:{{beforeTextColor}};margin-bottom:12px;padding-left:30px;position:relative;"><span style="position:absolute;left:0;color:{{beforeIconColor}};font-size:24px;">✗</span>{{beforePoint1}}</li><li style="font:18px Arial;color:{{beforeTextColor}};margin-bottom:12px;padding-left:30px;position:relative;"><span style="position:absolute;left:0;color:{{beforeIconColor}};font-size:24px;">✗</span>{{beforePoint2}}</li><li style="font:18px Arial;color:{{beforeTextColor}};padding-left:30px;position:relative;"><span style="position:absolute;left:0;color:{{beforeIconColor}};font-size:24px;">✗</span>{{beforePoint3}}</li></ul></div><div style="background:{{afterBackground}};padding:50px 60px;display:flex;flex-direction:column;justify-content:center;"><div style="text-align:center;margin-bottom:25px;"><span style="font:bold 16px Arial;color:{{afterLabelColor}};background:{{afterBadgeBackground}};padding:8px 20px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;">After</span></div><h3 style="font:bold 32px Arial;color:{{afterTextColor}};margin:0 0 18px 0;text-align:center;">{{afterTitle}}</h3><ul style="list-style:none;padding:0;margin:0;"><li style="font:18px Arial;color:{{afterTextColor}};margin-bottom:12px;padding-left:30px;position:relative;"><span style="position:absolute;left:0;color:{{afterIconColor}};font-size:24px;">✓</span>{{afterPoint1}}</li><li style="font:18px Arial;color:{{afterTextColor}};margin-bottom:12px;padding-left:30px;position:relative;"><span style="position:absolute;left:0;color:{{afterIconColor}};font-size:24px;">✓</span>{{afterPoint2}}</li><li style="font:18px Arial;color:{{afterTextColor}};padding-left:30px;position:relative;"><span style="position:absolute;left:0;color:{{afterIconColor}};font-size:24px;">✓</span>{{afterPoint3}}</li></ul></div></div>`,
    variables: {
      beforeTitle: 'The Old Way',
      beforePoint1: 'Manual processes',
      beforePoint2: 'Wasted time',
      beforePoint3: 'Limited results',
      afterTitle: 'The New Way',
      afterPoint1: 'Automated workflow',
      afterPoint2: 'Save hours daily',
      afterPoint3: 'Maximum impact',
      beforeBackground: 'rgba(239,68,68,0.05)',
      afterBackground: 'rgba(34,197,94,0.05)',
      beforeTextColor: '#DC2626',
      afterTextColor: '#16A34A',
      beforeIconColor: '#EF4444',
      afterIconColor: '#22C55E',
      beforeLabelColor: '#991B1B',
      afterLabelColor: '#14532D',
      beforeBadgeBackground: 'rgba(239,68,68,0.15)',
      afterBadgeBackground: 'rgba(34,197,94,0.15)',
      dividerColor: 'rgba(107,114,128,0.2)'
    },
    metadata: { moods: ['energetic', 'trustworthy'], purpose: ['engagement'], density: 'high', tags: ['comparison', 'before-after', 'transformation', 'results'] },
    compatibleEffects: []
  },
  {
    id: 'comparison-vs-table',
    name: 'VS Comparison Table',
    category: 'comparison',
    height: 280,
    html: `<div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;padding:40px 80px;"><div style="display:grid;grid-template-columns:1fr auto 1fr;gap:30px;align-items:center;"><div style="text-align:right;"><h3 style="font:bold 36px Arial;color:{{competitorColor}};margin:0 0 20px 0;">{{competitorName}}</h3><p style="font:18px Arial;color:{{textColor}};margin:0 0 12px 0;">{{competitorFeature1}}</p><p style="font:18px Arial;color:{{textColor}};margin:0 0 12px 0;">{{competitorFeature2}}</p><p style="font:18px Arial;color:{{textColor}};margin:0;">{{competitorFeature3}}</p></div><div style="text-align:center;"><div style="width:80px;height:80px;border-radius:50%;background:{{vsBackground}};display:flex;align-items:center;justify-content:center;"><span style="font:black 40px Impact;color:{{vsColor}};">VS</span></div></div><div style="text-align:left;"><h3 style="font:bold 36px Arial;color:{{brandColor}};margin:0 0 20px 0;">{{brandName}}</h3><p style="font:18px Arial;color:{{textColor}};margin:0 0 12px 0;">{{brandFeature1}}</p><p style="font:18px Arial;color:{{textColor}};margin:0 0 12px 0;">{{brandFeature2}}</p><p style="font:18px Arial;color:{{textColor}};margin:0;">{{brandFeature3}}</p></div></div></div>`,
    variables: {
      competitorName: 'Others',
      competitorFeature1: 'Basic features',
      competitorFeature2: 'Limited support',
      competitorFeature3: 'Higher price',
      brandName: 'Us',
      brandFeature1: 'Advanced features',
      brandFeature2: '24/7 support',
      brandFeature3: 'Better value',
      competitorColor: '#6B7280',
      brandColor: '#FF6B35',
      textColor: '#1F2937',
      vsColor: '#FFFFFF',
      vsBackground: '#FF6B35'
    },
    metadata: { moods: ['energetic', 'corporate'], purpose: ['engagement'], density: 'medium', tags: ['comparison', 'vs', 'competitor', 'features'] },
    compatibleEffects: []
  }
];
