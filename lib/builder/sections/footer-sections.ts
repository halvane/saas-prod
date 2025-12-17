import { Section } from '../types';

export const FOOTER_SECTIONS: Section[] = [
  {
    id: 'footer-contact-simple',
    name: 'Simple Contact Footer',
    category: 'footer',
    height: 120,
    html: `<div style="width:100%;height:100%;background:{{bgColor}};padding:30px 60px;display:flex;align-items:center;justify-content:space-between;border-top:2px solid {{borderColor}};"><div><p style="font:16px Arial;color:{{textColor}};margin:0;">{{companyName}}</p><p style="font:14px Arial;color:{{subtextColor}};margin:5px 0 0 0;">{{tagline}}</p></div><div style="text-align:right;"><p style="font:14px Arial;color:{{textColor}};margin:0;">{{contactInfo}}</p><p style="font:14px Arial;color:{{subtextColor}};margin:5px 0 0 0;">{{website}}</p></div></div>`,
    variables: {
      companyName: 'Your Company',
      tagline: 'Building amazing experiences',
      contactInfo: '+1 (555) 123-4567',
      website: 'www.yoursite.com',
      bgColor: '#F3F4F6',
      borderColor: '#E5E7EB',
      textColor: '#1F2937',
      subtextColor: '#6B7280'
    },
    metadata: { moods: ['corporate'], purpose: ['engagement'], density: 'low', tags: ['footer', 'contact', 'engagement', 'simple'] },
    compatibleEffects: []
  },
  {
    id: 'footer-social-links',
    name: 'Social Links Footer',
    category: 'footer',
    height: 100,
    html: `<div style="width:100%;height:100%;background:{{bgColor}};padding:30px 60px;display:flex;align-items:center;justify-content:center;gap:30px;border-top:1px solid {{borderColor}};"><a style="font:14px Arial;color:{{linkColor}};text-decoration:none;text-transform:uppercase;letter-spacing:1px;transition:color 0.3s;">{{social1}}</a><a style="font:14px Arial;color:{{linkColor}};text-decoration:none;text-transform:uppercase;letter-spacing:1px;transition:color 0.3s;">{{social2}}</a><a style="font:14px Arial;color:{{linkColor}};text-decoration:none;text-transform:uppercase;letter-spacing:1px;transition:color 0.3s;">{{social3}}</a><a style="font:14px Arial;color:{{linkColor}};text-decoration:none;text-transform:uppercase;letter-spacing:1px;transition:color 0.3s;">{{social4}}</a></div>`,
    variables: {
      social1: 'Instagram',
      social2: 'Twitter',
      social3: 'LinkedIn',
      social4: 'Facebook',
      bgColor: '#1F2937',
      borderColor: '#374151',
      linkColor: '#E5E7EB'
    },
    metadata: { moods: ['energetic', 'playful'], purpose: ['engagement'], density: 'low', tags: ['footer', 'social', 'links', 'follow'] },
    compatibleEffects: []
  },
  {
    id: 'footer-newsletter',
    name: 'Newsletter Signup Footer',
    category: 'footer',
    height: 140,
    html: `<div style="width:100%;height:100%;background:linear-gradient(135deg,{{gradientStart}} 0%,{{gradientEnd}} 100%);padding:40px 60px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;"><h3 style="font:bold 22px Arial;color:white;margin:0;text-align:center;">{{newsletterTitle}}</h3><div style="display:flex;gap:10px;width:100%;max-width:500px;"><input type="email" placeholder="{{placeholder}}" style="flex:1;padding:15px 20px;border:none;border-radius:5px;font:14px Arial;"/><button style="background:white;color:{{gradientStart}};padding:15px 30px;border-radius:5px;border:none;font:bold 14px Arial;cursor:pointer;text-transform:uppercase;letter-spacing:1px;">{{buttonText}}</button></div></div>`,
    variables: {
      newsletterTitle: 'Subscribe to our newsletter',
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
      gradientStart: '#FF6B35',
      gradientEnd: '#FF8C42'
    },
    metadata: { moods: ['urgent', 'energetic'], purpose: ['conversion'], density: 'medium', tags: ['footer', 'newsletter', 'subscription', 'email'] },
    compatibleEffects: []
  }
];
