import { Section } from '../types';

export const TESTIMONIALS: Section[] = [
  {
    id: 'testimonial-hotel-elegant',
    name: 'Hotel Review Elegant Beige',
    category: 'testimonial',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:{{bgColor}};position:relative;overflow:hidden;"><svg style="position:absolute;inset:0;opacity:0.04;"><defs><pattern id="lines" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 0 0 L 100 100 M 100 0 L 0 100" stroke="{{patternColor}}" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#lines)"/></svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px 100px;"><div style="background:white;padding:18px 50px;border-radius:50px;margin-bottom:50px;box-shadow:0 10px 25px rgba(0,0,0,0.1);"><span style="font:16px Arial;color:{{labelColor}};text-transform:uppercase;letter-spacing:2px;">{{label}}</span></div><h1 style="font:bold 56px Georgia,serif;color:{{titleColor}};margin:0 0 60px 0;text-align:center;">{{hotelName}}</h1><div style="background:white;border-radius:25px;padding:40px 50px;max-width:750px;box-shadow:0 20px 50px rgba(0,0,0,0.15);margin-bottom:40px;"><div style="display:flex;align-items:center;gap:20px;margin-bottom:25px;"><img src="{{reviewerImage}}" style="width:70px;height:70px;border-radius:50%;object-fit:cover;border:3px solid {{borderColor}};"/><div><h3 style="font:bold 20px Arial;color:{{nameColor}};margin:0 0 5px 0;">{{reviewerName}}</h3><p style="font:14px Arial;color:{{dateColor}};margin:0 0 8px 0;text-transform:uppercase;letter-spacing:1px;">{{date}}</p><div style="display:flex;gap:5px;">{{stars}}</div></div></div><p style="font:22px Georgia,serif;color:{{textColor}};line-height:1.7;margin:0;">{{reviewText}}</p></div></div></div>`,
    variables: {
      date: 'February 2024',
      label: 'Trip Review',
      stars: '★★★★☆',
      bgColor: '#F5F5DC',
      dateColor: '#8B7355',
      hotelName: '1211 Boutique Hotel',
      nameColor: '#4A4A4A',
      textColor: '#4A4A4A',
      labelColor: '#8B7355',
      reviewText: 'This hotel had so much character! The rooms were uniquely decorated, and the courtyard was a lovely place to unwind. I adored the quaint atmosphere.',
      titleColor: '#5D4E37',
      borderColor: '#D2B48C',
      patternColor: '#D2B48C',
      reviewerName: 'Lisa Taylor',
      reviewerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    metadata: { moods: ['luxury', 'calm'], purpose: ['engagement'], density: 'medium', tags: ['testimonial', 'hotel', 'review'] },
    compatibleEffects: []
  },
  {
    id: 'testimonial-hotel-luxury',
    name: 'Hotel Review with Photo',
    category: 'testimonial',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:linear-gradient(135deg,{{gradientStart}} 0%,{{gradientEnd}} 100%);position:relative;overflow:hidden;"><svg style="position:absolute;inset:0;opacity:0.08;"><defs><pattern id="waves" width="200" height="100" patternUnits="userSpaceOnUse"><path d="M 0 50 Q 50 20 100 50 T 200 50" stroke="white" stroke-width="3" fill="none"/></pattern></defs><rect width="100%" height="100%" fill="url(#waves)"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:100px;"><div style="background:white;border-radius:25px;padding:0;max-width:900px;box-shadow:0 30px 80px rgba(0,0,0,0.3);overflow:hidden;display:flex;gap:0;"><div style="width:400px;height:600px;flex-shrink:0;"><img src="{{propertyImage}}" style="width:100%;height:100%;object-fit:cover;"/></div><div style="padding:50px 45px;flex:1;display:flex;flex-direction:column;justify-content:center;"><div style="display:flex;align-items:center;gap:15px;margin-bottom:30px;"><img src="{{reviewerImage}}" style="width:70px;height:70px;border-radius:50%;object-fit:cover;border:3px solid {{borderColor}};"/><div><h3 style="font:bold 20px Arial;color:{{nameColor}};margin:0 0 8px 0;">{{reviewerName}}</h3><div style="display:flex;gap:5px;">{{stars}}</div></div></div><h2 style="font:black 32px Impact;color:{{titleColor}};margin:0 0 25px 0;text-transform:uppercase;letter-spacing:1px;">{{title}}</h2><p style="font:20px Georgia,serif;color:{{textColor}};line-height:1.7;margin:0 0 30px 0;">{{reviewText}}</p><p style="font:16px Arial;color:{{dateColor}};margin:0;text-transform:uppercase;letter-spacing:1px;">{{date}}</p></div></div></div></div>`,
    variables: {
      date: 'February 2024',
      stars: '★★★★☆',
      title: 'An Oasis of Luxury',
      dateColor: '#6B7280',
      nameColor: '#1F2937',
      textColor: '#374151',
      reviewText: 'From the moment I stepped into this hotel, I felt like royalty. The attention to detail, the exquisite decor, and the attentive staff made my stay truly special.',
      titleColor: '#0C4A6E',
      borderColor: '#0EA5E9',
      gradientEnd: '#BAE6FD',
      reviewerName: 'Amanda Langdon',
      gradientStart: '#E0F2FE',
      propertyImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      reviewerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    },
    metadata: { moods: ['luxurious', 'impressive'], purpose: ['engagement'], density: 'medium', tags: ['testimonial', 'hotel', 'luxury'] },
    compatibleEffects: []
  },
  {
    id: 'testimonial-hotel-minimal',
    name: 'Hotel Review Minimal Beige',
    category: 'testimonial',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:{{bgColor}};position:relative;overflow:hidden;"><svg style="position:absolute;inset:0;opacity:0.03;"><defs><pattern id="texture" width="200" height="200" patternUnits="userSpaceOnUse"><circle cx="100" cy="100" r="80" stroke="{{patternColor}}" stroke-width="2" fill="none"/><circle cx="100" cy="100" r="60" stroke="{{patternColor}}" stroke-width="2" fill="none"/></pattern></defs><rect width="100%" height="100%" fill="url(#texture)"/></svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px 100px;"><div style="background:{{headerBg}};padding:18px 50px;border-radius:50px;margin-bottom:50px;box-shadow:0 10px 25px rgba(0,0,0,0.1);"><span style="font:bold 18px Arial;color:{{headerColor}};text-transform:uppercase;letter-spacing:2px;">{{header}}</span></div><div style="background:white;border-radius:25px;padding:60px 50px;max-width:750px;box-shadow:0 20px 50px rgba(0,0,0,0.15);margin-bottom:50px;"><p style="font:16px Arial;color:{{dateColor}};margin:0 0 25px 0;text-transform:uppercase;letter-spacing:1px;">{{date}}</p><p style="font:24px Georgia,serif;color:{{textColor}};line-height:1.7;margin:0;">{{reviewText}}</p></div><div style="display:flex;align-items:center;gap:20px;background:white;padding:25px 40px;border-radius:50px;box-shadow:0 15px 35px rgba(0,0,0,0.15);"><svg width="60" height="60" style="background:{{iconBg}};border-radius:50%;padding:15px;"><circle cx="15" cy="15" r="12" fill="{{iconColor}}"/></svg><div><h3 style="font:bold 22px Arial;color:{{nameColor}};margin:0 0 8px 0;">{{reviewerName}}</h3><div style="display:flex;gap:5px;">{{stars}}</div></div></div></div></div>`,
    variables: {
      date: 'February 2024',
      stars: '★★★★☆',
      header: 'A Home Away From Home',
      iconBg: '#8B7355',
      bgColor: '#F5F5DC',
      headerBg: '#8B7355',
      dateColor: '#8B7355',
      iconColor: '#FFFFFF',
      nameColor: '#4A4A4A',
      textColor: '#4A4A4A',
      reviewText: 'I stay at this hotel whenever I\'m in town for work, and it never disappoints. The cozy ambiance and friendly staff make me feel like I\'m visiting old friends.',
      headerColor: '#FFFFFF',
      patternColor: '#D2B48C',
      reviewerName: 'Margaret Johnson'
    },
    metadata: { moods: ['calm', 'welcoming'], purpose: ['engagement'], density: 'low', tags: ['testimonial', 'hotel', 'minimal'] },
    compatibleEffects: []
  }
];
