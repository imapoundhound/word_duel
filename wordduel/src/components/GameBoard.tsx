import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { LetterFeedback } from '../types/game';
import GameRow from './GameRow';
import Keyboard from './Keyboard';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width * 0.9, 400);
const CELL_SIZE = BOARD_SIZE / 5;

interface GameBoardProps {
  playerId: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ playerId }) => {
  const { gameState, makeGuess, setError } = useGameStore();
  const [currentGuess, setCurrentGuess] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const player = gameState?.players.find(p => p.id === playerId);
  const maxAttempts = gameState?.maxAttempts || 6;

  useEffect(() => {
    if (gameState?.status === 'playing' && player?.hasWon) {
      setCurrentGuess('');
    }
  }, [gameState?.status, player?.hasWon]);

  const handleKeyPress = (key: string) => {
    if (isAnimating || !gameState || gameState.status !== 'playing') return;
    if (player?.hasWon || player?.attempts >= maxAttempts) return;

    if (key === 'ENTER') {
      if (currentGuess.length === 5) {
        submitGuess();
      } else {
        setError('Word must be 5 letters long');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const submitGuess = async () => {
    if (!gameState || !player) return;

    setIsAnimating(true);
    setError(null);

    try {
      makeGuess(playerId, currentGuess);
      setCurrentGuess('');
    } catch (error) {
      setError('Failed to submit guess');
    } finally {
      setIsAnimating(false);
    }
  };

  if (!gameState || !player) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Game not found</Text>
      </View>
    );
  }

  const rows = [];
  for (let i = 0; i < maxAttempts; i++) {
    const isCurrentRow = i === player.attempts;
    const rowGuess = isCurrentRow ? currentGuess : player.guesses[i] || '';
    
    rows.push(
      <GameRow
        key={i}
        guess={rowGuess}
        feedback={player.guesses[i] ? gameState.targetWord : undefined}
        isActive={isCurrentRow}
        isComplete={i < player.attempts}
        cellSize={CELL_SIZE}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {rows}
      </View>
      
      <Keyboard
        onKeyPress={handleKeyPress}
        feedback={player.guesses.flatMap(guess => 
          guess ? guess.split('').map((letter, index) => ({
            letter,
            status: guess[index] === gameState.targetWord[index] ? 'correct' : 
                    gameState.targetWord.includes(guess[index]) ? 'present' : 'absent',
            position: index
          })) : []
        )}
        disabled={isAnimating || player.hasWon || player.attempts >= maxAttempts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE * 1.2,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#666',
  },
});

export default GameBoard;