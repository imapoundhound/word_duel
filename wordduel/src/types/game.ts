export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isBot: boolean;
  score: number;
  currentGuess: string;
  guesses: string[];
  attempts: number;
  hasWon: boolean;
}

export interface GameState {
  id: string;
  status: 'waiting' | 'playing' | 'finished';
  targetWord: string;
  players: Player[];
  currentPlayerIndex: number;
  maxAttempts: number;
  roundNumber: number;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export interface GuessResult {
  word: string;
  feedback: LetterFeedback[];
  isCorrect: boolean;
}

export interface LetterFeedback {
  letter: string;
  status: 'correct' | 'present' | 'absent';
  position: number;
}

export interface GameSettings {
  maxPlayers: number;
  maxAttempts: number;
  wordLength: number;
  timeLimit?: number;
  allowBots: boolean;
}

export type GameMode = 'single' | 'multiplayer' | 'practice';