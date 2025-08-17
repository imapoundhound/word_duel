import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { GameMode } from '../types/game';

const GameLobby: React.FC = () => {
  const { gameState, createGame, joinGame, addBot, startGame, settings } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [selectedMode, setSelectedMode] = useState<GameMode>('multiplayer');

  const handleCreateGame = () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    createGame(selectedMode, playerName.trim());
  };

  const handleJoinGame = () => {
    if (!playerName.trim() || !gameId.trim()) {
      Alert.alert('Error', 'Please enter both name and game ID');
      return;
    }
    joinGame(gameId.trim(), playerName.trim());
  };

  const handleAddBot = () => {
    if (gameState?.players.length && gameState.players.length < settings.maxPlayers) {
      addBot();
    }
  };

  const handleStartGame = () => {
    if (gameState?.players.length && gameState.players.length >= 2) {
      startGame();
    } else {
      Alert.alert('Error', 'Need at least 2 players to start');
    }
  };

  if (gameState?.status === 'playing') {
    return null; // Game is active, don't show lobby
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>WordDuel</Text>
      <Text style={styles.subtitle}>Multiplayer Wordle Challenge</Text>

      {!gameState ? (
        // Create/Join Game Section
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Started</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
          />

          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeButton, selectedMode === 'single' && styles.modeButtonActive]}
              onPress={() => setSelectedMode('single')}
            >
              <Text style={[styles.modeButtonText, selectedMode === 'single' && styles.modeButtonTextActive]}>
                Single Player
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, selectedMode === 'multiplayer' && styles.modeButtonActive]}
              onPress={() => setSelectedMode('multiplayer')}
            >
              <Text style={[styles.modeButtonText, selectedMode === 'multiplayer' && styles.modeButtonTextActive]}>
                Multiplayer
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleCreateGame}>
            <Text style={styles.primaryButtonText}>Create New Game</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <Text style={styles.dividerText}>OR</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Game ID"
            value={gameId}
            onChangeText={setGameId}
            maxLength={20}
          />

          <TouchableOpacity style={styles.secondaryButton} onPress={handleJoinGame}>
            <Text style={styles.secondaryButtonText}>Join Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Game Lobby Section
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Lobby</Text>
          <Text style={styles.gameId}>Game ID: {gameState.id}</Text>
          <Text style={styles.status}>Status: {gameState.status}</Text>

          <View style={styles.playersSection}>
            <Text style={styles.playersTitle}>Players ({gameState.players.length}/{settings.maxPlayers})</Text>
            {gameState.players.map((player, index) => (
              <View key={player.id} style={styles.playerItem}>
                <Text style={styles.playerName}>
                  {player.name} {player.isHost && '(Host)'} {player.isBot && '(Bot)'}
                </Text>
                {player.isHost && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => useGameStore.getState().removePlayer(player.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {gameState.status === 'waiting' && (
            <View style={styles.actions}>
              {settings.allowBots && gameState.players.length < settings.maxPlayers && (
                <TouchableOpacity style={styles.secondaryButton} onPress={handleAddBot}>
                  <Text style={styles.secondaryButtonText}>Add Bot</Text>
                </TouchableOpacity>
              )}
              
              {gameState.players.length >= 2 && (
                <TouchableOpacity style={styles.primaryButton} onPress={handleStartGame}>
                  <Text style={styles.primaryButtonText}>Start Game</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  modeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  modeButtonActive: {
    borderColor: '#3498db',
    backgroundColor: '#3498db',
  },
  modeButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  primaryButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#95a5a6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    color: '#bdc3c7',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 15,
  },
  gameId: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  playersSection: {
    marginBottom: 20,
  },
  playersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  playerName: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default GameLobby;