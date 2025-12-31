import { useMemo } from 'react';
import { StatsService } from '../services/stats';
import type { Player, Match, PlayerStats, SortBy } from '../types';

export function useStats(players: Player[], matches: Match[]) {
  const playerStats = useMemo(() => {
    return StatsService.calculatePlayerStats(players, matches);
  }, [players, matches]);

  const getTopPlayers = useMemo(() => {
    return (sortBy: SortBy, limit: number = 10) => {
      return StatsService.getTopPlayers(playerStats, sortBy, limit);
    };
  }, [playerStats]);

  const getPlayerStats = useMemo(() => {
    return (playerId: string): PlayerStats | undefined => {
      return playerStats.find(stats => stats.playerId === playerId);
    };
  }, [playerStats]);

  return {
    playerStats,
    getTopPlayers,
    getPlayerStats,
  };
}
