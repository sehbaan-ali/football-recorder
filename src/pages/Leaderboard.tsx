import { useState } from 'react';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { StatFilters } from '../components/leaderboard/StatFilters';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import { useStats } from '../hooks/useStats';
import type { SortBy } from '../types';
import { StatsService } from '../services/stats';

export function Leaderboard() {
  const { players, loading: playersLoading } = usePlayers();
  const { matches, loading: matchesLoading } = useMatches();
  const { playerStats } = useStats(players, matches);
  const [sortBy, setSortBy] = useState<SortBy>('wins');

  const sortedStats = StatsService.getTopPlayers(playerStats, sortBy, playerStats.length);
  const loading = playersLoading || matchesLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">Player rankings and statistics</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <StatFilters selectedSort={sortBy} onSortChange={setSortBy} />
          <LeaderboardTable stats={sortedStats} />
        </div>
      )}
    </div>
  );
}
