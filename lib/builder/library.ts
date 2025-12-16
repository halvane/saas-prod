export interface Section {
  id: string;
  name: string;
  category: 'header' | 'hero' | 'product' | 'footer' | 'overlay' | 'text' | 'badge';
  height: number; // Expected height in px
  html: string; // The HTML content (must use relative positioning or be adaptable)
  variables: Record<string, any>;
}

export const SECTIONS: Section[] = [
  // --- HEADERS ---
  {
    id: 'header-modern-nav',
    name: 'Modern Nav Header',
    category: 'header',
    height: 160,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:160px;display:flex;align-items:center;justify-content:space-between;padding:0 60px;z-index:10;background:linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)"><div style="font-size:32px;font-weight:900;color:var(--brand-secondary);text-transform:uppercase;letter-spacing:2px;text-shadow:0 2px 10px rgba(0,0,0,0.2)">{{brand_name}}</div><div style="display:flex;gap:30px"><div style="width:40px;height:2px;background:var(--brand-secondary)"></div><div style="width:30px;height:2px;background:var(--brand-secondary)"></div></div></div>`,
    variables: { brand_name: 'BRAND' }
  },
  {
    id: 'header-centered-logo',
    name: 'Centered Logo Header',
    category: 'header',
    height: 180,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10"><div style="width:80px;height:80px;background:var(--brand-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:15px;box-shadow:0 10px 20px rgba(0,0,0,0.1)"><span style="color:var(--brand-secondary);font-size:32px;font-weight:bold">B</span></div><div style="font-size:16px;font-weight:600;color:var(--brand-primary);letter-spacing:4px;text-transform:uppercase">{{tagline}}</div></div>`,
    variables: { tagline: 'EST. 2025' }
  },

  // --- HERO ---
  {
    id: 'hero-impact-overlay',
    name: 'Impact Hero Overlay',
    category: 'hero',
    height: 600,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:600px;z-index:5"><img src="{{hero_image}}" style="width:100%;height:100%;object-fit:cover"/><div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))"></div><div style="position:absolute;bottom:60px;left:60px;right:60px"><h1 style="margin:0 0 20px 0;color:#fff;font-size:90px;font-weight:900;line-height:0.9;text-transform:uppercase;font-family:var(--font-heading);text-shadow:0 10px 30px rgba(0,0,0,0.3)">{{headline}}</h1><div style="width:100px;height:6px;background:var(--brand-accent);margin-bottom:30px"></div><p style="color:rgba(255,255,255,0.9);font-size:28px;font-weight:400;max-width:600px;line-height:1.4">{{subheadline}}</p></div></div>`,
    variables: { 
      headline: 'UNLEASH POWER', 
      subheadline: 'Experience the next generation of performance.',
      hero_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
    }
  },
  {
    id: 'hero-split-modern',
    name: 'Split Modern Hero',
    category: 'hero',
    height: 500,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:500px;display:flex;z-index:5"><div style="flex:1;padding:60px;display:flex;flex-direction:column;justify-content:center;background:rgba(255,255,255,0.9)"><h1 style="margin:0 0 20px 0;color:var(--brand-primary);font-size:72px;font-weight:800;line-height:1">{{headline}}</h1><p style="color:var(--brand-primary-dark);font-size:24px;line-height:1.5">{{subheadline}}</p></div><div style="flex:1;position:relative"><img src="{{hero_image}}" style="width:100%;height:100%;object-fit:cover"/></div></div>`,
    variables: { 
      headline: 'New Collection', 
      subheadline: 'Discover the latest trends.',
      hero_image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800'
    }
  },

  // --- PRODUCT ---
  {
    id: 'product-glass-card',
    name: 'Glass Product Card',
    category: 'product',
    height: 600,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:600px;display:flex;align-items:center;justify-content:center;z-index:5"><div style="width:500px;background:rgba(255,255,255,0.1);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.2);border-radius:24px;padding:40px;box-shadow:0 20px 50px rgba(0,0,0,0.15)"><img src="{{product_image}}" style="width:100%;height:400px;object-fit:cover;border-radius:16px;margin-bottom:30px;box-shadow:0 10px 30px rgba(0,0,0,0.1)"/><div style="display:flex;justify-content:space-between;align-items:center"><div style="color:var(--brand-secondary);font-size:32px;font-weight:700">{{product_name}}</div><div style="background:var(--brand-accent);color:var(--brand-secondary);padding:10px 20px;border-radius:50px;font-weight:bold;font-size:20px">{{price}}</div></div></div></div>`,
    variables: { 
      product_name: 'Signature Item', 
      price: '$99',
      product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
    }
  },
  {
    id: 'product-feature-list',
    name: 'Product Feature List',
    category: 'product',
    height: 400,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:400px;display:flex;align-items:center;padding:0 80px;z-index:5"><div style="flex:1"><img src="{{product_image}}" style="width:300px;height:300px;object-fit:cover;border-radius:50%;border:10px solid rgba(255,255,255,0.2)"/></div><div style="flex:1.5;padding-left:40px"><div style="display:flex;align-items:center;margin-bottom:20px"><div style="width:40px;height:40px;background:var(--brand-accent);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:20px;color:#fff">✓</div><div style="font-size:24px;font-weight:600;color:var(--brand-secondary)">{{feature_1}}</div></div><div style="display:flex;align-items:center;margin-bottom:20px"><div style="width:40px;height:40px;background:var(--brand-accent);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:20px;color:#fff">✓</div><div style="font-size:24px;font-weight:600;color:var(--brand-secondary)">{{feature_2}}</div></div><div style="display:flex;align-items:center"><div style="width:40px;height:40px;background:var(--brand-accent);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:20px;color:#fff">✓</div><div style="font-size:24px;font-weight:600;color:var(--brand-secondary)">{{feature_3}}</div></div></div></div>`,
    variables: { 
      feature_1: 'Premium Quality',
      feature_2: 'Sustainably Sourced',
      feature_3: 'Lifetime Warranty',
      product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    }
  },

  // --- FOOTER ---
  {
    id: 'footer-social-minimal',
    name: 'Minimal Social Footer',
    category: 'footer',
    height: 150,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10"><div style="display:flex;gap:30px;margin-bottom:20px"><div style="width:40px;height:40px;background:var(--brand-secondary);border-radius:50%;opacity:0.8"></div><div style="width:40px;height:40px;background:var(--brand-secondary);border-radius:50%;opacity:0.8"></div><div style="width:40px;height:40px;background:var(--brand-secondary);border-radius:50%;opacity:0.8"></div></div><div style="color:var(--brand-secondary);font-size:18px;letter-spacing:2px;opacity:0.8">{{website}}</div></div>`,
    variables: { website: '@BRANDOFFICIAL' }
  },
  {
    id: 'footer-bold-cta',
    name: 'Bold CTA Footer',
    category: 'footer',
    height: 250,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:250px;display:flex;align-items:center;justify-content:center;z-index:10"><button style="background:var(--brand-accent);color:#fff;border:none;padding:25px 80px;font-size:32px;font-weight:800;border-radius:12px;cursor:pointer;text-transform:uppercase;letter-spacing:2px;box-shadow:0 10px 30px rgba(0,0,0,0.2);transition:transform 0.2s">{{cta}}</button></div>`,
    variables: { cta: 'SHOP NOW' }
  },

  // --- OVERLAY ---
  {
    id: 'overlay-dark-gradient',
    name: 'Dark Gradient Overlay',
    category: 'overlay',
    height: 1080,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);z-index:0"></div>`,
    variables: {}
  },
  {
    id: 'overlay-brand-mesh',
    name: 'Brand Mesh Overlay',
    category: 'overlay',
    height: 1080,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle at 0% 0%, var(--brand-primary) 0%, transparent 50%), radial-gradient(circle at 100% 100%, var(--brand-accent) 0%, transparent 50%);background-color:var(--brand-secondary);z-index:0;opacity:0.8"></div>`,
    variables: {}
  },

  // --- TESTIMONIALS ---
  {
    id: 'testimonial-modern-card',
    name: 'Modern Testimonial Card',
    category: 'content',
    height: 400,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:400px;display:flex;align-items:center;justify-content:center;z-index:5"><div style="background:#fff;padding:40px;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);max-width:800px;text-align:center"><div style="color:var(--brand-accent);font-size:60px;line-height:1;margin-bottom:20px">"</div><p style="font-size:28px;font-style:italic;color:var(--brand-primary);margin-bottom:30px;line-height:1.4">{{quote}}</p><div style="display:flex;align-items:center;justify-content:center;gap:15px"><img src="{{avatar}}" style="width:60px;height:60px;border-radius:50%;object-fit:cover"/><div style="text-align:left"><div style="font-weight:bold;font-size:18px;color:var(--brand-primary)">{{author}}</div><div style="color:var(--brand-primary-light);font-size:14px">{{role}}</div></div></div></div></div>`,
    variables: {
      quote: 'This product completely changed my workflow. Highly recommended!',
      author: 'Sarah Jenkins',
      role: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    }
  },

  // --- FEATURES ---
  {
    id: 'features-grid-4',
    name: 'Four Column Features',
    category: 'content',
    height: 300,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:300px;display:flex;align-items:center;justify-content:space-between;padding:0 60px;z-index:5"><div style="text-align:center;flex:1"><div style="font-size:40px;margin-bottom:15px">🚀</div><h3 style="font-size:20px;font-weight:bold;color:var(--brand-primary);margin-bottom:10px">{{feat1_title}}</h3><p style="font-size:14px;color:var(--brand-primary-light)">{{feat1_desc}}</p></div><div style="text-align:center;flex:1"><div style="font-size:40px;margin-bottom:15px">⚡</div><h3 style="font-size:20px;font-weight:bold;color:var(--brand-primary);margin-bottom:10px">{{feat2_title}}</h3><p style="font-size:14px;color:var(--brand-primary-light)">{{feat2_desc}}</p></div><div style="text-align:center;flex:1"><div style="font-size:40px;margin-bottom:15px">🛡️</div><h3 style="font-size:20px;font-weight:bold;color:var(--brand-primary);margin-bottom:10px">{{feat3_title}}</h3><p style="font-size:14px;color:var(--brand-primary-light)">{{feat3_desc}}</p></div><div style="text-align:center;flex:1"><div style="font-size:40px;margin-bottom:15px">💎</div><h3 style="font-size:20px;font-weight:bold;color:var(--brand-primary);margin-bottom:10px">{{feat4_title}}</h3><p style="font-size:14px;color:var(--brand-primary-light)">{{feat4_desc}}</p></div></div>`,
    variables: {
      feat1_title: 'Fast', feat1_desc: 'Lightning speed',
      feat2_title: 'Powerful', feat2_desc: 'Do more',
      feat3_title: 'Secure', feat3_desc: 'Bank-grade',
      feat4_title: 'Premium', feat4_desc: 'Top quality'
    }
  },

  // --- TAILWIND INSPIRED BLOCKS ---
  {
    id: 'tailwind-stats-simple',
    name: 'Simple Stats (Tailwind Style)',
    category: 'content',
    height: 200,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:200px;display:flex;align-items:center;justify-content:center;background:#f9fafb;z-index:5"><div style="display:flex;gap:80px;text-align:center"><div style="display:flex;flex-direction:column"><span style="font-size:48px;font-weight:800;color:var(--brand-primary)">{{stat1_val}}</span><span style="font-size:16px;font-weight:500;color:var(--brand-primary-light);text-transform:uppercase;letter-spacing:1px">{{stat1_label}}</span></div><div style="width:1px;height:60px;background:#e5e7eb"></div><div style="display:flex;flex-direction:column"><span style="font-size:48px;font-weight:800;color:var(--brand-primary)">{{stat2_val}}</span><span style="font-size:16px;font-weight:500;color:var(--brand-primary-light);text-transform:uppercase;letter-spacing:1px">{{stat2_label}}</span></div><div style="width:1px;height:60px;background:#e5e7eb"></div><div style="display:flex;flex-direction:column"><span style="font-size:48px;font-weight:800;color:var(--brand-primary)">{{stat3_val}}</span><span style="font-size:16px;font-weight:500;color:var(--brand-primary-light);text-transform:uppercase;letter-spacing:1px">{{stat3_label}}</span></div></div></div>`,
    variables: {
      stat1_val: '100%', stat1_label: 'Uptime',
      stat2_val: '24/7', stat2_label: 'Support',
      stat3_val: '100k+', stat3_label: 'Users'
    }
  },
  {
    id: 'tailwind-pricing-card',
    name: 'Pricing Card (Tailwind Style)',
    category: 'content',
    height: 500,
    html: `<div style="position:absolute;top:0;left:0;width:100%;height:500px;display:flex;align-items:center;justify-content:center;z-index:5"><div style="width:400px;background:#fff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);padding:40px;border:1px solid #e5e7eb"><div style="text-align:center;margin-bottom:30px"><h3 style="font-size:24px;font-weight:600;color:var(--brand-primary);margin-bottom:10px">{{plan_name}}</h3><div style="display:flex;align-items:baseline;justify-content:center"><span style="font-size:48px;font-weight:800;color:var(--brand-primary)">{{price}}</span><span style="font-size:18px;color:var(--brand-primary-light);margin-left:5px">/mo</span></div></div><ul style="list-style:none;padding:0;margin:0 0 30px 0"><li style="display:flex;align-items:center;margin-bottom:15px;color:var(--brand-primary-light);font-size:16px"><span style="color:var(--brand-accent);margin-right:10px">✓</span>{{feat1}}</li><li style="display:flex;align-items:center;margin-bottom:15px;color:var(--brand-primary-light);font-size:16px"><span style="color:var(--brand-accent);margin-right:10px">✓</span>{{feat2}}</li><li style="display:flex;align-items:center;margin-bottom:15px;color:var(--brand-primary-light);font-size:16px"><span style="color:var(--brand-accent);margin-right:10px">✓</span>{{feat3}}</li></ul><button style="width:100%;padding:15px;background:var(--brand-accent);color:#fff;border:none;border-radius:8px;font-weight:600;font-size:16px;cursor:pointer;transition:opacity 0.2s">{{cta}}</button></div></div>`,
    variables: {
      plan_name: 'Pro Plan',
      price: '$49',
      feat1: 'Unlimited Access',
      feat2: 'Priority Support',
      feat3: 'Advanced Analytics',
      cta: 'Get Started'
    }
  }
];

// Helper to stack sections into a full template
export function buildTemplateFromSections(
  name: string, 
  description: string, 
  sections: string[], 
  baseVariables: Record<string, any> = {}
) {
  let currentTop = 0;
  let combinedHtml = '';
  let combinedVariables = { ...baseVariables };

  // Always add a background/overlay first if present (they usually take full height)
  // But for stacking logic, we need to handle "flow" vs "absolute"
  
  // Simple stacking strategy:
  // 1. Overlays are placed at top:0, left:0, full width/height
  // 2. Content sections are stacked vertically
  
  const selectedSections = sections.map(id => SECTIONS.find(s => s.id === id)).filter(Boolean) as Section[];
  
  // 1. Render Overlays
  selectedSections.filter(s => s.category === 'overlay').forEach(s => {
    combinedHtml += s.html; // Assumes overlay handles its own positioning (usually full cover)
    Object.assign(combinedVariables, s.variables);
  });

  // 2. Render Content Stack
  const contentSections = selectedSections.filter(s => s.category !== 'overlay');
  
  // Calculate total height of content to center it vertically? 
  // Or just start from top? Let's start from top + padding.
  currentTop = 80; // Top padding

  contentSections.forEach(s => {
    // We need to inject the 'top' position into the HTML
    // The HTML strings in SECTIONS usually have 'top:0'. We need to replace it or wrap it.
    // Wrapping is safer.
    
    const wrappedHtml = `<div style="position:absolute;top:${currentTop}px;left:0;width:100%;height:${s.height}px;pointer-events:none">${s.html.replace('position:absolute;', 'position:relative;')}</div>`;
    // Note: The inner HTML usually has position:absolute. If we wrap it in a relative div, 
    // and change inner to relative, it might break layout if inner relied on absolute.
    // BETTER APPROACH: Parse the HTML and adjust the 'top' style.
    // BUT regex is brittle.
    
    // ALTERNATIVE: Just wrap in a div that uses transform?
    // <div style="position:absolute;top:0;left:0;width:100%;transform:translateY(100px)">...</div>
    
    const positionedHtml = `<div style="position:absolute;top:0;left:0;width:100%;height:100%;transform:translateY(${currentTop}px)">${s.html}</div>`;
    
    combinedHtml += positionedHtml;
    Object.assign(combinedVariables, s.variables);
    currentTop += s.height;
  });

  return {
    name,
    description,
    htmlTemplate: `
      <div style="width:1080px;height:1080px;background:#fff;position:relative;overflow:hidden;font-family:var(--font-body)">
        <style>
          :root {
            --brand-primary: #000000;
            --brand-secondary: #ffffff;
            --brand-accent: #3b82f6;
            --brand-primary-light: #333333;
            --brand-primary-dark: #000000;
            --font-heading: 'Inter', sans-serif;
            --font-body: 'Inter', sans-serif;
          }
        </style>
        ${combinedHtml}
      </div>`,
    variables: combinedVariables,
    category: 'custom',
    platform: ['instagram', 'facebook']
  };
}
