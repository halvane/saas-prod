import React from 'react';
import { 
  Type, Image, Square, Circle, Triangle, Minus, Upload, Search, Layers, Lock, Eye, EyeOff, Trash2, MoveUp, MoveDown,
  Hexagon, Octagon, Pentagon, Star, Heart, Cloud, MessageCircle, Zap, Sun, Moon, Check, X, Shield, Tag, Bookmark, 
  Layout, Smartphone, Monitor, CreditCard, Ticket, Stamp, Facebook, Instagram, Twitter, Linkedin, Youtube, Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

interface ToolPanelProps {
  onClose: () => void;
  addElement: (type: any, payload?: any) => void;
}

export function TextPanel({ onClose, addElement }: ToolPanelProps) {
  return (
    <div className="absolute top-16 left-4 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 z-50 animate-in slide-in-from-left-5 fade-in duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800">Text</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 rounded-full">×</Button>
      </div>
      
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start text-left h-12 text-2xl font-bold"
          onClick={() => addElement('text', { text: 'Add a heading', fontSize: 48, fontWeight: 'bold' })}
        >
          Add a heading
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left h-10 text-lg font-semibold"
          onClick={() => addElement('text', { text: 'Add a subheading', fontSize: 32, fontWeight: 'semibold' })}
        >
          Add a subheading
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left h-8 text-sm"
          onClick={() => addElement('text', { text: 'Add a little bit of body text', fontSize: 16, fontWeight: 'normal' })}
        >
          Add a little bit of body text
        </Button>
      </div>

      <div className="mt-6">
        <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Font Combinations</h4>
        <ScrollArea className="h-48 rounded-md border p-2">
          <div className="grid grid-cols-1 gap-2">
            {/* Placeholders for font combinations */}
            <div className="p-2 hover:bg-slate-50 rounded cursor-pointer border border-transparent hover:border-purple-200 transition-all" onClick={() => addElement('text', { text: 'GLOW', fontSize: 60, fontFamily: 'Inter', fontWeight: '900', fill: '#8b5cf6' })}>
              <span className="text-4xl font-black text-purple-500">GLOW</span>
            </div>
            <div className="p-2 hover:bg-slate-50 rounded cursor-pointer border border-transparent hover:border-pink-200 transition-all" onClick={() => addElement('text', { text: 'Sale', fontSize: 60, fontFamily: 'Serif', fontStyle: 'italic', fill: '#ec4899' })}>
              <span className="text-4xl font-serif italic text-pink-500">Sale</span>
            </div>
             <div className="p-2 hover:bg-slate-50 rounded cursor-pointer border border-transparent hover:border-blue-200 transition-all" onClick={() => addElement('text', { text: 'Modern', fontSize: 40, fontFamily: 'Monospace', letterSpacing: '0.2em', fill: '#3b82f6' })}>
              <span className="text-2xl font-mono tracking-widest text-blue-500 uppercase">Modern</span>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export function MediaPanel({ onClose, addElement }: ToolPanelProps) {
  return (
    <div className="absolute top-16 left-4 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 z-50 animate-in slide-in-from-left-5 fade-in duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800">Media</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 rounded-full">×</Button>
      </div>

      <div className="mb-4">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2">
          <Upload className="w-4 h-4" /> Upload Media
        </Button>
      </div>

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search Unsplash..." className="pl-8" />
        </div>

        <TabsContent value="photos" className="mt-0">
          <ScrollArea className="h-[300px] pr-2">
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-slate-100 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group relative"
                  onClick={() => addElement('image', { src: `https://picsum.photos/400/400?random=${i}` })}
                >
                  <img 
                    src={`https://picsum.photos/200/200?random=${i}`} 
                    alt="Stock" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="videos">
          <div className="flex flex-col items-center justify-center h-[300px] text-slate-400 text-sm">
            <p>Video support coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ElementsPanel({ onClose, addElement }: ToolPanelProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('shapes');

  const categories = [
    { id: 'shapes', label: 'Shapes' },
    { id: 'frames', label: 'Frames' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'badges', label: 'Badges' },
    { id: 'social', label: 'Social' },
  ];

  // --- SHAPES ---
  const shapes = [
    { label: 'Rectangle', icon: <Square className="w-6 h-6" />, action: () => addElement('rectangle') },
    { label: 'Circle', icon: <Circle className="w-6 h-6" />, action: () => addElement('circle') },
    { label: 'Triangle', icon: <Triangle className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:triangle.svg?color=%23666' }) },
    { label: 'Star', icon: <Star className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:star.svg?color=%23666' }) },
    { label: 'Heart', icon: <Heart className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:heart.svg?color=%23666' }) },
    { label: 'Hexagon', icon: <Hexagon className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:hexagon.svg?color=%23666' }) },
    { label: 'Octagon', icon: <Octagon className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:octagon.svg?color=%23666' }) },
    { label: 'Pentagon', icon: <Pentagon className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:pentagon.svg?color=%23666' }) },
    { label: 'Cloud', icon: <Cloud className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:cloud.svg?color=%23666' }) },
    { label: 'Message', icon: <MessageCircle className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:message.svg?color=%23666' }) },
    { label: 'Zap', icon: <Zap className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:lightning-bolt.svg?color=%23666' }) },
    { label: 'Sun', icon: <Sun className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:white-balance-sunny.svg?color=%23666' }) },
    { label: 'Moon', icon: <Moon className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:moon-waning-crescent.svg?color=%23666' }) },
    { label: 'Check', icon: <Check className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:check-bold.svg?color=%23666' }) },
    { label: 'X', icon: <X className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:close-thick.svg?color=%23666' }) },
    { label: 'Shield', icon: <Shield className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:shield.svg?color=%23666' }) },
    { label: 'Tag', icon: <Tag className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:tag.svg?color=%23666' }) },
    { label: 'Bookmark', icon: <Bookmark className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:bookmark.svg?color=%23666' }) },
    { label: 'Arrow R', icon: <span className="text-xl">→</span>, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:arrow-right.svg?color=%23666' }) },
    { label: 'Arrow L', icon: <span className="text-xl">←</span>, action: () => addElement('image', { src: 'https://api.iconify.design/mdi:arrow-left.svg?color=%23666' }) },
  ];

  // --- FRAMES ---
  const frames = [
    { label: 'Phone', icon: <Smartphone className="w-6 h-6" />, action: () => addElement('rectangle', { width: 180, height: 320, borderRadius: 24, border: '4px solid #333', backgroundColor: 'transparent' }) },
    { label: 'Tablet', icon: <div className="w-5 h-6 border-2 border-current rounded-sm" />, action: () => addElement('rectangle', { width: 240, height: 320, borderRadius: 16, border: '4px solid #333', backgroundColor: 'transparent' }) },
    { label: 'Browser', icon: <Layout className="w-6 h-6" />, action: () => addElement('rectangle', { width: 300, height: 200, borderRadius: 8, border: '2px solid #ccc', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }) },
    { label: 'Polaroid', icon: <div className="w-5 h-6 bg-white border border-current p-1"><div className="w-full h-3/4 bg-slate-200"/></div>, action: () => addElement('rectangle', { width: 220, height: 260, backgroundColor: '#fff', padding: '16px 16px 60px 16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }) },
    { label: 'Circle Frame', icon: <Circle className="w-6 h-6 border-2 border-dashed border-current rounded-full" />, action: () => addElement('circle', { width: 200, height: 200, border: '4px solid #333', backgroundColor: 'transparent' }) },
    { label: 'Card', icon: <CreditCard className="w-6 h-6" />, action: () => addElement('rectangle', { width: 300, height: 180, borderRadius: 12, backgroundColor: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }) },
    { label: 'Ticket', icon: <Ticket className="w-6 h-6" />, action: () => addElement('rectangle', { width: 200, height: 100, borderRadius: 8, border: '2px dashed #333', backgroundColor: '#fef3c7' }) },
    { label: 'Stamp', icon: <Stamp className="w-6 h-6" />, action: () => addElement('rectangle', { width: 120, height: 120, border: '4px dotted #333', borderRadius: 8, backgroundColor: '#f1f5f9' }) },
    { label: 'Quote', icon: <MessageCircle className="w-6 h-6" />, action: () => addElement('rectangle', { width: 280, height: 120, borderRadius: 0, borderLeft: '4px solid #333', backgroundColor: '#f8fafc', padding: 16 }) },
    { label: 'Monitor', icon: <Monitor className="w-6 h-6" />, action: () => addElement('rectangle', { width: 320, height: 180, borderRadius: 8, border: '8px solid #1e293b', backgroundColor: '#0f172a' }) },
  ];

  // --- BUTTONS ---
  const createButton = (label: string, bg: string, color: string, radius: number = 6, outline: boolean = false) => ({
    label: `${label} ${outline ? 'Outline' : ''}`,
    preview: <div className={`px-3 py-1.5 text-[10px] rounded-${radius > 20 ? 'full' : 'sm'} ${outline ? 'border border-current' : ''}`} style={{ backgroundColor: outline ? 'transparent' : bg, color: outline ? bg : color, borderColor: bg }}>Button</div>,
    action: () => addElement('text', { 
      content: 'Button', 
      backgroundColor: outline ? 'transparent' : bg, 
      color: outline ? bg : color, 
      border: outline ? `2px solid ${bg}` : 'none',
      borderRadius: radius, 
      padding: 12,
      fontSize: 16,
      textAlign: 'center',
      width: 120,
      height: 44,
      fontWeight: '600'
    })
  });

  const buttons = [
    createButton('Blue', '#2563eb', '#fff'),
    createButton('Purple', '#9333ea', '#fff'),
    createButton('Black', '#000000', '#fff'),
    createButton('Red', '#dc2626', '#fff'),
    createButton('Green', '#16a34a', '#fff'),
    createButton('Blue', '#2563eb', '#fff', 6, true),
    createButton('Purple', '#9333ea', '#fff', 6, true),
    createButton('Black', '#000000', '#fff', 6, true),
    createButton('Pill Blue', '#2563eb', '#fff', 999),
    createButton('Pill Black', '#000000', '#fff', 999),
    createButton('Pill Outline', '#000000', '#fff', 999, true),
    createButton('Ghost', 'transparent', '#64748b', 6),
    { 
      label: 'Gradient', 
      preview: <div className="px-3 py-1.5 text-[10px] rounded bg-gradient-to-r from-pink-500 to-violet-500 text-white">Button</div>,
      action: () => addElement('text', { content: 'Button', backgroundImage: 'linear-gradient(to right, #ec4899, #8b5cf6)', color: '#fff', borderRadius: 6, padding: 12, fontSize: 16, textAlign: 'center', width: 120, height: 44, fontWeight: '600' }) 
    },
    { 
      label: '3D', 
      preview: <div className="px-3 py-1.5 text-[10px] rounded bg-blue-500 text-white border-b-4 border-blue-700">Button</div>,
      action: () => addElement('text', { content: 'Button', backgroundColor: '#3b82f6', color: '#fff', borderRadius: 6, borderBottom: '4px solid #1d4ed8', padding: 12, fontSize: 16, textAlign: 'center', width: 120, height: 48, fontWeight: '600' }) 
    },
  ];

  // --- BADGES ---
  const createBadge = (text: string, bg: string, color: string = '#fff', radius: number = 4) => ({
    label: text,
    preview: <div className="px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: bg, color, borderRadius: radius }}>{text}</div>,
    action: () => addElement('text', { content: text, backgroundColor: bg, color, borderRadius: radius, fontSize: 14, fontWeight: 'bold', textAlign: 'center', width: 'auto', padding: '4px 12px' })
  });

  const badges = [
    createBadge('SALE', '#dc2626'),
    createBadge('NEW', '#16a34a'),
    createBadge('HOT', '#ea580c'),
    createBadge('FREE', '#2563eb'),
    createBadge('PRO', '#000000'),
    createBadge('BETA', '#7c3aed'),
    createBadge('50% OFF', '#db2777'),
    createBadge('SOLD OUT', '#475569'),
    createBadge('LIMITED', '#ca8a04'),
    createBadge('TOP', '#0891b2'),
    createBadge('VERIFIED', '#059669', '#fff', 999),
    createBadge('PREMIUM', '#f59e0b', '#fff', 999),
    createBadge('ELITE', '#4f46e5', '#fff', 999),
    createBadge('VIP', '#be185d', '#fff', 999),
    {
      label: 'VS Badge',
      preview: <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-[8px] border border-black">VS</div>,
      action: () => addElement('text', { content: 'VS', backgroundColor: '#facc15', color: '#000000', borderRadius: 999, border: '4px solid #000000', fontSize: 24, fontWeight: '900', textAlign: 'center', width: 80, height: 80, lineHeight: 3.3 })
    },
    {
      label: 'Ribbon',
      preview: <div className="px-2 py-0.5 bg-red-500 text-white text-[9px] relative">Ribbon</div>,
      action: () => addElement('text', { content: 'BEST VALUE', backgroundColor: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center', width: 120, padding: '8px' })
    }
  ];

  // --- SOCIAL ---
  const social = [
    { label: 'Facebook', icon: <Facebook className="w-6 h-6 text-blue-600" />, action: () => addElement('image', { src: 'https://api.iconify.design/logos:facebook.svg' }) },
    { label: 'Instagram', icon: <Instagram className="w-6 h-6 text-pink-600" />, action: () => addElement('image', { src: 'https://api.iconify.design/skill-icons:instagram.svg' }) },
    { label: 'Twitter', icon: <Twitter className="w-6 h-6 text-sky-500" />, action: () => addElement('image', { src: 'https://api.iconify.design/logos:twitter.svg' }) },
    { label: 'LinkedIn', icon: <Linkedin className="w-6 h-6 text-blue-700" />, action: () => addElement('image', { src: 'https://api.iconify.design/logos:linkedin-icon.svg' }) },
    { label: 'YouTube', icon: <Youtube className="w-6 h-6 text-red-600" />, action: () => addElement('image', { src: 'https://api.iconify.design/logos:youtube-icon.svg' }) },
    { label: 'GitHub', icon: <Github className="w-6 h-6" />, action: () => addElement('image', { src: 'https://api.iconify.design/logos:github-icon.svg' }) },
    { label: 'TikTok', icon: <span className="font-bold">TikTok</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:tiktok-icon.svg' }) },
    { label: 'Pinterest', icon: <span className="font-bold text-red-600">Pin</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:pinterest.svg' }) },
    { label: 'Discord', icon: <span className="font-bold text-indigo-500">Discord</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:discord-icon.svg' }) },
    { label: 'WhatsApp', icon: <span className="font-bold text-green-500">WA</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:whatsapp-icon.svg' }) },
    { label: 'Telegram', icon: <span className="font-bold text-sky-400">TG</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:telegram.svg' }) },
    { label: 'Snapchat', icon: <span className="font-bold text-yellow-400">Snap</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:snapchat.svg' }) },
    { label: 'Reddit', icon: <span className="font-bold text-orange-500">Reddit</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:reddit-icon.svg' }) },
    { label: 'Medium', icon: <span className="font-bold">Medium</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:medium-icon.svg' }) },
    { label: 'Spotify', icon: <span className="font-bold text-green-500">Spotify</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:spotify-icon.svg' }) },
    { label: 'Twitch', icon: <span className="font-bold text-purple-500">Twitch</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:twitch.svg' }) },
    { label: 'Slack', icon: <span className="font-bold text-purple-600">Slack</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:slack-icon.svg' }) },
    { label: 'Dribbble', icon: <span className="font-bold text-pink-500">Drib</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:dribbble-icon.svg' }) },
    { label: 'Behance', icon: <span className="font-bold text-blue-600">Be</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:behance.svg' }) },
    { label: 'Figma', icon: <span className="font-bold text-purple-400">Figma</span>, action: () => addElement('image', { src: 'https://api.iconify.design/logos:figma.svg' }) },
  ];

  const filterItems = (items: any[]) => items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="absolute top-16 left-4 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 z-50 animate-in slide-in-from-left-5 fade-in duration-200 flex flex-col max-h-[80vh]">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-semibold text-slate-800">Elements</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 rounded-full">×</Button>
      </div>

      <div className="relative mb-4 shrink-0">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search elements..." 
          className="pl-8" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="shapes" value={activeCategory} onValueChange={setActiveCategory} className="w-full flex-1 flex flex-col min-h-0">
        <ScrollArea className="w-full shrink-0 mb-2">
          <TabsList className="w-full justify-start">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs px-3">{cat.label}</TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <ScrollArea className="flex-1 -mr-3 pr-3">
          <TabsContent value="shapes" className="mt-0">
            <div className="grid grid-cols-4 gap-2">
              {filterItems(shapes).map((shape, i) => (
                <button 
                  key={i}
                  onClick={shape.action}
                  className="aspect-square bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-slate-100 hover:border-purple-200 group p-1"
                  title={shape.label}
                >
                  <div className="text-slate-600 group-hover:text-purple-600 transition-colors scale-75">
                    {shape.icon}
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="frames" className="mt-0">
            <div className="grid grid-cols-3 gap-3">
              {filterItems(frames).map((frame, i) => (
                <button 
                  key={i}
                  onClick={frame.action}
                  className="aspect-square bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors border border-slate-100 hover:border-purple-200 p-2 group"
                >
                  <div className="text-slate-400 group-hover:text-purple-500 transition-colors">
                    {frame.icon}
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium truncate w-full text-center">{frame.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buttons" className="mt-0">
            <div className="grid grid-cols-2 gap-3">
              {filterItems(buttons).map((btn, i) => (
                <button 
                  key={i}
                  onClick={btn.action}
                  className="h-16 bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors border border-slate-100 hover:border-purple-200 p-2"
                >
                  {btn.preview}
                  <span className="text-[9px] text-slate-500 font-medium">{btn.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-0">
            <div className="grid grid-cols-3 gap-3">
              {filterItems(badges).map((badge, i) => (
                <button 
                  key={i}
                  onClick={badge.action}
                  className="aspect-square bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors border border-slate-100 hover:border-purple-200 p-1"
                >
                  {badge.preview}
                  <span className="text-[9px] text-slate-500 font-medium truncate w-full text-center">{badge.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-0">
            <div className="grid grid-cols-4 gap-2">
              {filterItems(social).map((item, i) => (
                <button 
                  key={i}
                  onClick={item.action}
                  className="aspect-square bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-slate-100 hover:border-purple-200 group p-1"
                  title={item.label}
                >
                  <div className="scale-75">
                    {item.icon}
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

interface LayersPanelProps {
  elements: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function LayersPanel({ elements, selectedId, onSelect, onReorder, onDelete, onClose }: LayersPanelProps) {
  return (
    <div className="absolute top-16 right-4 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 z-50 animate-in slide-in-from-right-5 fade-in duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4" /> Layers
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 rounded-full">×</Button>
      </div>

      <ScrollArea className="h-[400px] pr-2">
        <div className="space-y-1">
          {[...elements].reverse().map((el, index) => (
            <div 
              key={el.id}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors group ${
                selectedId === el.id ? 'bg-purple-100 text-purple-900' : 'hover:bg-slate-50 text-slate-700'
              }`}
              onClick={() => onSelect(el.id)}
            >
              <div className="w-4 h-4 flex items-center justify-center text-slate-400">
                {el.type === 'text' && <Type className="w-3 h-3" />}
                {el.type === 'image' && <Image className="w-3 h-3" />}
                {el.type === 'rectangle' && <Square className="w-3 h-3" />}
                {el.type === 'circle' && <Circle className="w-3 h-3" />}
              </div>
              
              <span className="flex-1 truncate font-medium">
                {el.type === 'text' ? (el.content || 'Text') : `${el.type} ${elements.length - index}`}
              </span>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onReorder(el.id, 'up'); }}
                  className="p-1 hover:bg-slate-200 rounded"
                >
                  <MoveUp className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onReorder(el.id, 'down'); }}
                  className="p-1 hover:bg-slate-200 rounded"
                >
                  <MoveDown className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(el.id); }}
                  className="p-1 hover:bg-red-100 text-red-500 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          {elements.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No layers yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
