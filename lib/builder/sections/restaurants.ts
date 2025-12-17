import { Section } from '../types';

export const RESTAURANTS: Section[] = [
  {
    id: 'restaurant-lunch-grid',
    name: 'Restaurant Lunch Special Grid',
    category: 'restaurant',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:{{bgColor}};position:relative;overflow:hidden;"><div style="position:absolute;inset:0;display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,1fr);gap:0;transform:rotate(45deg) scale(1.5);"><div style="clip-path:polygon(0 0,100% 0,100% 100%,0 100%);overflow:hidden;"><img src="{{dish1}}" style="width:100%;height:100%;object-fit:cover;transform:rotate(-45deg) scale(1.5);"/></div><div style="background:{{accentColor}};clip-path:polygon(0 0,100% 0,100% 100%,0 100%);"></div><div style="background:{{accentColor}};clip-path:polygon(0 0,100% 0,100% 100%,0 100%);"></div><div style="clip-path:polygon(0 0,100% 0,100% 100%,0 100%);overflow:hidden;"><img src="{{dish2}}" style="width:100%;height:100%;object-fit:cover;transform:rotate(-45deg) scale(1.5);"/></div></div><div style="position:absolute;top:0;left:0;width:450px;height:100%;clip-path:polygon(0 0,100% 0,50% 100%,0 100%);overflow:hidden;"><img src="{{dish3}}" style="width:100%;height:100%;object-fit:cover;"/></div><div style="position:absolute;top:0;right:0;width:450px;height:100%;clip-path:polygon(50% 0,100% 0,100% 100%,0 100%);overflow:hidden;"><img src="{{dish4}}" style="width:100%;height:100%;object-fit:cover;"/></div><div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,0.4) 50%,rgba(0,0,0,0) 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100px;text-align:center;"><div style="background:rgba(255,255,255,0.95);backdrop-filter:blur(15px);padding:50px 60px;border-radius:25px;box-shadow:0 30px 80px rgba(0,0,0,0.4);"><p style="font:16px Arial;color:{{labelColor}};margin:0 0 20px 0;text-transform:uppercase;letter-spacing:2px;">{{restaurantName}}</p><h1 style="font:black 76px Impact;color:{{accentColor}};margin:0 0 20px 0;text-transform:uppercase;letter-spacing:4px;">{{title}}</h1><p style="font:24px Georgia,serif;color:{{descColor}};margin:0 0 30px 0;line-height:1.5;">{{description}}</p><div style="background:{{accentColor}};padding:18px 50px;border-radius:50px;display:inline-block;box-shadow:0 15px 40px rgba(0,0,0,0.3);"><span style="font:bold 18px Arial;color:white;text-transform:uppercase;letter-spacing:2px;">{{ctaText}}</span></div></div></div></div>`,
    variables: {
      dish1: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
      dish2: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
      dish3: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9',
      dish4: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      title: 'Lunch Treat',
      bgColor: '#FEF3C7',
      ctaText: 'Order Now',
      descColor: '#92400E',
      labelColor: '#78350F',
      accentColor: '#FF6B35',
      description: 'Experience bliss in every bite and sip. Avail our Family Platters for $20 only!',
      restaurantName: 'The Orange Water Cafe'
    },
    metadata: { moods: ['urgent', 'fun'], purpose: ['conversion'], density: 'high', tags: ['restaurant', 'lunch', 'food'] },
    compatibleEffects: []
  },
  {
    id: 'restaurant-breakfast',
    name: 'Restaurant Breakfast Special',
    category: 'restaurant',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:{{bgColor}};position:relative;overflow:hidden;"><svg style="position:absolute;bottom:-100px;left:-100px;width:500px;height:500px;opacity:0.08;"><path d="M 250 0 Q 500 125 500 250 Q 375 500 250 500 Q 0 375 0 250 Q 125 0 250 0 Z" fill="{{shape1Color}}"/></svg><svg style="position:absolute;top:-80px;right:-80px;width:400px;height:400px;opacity:0.08;"><circle cx="200" cy="200" r="180" fill="{{shape2Color}}"/></svg><div style="position:absolute;top:80px;left:50%;transform:translateX(-50%);background:{{badgeBg}};padding:16px 50px;border-radius:50px;box-shadow:0 10px 25px rgba(0,0,0,0.15);"><span style="font:16px Arial;color:{{badgeColor}};text-transform:uppercase;letter-spacing:2px;">{{restaurantName}}</span></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100px;text-align:center;"><div style="width:600px;height:400px;border-radius:25px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,0.3);margin-bottom:50px;border:8px solid white;"><img src="{{dishImage}}" style="width:100%;height:100%;object-fit:cover;"/></div><h1 style="font:black 68px Impact;color:{{titleColor}};margin:0 0 20px 0;text-transform:uppercase;letter-spacing:2px;">{{dishName}}</h1><p style="font:24px Georgia,serif;color:{{descColor}};margin:0;line-height:1.5;max-width:700px;">{{description}}</p></div></div>`,
    variables: {
      badgeBg: '#D97706',
      bgColor: '#FEF3C7',
      dishName: 'The Breakfast Sunrise Platter',
      descColor: '#78350F',
      dishImage: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666',
      badgeColor: '#FFFFFF',
      titleColor: '#92400E',
      description: 'Join us every Sunday, where good food and friendly service come together to create a delightful experience',
      shape1Color: '#D97706',
      shape2Color: '#F59E0B',
      restaurantName: 'Morningside Cafe'
    },
    metadata: { moods: ['calm', 'inviting'], purpose: ['engagement'], density: 'medium', tags: ['restaurant', 'breakfast', 'food'] },
    compatibleEffects: []
  },
  {
    id: 'restaurant-friday-special',
    name: 'Restaurant Friday Special',
    category: 'restaurant',
    height: 1080,
    html: `<div style="width:100%;height:100%;background:{{bgColor}};position:relative;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;width:100%;height:55%;background:{{bottomColor}};clip-path:polygon(0 15%,100% 0,100% 100%,0 100%);"></div><svg style="position:absolute;bottom:50px;right:50px;width:250px;height:250px;opacity:0.15;"><path d="M 125 0 L 175 75 L 125 150 L 75 75 Z M 0 125 L 75 175 L 150 125 L 75 75 Z" fill="{{accentColor}}"/></svg><div style="position:absolute;top:70px;left:50%;transform:translateX(-50%);text-align:center;"><p style="font:18px Arial;color:white;margin:0;letter-spacing:1px;">{{restaurantName}}</p></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100px;"><h1 style="font:black 72px Impact;color:{{titleColor}};margin:0 0 10px 0;text-transform:uppercase;letter-spacing:3px;text-align:center;">{{daySpecial}}</h1><h2 style="font:black 64px Impact;color:white;margin:0 0 50px 0;text-transform:uppercase;letter-spacing:2px;text-align:center;">{{dishName}}</h2><svg style="margin-bottom:40px;"><line x1="0" y1="5" x2="300" y2="5" stroke="{{accentColor}}" stroke-width="8"/></svg><div style="position:relative;width:600px;height:350px;margin-bottom:40px;"><img src="{{productImage}}" style="width:100%;height:100%;object-fit:cover;border-radius:15px;box-shadow:0 25px 60px rgba(0,0,0,0.4);"/><div style="position:absolute;top:-30px;right:-30px;width:140px;height:140px;background:white;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 15px 40px rgba(0,0,0,0.3);"><h3 style="font:black 20px Arial;color:{{priceColor}};margin:0 0 5px 0;text-transform:uppercase;">{{priceLabel}}</h3><p style="font:black 42px Impact;color:{{priceColor}};margin:0;">{{price}}</p></div></div><p style="font:bold 24px Arial;color:{{contactColor}};margin:0;text-align:center;letter-spacing:1px;">{{contactText}}</p></div></div>`,
    variables: {
      price: '$22',
      bgColor: '#2C2C2C',
      dishName: 'Ribeye Steak',
      daySpecial: 'Friday Special',
      priceColor: '#2C2C2C',
      priceLabel: 'Only',
      titleColor: '#F59E0B',
      accentColor: '#FCD34D',
      bottomColor: '#F59E0B',
      contactText: 'For reservations call or message +90 673 9485',
      contactColor: '#1F2937',
      productImage: 'https://images.unsplash.com/photo-1558030006-450675393462',
      restaurantName: 'The Baka Bar + Resto'
    },
    metadata: { moods: ['luxurious', 'inviting'], purpose: ['conversion'], density: 'high', tags: ['restaurant', 'special', 'food'] },
    compatibleEffects: []
  }
];
