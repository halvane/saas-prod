import type { CustomTemplate } from '../types';

export const DEMO_TEMPLATES_FALLBACK: CustomTemplate[] = [
  {
    id: 'demo-1',
    name: 'Instagram Post - Promo',
    description: 'Template Instagram pour promotions',
    category: 'instagram',
    platform: ['instagram'],
    width: 1080,
    height: 1080,
    htmlTemplate: `<div class="container">
  <div class="header">{{brandName}}</div>
  <div class="hero-image">
    <img src="{{mainImage}}" alt="Product" />
  </div>
  <div class="promo-badge">{{discount}}</div>
  <h1 class="title">{{title}}</h1>
  <p class="description">{{description}}</p>
  <div class="cta-button">{{ctaText}}</div>
</div>`,
    cssTemplate: `.container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, {{primaryColor}} 0%, {{secondaryColor}} 100%);
  display: flex;
  flex-direction: column;
  padding: 40px;
  font-family: 'Arial', sans-serif;
}`,
    variables: {
      brandName: { type: 'text', label: 'Nom de Marque', default: 'MA MARQUE' },
      mainImage: { type: 'image', label: 'Image Principale', default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' },
      discount: { type: 'text', label: 'Réduction', default: '-50%' },
      title: { type: 'text', label: 'Titre', default: 'SOLDES D\'ÉTÉ' },
      description: { type: 'text', label: 'Description', default: 'Profitez de réductions exceptionnelles' },
      ctaText: { type: 'text', label: 'Texte CTA', default: 'ACHETER MAINTENANT' },
      primaryColor: { type: 'color', label: 'Couleur Principale', default: '#667eea' },
      secondaryColor: { type: 'color', label: 'Couleur Secondaire', default: '#764ba2' }
    },
    tags: ['instagram', 'promo', 'sale'],
    isActive: true,
    isPublic: true,
    usageCount: 45
  },
];
