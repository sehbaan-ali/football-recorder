import { useState } from 'react';
import { LoadingState } from '@/components/ui/loading-spinner';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { SortDropdown } from '../components/leaderboard/SortDropdown';
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
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortBy) => {
    if (field === sortBy) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      // New field: set to field and reset to descending
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const sortedStats = StatsService.getTopPlayers(playerStats, sortBy, playerStats.length, sortDirection);
  const loading = playersLoading || matchesLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">Player rankings and statistics</p>
      </div>

      {loading ? (
        <LoadingState message="Loading leaderboard" />
      ) : (
        <div className="space-y-4">
          <SortDropdown value={sortBy} onChange={handleSort} />
          <LeaderboardTable
            stats={sortedStats}
            players={players}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
      )}
    </div>
  );
}
