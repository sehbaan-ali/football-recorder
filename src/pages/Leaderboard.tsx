import { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
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
    <div>
      <PageHeader
        title="Leaderboard"
        subtitle="Player rankings and statistics"
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <StatFilters selectedSort={sortBy} onSortChange={setSortBy} />
          <LeaderboardTable stats={sortedStats} />
        </>
      )}
    </div>
  );
}
