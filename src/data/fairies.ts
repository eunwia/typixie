export interface Fairy {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  unlockType: 'default' | 'level' | 'shop';
  requiredLevel?: number;
  price?: number;
  element: 'Light' | 'Blossom' | 'Sun' | 'Frost' | 'Forest' | 'Moon' | 'Fungi' | 'Winter' | 'Flora' | 'Breeze';
  quote: string;
  accentColor: string;
}

export const fairies: Fairy[] = [
  {
    id: 'your-fairy',
    name: 'Your Fairy',
    title: 'First Companion',
    description: 'Your loyal fairy partner who awakens the magic in every keystroke. Gentle, attentive, and always by your side.',
    image: '/fairies/your-fairy.png',
    unlockType: 'default',
    element: 'Light',
    quote: 'Together, we make magic happen!',
    accentColor: '#F4A6B7',
  },
  {
    id: 'roselle',
    name: 'Roselle',
    title: 'Blossom Fairy',
    description: 'A delicate fairy born from soft spring cherry blossoms. She leaves a trail of soft pink petals as she glides across keys.',
    image: '/fairies/roselle-blossomfairy.png',
    unlockType: 'level',
    requiredLevel: 2,
    element: 'Blossom',
    quote: 'Bloom brightly with each word you craft.',
    accentColor: '#F4A6B7',
  },
  {
    id: 'sunnybell',
    name: 'Sunnybell',
    title: 'Sunshine Fairy',
    description: 'A radiant spirit who harnesses morning sunbeams. Her cheerful aura brings warmth and lightning-fast energy to your fingers.',
    image: '/fairies/sunnybell-sunshinefairy.png',
    unlockType: 'level',
    requiredLevel: 3,
    element: 'Sun',
    quote: 'Shine as bright as the morning sky!',
    accentColor: '#F9E7A7',
  },
  {
    id: 'frostelle',
    name: 'Frostelle',
    title: 'Ice Fairy',
    description: 'A serene crystallite fairy who calms turbulent thoughts into cool, razor-sharp focus and pinpoint accuracy.',
    image: '/fairies/frostelle-icefairy.png',
    unlockType: 'level',
    requiredLevel: 4,
    element: 'Frost',
    quote: 'Cool composure guides every keystroke.',
    accentColor: '#BEE3F8',
  },
  {
    id: 'lunelle',
    name: 'Lunelle',
    title: 'Moon Fairy',
    description: 'A mystical guardian of nocturnal dreams and soft starlight. She guides typing in peaceful tranquility beneath the moon.',
    image: '/fairies/lunelle-moonfairy.png',
    unlockType: 'level',
    requiredLevel: 5,
    element: 'Moon',
    quote: 'In quiet starlight, your thoughts dance gracefully.',
    accentColor: '#DDD6FE',
  },
  {
    id: 'snowelle',
    name: 'Snowelle',
    title: 'Winter Fairy',
    description: 'An ethereal sprite of gentle winter snowfall. Each perfect keystroke lands as softly and neatly as fresh morning snow.',
    image: '/fairies/snowelle-winterfairy.png',
    unlockType: 'level',
    requiredLevel: 6,
    element: 'Winter',
    quote: 'Purity of focus brings effortless speed.',
    accentColor: '#E2E8F0',
  },
  {
    id: 'fernie',
    name: 'Fernie',
    title: 'Forest Fairy',
    description: 'A playful nymph from ancient mossy groves. She loves the soothing sound of mechanical keyboards clicking like rain in the trees.',
    image: '/fairies/fernie-forestfairy.png',
    unlockType: 'shop',
    price: 80,
    element: 'Forest',
    quote: 'Let your rhythm flow like wind through leaves.',
    accentColor: '#B9D5A4',
  },
  {
    id: 'poppy',
    name: 'Poppy',
    title: 'Mushroom Fairy',
    description: 'A whimsical fairy living under cozy spotted toadstools. Her joyful hops and bounce add rhythm to rapid typing runs.',
    image: '/fairies/poppy-mushroomfairy.png',
    unlockType: 'shop',
    price: 150,
    element: 'Fungi',
    quote: 'Boing! Hop from key to key without missing a beat!',
    accentColor: '#FCA5A5',
  },
  {
    id: 'roswyn',
    name: 'Roswyn',
    title: 'Rose Fairy',
    description: 'An enchanting protector of velvet garden roses. Graceful and noble, she inspires eloquent and expressive writing.',
    image: '/fairies/roswyn-rosefairy.png',
    unlockType: 'shop',
    price: 280,
    element: 'Flora',
    quote: 'True elegance lies in deliberate practice.',
    accentColor: '#FDA4AF',
  },
  {
    id: 'willow',
    name: 'Willow',
    title: 'Meadow Fairy',
    description: 'A wise and soothing guardian of endless flowering meadows. She grants deep calm and flow state during long typing sessions.',
    image: '/fairies/willow-meadowfairy.png',
    unlockType: 'shop',
    price: 400,
    element: 'Breeze',
    quote: 'Breathe with the meadow breeze, and let your hands fly.',
    accentColor: '#A7F3D0',
  }
];

export const DEFAULT_FAIRY_ID = 'your-fairy';
