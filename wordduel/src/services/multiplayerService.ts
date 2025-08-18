import { GameState, Player, GameMode } from '../types/game';
import { getRandomWord } from '../utils/wordValidation';

class LocalMultiplayerService {
  private games: Map<string, GameState> = new Map();
  private gameSubscribers: Map<string, Set<(game: GameState) => void>> = new Map();

  // Create a new game
  createGame(mode: GameMode, playerName: string, maxPlayers: number = 4): string {
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      id: gameId,
      status: 'waiting',
      targetWord,
      players: [hostPlayer],
      currentPlayerIndex: 0,
      maxAttempts: 6,
      roundNumber: 1,
      createdAt: new Date(),
    };

    this.games.set(gameId, gameState);
    this.gameSubscribers.set(gameId, new Set());
    
    return gameId;
  }

  // Join an existing game
  joinGame(gameId: string, playerName: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'waiting') {
      return false;
    }

    if (game.players.length >= 4) {
      return false;
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

    game.players.push(newPlayer);
    this.notifySubscribers(gameId, game);
    
    return true;
  }

  // Start a game
  startGame(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.players.length < 2) {
      return false;
    }

    game.status = 'playing';
    game.startedAt = new Date();
    this.notifySubscribers(gameId, game);
    
    return true;
  }

  // Make a guess
  makeGuess(gameId: string, playerId: string, guess: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'playing') {
      return false;
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player || player.hasWon || player.attempts >= game.maxAttempts) {
      return false;
    }

    // Add the guess
    player.guesses.push(guess);
    player.attempts += 1;

    // Check if correct
    if (guess.toLowerCase() === game.targetWord.toLowerCase()) {
      player.hasWon = true;
      player.score = Math.max(0, game.maxAttempts - player.attempts + 1);
    }

    // Check if game should end
    const allPlayersFinished = game.players.every(p => 
      p.hasWon || p.attempts >= game.maxAttempts
    );

    if (allPlayersFinished) {
      game.status = 'finished';
      game.endedAt = new Date();
    }

    this.notifySubscribers(gameId, game);
    return true;
  }

  // Add a bot player
  addBot(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.players.length >= 4) {
      return false;
    }

    const botNames = ['Bot Alpha', 'Bot Beta', 'Bot Gamma', 'Bot Delta'];
    const usedNames = game.players.map(p => p.name);
    const availableNames = botNames.filter(name => !usedNames.includes(name));

    if (availableNames.length === 0) {
      return false;
    }

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

    game.players.push(botPlayer);
    this.notifySubscribers(gameId, game);
    
    return true;
  }

  // Subscribe to game updates
  subscribeToGame(gameId: string, callback: (game: GameState) => void): () => void {
    if (!this.gameSubscribers.has(gameId)) {
      this.gameSubscribers.set(gameId, new Set());
    }

    this.gameSubscribers.get(gameId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.gameSubscribers.get(gameId);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  // Get current game state
  getGame(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  // Remove a player
  removePlayer(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game) {
      return false;
    }

    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      return false;
    }

    game.players.splice(playerIndex, 1);
    
    if (game.players.length === 0) {
      this.games.delete(gameId);
      this.gameSubscribers.delete(gameId);
    } else {
      this.notifySubscribers(gameId, game);
    }
    
    return true;
  }

  // Private method to notify subscribers
  private notifySubscribers(gameId: string, game: GameState) {
    const subscribers = this.gameSubscribers.get(gameId);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback({ ...game });
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  // Clean up old games
  cleanupOldGames() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    for (const [gameId, game] of this.games.entries()) {
      if (now - game.createdAt.getTime() > oneHour) {
        this.games.delete(gameId);
        this.gameSubscribers.delete(gameId);
      }
    }
  }
}

// Create singleton instance
export const multiplayerService = new LocalMultiplayerService();

// Clean up old games every 10 minutes
setInterval(() => {
  multiplayerService.cleanupOldGames();
}, 10 * 60 * 1000);

export default multiplayerService;