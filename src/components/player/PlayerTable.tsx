import { Edit, Trash2, Archive, Undo2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Player, PlayerStats, PlayerPosition } from '../../types';
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

interface PlayerTableProps {
  players: Player[];
  playerStats: PlayerStats[];
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string, playerName: string, hasMatches: boolean) => void;
  onUnarchivePlayer: (playerId: string) => void;
  showArchived: boolean;
  isAdmin: boolean;
}

export function PlayerTable({ players, playerStats, onEditPlayer, onDeletePlayer, onUnarchivePlayer, showArchived, isAdmin }: PlayerTableProps) {
  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="py-16">
          <p className="text-center text-muted-foreground">
            {showArchived
              ? 'No archived players.'
              : 'No players yet. Add your first player to get started!'}
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
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pos</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Matches</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Wins</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Draws</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Losses</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Goals</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Assists</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Clean Sheets</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {players.map(player => {
                const stats = playerStats.find(s => s.playerId === player.id);
                const hasMatches = stats ? stats.matchesPlayed > 0 : false;

                return (
                  <tr key={player.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-semibold">{player.name}</td>
                    <td className="p-4 align-middle">
                      <Badge className={cn("text-[11px] px-2 py-0.5", getPositionBadgeColor(player.position))}>
                        {player.position}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-center">{stats?.matchesPlayed || 0}</td>
                    <td className="p-4 align-middle text-center">{stats?.wins || 0}</td>
                    <td className="p-4 align-middle text-center">{stats?.draws || 0}</td>
                    <td className="p-4 align-middle text-center">{stats?.losses || 0}</td>
                    <td className="p-4 align-middle text-center">{stats?.goals || 0}</td>
                    <td className="p-4 align-middle text-center">{stats?.assists || 0}</td>
                    <td className="p-4 align-middle text-center">{stats?.cleanSheets || 0}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        {showArchived ? (
                          // Archived players: Show unarchive button
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUnarchivePlayer(player.id)}
                            disabled={!isAdmin}
                            title={isAdmin ? "Restore player" : "Login required"}
                          >
                            <Undo2 className="h-4 w-4 mr-1" />
                            Restore
                          </Button>
                        ) : (
                          // Active players: Show edit and archive/delete buttons
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditPlayer(player)}
                              disabled={!isAdmin}
                              title={isAdmin ? "Edit player" : "Login required"}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeletePlayer(player.id, player.name, hasMatches)}
                              disabled={!isAdmin}
                              title={isAdmin ? (hasMatches ? "Archive player" : "Delete player") : "Login required"}
                            >
                              {hasMatches ? (
                                <>
                                  <Archive className="h-4 w-4 mr-1" />
                                  Archive
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
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
