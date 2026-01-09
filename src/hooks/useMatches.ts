import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';
import type { Match, MatchEvent } from '../types';

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const loadedMatches = await api.matches.getAll();
        // Backend already sorts by date descending
        setMatches(loadedMatches);
        setError(null);
      } catch (err) {
        console.error('Error loading matches:', err);
        setError('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();

    // TODO: Add Azure SignalR real-time updates later
    // For now, data updates on page refresh or after mutations
  }, []);

  const createMatch = useCallback(async (
    date: string,
    yellowPlayerIds: string[],
    redPlayerIds: string[]
  ): Promise<Match | null> => {
    try {
      const newMatch = await api.matches.create({
        date,
        yellowTeam: {
          playerIds: yellowPlayerIds,
          score: 0,
        },
        redTeam: {
          playerIds: redPlayerIds,
          score: 0,
        },
        events: [],
      });

      setMatches(prev => [newMatch, ...prev]);
      return newMatch;
    } catch (err) {
      console.error('Error creating match:', err);
      setError('Failed to create match');
      return null;
    }
  }, []);

  const updateMatch = useCallback(async (matchId: string, updates: Partial<Match>): Promise<boolean> => {
    try {
      const updatedMatch = await api.matches.update(matchId, updates);
      setMatches(prev =>
        prev.map(match =>
          match.id === matchId ? updatedMatch : match
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating match:', err);
      setError('Failed to update match');
      return false;
    }
  }, []);

  const deleteMatch = useCallback(async (matchId: string): Promise<boolean> => {
    try {
      await api.matches.delete(matchId);
      setMatches(prev => prev.filter(match => match.id !== matchId));
      return true;
    } catch (err) {
      console.error('Error deleting match:', err);
      setError('Failed to delete match');
      return false;
    }
  }, []);

  const getMatchById = useCallback((matchId: string): Match | undefined => {
    return matches.find(match => match.id === matchId);
  }, [matches]);

  const addMatchEvent = useCallback(async (matchId: string, event: MatchEvent): Promise<boolean> => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return false;

    const updatedEvents = [...match.events, event];

    // Update score based on event
    let yellowScore = match.yellowTeam.score;
    let redScore = match.redTeam.score;

    if (event.type === 'goal') {
      if (event.team === 'yellow') {
        yellowScore++;
      } else {
        redScore++;
      }
    } else if (event.type === 'own-goal') {
      // Own goal increases the opponent's score
      if (event.team === 'yellow') {
        redScore++;
      } else {
        yellowScore++;
      }
    }

    return await updateMatch(matchId, {
      events: updatedEvents,
      yellowTeam: { ...match.yellowTeam, score: yellowScore },
      redTeam: { ...match.redTeam, score: redScore },
    });
  }, [matches, updateMatch]);

  const removeLastEvent = useCallback(async (matchId: string): Promise<boolean> => {
    const match = matches.find(m => m.id === matchId);
    if (!match || match.events.length === 0) return false;

    const updatedEvents = match.events.slice(0, -1);

    // Recalculate scores by processing all remaining events
    let yellowScore = 0;
    let redScore = 0;

    updatedEvents.forEach(event => {
      if (event.type === 'goal') {
        if (event.team === 'yellow') {
          yellowScore++;
        } else {
          redScore++;
        }
      } else if (event.type === 'own-goal') {
        if (event.team === 'yellow') {
          redScore++;
        } else {
          yellowScore++;
        }
      }
    });

    return await updateMatch(matchId, {
      events: updatedEvents,
      yellowTeam: { ...match.yellowTeam, score: yellowScore },
      redTeam: { ...match.redTeam, score: redScore },
    });
  }, [matches, updateMatch]);

  const finalizeMatch = useCallback(async (matchId: string): Promise<boolean> => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return false;

    // Add clean sheet events for players whose team didn't concede
    const cleanSheetEvents: MatchEvent[] = [];

    if (match.redTeam.score === 0) {
      // Yellow team kept a clean sheet
      match.yellowTeam.playerIds.forEach(playerId => {
        cleanSheetEvents.push({
          type: 'clean-sheet',
          playerId,
          team: 'yellow',
        });
      });
    }

    if (match.yellowTeam.score === 0) {
      // Red team kept a clean sheet
      match.redTeam.playerIds.forEach(playerId => {
        cleanSheetEvents.push({
          type: 'clean-sheet',
          playerId,
          team: 'red',
        });
      });
    }

    if (cleanSheetEvents.length > 0) {
      return await updateMatch(matchId, {
        events: [...match.events, ...cleanSheetEvents],
      });
    }

    return true;
  }, [matches, updateMatch]);

  return {
    matches,
    loading,
    error,
    createMatch,
    updateMatch,
    deleteMatch,
    getMatchById,
    addMatchEvent,
    removeLastEvent,
    finalizeMatch,
  };
}
