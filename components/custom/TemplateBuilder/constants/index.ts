// Canva-style Assets
export const TEXT_PRESETS = [
  { name: 'Heading', fontSize: 64, fontWeight: 'bold', content: 'Add a heading' },
  { name: 'Subheading', fontSize: 32, fontWeight: '600', content: 'Add a subheading' },
  { name: 'Body', fontSize: 16, fontWeight: 'normal', content: 'Add a little bit of body text' },
];

export const TEXT_EFFECTS = [
  { name: 'Neon', style: { color: '#fff', textShadow: '0 0 5px #fff, 0 0 10px #ff00de, 0 0 20px #ff00de', fontFamily: 'sans-serif', fontWeight: 'bold' } },
  { name: 'Hollow', style: { color: 'transparent', WebkitTextStroke: '2px #000', fontFamily: 'sans-serif', fontWeight: '900' } },
  { name: 'Glitch', style: { color: '#000', textShadow: '2px 2px #ff00de, -2px -2px #00ffff', fontFamily: 'monospace', fontWeight: 'bold' } },
  { name: '3D', style: { color: '#ddd', textShadow: '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)', fontFamily: 'sans-serif', fontWeight: '900' } },
  { name: 'Shadow', style: { color: '#333', textShadow: '5px 5px 0px rgba(0,0,0,0.2)', fontFamily: 'serif', fontWeight: 'bold' } },
  { name: 'Echo', style: { color: '#333', textShadow: '-4px -4px 0 #ff00de, 4px 4px 0 #00ffff', fontFamily: 'sans-serif', fontWeight: 'bold' } },
];

export const SHAPE_PRESETS = [
  { type: 'rectangle', label: 'Square', borderRadius: 0 },
  { type: 'rectangle', label: 'Rounded', borderRadius: 20 },
  { type: 'circle', label: 'Circle' },
  { type: 'rectangle', label: 'Border', backgroundColor: 'transparent', borderWidth: 4, borderColor: '#000' },
];
