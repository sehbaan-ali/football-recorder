import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../services/storage';
import type { Match, MatchEvent } from '../types';

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = () => {
      const loadedMatches = storage.getMatches();
      // Sort by date descending (most recent first)
      loadedMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMatches(loadedMatches);
      setLoading(false);
    };

    loadMatches();
  }, []);

  const createMatch = useCallback((
    date: string,
    yellowPlayerIds: string[],
    redPlayerIds: string[]
  ): Match | null => {
    const newMatch: Match = {
      id: uuidv4(),
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
      createdAt: new Date().toISOString(),
    };

    const success = storage.addMatch(newMatch);
    if (success) {
      setMatches(prev => [newMatch, ...prev]);
      return newMatch;
    }
    return null;
  }, []);

  const updateMatch = useCallback((matchId: string, updates: Partial<Match>): boolean => {
    const success = storage.updateMatch(matchId, updates);
    if (success) {
      setMatches(prev =>
        prev.map(match =>
          match.id === matchId ? { ...match, ...updates } : match
        )
      );
    }
    return success;
  }, []);

  const deleteMatch = useCallback((matchId: string): boolean => {
    const success = storage.deleteMatch(matchId);
    if (success) {
      setMatches(prev => prev.filter(match => match.id !== matchId));
    }
    return success;
  }, []);

  const getMatchById = useCallback((matchId: string): Match | undefined => {
    return matches.find(match => match.id === matchId);
  }, [matches]);

  const addMatchEvent = useCallback((matchId: string, event: MatchEvent): boolean => {
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

    return updateMatch(matchId, {
      events: updatedEvents,
      yellowTeam: { ...match.yellowTeam, score: yellowScore },
      redTeam: { ...match.redTeam, score: redScore },
    });
  }, [matches, updateMatch]);

  const removeLastEvent = useCallback((matchId: string): boolean => {
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

    return updateMatch(matchId, {
      events: updatedEvents,
      yellowTeam: { ...match.yellowTeam, score: yellowScore },
      redTeam: { ...match.redTeam, score: redScore },
    });
  }, [matches, updateMatch]);

  const finalizeMatch = useCallback((matchId: string): boolean => {
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
      return updateMatch(matchId, {
        events: [...match.events, ...cleanSheetEvents],
      });
    }

    return true;
  }, [matches, updateMatch]);

  return {
    matches,
    loading,
    createMatch,
    updateMatch,
    deleteMatch,
    getMatchById,
    addMatchEvent,
    removeLastEvent,
    finalizeMatch,
  };
}
