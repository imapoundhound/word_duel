import { create } from 'zustand';
import { GameState, Player, GameMode, GameSettings } from '../types/game';
import { getRandomWord, isValidWord, generateFeedback } from '../utils/wordValidation';

interface GameStore {
  // State
  gameState: GameState | null;
  currentMode: GameMode;
  settings: GameSettings;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createGame: (mode: GameMode, playerName: string, settings?: Partial<GameSettings>) => void;
  joinGame: (gameId: string, playerName: string) => void;
  addPlayer: (player: Omit<Player, 'id'>) => void;
  removePlayer: (playerId: string) => void;
  startGame: () => void;
  makeGuess: (playerId: string, guess: string) => void;
  endGame: () => void;
  resetGame: () => void;
  setError: (error: string | null) => void;
  addBot: () => void;
}

const defaultSettings: GameSettings = {
  maxPlayers: 4,
  maxAttempts: 6,
  wordLength: 5,
  allowBots: true,
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: null,
  currentMode: 'single',
  settings: defaultSettings,
  isLoading: false,
  error: null,

  // Actions
  createGame: (mode, playerName, customSettings = {}) => {
    const settings = { ...defaultSettings, ...customSettings };
    const targetWord = getRandomWord();
    
    const hostPlayer: Player = {
      id: `player_${Date.now()}`,
      name: playerName,
      isHost: true,
      isBot: false,
      score: 0,
      currentGuess: '',
      guesses: [],
      attempts: 0,
      hasWon: false,
    };

    const gameState: GameState = {
      id: `game_${Date.now()}`,
      status: 'waiting',
      targetWord,
      players: [hostPlayer],
      currentPlayerIndex: 0,
      maxAttempts: settings.maxAttempts,
      roundNumber: 1,
      createdAt: new Date(),
    };

    set({
      gameState,
      currentMode: mode,
      settings,
      error: null,
    });
  },

  joinGame: (gameId, playerName) => {
    const { gameState } = get();
    if (!gameState || gameState.status !== 'waiting') {
      set({ error: 'Cannot join game' });
      return;
    }

    if (gameState.players.length >= get().settings.maxPlayers) {
      set({ error: 'Game is full' });
      return;
    }

    const newPlayer: Player = {
      id: `player_${Date.now()}`,
      name: playerName,
      isHost: false,
      isBot: false,
      score: 0,
      currentGuess: '',
      guesses: [],
      attempts: 0,
      hasWon: false,
    };

    set({
      gameState: {
        ...gameState,
        players: [...gameState.players, newPlayer],
      },
    });
  },

  addPlayer: (playerData) => {
    const { gameState } = get();
    if (!gameState) return;

    const newPlayer: Player = {
      ...playerData,
      id: `player_${Date.now()}`,
    };

    set({
      gameState: {
        ...gameState,
        players: [...gameState.players, newPlayer],
      },
    });
  },

  removePlayer: (playerId) => {
    const { gameState } = get();
    if (!gameState) return;

    const updatedPlayers = gameState.players.filter(p => p.id !== playerId);
    
    set({
      gameState: {
        ...gameState,
        players: updatedPlayers,
        currentPlayerIndex: Math.min(gameState.currentPlayerIndex, updatedPlayers.length - 1),
      },
    });
  },

  startGame: () => {
    const { gameState } = get();
    if (!gameState || gameState.players.length < 2) {
      set({ error: 'Need at least 2 players to start' });
      return;
    }

    set({
      gameState: {
        ...gameState,
        status: 'playing',
        startedAt: new Date(),
      },
    });
  },

  makeGuess: (playerId, guess) => {
    const { gameState } = get();
    if (!gameState || gameState.status !== 'playing') return;

    if (!isValidWord(guess)) {
      set({ error: 'Invalid word' });
      return;
    }

    const playerIndex = gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;

    const player = gameState.players[playerIndex];
    if (player.attempts >= gameState.maxAttempts || player.hasWon) return;

    const feedback = generateFeedback(guess, gameState.targetWord);
    const isCorrect = feedback.isCorrect;

    const updatedPlayers = [...gameState.players];
    updatedPlayers[playerIndex] = {
      ...player,
      guesses: [...player.guesses, guess],
      attempts: player.attempts + 1,
      hasWon: isCorrect,
      score: isCorrect ? Math.max(0, gameState.maxAttempts - player.attempts) : player.score,
    };

    // Check if game should end
    const allPlayersFinished = updatedPlayers.every(p => 
      p.hasWon || p.attempts >= gameState.maxAttempts
    );

    set({
      gameState: {
        ...gameState,
        players: updatedPlayers,
        status: allPlayersFinished ? 'finished' : 'playing',
        endedAt: allPlayersFinished ? new Date() : undefined,
      },
    });
  },

  endGame: () => {
    const { gameState } = get();
    if (!gameState) return;

    set({
      gameState: {
        ...gameState,
        status: 'finished',
        endedAt: new Date(),
      },
    });
  },

  resetGame: () => {
    set({
      gameState: null,
      error: null,
    });
  },

  setError: (error) => {
    set({ error });
  },

  addBot: () => {
    const { gameState, settings } = get();
    if (!gameState || !settings.allowBots) return;

    const botNames = ['Bot Alpha', 'Bot Beta', 'Bot Gamma', 'Bot Delta'];
    const usedNames = gameState.players.map(p => p.name);
    const availableNames = botNames.filter(name => !usedNames.includes(name));

    if (availableNames.length === 0) return;

    const botPlayer: Player = {
      id: `bot_${Date.now()}`,
      name: availableNames[0],
      isHost: false,
      isBot: true,
      score: 0,
      currentGuess: '',
      guesses: [],
      attempts: 0,
      hasWon: false,
    };

    set({
      gameState: {
        ...gameState,
        players: [...gameState.players, botPlayer],
      },
    });
  },
}));