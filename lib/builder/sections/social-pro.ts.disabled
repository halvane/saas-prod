import { Section } from '../types';

export const SOCIAL_PRO: Section[] = [
  // --- Spacers ---
  {
    id: 'social-spacer-small',
    name: 'Small Spacer (Transparent)',
    category: 'social',
    height: 100,
    html: `<div class="w-full h-full"></div>`,
    variables: {},
    metadata: { moods: [], purpose: ['spacing'], density: 'low', tags: ['spacer'] },
    compatibleEffects: []
  },
  {
    id: 'social-spacer-medium',
    name: 'Medium Spacer (Transparent)',
    category: 'social',
    height: 200,
    html: `<div class="w-full h-full"></div>`,
    variables: {},
    metadata: { moods: [], purpose: ['spacing'], density: 'low', tags: ['spacer'] },
    compatibleEffects: []
  },

  // --- Modular Webinar Sections ---
  {
    id: 'webinar-header',
    name: 'Webinar Header (Transparent)',
    category: 'social',
    height: 400,
    html: `<div class="w-full h-full flex flex-col justify-end px-[6cqw] pb-[2cqw]"><div class="bg-[var(--brand-accent)] text-[var(--brand-primary)] font-heading font-bold px-[3cqw] py-[1cqw] rounded-full self-start text-[2cqw] mb-[4cqw]">{{pill_text}}</div><div class="text-[2.5cqw] font-body font-light text-[var(--brand-secondary)] mb-[1cqw]">Thanks for signing up,</div><h1 class="text-[7cqw] font-heading font-black leading-none text-[var(--brand-secondary)] uppercase">{{speaker_name}}</h1></div>`,
    variables: { pill_text: 'Live Webinar', speaker_name: 'Maria Amerie Johnson' },
    metadata: { moods: ['corporate'], purpose: ['energetic'], density: 'medium', tags: ['webinar', 'energetic'] },
    compatibleEffects: []
  },
  {
    id: 'webinar-body',
    name: 'Webinar Body (Transparent)',
    category: 'social',
    height: 400,
    html: `<div class="w-full h-full px-[6cqw] py-[2cqw]"><p class="text-[2.2cqw] leading-relaxed max-w-[90%] mb-[6cqw] text-[var(--brand-secondary)] opacity-90 font-body">{{description}}</p><div class="flex gap-[6cqw]"><div class="border-l-4 border-[var(--brand-accent)] pl-[2cqw] text-[var(--brand-secondary)]"><div class="font-bold text-[2cqw] font-heading">{{date}}</div><div class="text-[1.8cqw] opacity-80 font-body">{{year}}</div></div><div class="border-l-4 border-[var(--brand-accent)] pl-[2cqw] text-[var(--brand-secondary)]"><div class="font-bold text-[2cqw] font-heading">{{time}}</div><div class="text-[1.8cqw] opacity-80 font-body">{{timezone}}</div></div></div></div>`,
    variables: { description: 'We are happy to have you join us for this event. You will learn how to improve the effectiveness of your programs and processes.', date: 'Saturday, July 25', year: '2022', time: '10AM - 2PM', timezone: 'EST' },
    metadata: { moods: ['corporate'], purpose: ['engagement'], density: 'medium', tags: ['webinar', 'body'] },
    compatibleEffects: []
  },
  {
    id: 'webinar-footer',
    name: 'Webinar Footer (Transparent)',
    category: 'social',
    height: 280,
    html: `<div class="w-full h-full flex items-end justify-between px-[6cqw] pb-[6cqw]"><div class="flex items-center gap-[2cqw] text-[var(--brand-secondary)]"><img src="{{brand_logo}}" class="w-[6cqw] h-[6cqw] object-contain rounded-lg"/><div><div class="font-bold text-[2cqw] font-heading">{{brand_name}}</div><div class="text-[1.5cqw] opacity-70 font-body">{{brand_tagline}}</div></div></div><div class="text-[2cqw] text-[var(--brand-secondary)] opacity-80 font-body">For more info, visit {{website}}</div></div>`,
    variables: { website: 'www.yourwebsite.com', brand_logo: 'https://via.placeholder.com/150', brand_name: 'Your Brand', brand_tagline: 'COMPANY TAGLINE' },
    metadata: { moods: ['corporate'], purpose: ['footer'], density: 'low', tags: ['webinar', 'footer'] },
    compatibleEffects: []
  },

  // --- Modular Travel Sections ---
  {
    id: 'travel-image-header',
    name: 'Travel Image Header',
    category: 'social',
    height: 600,
    html: `<div class="w-full h-full relative"><img src="{{image}}" class="w-full h-full object-cover" /><div class="absolute inset-0 bg-gradient-to-t from-[var(--brand-secondary)]/50 to-transparent"></div></div>`,
    variables: { image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800' },
    metadata: { moods: ['energetic'], purpose: ['energetic'], density: 'low', tags: ['energetic', 'image'] },
    compatibleEffects: []
  },
  {
    id: 'travel-content-body',
    name: 'Travel Content Body',
    category: 'social',
    height: 480,
    html: `<div class="w-full h-full bg-[var(--brand-secondary)] rounded-t-[4cqw] p-[6cqw] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] -mt-[4cqw] relative z-10"><div class="flex justify-between items-start mb-[2cqw]"><div><h2 class="text-[5cqw] font-black text-[var(--brand-primary)] mb-[1cqw] font-heading">{{title}}</h2><div class="flex items-center gap-[1cqw] text-[var(--brand-accent)]"><span>📍</span><span class="text-[2cqw] font-medium font-body">{{subtitle}}</span></div></div><div class="w-[8cqw] h-[8cqw] border-2 border-[var(--brand-primary)] rounded-full flex items-center justify-center overflow-hidden"><img src="{{brand_logo}}" class="w-full h-full object-cover"/></div></div><div class="grid grid-cols-3 gap-[4cqw] mt-[4cqw] border-t border-gray-100 pt-[4cqw]"><div><div class="text-[1.5cqw] text-[var(--brand-primary)] opacity-60 uppercase tracking-wider font-bold mb-[0.5cqw] font-heading">Starts At</div><div class="text-[3.5cqw] font-black text-[var(--brand-accent)] font-heading">{{price}}</div></div><div class="border-l border-gray-200 pl-[4cqw]"><div class="text-[1.5cqw] text-[var(--brand-primary)] opacity-60 uppercase tracking-wider font-bold mb-[0.5cqw] font-heading">Travel From</div><div class="text-[3.5cqw] font-bold text-[var(--brand-primary)] font-heading">{{date}}</div></div><div class="border-l border-gray-200 pl-[4cqw]"><div class="text-[1.5cqw] text-[var(--brand-primary)] opacity-60 uppercase tracking-wider font-bold mb-[0.5cqw] font-heading">Inclusions</div><div class="text-[2.5cqw] font-bold text-[var(--brand-accent)] leading-tight font-heading">{{inclusions}}</div></div></div><div class="mt-[4cqw] bg-[var(--brand-accent)] text-[var(--brand-secondary)] text-center py-[1.5cqw] text-[1.5cqw] font-medium rounded-full font-body">For more inquiries, visit {{website}}</div></div>`,
    variables: { title: 'Travel to Europe', subtitle: 'Switzerland, France, and Germany', price: '$3800', date: 'July 15', inclusions: 'Schengen Visa', website: 'www.travelwebsite.com', brand_logo: 'https://via.placeholder.com/150' },
    metadata: { moods: ['energetic'], purpose: ['engagement'], density: 'high', tags: ['energetic', 'body'] },
    compatibleEffects: []
  },

  // --- Modular Hotel Sections ---
  {
    id: 'hotel-bg-overlay',
    name: 'Hotel Background Overlay',
    category: 'overlay',
    height: 1080,
    html: `<div class="absolute inset-0 w-full h-full"><img src="{{bg_image}}" class="w-full h-full object-cover blur-sm brightness-75" /></div>`,
    variables: { bg_image: 'https://images.unsplash.com/photo-1571896349842-6e53ce41e8f2?w=800' },
    metadata: { moods: ['energetic'], purpose: ['background'], density: 'low', tags: ['hotel', 'bg'] },
    compatibleEffects: []
  },
  {
    id: 'hotel-quote-core',
    name: 'Hotel Quote Card (Core)',
    category: 'social',
    height: 500,
    html: `<div class="w-full h-full flex items-center justify-center px-[4cqw]"><div class="relative w-full max-w-[90%] bg-[var(--brand-secondary)] rounded-[2cqw] p-[5cqw] pt-[6cqw] text-center shadow-xl"><div class="absolute -top-[5cqw] left-1/2 -translate-x-1/2 w-[10cqw] h-[10cqw] rounded-full border-4 border-[var(--brand-secondary)] overflow-hidden shadow-lg"><img src="{{avatar}}" class="w-full h-full object-cover" /></div><p class="text-[2.5cqw] leading-relaxed text-[var(--brand-primary)] mb-[4cqw] font-medium font-body">"{{quote}}"</p><div class="inline-block bg-[var(--brand-accent)] text-[var(--brand-secondary)] px-[4cqw] py-[1cqw] rounded-full text-[2cqw] font-bold font-heading">{{author}}</div></div></div>`,
    variables: { avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', quote: 'Great location, really pleasant and clean rooms, but the thing that makes this such a good place to stay are the staff.', author: 'Anna Lewis Hopkins' },
    metadata: { moods: ['energetic'], purpose: ['testimonial'], density: 'medium', tags: ['hotel', 'quote'] },
    compatibleEffects: []
  },
  {
    id: 'hotel-info-footer',
    name: 'Hotel Info Footer',
    category: 'social',
    height: 200,
    html: `<div class="w-full h-full flex items-center justify-center px-[4cqw]"><div class="w-full max-w-[90%] bg-[var(--brand-secondary)] rounded-[2cqw] p-[3cqw] shadow-xl flex items-center justify-between"><div><div class="text-[2.2cqw] font-bold text-[var(--brand-accent)] font-heading">{{hotel_name}}</div><div class="text-[1.8cqw] text-[var(--brand-primary)] opacity-70 font-body">{{address}}</div></div><div class="text-[var(--brand-accent)] text-[2.5cqw]">★★★★☆</div></div></div>`,
    variables: { hotel_name: 'Fairway Hotel', address: '2871 West Side Avenue' },
    metadata: { moods: ['energetic'], purpose: ['info'], density: 'medium', tags: ['hotel', 'info'] },
    compatibleEffects: []
  },

  // --- Modular Movie Sections ---
  {
    id: 'movie-header',
    name: 'Movie Header',
    category: 'social',
    height: 300,
    html: `<div class="w-full h-full p-[6cqw] flex flex-col justify-end"><h2 class="text-[6cqw] font-black text-[var(--brand-primary)] leading-none mb-[2cqw] font-heading">{{title}}</h2><div class="flex items-center gap-[2cqw]"><span class="text-[var(--brand-primary)] opacity-60 text-[2.5cqw] font-body">{{meta_info}}</span><span class="bg-[var(--brand-accent)] text-[var(--brand-primary)] px-[2cqw] py-[0.5cqw] rounded text-[2cqw] font-bold font-heading">{{genre}}</span></div></div>`,
    variables: { title: 'Top Gun: Maverick', meta_info: '2022 • PG-13 • 2h 10m', genre: 'Action' },
    metadata: { moods: ['playful'], purpose: ['energetic'], density: 'medium', tags: ['movie', 'energetic'] },
    compatibleEffects: []
  },
  {
    id: 'movie-media',
    name: 'Movie Media',
    category: 'social',
    height: 450,
    html: `<div class="w-full h-full px-[6cqw]"><div class="w-full h-full rounded-[3cqw] overflow-hidden shadow-lg"><img src="{{image}}" class="w-full h-full object-cover" /></div></div>`,
    variables: { image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800' },
    metadata: { moods: ['playful'], purpose: ['media'], density: 'low', tags: ['movie', 'media'] },
    compatibleEffects: []
  },
  {
    id: 'movie-review',
    name: 'Movie Review Body',
    category: 'social',
    height: 330,
    html: `<div class="w-full h-full p-[6cqw]"><div class="flex items-center justify-between mb-[3cqw]"><div class="font-bold text-[2.5cqw] font-heading text-[var(--brand-primary)]">Review by {{reviewer}}</div><div class="text-[var(--brand-accent)] text-[3cqw] font-black font-heading">{{score}}</div></div><p class="text-[2.5cqw] leading-relaxed text-[var(--brand-primary)] opacity-80 font-body">{{review_text}}</p></div>`,
    variables: { reviewer: 'Jason Waller', score: '8.6/10', review_text: 'The bush began to shake. Brad couldn\'t see what was causing it to shake, but he didn\'t care.' },
    metadata: { moods: ['playful'], purpose: ['engagement'], density: 'high', tags: ['movie', 'review'] },
    compatibleEffects: []
  },

  // --- Modular Dark Rating Sections ---
  {
    id: 'dark-hero',
    name: 'Dark Movie Hero',
    category: 'social',
    height: 500,
    html: `<div class="w-full h-full relative"><img src="{{image}}" class="w-full h-full object-cover" /><div class="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)] to-transparent"></div><div class="absolute bottom-[4cqw] left-[6cqw]"><h2 class="text-[7cqw] font-heading font-bold text-[var(--brand-secondary)] leading-none mb-[1cqw]">{{title}}</h2><div class="text-[2cqw] text-[var(--brand-secondary)] opacity-70 uppercase tracking-widest font-body">{{subtitle}}</div></div></div>`,
    variables: { image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', title: 'Finding Michael', subtitle: '2021 • Directed by Jackson Phillipes' },
    metadata: { moods: ['calm', 'energetic'], purpose: ['energetic'], density: 'medium', tags: ['movie', 'calm', 'hero'] },
    compatibleEffects: []
  },
  {
    id: 'dark-content',
    name: 'Dark Rating Content',
    category: 'social',
    height: 580,
    html: `<div class="w-full h-full bg-[var(--brand-primary)] p-[6cqw] flex gap-[4cqw]"><div class="flex-1"><span class="bg-[var(--brand-accent)] text-[var(--brand-secondary)] px-[2cqw] py-[0.5cqw] rounded text-[2cqw] font-bold inline-block mb-[3cqw] font-heading">{{genre}}</span><p class="text-[2.5cqw] text-[var(--brand-secondary)] opacity-70 leading-relaxed line-clamp-6 font-body">{{description}}</p></div><div class="w-[35%] bg-white/10 rounded-[3cqw] p-[3cqw] border border-white/20 flex flex-col justify-center"><div class="text-[1.8cqw] text-[var(--brand-secondary)] opacity-50 uppercase tracking-widest mb-[2cqw] border-b border-white/20 pb-[1cqw] text-center font-heading">Rating</div><div class="flex items-end justify-center gap-[1cqw] h-[15cqw] mb-[3cqw]"><div class="w-[12%] bg-white/30 h-[30%] rounded-t"></div><div class="w-[12%] bg-white/30 h-[50%] rounded-t"></div><div class="w-[12%] bg-white/40 h-[80%] rounded-t"></div><div class="w-[12%] bg-white/50 h-[100%] rounded-t"></div></div><div class="text-center"><div class="text-[6cqw] font-black text-[var(--brand-secondary)] leading-none font-heading">{{score}}</div><div class="text-[1.8cqw] text-[var(--brand-secondary)] opacity-50 font-body">{{votes}} Votes</div></div></div></div>`,
    variables: { genre: 'DRAMA', description: 'Finney Shaw is a shy but clever 13-year-old boy who\'s being held in a soundproof basement by a sadistic, masked killer.', score: '4.7', votes: '301k' },
    metadata: { moods: ['calm'], purpose: ['engagement'], density: 'high', tags: ['movie', 'calm', 'engagement'] },
    compatibleEffects: []
  },

  // --- Modular Product Sections ---
  {
    id: 'product-hero',
    name: 'Product Hero Image',
    category: 'social',
    height: 540,
    html: `<div class="w-full h-full relative"><img src="{{product_image}}" class="w-full h-full object-cover" /><div class="absolute top-[6cqw] left-[6cqw]"><div class="flex items-center gap-[2cqw] text-[var(--brand-secondary)] mb-[2cqw]"><img src="{{brand_logo}}" class="w-[5cqw] h-[5cqw] rounded-full object-cover border border-[var(--brand-secondary)]"/><span class="text-[2.5cqw] tracking-widest uppercase font-heading">{{brand_name}}</span></div><h2 class="text-[8cqw] text-[var(--brand-secondary)] font-heading leading-none drop-shadow-md">Product<br/>Review</h2></div></div>`,
    variables: { product_image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800', brand_logo: 'https://via.placeholder.com/150', brand_name: 'Your Brand' },
    metadata: { moods: ['luxury'], purpose: ['engagement'], density: 'low', tags: ['urgent', 'hero'] },
    compatibleEffects: []
  },
  {
    id: 'product-content',
    name: 'Product Review Content',
    category: 'social',
    height: 540,
    html: `<div class="w-full h-full bg-[var(--brand-secondary)] p-[6cqw] flex flex-col justify-center"><div class="flex items-center gap-[3cqw] mb-[4cqw]"><img src="{{avatar}}" class="w-[10cqw] h-[10cqw] rounded-full object-cover" /><div><div class="font-bold text-[3cqw] text-[var(--brand-primary)] font-heading">{{author}}</div><div class="text-[var(--brand-accent)] text-[2.5cqw]">★★★★★</div></div></div><p class="text-[3cqw] text-[var(--brand-primary)] opacity-70 leading-relaxed mb-[4cqw] italic font-body">"{{review}}"</p><div class="flex justify-between items-center"><div class="text-[2cqw] text-[var(--brand-primary)] opacity-50 font-body">{{date}}</div><div class="bg-[var(--brand-accent)] text-[var(--brand-secondary)] px-[4cqw] py-[1.5cqw] rounded-full font-bold text-[2cqw] font-heading">Shop Now</div></div></div>`,
    variables: { avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', author: 'Michelle Leary', review: 'This facial cleansing is very safe to use and a very satisfying product.', date: 'July 23, 2022' },
    metadata: { moods: ['luxury'], purpose: ['engagement'], density: 'medium', tags: ['urgent', 'engagement'] },
    compatibleEffects: []
  },

  {
    id: 'social-pro-tweet-authority',
    name: 'Tweet Authority Card',
    category: 'social',
    height: 600,
    html: `<div class="w-full h-full flex items-center justify-center p-[8cqw]"><div class="bg-[var(--brand-secondary)] rounded-3xl shadow-2xl p-[6cqw] w-full border border-[var(--brand-primary)]/10"><div class="flex items-center gap-4 mb-6"><img src="{{author_avatar}}" class="w-[12cqw] h-[12cqw] rounded-full object-cover border-2 border-[var(--brand-primary)]/10"/><div><div class="font-bold text-[4cqw] text-[var(--brand-primary)] flex items-center gap-2 font-heading">{{author_name}} <span class="text-[var(--brand-accent)]">Verified</span></div><div class="text-[var(--brand-primary)] opacity-60 text-[3cqw] font-body">@{{author_handle}}</div></div><div class="ml-auto text-[var(--brand-primary)] opacity-40"><svg class="w-[6cqw] h-[6cqw]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></div></div><p class="text-[5cqw] leading-relaxed text-[var(--brand-primary)] opacity-90 font-medium mb-6 font-body">{{tweet_content}}</p><div class="flex items-center gap-6 text-[var(--brand-primary)] opacity-60 text-[3.5cqw] border-t border-[var(--brand-primary)]/10 pt-6 font-body"><div class="flex items-center gap-2"><span>❤️</span> {{likes}}</div><div class="flex items-center gap-2"><span>🔁</span> {{retweets}}</div><div class="ml-auto">{{date}}</div></div></div></div>`,
    variables: {
      author_name: 'Tech Insider',
      author_handle: 'techinsider',
      author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      tweet_content: 'The future of AI is not just about automation, it\'s about augmentation. We are entering an era where human creativity is multiplied by machine intelligence.',
      likes: '12.5K',
      retweets: '4.2K',
      date: 'Just now'
    },
    metadata: {
      moods: ['corporate', 'calm', 'energetic'],
      purpose: ['education', 'engagement'],
      density: 'medium',
      tags: ['twitter', 'social', 'quote', 'card']
    },
    compatibleEffects: ['shadow', 'gradient-bg']
  },
  {
    id: 'social-pro-notification-stack',
    name: 'iOS Notification Stack',
    category: 'social',
    height: 800,
    html: `<div class="w-full h-full flex flex-col items-center justify-center gap-4 p-[4cqw]"><div class="w-full max-w-[90%] bg-[var(--brand-secondary)]/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[var(--brand-secondary)]/40 transform hover:scale-105 transition-transform duration-300"><div class="flex items-center gap-3 mb-2"><div class="w-8 h-8 bg-[var(--brand-accent)] rounded-lg flex items-center justify-center text-[var(--brand-secondary)] text-xs font-bold">Msg</div><div class="font-semibold text-[var(--brand-primary)] font-heading">Messages</div><div class="ml-auto text-xs text-[var(--brand-primary)] opacity-60 font-body">Now</div></div><div class="font-medium text-[var(--brand-primary)] font-heading">{{notification_title_1}}</div><div class="text-[var(--brand-primary)] opacity-70 text-sm font-body">{{notification_body_1}}</div></div><div class="w-full max-w-[90%] bg-[var(--brand-secondary)]/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[var(--brand-secondary)]/40 transform scale-95 opacity-80"><div class="flex items-center gap-3 mb-2"><div class="w-8 h-8 bg-[var(--brand-primary)] rounded-lg flex items-center justify-center text-[var(--brand-secondary)] text-xs font-bold">Pay</div><div class="font-semibold text-[var(--brand-primary)] font-heading">Stripe</div><div class="ml-auto text-xs text-[var(--brand-primary)] opacity-60 font-body">2m ago</div></div><div class="font-medium text-[var(--brand-primary)] font-heading">{{notification_title_2}}</div><div class="text-[var(--brand-primary)] opacity-70 text-sm font-body">{{notification_body_2}}</div></div></div>`,
    variables: {
      notification_title_1: 'New Sale! 💰',
      notification_body_1: 'You just received a payment of $99.00 from a new customer.',
      notification_title_2: 'Goal Reached 🎯',
      notification_body_2: 'Congratulations! You hit your monthly revenue target.'
    },
    metadata: {
      moods: ['energetic', 'minimalist'],
      purpose: ['engagement', 'awareness'],
      density: 'medium',
      tags: ['notification', 'ios', 'mobile', 'alert']
    },
    compatibleEffects: ['blur', 'glass']
  },
  {
    id: 'social-pro-polaroid-scatter',
    name: 'Polaroid Scatter',
    category: 'social',
    height: 800,
    html: `<div class="w-full h-full relative overflow-hidden"><div class="absolute top-[10%] left-[10%] transform -rotate-6 z-10"><div class="bg-[var(--brand-secondary)] p-4 pb-12 shadow-xl w-[40cqw]"><img src="{{image_1}}" class="w-full aspect-square object-cover mb-2"/><div class="font-handwriting text-center text-[var(--brand-primary)] opacity-70 text-xl font-body">{{caption_1}}</div></div></div><div class="absolute top-[20%] right-[10%] transform rotate-12 z-20"><div class="bg-[var(--brand-secondary)] p-4 pb-12 shadow-xl w-[45cqw]"><img src="{{image_2}}" class="w-full aspect-square object-cover mb-2"/><div class="font-handwriting text-center text-[var(--brand-primary)] opacity-70 text-xl font-body">{{caption_2}}</div></div></div><div class="absolute bottom-[10%] left-[30%] transform -rotate-3 z-30"><div class="bg-[var(--brand-secondary)] p-4 pb-12 shadow-xl w-[35cqw]"><img src="{{image_3}}" class="w-full aspect-square object-cover mb-2"/><div class="font-handwriting text-center text-[var(--brand-primary)] opacity-70 text-xl font-body">{{caption_3}}</div></div></div></div>`,
    variables: {
      image_1: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      caption_1: 'Summer Vibes ☀️',
      image_2: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
      caption_2: 'Best Team Ever',
      image_3: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      caption_3: 'New Drop!'
    },
    metadata: {
      moods: ['casual', 'fun', 'nostalgic'],
      purpose: ['showcase', 'lifestyle'],
      density: 'high',
      tags: ['polaroid', 'photo', 'gallery', 'collage']
    },
    compatibleEffects: ['texture', 'grain']
  },
  {
    id: 'social-pro-search-bar',
    name: 'Google Search Hook',
    category: 'social',
    height: 400,
    html: `<div class="w-full h-full flex items-center justify-center p-8"><div class="w-full max-w-2xl bg-[var(--brand-secondary)] rounded-full shadow-lg border border-[var(--brand-primary)]/20 px-8 py-6 flex items-center gap-4"><img src="https://www.google.com/favicon.ico" class="w-8 h-8 opacity-80"/><div class="flex-1 text-2xl text-[var(--brand-primary)] font-medium typing-cursor font-heading">{{search_query}}</div><div class="flex gap-4 text-[var(--brand-primary)] opacity-40"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg><div class="w-px h-8 bg-[var(--brand-primary)]/20"></div><svg class="w-6 h-6 text-[var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div></div></div>`,
    variables: {
      search_query: 'How to scale your business fast?'
    },
    metadata: {
      moods: ['curious', 'educational'],
      purpose: ['hook', 'intro'],
      density: 'low',
      tags: ['search', 'google', 'question', 'hook']
    },
    compatibleEffects: ['shadow']
  },
  {
    id: 'social-pro-logos-ticker',
    name: 'Trusted By Logos Ticker',
    category: 'social',
    height: 180,
    html: `<div class="w-full h-full flex flex-col items-center justify-center bg-[var(--brand-secondary)]"><p class="text-[var(--brand-primary)] opacity-60 text-[1.5cqw] font-medium uppercase tracking-widest mb-[3cqw] font-heading">{{ticker_title}}</p><div class="flex items-center justify-center gap-[6cqw] opacity-60 grayscale hover:grayscale-0 transition-all duration-500"><img src="{{logo_1}}" class="h-[4cqw] object-contain"/><img src="{{logo_2}}" class="h-[4cqw] object-contain"/><img src="{{logo_3}}" class="h-[4cqw] object-contain"/><img src="{{logo_4}}" class="h-[4cqw] object-contain"/><img src="{{logo_5}}" class="h-[4cqw] object-contain"/></div></div>`,
    variables: {
      ticker_title: 'TRUSTED BY INDUSTRY LEADERS',
      logo_1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png',
      logo_2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png',
      logo_3: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png',
      logo_4: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png',
      logo_5: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png'
    },
    metadata: {
      moods: ['trustworthy', 'corporate'],
      purpose: ['engagement', 'trustworthy'],
      density: 'low',
      tags: ['logos', 'ticker', 'trusted-by', 'social-proof']
    },
    compatibleEffects: ['opacity']
  },
  {
    id: 'social-pro-comments-waterfall',
    name: 'Comments Waterfall',
    category: 'social',
    height: 600,
    html: `<div class="w-full h-full flex flex-col items-center justify-center bg-[var(--brand-secondary)] p-[4cqw] overflow-hidden"><div class="space-y-[2cqw] w-full max-w-[60cqw]"><div class="bg-[var(--brand-secondary)] brightness-110 p-[2cqw] rounded-[1.5cqw] shadow-sm border border-[var(--brand-primary)]/10 transform -translate-x-[5cqw]"><div class="flex items-center gap-[1cqw] mb-[1cqw]"><div class="w-[3cqw] h-[3cqw] bg-[var(--brand-accent)]/20 rounded-full"></div><div class="font-bold text-[1.2cqw] text-[var(--brand-primary)] font-heading">Alex M.</div></div><div class="text-[1.2cqw] text-[var(--brand-primary)] opacity-70 font-body">This is exactly what I needed! 🔥</div></div><div class="bg-[var(--brand-secondary)] brightness-110 p-[2cqw] rounded-[1.5cqw] shadow-sm border border-[var(--brand-primary)]/10 transform translate-x-[5cqw]"><div class="flex items-center gap-[1cqw] mb-[1cqw]"><div class="w-[3cqw] h-[3cqw] bg-[var(--brand-accent)]/20 rounded-full"></div><div class="font-bold text-[1.2cqw] text-[var(--brand-primary)] font-heading">Sarah J.</div></div><div class="text-[1.2cqw] text-[var(--brand-primary)] opacity-70 font-body">Incredible value for the price. Highly recommend.</div></div><div class="bg-[var(--brand-secondary)] brightness-110 p-[2cqw] rounded-[1.5cqw] shadow-sm border border-[var(--brand-primary)]/10 transform -translate-x-[2cqw]"><div class="flex items-center gap-[1cqw] mb-[1cqw]"><div class="w-[3cqw] h-[3cqw] bg-[var(--brand-accent)]/20 rounded-full"></div><div class="font-bold text-[1.2cqw] text-[var(--brand-primary)] font-heading">Mike T.</div></div><div class="text-[1.2cqw] text-[var(--brand-primary)] opacity-70 font-body">Game changer for my business. 🚀</div></div></div></div>`,
    variables: {},
    metadata: {
      moods: ['social', 'busy'],
      purpose: ['engagement', 'engagement'],
      density: 'high',
      tags: ['comments', 'reviews', 'waterfall', 'social']
    },
    compatibleEffects: ['animation']
  },
];
