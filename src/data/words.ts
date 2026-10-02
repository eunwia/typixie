export const commonWords: string[] = [
  // Core typing test vocabulary (common English words)
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only',
  'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
  'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new',
  'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'great', 'between', 'need', 'large', 'under', 'never', 'each',
  'right', 'hand', 'high', 'place', 'small', 'found', 'still',
  'house', 'world', 'head', 'long', 'story', 'life', 'left', 'away',
  'point', 'home', 'water', 'room', 'mother', 'light', 'night',
  'city', 'tree', 'cross', 'farm', 'hard', 'start', 'might', 'far',
  'sea', 'draw', 'earth', 'eye', 'last', 'door', 'read', 'keep',
  'name', 'line', 'set', 'air', 'end', 'run', 'book', 'river',
  'food', 'plan', 'sure', 'form', 'kind', 'near', 'page', 'let',
  'above', 'add', 'below', 'country', 'plant', 'school', 'father',
  'land', 'part', 'side', 'group', 'often', 'turn', 'move', 'number',
  'same', 'late', 'help', 'change', 'face', 'cut', 'play', 'music',
  'white', 'close', 'open', 'begin', 'seem', 'next', 'walk', 'stop',
  'grow', 'study', 'stand', 'paper', 'girl', 'body', 'miss',
  'care', 'idea', 'north', 'once', 'base', 'hear', 'horse',
  'show', 'few', 'bring', 'hold', 'step', 'warm', 'field',
  'love', 'color', 'deep', 'early', 'again', 'main', 'road', 'rain',
  'stay', 'song', 'fact', 'round', 'short', 'dark', 'cold', 'fire',
  'done', 'watch', 'list', 'true', 'full', 'town', 'leave', 'note',
  'word', 'rest', 'class', 'heart', 'power', 'four', 'real',
  'table', 'front', 'free', 'south', 'rock', 'wind', 'half', 'teach',
  'fast', 'sing', 'voice', 'fly', 'fall', 'try', 'clear', 'lake',
  'area', 'moon', 'drive', 'pull', 'best', 'feel', 'sun', 'star',
  'red', 'green', 'blue', 'map', 'reach', 'happy', 'wait', 'hot',
  'snow', 'bed', 'sit', 'check', 'tiny', 'soft', 'wide', 'dream',
  
  // Whimsical and fairy-themed words
  'fairy', 'magic', 'sparkle', 'petal', 'forest', 'meadow', 'blossom',
  'garden', 'gentle', 'glow', 'whisper', 'sweet', 'breeze', 'wings',
  'shimmer', 'honey', 'berry', 'crystal', 'stream', 'willow', 'clover',
  'sunny', 'moss', 'dewdrop', 'peace', 'wonder', 'charm', 'cozy',
  'feather', 'flutter', 'radiant', 'twinkle', 'delicate', 'pastel',
  'pollen', 'dawn', 'dusk', 'moonlight', 'sunbeam', 'glade', 'haven',
  'serene', 'starlight', 'lilac', 'rose', 'daisy', 'violet', 'melody',
  'nymph', 'woodland', 'enchanted', 'spore', 'acorn', 'thistle', 'flora'
];

export function generateRandomWords(count: number = 70): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    result.push(commonWords[randomIndex]);
  }
  return result;
}
