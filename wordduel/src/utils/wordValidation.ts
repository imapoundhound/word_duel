import { GuessResult, LetterFeedback } from '../types/game';

// Common 5-letter words for Wordle
const VALID_WORDS = [
  'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again',
  'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone',
  'along', 'alter', 'among', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena',
  'argue', 'arise', 'array', 'aside', 'asset', 'audio', 'audit', 'avoid', 'award', 'aware',
  'badly', 'baker', 'bases', 'basic', 'beach', 'began', 'begin', 'being', 'below', 'bench',
  'billy', 'birth', 'black', 'blame', 'blank', 'blind', 'block', 'blood', 'blow', 'blue',
  'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'bread', 'break', 'breed', 'brief',
  'bring', 'broad', 'broke', 'brown', 'build', 'built', 'buyer', 'cable', 'calif', 'carry',
  'catch', 'cause', 'chain', 'chair', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief',
  'child', 'china', 'chose', 'civil', 'claim', 'class', 'clean', 'clear', 'click', 'climb',
  'clock', 'close', 'coach', 'coast', 'could', 'count', 'court', 'cover', 'craft', 'crash',
  'cream', 'crime', 'cross', 'crowd', 'crown', 'crude', 'crush', 'curve', 'cycle', 'daily',
  'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'depth', 'doing', 'doubt', 'dozen',
  'draft', 'drama', 'drank', 'draw', 'dress', 'drill', 'drink', 'drive', 'drop', 'drove',
  'dying', 'eager', 'early', 'earth', 'eight', 'elite', 'empty', 'enemy', 'enjoy', 'enter',
  'entry', 'equal', 'error', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false',
  'fault', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flash',
  'fleet', 'floor', 'fluid', 'focus', 'force', 'forth', 'forty', 'forum', 'found', 'frame',
  'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny', 'giant', 'given', 'glass',
  'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass', 'grave', 'great', 'green',
  'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harry', 'heart',
  'heavy', 'hence', 'henry', 'horse', 'hotel', 'house', 'human', 'ideal', 'image', 'index',
  'inner', 'input', 'issue', 'japan', 'jimmy', 'joint', 'jones', 'judge', 'known', 'label',
  'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave', 'legal',
  'level', 'lewis', 'light', 'limit', 'links', 'lives', 'local', 'loose', 'lower', 'lucky',
  'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'maria', 'match', 'maybe', 'mayor',
  'meant', 'media', 'metal', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month',
  'moral', 'motor', 'mount', 'mouse', 'mouth', 'moved', 'movie', 'music', 'needs', 'never',
  'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse', 'occur', 'ocean', 'offer',
  'often', 'order', 'other', 'ought', 'paint', 'panel', 'paper', 'party', 'peace', 'peter',
  'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch', 'place', 'plain', 'plane', 'plant',
  'plate', 'point', 'pound', 'power', 'press', 'price', 'pride', 'prime', 'print', 'prior',
  'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite', 'radio', 'raise',
  'range', 'rapid', 'ratio', 'reach', 'ready', 'realm', 'rebel', 'refer', 'relax', 'reply',
  'right', 'rival', 'river', 'robin', 'roger', 'roman', 'rough', 'round', 'route', 'royal',
  'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape',
  'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shirt', 'shock', 'shoot', 'short',
  'shown', 'sight', 'since', 'sixth', 'sixty', 'size', 'sleep', 'slide', 'small', 'smart',
  'smile', 'smith', 'smoke', 'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare',
  'speak', 'speed', 'spend', 'spent', 'split', 'spoke', 'sport', 'staff', 'stage', 'stake',
  'stand', 'start', 'state', 'steam', 'steel', 'steep', 'steer', 'steve', 'stick', 'still',
  'stock', 'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck', 'study', 'stuff',
  'style', 'sugar', 'suite', 'super', 'sweet', 'table', 'taken', 'taste', 'taxes', 'teach',
  'teeth', 'terry', 'texas', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick',
  'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'thumb', 'tiger', 'tight',
  'timer', 'tired', 'title', 'today', 'topic', 'total', 'touch', 'tough', 'tower', 'track',
  'trade', 'train', 'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tries', 'truck',
  'truly', 'trunk', 'trust', 'truth', 'twice', 'under', 'undue', 'union', 'unity', 'until',
  'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'video', 'virus', 'visit',
  'vital', 'voice', 'waste', 'watch', 'water', 'wheel', 'where', 'which', 'while', 'white',
  'whole', 'whose', 'woman', 'women', 'world', 'worry', 'worse', 'worst', 'worth', 'would',
  'wound', 'write', 'wrong', 'wrote', 'yield', 'young', 'youth'
];

export const isValidWord = (word: string): boolean => {
  return VALID_WORDS.includes(word.toLowerCase());
};

export const generateFeedback = (guess: string, targetWord: string): GuessResult => {
  const feedback: LetterFeedback[] = [];
  const target = targetWord.toLowerCase();
  const guessLower = guess.toLowerCase();
  
  // Create a map of target word letter counts
  const targetLetterCounts = new Map<string, number>();
  for (const letter of target) {
    targetLetterCounts.set(letter, (targetLetterCounts.get(letter) || 0) + 1);
  }
  
  // First pass: mark correct letters
  for (let i = 0; i < guessLower.length; i++) {
    if (guessLower[i] === target[i]) {
      feedback.push({
        letter: guess[i],
        status: 'correct',
        position: i
      });
      targetLetterCounts.set(guessLower[i], targetLetterCounts.get(guessLower[i])! - 1);
    } else {
      feedback.push({
        letter: guess[i],
        status: 'absent',
        position: i
      });
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < feedback.length; i++) {
    if (feedback[i].status === 'absent') {
      const letter = guessLower[i];
      if (targetLetterCounts.get(letter) && targetLetterCounts.get(letter)! > 0) {
        feedback[i].status = 'present';
        targetLetterCounts.set(letter, targetLetterCounts.get(letter)! - 1);
      }
    }
  }
  
  return {
    word: guess,
    feedback,
    isCorrect: guessLower === target
  };
};

export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * VALID_WORDS.length);
  return VALID_WORDS[randomIndex];
};