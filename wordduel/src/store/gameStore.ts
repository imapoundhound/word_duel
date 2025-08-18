import { create } from 'zustand';
import { GameState, Player, GameMode, GameSettings } from '../types/game';
import { getRandomWord, isValidWord, generateFeedback } from '../utils/wordValidation';
import { multiplayerService } from '../services/multiplayerService';

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
    
    try {
      const gameId = multiplayerService.createGame(mode, playerName, settings.maxPlayers);
      const gameState = multiplayerService.getGame(gameId);
      
      if (gameState) {
        set({
          gameState,
          currentMode: mode,
          settings,
          error: null,
        });

        // Subscribe to game updates
        multiplayerService.subscribeToGame(gameId, (updatedGame) => {
          set({ gameState: updatedGame });
        });
      }
    } catch (error) {
      set({ error: 'Failed to create game' });
    }
  },

  joinGame: (gameId, playerName) => {
    try {
      const success = multiplayerService.joinGame(gameId, playerName);
      if (success) {
        const gameState = multiplayerService.getGame(gameId);
        if (gameState) {
          set({ gameState, error: null });
          
          // Subscribe to game updates
          multiplayerService.subscribeToGame(gameId, (updatedGame) => {
            set({ gameState: updatedGame });
          });
        }
      } else {
        set({ error: 'Cannot join game' });
      }
    } catch (error) {
      set({ error: 'Failed to join game' });
    }
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

    multiplayerService.removePlayer(gameState.id, playerId);
  },

  startGame: () => {
    const { gameState } = get();
    if (!gameState || gameState.players.length < 2) {
      set({ error: 'Need at least 2 players to start' });
      return;
    }

    try {
      const success = multiplayerService.startGame(gameState.id);
      if (!success) {
        set({ error: 'Failed to start game' });
      }
    } catch (error) {
      set({ error: 'Failed to start game' });
    }
  },

  makeGuess: (playerId, guess) => {
    const { gameState } = get();
    if (!gameState || gameState.status !== 'playing') return;

    if (!isValidWord(guess)) {
      set({ error: 'Invalid word' });
      return;
    }

    try {
      const success = multiplayerService.makeGuess(gameState.id, playerId, guess);
      if (!success) {
        set({ error: 'Failed to submit guess' });
      }
    } catch (error) {
      set({ error: 'Failed to submit guess' });
    }
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

    try {
      const success = multiplayerService.addBot(gameState.id);
      if (!success) {
        set({ error: 'Failed to add bot' });
      }
    } catch (error) {
      set({ error: 'Failed to add bot' });
    }
  },
}));