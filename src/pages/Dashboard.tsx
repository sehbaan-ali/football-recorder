import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchCard } from '../components/match/MatchCard';
import { MatchDetailsModal } from '../components/match/MatchDetailsModal';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import { useStats } from '../hooks/useStats';
import { StatsService } from '../services/stats';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import type { Match } from '../types';

export function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { players, loading: playersLoading } = usePlayers();
  const { matches, deleteMatch, loading: matchesLoading } = useMatches();
  const { playerStats } = useStats(players, matches);
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const loading = playersLoading || matchesLoading;
  const totalMatches = matches.length;
  const totalPlayers = players.length;
  const recentMatches = matches.slice(0, 5);

  const topByGoals = StatsService.getTopPlayers(playerStats, 'goals', 3);
  const topByAssists = StatsService.getTopPlayers(playerStats, 'assists', 3);
  const topByWins = StatsService.getTopPlayers(playerStats, 'wins', 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (totalPlayers === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your football matches</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h2 className="text-xl font-semibold mb-2">Welcome to Football Tracker!</h2>
            <p className="text-muted-foreground mb-6">Get started by adding some players.</p>
            <Button onClick={() => navigate('/players')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Players
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Overview of your football matches</p>
        </div>
        <Button
          onClick={() => navigate('/match/new')}
          disabled={!isAdmin}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Record New Match</span>
          <span className="sm:hidden">New Match</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMatches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPlayers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {playerStats.reduce((sum, s) => sum + s.goals, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {totalMatches > 0 && (
        <>
          {/* Recent Matches */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Matches</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onClick={() => setSelectedMatch(match)}
                />
              ))}
            </div>
          </div>

          {/* Top Players */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <h2 className="text-xl font-semibold">Top Players</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Most Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Most Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topByGoals.slice(0, 3).map((stat, index) => (
                    <div key={stat.playerId} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <span className="text-sm">
                        {index + 1}. {stat.playerName}
                      </span>
                      <span className="font-semibold text-sm">{stat.goals} goals</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Most Assists */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Most Assists</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topByAssists.slice(0, 3).map((stat, index) => (
                    <div key={stat.playerId} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <span className="text-sm">
                        {index + 1}. {stat.playerName}
                      </span>
                      <span className="font-semibold text-sm">{stat.assists} assists</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Most Wins */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Most Wins</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topByWins.slice(0, 3).map((stat, index) => (
                    <div key={stat.playerId} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <span className="text-sm">
                        {index + 1}. {stat.playerName}
                      </span>
                      <span className="font-semibold text-sm">{stat.wins} wins</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {totalMatches === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium mb-2">No matches recorded yet.</p>
            <p className="text-muted-foreground mb-6">Record your first match to see statistics!</p>
            <Button onClick={() => navigate('/match/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Record New Match
            </Button>
          </CardContent>
        </Card>
      )}

      <MatchDetailsModal
        match={selectedMatch}
        players={players}
        open={selectedMatch !== null}
        onClose={() => setSelectedMatch(null)}
        onDelete={(matchId) => {
          deleteMatch(matchId);
          toast({
            title: "Success",
            description: "Match deleted successfully!",
          });
          setSelectedMatch(null);
        }}
      />
    </div>
  );
}
