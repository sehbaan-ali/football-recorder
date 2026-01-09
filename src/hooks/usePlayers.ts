import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';
import type { Player } from '../types';

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const loadedPlayers = await api.players.getAll();
        setPlayers(loadedPlayers);
        setError(null);
      } catch (err) {
        console.error('Error loading players:', err);
        setError('Failed to load players');
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();

    // TODO: Add Azure SignalR real-time updates later
    // For now, data updates on page refresh or after mutations
  }, []);

  const addPlayer = useCallback(async (name: string, position: string): Promise<Player | null> => {
    try {
      const newPlayer = await api.players.create(name, position);
      setPlayers(prev => [...prev, newPlayer]);
      return newPlayer;
    } catch (err) {
      console.error('Error adding player:', err);
      setError('Failed to add player');
      return null;
    }
  }, []);

  const updatePlayer = useCallback(async (playerId: string, updates: Partial<Player>): Promise<boolean> => {
    try {
      const updatedPlayer = await api.players.update(playerId, updates);
      setPlayers(prev =>
        prev.map(player =>
          player.id === playerId ? updatedPlayer : player
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating player:', err);
      setError('Failed to update player');
      return false;
    }
  }, []);

  const deletePlayer = useCallback(async (playerId: string): Promise<boolean> => {
    try {
      await api.players.delete(playerId);
      setPlayers(prev => prev.filter(player => player.id !== playerId));
      return true;
    } catch (err) {
      console.error('Error deleting player:', err);
      setError('Failed to delete player');
      return false;
    }
  }, []);

  const archivePlayer = useCallback(async (playerId: string): Promise<boolean> => {
    try {
      const updatedPlayer = await api.players.archive(playerId);
      setPlayers(prev =>
        prev.map(player =>
          player.id === playerId ? updatedPlayer : player
        )
      );
      return true;
    } catch (err) {
      console.error('Error archiving player:', err);
      setError('Failed to archive player');
      return false;
    }
  }, []);

  const unarchivePlayer = useCallback(async (playerId: string): Promise<boolean> => {
    try {
      const updatedPlayer = await api.players.unarchive(playerId);
      setPlayers(prev =>
        prev.map(player =>
          player.id === playerId ? updatedPlayer : player
        )
      );
      return true;
    } catch (err) {
      console.error('Error unarchiving player:', err);
      setError('Failed to unarchive player');
      return false;
    }
  }, []);

  const getPlayerById = useCallback((playerId: string): Player | undefined => {
    return players.find(player => player.id === playerId);
  }, [players]);

  return {
    players,
    loading,
    error,
    addPlayer,
    updatePlayer,
    deletePlayer,
    archivePlayer,
    unarchivePlayer,
    getPlayerById,
  };
}
