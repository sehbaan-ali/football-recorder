import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { PlayerStats } from '../../types';
import { cn } from '@/lib/utils';

interface LeaderboardTableProps {
  stats: PlayerStats[];
}

export function LeaderboardTable({ stats }: LeaderboardTableProps) {
  if (stats.length === 0) {
    return (
      <Card>
        <CardContent className="py-16">
          <p className="text-center text-muted-foreground">
            No statistics available yet. Play some matches to see the leaderboard!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="relative w-full max-h-[calc(100vh-220px)] overflow-y-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b sticky top-0 bg-background z-10">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-20">Rank</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Player</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Matches</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Wins</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Draws</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Losses</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Goals</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Assists</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Clean Sheets</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {stats.map((stat, index) => (
                <tr key={stat.playerId} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                      <span
                        className={cn(
                          'font-semibold',
                          index < 3 && 'text-yellow-500'
                        )}
                      >
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 align-middle font-semibold">{stat.playerName}</td>
                  <td className="p-4 align-middle text-center">{stat.matchesPlayed}</td>
                  <td className="p-4 align-middle text-center">{stat.wins}</td>
                  <td className="p-4 align-middle text-center">{stat.draws}</td>
                  <td className="p-4 align-middle text-center">{stat.losses}</td>
                  <td className="p-4 align-middle text-center">{stat.goals}</td>
                  <td className="p-4 align-middle text-center">{stat.assists}</td>
                  <td className="p-4 align-middle text-center">{stat.cleanSheets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
