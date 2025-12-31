import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../services/storage';
import type { Player } from '../types';

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayers = () => {
      const loadedPlayers = storage.getPlayers();
      setPlayers(loadedPlayers);
      setLoading(false);
    };

    loadPlayers();
  }, []);

  const addPlayer = useCallback((name: string): Player | null => {
    const newPlayer: Player = {
      id: uuidv4(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };

    const success = storage.addPlayer(newPlayer);
    if (success) {
      setPlayers(prev => [...prev, newPlayer]);
      return newPlayer;
    }
    return null;
  }, []);

  const updatePlayer = useCallback((playerId: string, updates: Partial<Player>): boolean => {
    const success = storage.updatePlayer(playerId, updates);
    if (success) {
      setPlayers(prev =>
        prev.map(player =>
          player.id === playerId ? { ...player, ...updates } : player
        )
      );
    }
    return success;
  }, []);

  const deletePlayer = useCallback((playerId: string): boolean => {
    const success = storage.deletePlayer(playerId);
    if (success) {
      setPlayers(prev => prev.filter(player => player.id !== playerId));
    }
    return success;
  }, []);

  const getPlayerById = useCallback((playerId: string): Player | undefined => {
    return players.find(player => player.id === playerId);
  }, [players]);

  return {
    players,
    loading,
    addPlayer,
    updatePlayer,
    deletePlayer,
    getPlayerById,
  };
}
