import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import GameLobby from './src/components/GameLobby';
import GameBoard from './src/components/GameBoard';
import { useGameStore } from './src/store/gameStore';

export default function App() {
  const { gameState } = useGameStore();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        
        {gameState?.status === 'playing' ? (
          <GameBoard playerId={gameState.players[0].id} />
        ) : (
          <GameLobby />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
