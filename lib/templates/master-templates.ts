export const MASTER_TEMPLATES = [
  {
    id: "podcast-interview-dual",
    name: "Podcast Interview Duo",
    description: "Dual host/guest layout perfect for interview promotions.",
    category: "podcast",
    platform: ["instagram", "linkedin", "twitter"],
    htmlTemplate: `<div style="width:1080px;height:1080px;background:linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);position:relative;font-family:var(--font-body);color:white;overflow:hidden;">
  <div style="text-align:center;padding-top:100px;">
    <div style="font-size:28px;font-weight:bold;text-transform:uppercase;letter-spacing:4px;margin-bottom:30px;opacity:0.9;">{{subheadline}}</div>
    <h1 style="font-family:var(--font-heading);font-size:90px;line-height:1.1;margin:0 40px;text-shadow:0 4px 20px rgba(0,0,0,0.2);">{{headline}}</h1>
  </div>
  <div style="display:flex;justify-content:center;gap:60px;margin-top:80px;">
    <div style="text-align:center;">
      <div style="width:320px;height:320px;border-radius:30px;overflow:hidden;border:6px solid rgba(255,255,255,0.3);margin-bottom:30px;box-shadow:0 20px 40px rgba(0,0,0,0.2);">
        <img src="{{host_image}}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div style="background:white;color:var(--brand-primary);padding:12px 30px;border-radius:50px;display:inline-block;font-weight:800;font-size:20px;box-shadow:0 10px 20px rgba(0,0,0,0.1);">Hosted by {{host_name}}</div>
    </div>
    <div style="text-align:center;">
      <div style="width:320px;height:320px;border-radius:30px;overflow:hidden;border:6px solid rgba(255,255,255,0.3);margin-bottom:30px;box-shadow:0 20px 40px rgba(0,0,0,0.2);">
        <img src="{{guest_image}}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div style="background:white;color:var(--brand-primary);padding:12px 30px;border-radius:50px;display:inline-block;font-weight:800;font-size:20px;box-shadow:0 10px 20px rgba(0,0,0,0.1);">With guest {{guest_name}}</div>
    </div>
  </div>
  <div style="position:absolute;bottom:80px;width:100%;text-align:center;">
    <div style="display:flex;justify-content:center;align-items:center;gap:30px;font-size:26px;font-weight:600;opacity:0.9;">
      <span style="display:flex;align-items:center;gap:10px;">📅 {{date_time}}</span>
      <span>•</span>
      <span style="display:flex;align-items:center;gap:10px;">🎧 Listen on Spotify & Apple</span>
    </div>
  </div>
</div>`,
    cssTemplate: "",
    width: 1080,
    height: 1080,
    variables: {
      "headline": "Diving Deeper into Financial Mastery",
      "subheadline": "Strategies to Level Up",
      "host_name": "Marcus Whittman",
      "guest_name": "Anthony Lebronski",
      "host_image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
      "guest_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600",
      "date_time": "Every Thursday • 5 PM"
    },
    tags: ["podcast", "interview", "duo", "promo"]
  },
  {
    id: "news-headline-breaking",
    name: "Breaking News Headline",
    description: "Bold, industrial style layout for major announcements or news.",
    category: "news",
    platform: ["instagram", "twitter", "linkedin"],
    htmlTemplate: `<div style="width:1080px;height:1080px;background:var(--brand-primary-dark);position:relative;font-family:var(--font-body);color:white;overflow:hidden;">
  <img src="{{hero_image}}" style="position:absolute;top:0;left:0;width:100%;height:65%;object-fit:cover;opacity:0.7;filter:grayscale(50%);" />
  <div style="position:absolute;top:0;left:0;width:100%;height:65%;background:linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, var(--brand-primary-dark) 100%);pointer-events:none;"></div>
  
  <div style="position:absolute;top:60px;left:60px;background:#E63946;color:white;padding:15px 30px;font-weight:900;text-transform:uppercase;letter-spacing:2px;font-size:20px;box-shadow:0 10px 20px rgba(0,0,0,0.3);">Breaking News</div>
  
  <div style="position:absolute;bottom:0;width:100%;height:50%;padding:80px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(to top, var(--brand-primary-dark) 80%, transparent 100%);">
    <div style="font-size:32px;color:var(--brand-accent);font-weight:800;text-transform:uppercase;margin-bottom:20px;letter-spacing:2px;">{{subheadline}}</div>
    <h1 style="font-family:var(--font-heading);font-size:100px;line-height:0.9;margin:0 0 50px 0;text-transform:uppercase;font-weight:900;">{{headline}}</h1>
    <div style="display:flex;align-items:center;gap:30px;border-top:2px solid rgba(255,255,255,0.2);padding-top:40px;">
      <div style="width:70px;height:70px;border-radius:50%;background:var(--brand-accent);display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(255,255,255,0.1);">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
      </div>
      <div>
        <div style="font-size:24px;font-weight:bold;">Tune in every week</div>
        <div style="font-size:18px;opacity:0.7;">{{date_time}}</div>
      </div>
    </div>
  </div>
</div>`,
    cssTemplate: "",
    width: 1080,
    height: 1080,
    variables: {
      "headline": "Nations Pledge Emission Cuts",
      "subheadline": "Global Headlines Podcast",
      "hero_image": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200",
      "date_time": "7:30 PM EST"
    },
    tags: ["news", "headline", "bold", "industrial"]
  },
  {
    id: "review-card-trust",
    name: "Trust Review Card",
    description: "Clean and trustworthy layout for sharing reviews and testimonials.",
    category: "review",
    platform: ["instagram", "facebook"],
    htmlTemplate: `<div style="width:1080px;height:1080px;background:var(--brand-secondary);position:relative;font-family:var(--font-body);display:flex;align-items:center;justify-content:center;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;width:100%;height:45%;background:var(--brand-primary);border-bottom-left-radius:50% 20%;border-bottom-right-radius:50% 20%;"></div>
  <div style="position:absolute;top:40px;left:0;width:100%;text-align:center;color:white;font-size:24px;font-weight:bold;letter-spacing:4px;text-transform:uppercase;opacity:0.8;">{{subheadline}}</div>
  
  <div style="width:850px;background:white;border-radius:40px;padding:80px 60px;box-shadow:0 30px 80px rgba(0,0,0,0.15);position:relative;z-index:10;text-align:center;">
    <div style="display:flex;justify-content:center;gap:15px;margin-bottom:50px;">
      <span style="color:#FFD700;font-size:48px;">★</span><span style="color:#FFD700;font-size:48px;">★</span><span style="color:#FFD700;font-size:48px;">★</span><span style="color:#FFD700;font-size:48px;">★</span><span style="color:#FFD700;font-size:48px;">★</span>
    </div>
    <h2 style="font-family:var(--font-heading);font-size:42px;margin-bottom:50px;line-height:1.4;color:#1a1a1a;font-weight:600;">"{{review_text}}"</h2>
    
    <div style="display:flex;align-items:center;justify-content:center;gap:30px;margin-top:50px;border-top:2px solid #f0f0f0;padding-top:50px;">
      <img src="{{reviewer_image}}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:4px solid #f0f0f0;" />
      <div style="text-align:left;">
        <div style="font-weight:800;font-size:28px;color:#1a1a1a;">{{reviewer_name}}</div>
        <div style="color:#666;font-size:20px;font-weight:500;">{{reviewer_role}}</div>
      </div>
    </div>
  </div>
</div>`,
    cssTemplate: "",
    width: 1080,
    height: 1080,
    variables: {
      "subheadline": "What people are saying",
      "review_text": "This podcast keeps me informed and engaged. Each episode is a global journey that broadens my horizons. Highly recommend!",
      "reviewer_name": "Amy Langdon",
      "reviewer_role": "Economics Teacher",
      "reviewer_image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
    },
    tags: ["review", "testimonial", "clean", "trust"]
  },
  {
    id: "promo-microphone-energy",
    name: "High Energy Promo",
    description: "Dynamic layout with microphone visual for new episode announcements.",
    category: "promo",
    platform: ["instagram", "stories", "tiktok"],
    htmlTemplate: `<div style="width:1080px;height:1080px;background:linear-gradient(45deg, #FF416C 0%, #FF4B2B 100%);position:relative;font-family:var(--font-body);color:white;overflow:hidden;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:900px;height:900px;border:2px solid rgba(255,255,255,0.1);border-radius:50%;pointer-events:none;"></div>
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:700px;height:700px;border:2px solid rgba(255,255,255,0.15);border-radius:50%;pointer-events:none;"></div>
  
  <div style="position:absolute;right:-150px;bottom:-80px;width:700px;z-index:1;">
    <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800" style="width:100%;transform:rotate(-15deg);filter:drop-shadow(-20px 20px 50px rgba(0,0,0,0.5));" />
  </div>
  
  <div style="position:absolute;top:120px;left:80px;width:750px;z-index:2;">
    <div style="background:white;color:#FF4B2B;padding:12px 25px;display:inline-block;font-weight:900;border-radius:6px;margin-bottom:40px;font-size:20px;letter-spacing:1px;box-shadow:0 10px 20px rgba(0,0,0,0.2);">NEW EPISODE</div>
    <h1 style="font-family:var(--font-heading);font-size:110px;line-height:0.9;margin:0 0 40px 0;font-style:italic;text-transform:uppercase;text-shadow:0 10px 30px rgba(0,0,0,0.2);">{{headline}}</h1>
    <p style="font-size:36px;font-weight:300;margin-bottom:80px;opacity:0.9;max-width:600px;">{{subheadline}}</p>
    
    <div style="border:4px solid white;padding:25px 50px;display:inline-block;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:2px;cursor:pointer;transition:all 0.3s;">
      {{cta}}
    </div>
  </div>
</div>`,
    cssTemplate: "",
    width: 1080,
    height: 1080,
    variables: {
      "headline": "Kick Off: Sports Talk",
      "subheadline": "Weekly analysis of the biggest games.",
      "cta": "Listen Now"
    },
    tags: ["promo", "microphone", "energy", "podcast"]
  }
];
