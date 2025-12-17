import { Section } from '../types';

export const STATS_SECTIONS: Section[] = [
  {
    id: 'stats-four-column',
    name: 'Four Column Statistics',
    category: 'stats',
    height: 180,
    html: `<div style="width:100%;height:100%;display:grid;grid-template-columns:repeat(4,1fr);gap:30px;padding:40px 60px;align-items:center;background:{{backgroundColor}};"><div style="text-align:center;"><h3 style="font:black 56px Impact;color:{{accentColor}};margin:0 0 10px 0;letter-spacing:1px;">{{stat1Value}}</h3><p style="font:bold 16px Arial;color:{{labelColor}};margin:0;text-transform:uppercase;letter-spacing:1px;">{{stat1Label}}</p></div><div style="text-align:center;"><h3 style="font:black 56px Impact;color:{{accentColor}};margin:0 0 10px 0;letter-spacing:1px;">{{stat2Value}}</h3><p style="font:bold 16px Arial;color:{{labelColor}};margin:0;text-transform:uppercase;letter-spacing:1px;">{{stat2Label}}</p></div><div style="text-align:center;"><h3 style="font:black 56px Impact;color:{{accentColor}};margin:0 0 10px 0;letter-spacing:1px;">{{stat3Value}}</h3><p style="font:bold 16px Arial;color:{{labelColor}};margin:0;text-transform:uppercase;letter-spacing:1px;">{{stat3Label}}</p></div><div style="text-align:center;"><h3 style="font:black 56px Impact;color:{{accentColor}};margin:0 0 10px 0;letter-spacing:1px;">{{stat4Value}}</h3><p style="font:bold 16px Arial;color:{{labelColor}};margin:0;text-transform:uppercase;letter-spacing:1px;">{{stat4Label}}</p></div></div>`,
    variables: {
      stat1Value: '10K+',
      stat1Label: 'Customers',
      stat2Value: '99%',
      stat2Label: 'Satisfaction',
      stat3Value: '24/7',
      stat3Label: 'Support',
      stat4Value: '150+',
      stat4Label: 'Countries',
      accentColor: '#FF6B35',
      labelColor: '#6B7280',
      backgroundColor: 'rgba(255,255,255,0.05)'
    },
    metadata: { moods: ['corporate', 'energetic'], purpose: ['engagement'], density: 'high', tags: ['stats', 'numbers', 'metrics', 'data'] },
    compatibleEffects: []
  },
  {
    id: 'stats-two-column-large',
    name: 'Two Column Large Stats',
    category: 'stats',
    height: 220,
    html: `<div style="width:100%;height:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:50px;padding:50px 100px;align-items:center;"><div style="text-align:center;border-right:2px solid {{borderColor}};padding-right:50px;"><h3 style="font:black 80px Impact;color:{{primaryColor}};margin:0 0 15px 0;letter-spacing:2px;">{{statLeftValue}}</h3><p style="font:bold 20px Arial;color:{{labelColor}};margin:0;text-transform:uppercase;letter-spacing:2px;">{{statLeftLabel}}</p></div><div style="text-align:center;padding-left:50px;"><h3 style="font:black 80px Impact;color:{{primaryColor}};margin:0 0 15px 0;letter-spacing:2px;">{{statRightValue}}</h3><p style="font:bold 20px Arial;color:{{labelColor}};margin:0;text-transform:uppercase;letter-spacing:2px;">{{statRightLabel}}</p></div></div>`,
    variables: {
      statLeftValue: '500K',
      statLeftLabel: 'Active Users',
      statRightValue: '98%',
      statRightLabel: 'Success Rate',
      primaryColor: '#1F2937',
      labelColor: '#FF6B35',
      borderColor: 'rgba(107,114,128,0.3)'
    },
    metadata: { moods: ['corporate', 'minimalist'], purpose: ['engagement'], density: 'medium', tags: ['stats', 'numbers', 'metrics', 'minimal'] },
    compatibleEffects: []
  },
  {
    id: 'stats-progress-bar',
    name: 'Stats with Progress Bars',
    category: 'stats',
    height: 240,
    html: `<div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;padding:40px 80px;gap:35px;"><div><div style="display:flex;justify-content:space-between;margin-bottom:12px;"><span style="font:bold 18px Arial;color:{{labelColor}};text-transform:uppercase;letter-spacing:1px;">{{metric1Name}}</span><span style="font:black 24px Impact;color:{{accentColor}};">{{metric1Value}}%</span></div><div style="width:100%;height:12px;background:{{barBackground}};border-radius:6px;overflow:hidden;"><div style="width:{{metric1Value}}%;height:100%;background:{{accentColor}};transition:width 1s ease;"></div></div></div><div><div style="display:flex;justify-content:space-between;margin-bottom:12px;"><span style="font:bold 18px Arial;color:{{labelColor}};text-transform:uppercase;letter-spacing:1px;">{{metric2Name}}</span><span style="font:black 24px Impact;color:{{accentColor}};">{{metric2Value}}%</span></div><div style="width:100%;height:12px;background:{{barBackground}};border-radius:6px;overflow:hidden;"><div style="width:{{metric2Value}}%;height:100%;background:{{accentColor}};transition:width 1s ease;"></div></div></div><div><div style="display:flex;justify-content:space-between;margin-bottom:12px;"><span style="font:bold 18px Arial;color:{{labelColor}};text-transform:uppercase;letter-spacing:1px;">{{metric3Name}}</span><span style="font:black 24px Impact;color:{{accentColor}};">{{metric3Value}}%</span></div><div style="width:100%;height:12px;background:{{barBackground}};border-radius:6px;overflow:hidden;"><div style="width:{{metric3Value}}%;height:100%;background:{{accentColor}};transition:width 1s ease;"></div></div></div></div>`,
    variables: {
      metric1Name: 'Performance',
      metric1Value: '95',
      metric2Name: 'Quality',
      metric2Value: '88',
      metric3Name: 'Delivery',
      metric3Value: '92',
      accentColor: '#FF6B35',
      labelColor: '#1F2937',
      barBackground: 'rgba(107,114,128,0.15)'
    },
    metadata: { moods: ['corporate', 'trustworthy'], purpose: ['engagement'], density: 'high', tags: ['stats', 'progress', 'metrics', 'data-viz'] },
    compatibleEffects: []
  }
];
