import { Trophy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PlayerStats, Player, PlayerPosition, SortBy } from '../../types';
import { cn } from '@/lib/utils';

const getPositionBadgeColor = (position: PlayerPosition): string => {
  switch (position) {
    case 'GK':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'DEF':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'MID':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    case 'WING':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
    case 'ST':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

interface LeaderboardTableProps {
  stats: PlayerStats[];
  players: Player[];
  sortBy: SortBy;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortBy) => void;
}

interface SortableHeaderProps {
  label: string;
  field: SortBy;
  currentSort: SortBy;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortBy) => void;
  className?: string;
}

function SortableHeader({ label, field, currentSort, sortDirection, onSort, className }: SortableHeaderProps) {
  const isSorted = currentSort === field;

  return (
    <th
      className={cn(
        "h-12 px-4 align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors select-none",
        isSorted && "bg-muted/30",
        className
      )}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center justify-center gap-1">
        <span>{label}</span>
        {isSorted ? (
          sortDirection === 'desc' ? (
            <ArrowDown className="h-3 w-3" />
          ) : (
            <ArrowUp className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" />
        )}
      </div>
    </th>
  );
}

export function LeaderboardTable({ stats, players, sortBy, sortDirection, onSort }: LeaderboardTableProps) {
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
              <tr className="border-b">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-20">Rank</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Player</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pos</th>
                <SortableHeader
                  label="Matches"
                  field="matchesPlayed"
                  currentSort={sortBy}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  className="text-center"
                />
                <SortableHeader
                  label="Wins"
                  field="wins"
                  currentSort={sortBy}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  className="text-center"
                />
                <SortableHeader
                  label="Draws"
                  field="draws"
                  currentSort={sortBy}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  className="text-center"
                />
                <SortableHeader
                  label="Losses"
                  field="losses"
                  currentSort={sortBy}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  className="text-center"
                />
                <SortableHeader
                  label="Goals"
                  field="goals"
                  currentSort={sortBy}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  className="text-center"
                />
                <SortableHeader
                  label="Assists"
                  field="assists"
                  currentSort={sortBy}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  className="text-center"
                />
                <SortableHeader
                  label="Clean Sheets"
                  field="cleanSheets"
                  currentSort={sortBy}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  className="text-center"
                />
                <SortableHeader
                  label="MOTM"
                  field="manOfTheMatchAwards"
                  currentSort={sortBy}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  className="text-center"
                />
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {stats.map((stat, index) => {
                const player = players.find(p => p.id === stat.playerId);

                return (
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
                    <td className="p-4 align-middle">
                      {player && (
                        <Badge className={cn("text-[11px] px-2 py-0.5", getPositionBadgeColor(player.position))}>
                          {player.position}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 align-middle text-center">{stat.matchesPlayed}</td>
                    <td className="p-4 align-middle text-center">{stat.wins}</td>
                    <td className="p-4 align-middle text-center">{stat.draws}</td>
                    <td className="p-4 align-middle text-center">{stat.losses}</td>
                    <td className="p-4 align-middle text-center">{stat.goals}</td>
                    <td className="p-4 align-middle text-center">{stat.assists}</td>
                    <td className="p-4 align-middle text-center">{stat.cleanSheets}</td>
                    <td className="p-4 align-middle text-center">{stat.manOfTheMatchAwards}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
