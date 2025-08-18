import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LetterFeedback } from '../types/game';

interface GameRowProps {
  guess: string;
  feedback?: string; // target word for feedback calculation
  isActive: boolean;
  isComplete: boolean;
  cellSize: number;
}

const GameRow: React.FC<GameRowProps> = ({ 
  guess, 
  feedback, 
  isActive, 
  isComplete, 
  cellSize 
}) => {
  const cells = [];
  const maxLength = 5;

  for (let i = 0; i < maxLength; i++) {
    const letter = guess[i] || '';
    const isFilled = letter !== '';
    
    let cellStyle = [styles.cell, { width: cellSize, height: cellSize }];
    let textStyle = [styles.letter];
    
    if (isComplete && feedback) {
      // Calculate feedback for completed rows
      const targetLetter = feedback[i];
      const isCorrect = letter === targetLetter;
      const isPresent = !isCorrect && feedback.includes(letter);
      
      if (isCorrect) {
        cellStyle.push(styles.correct);
      } else if (isPresent) {
        cellStyle.push(styles.present);
      } else if (isFilled) {
        cellStyle.push(styles.absent);
      }
    } else if (isActive && isFilled) {
      cellStyle.push(styles.filled);
    } else if (isActive) {
      cellStyle.push(styles.empty);
    } else {
      cellStyle.push(styles.empty);
    }

    cells.push(
      <View key={i} style={cellStyle}>
        <Text style={textStyle}>{letter.toUpperCase()}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.row, { height: cellSize }]}>
      {cells}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  cell: {
    borderWidth: 2,
    borderColor: '#d3d6da',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: '#ffffff',
  },
  empty: {
    borderColor: '#d3d6da',
    backgroundColor: '#ffffff',
  },
  filled: {
    borderColor: '#878a8c',
    backgroundColor: '#ffffff',
  },
  correct: {
    borderColor: '#6aaa64',
    backgroundColor: '#6aaa64',
  },
  present: {
    borderColor: '#c9b458',
    backgroundColor: '#c9b458',
  },
  absent: {
    borderColor: '#787c7e',
    backgroundColor: '#787c7e',
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default GameRow;