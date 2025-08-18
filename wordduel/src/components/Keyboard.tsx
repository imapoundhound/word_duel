import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LetterFeedback } from '../types/game';

const { width } = Dimensions.get('window');
const KEYBOARD_WIDTH = Math.min(width * 0.95, 500);

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  feedback: LetterFeedback[];
  disabled: boolean;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, feedback, disabled }) => {
  const keyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const getKeyStyle = (key: string) => {
    const baseStyle = [styles.key];
    
    if (key === 'ENTER' || key === 'BACKSPACE') {
      baseStyle.push(styles.specialKey);
    } else {
      // Find feedback for this letter
      const letterFeedback = feedback.find(f => f.letter.toUpperCase() === key);
      if (letterFeedback) {
        switch (letterFeedback.status) {
          case 'correct':
            baseStyle.push(styles.correct);
            break;
          case 'present':
            baseStyle.push(styles.present);
            break;
          case 'absent':
            baseStyle.push(styles.absent);
            break;
        }
      } else {
        baseStyle.push(styles.default);
      }
    }

    return baseStyle;
  };

  const getKeyText = (key: string) => {
    if (key === 'BACKSPACE') return '⌫';
    if (key === 'ENTER') return '↵';
    return key;
  };

  const getKeyWidth = (key: string) => {
    if (key === 'ENTER' || key === 'BACKSPACE') {
      return { width: 65 };
    }
    return { width: 35 };
  };

  return (
    <View style={styles.container}>
      {keyRows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[getKeyStyle(key), getKeyWidth(key)]}
              onPress={() => !disabled && onKeyPress(key)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.keyText,
                (key === 'ENTER' || key === 'BACKSPACE') && styles.specialKeyText
              ]}>
                {getKeyText(key)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: KEYBOARD_WIDTH,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  key: {
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: '#d3d6da',
  },
  default: {
    backgroundColor: '#d3d6da',
  },
  correct: {
    backgroundColor: '#6aaa64',
  },
  present: {
    backgroundColor: '#c9b458',
  },
  absent: {
    backgroundColor: '#787c7e',
  },
  specialKey: {
    backgroundColor: '#878a8c',
  },
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  specialKeyText: {
    fontSize: 14,
  },
});

export default Keyboard;