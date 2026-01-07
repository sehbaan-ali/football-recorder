import { Trash2, Circle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MatchEventList } from './MatchEventList';
import { formatDate } from '../../utils/helpers';
import { cn } from '@/lib/utils';
import type { Match, Player } from '../../types';

interface MatchDetailsModalProps {
  match: Match | null;
  players: Player[];
  open: boolean;
  onClose: () => void;
  onDelete: (matchId: string) => void;
}

export function MatchDetailsModal({
  match,
  players,
  open,
  onClose,
  onDelete,
}: MatchDetailsModalProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!match) return null;

  const yellowScore = match.yellowTeam.score;
  const redScore = match.redTeam.score;

  let result = 'Draw';
  let resultColor = 'text-muted-foreground';
  if (yellowScore > redScore) {
    result = 'Yellow Team Wins';
    resultColor = 'text-foreground';
  } else if (redScore > yellowScore) {
    result = 'Red Team Wins';
    resultColor = 'text-foreground';
  }

  const yellowPlayers = match.yellowTeam.playerIds
    .map(id => players.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const redPlayers = match.redTeam.playerIds
    .map(id => players.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // Calculate player stats for emoticons
  const getPlayerStats = (playerId: string) => {
    const goals = match.events.filter(
      e => e.playerId === playerId && (e.type === 'goal' || e.type === 'own-goal')
    ).length;
    const assists = match.events.filter(
      e => e.type === 'goal' && e.assistPlayerId === playerId
    ).length;
    return { goals, assists };
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(match.id);
    setDeleteDialogOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl">Match Details</DialogTitle>
              <p className="text-sm text-muted-foreground">{formatDate(match.date)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Score Section */}
          <Card className="border-muted/50">
            <CardContent className="p-8">
              <div className="grid grid-cols-3 items-center gap-8">
                <div className="text-center space-y-2">
                  <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Yellow</p>
                  <div className="text-5xl font-bold">
                    {yellowScore}
                  </div>
                </div>

                <div className="text-2xl font-light text-muted-foreground text-center">
                  -
                </div>

                <div className="text-center space-y-2">
                  <p className="text-xs font-medium text-red-700 dark:text-red-400">Red</p>
                  <div className="text-5xl font-bold">
                    {redScore}
                  </div>
                </div>
              </div>

              <div className={cn("text-center text-sm font-medium mt-6", resultColor)}>
                {result}
              </div>
            </CardContent>
          </Card>

          {/* Teams and Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teams Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Teams
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Yellow Team */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400 pb-2 border-b border-muted">
                    Yellow Team
                  </div>
                  <div className="space-y-1.5">
                    {yellowPlayers.map(player => {
                      const stats = getPlayerStats(player.id);
                      return (
                        <div
                          key={player.id}
                          className="text-sm flex items-center gap-2 py-1.5"
                        >
                          <span>{player.name}</span>
                          {(stats.goals > 0 || stats.assists > 0) && (
                            <div className="inline-flex items-center gap-1 text-muted-foreground -mb-0.5">
                              {stats.goals > 0 && Array.from({ length: stats.goals }).map((_, i) => (
                                <Circle key={`goal-${i}`} className="h-3 w-3 fill-current" />
                              ))}
                              {stats.assists > 0 && Array.from({ length: stats.assists }).map((_, i) => (
                                <ArrowRight key={`assist-${i}`} className="h-3 w-3" />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Red Team */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-red-700 dark:text-red-400 pb-2 border-b border-muted">
                    Red Team
                  </div>
                  <div className="space-y-1.5">
                    {redPlayers.map(player => {
                      const stats = getPlayerStats(player.id);
                      return (
                        <div
                          key={player.id}
                          className="text-sm flex items-center gap-2 py-1.5"
                        >
                          <span>{player.name}</span>
                          {(stats.goals > 0 || stats.assists > 0) && (
                            <div className="inline-flex items-center gap-1 text-muted-foreground -mb-0.5">
                              {stats.goals > 0 && Array.from({ length: stats.goals }).map((_, i) => (
                                <Circle key={`goal-${i}`} className="h-3 w-3 fill-current" />
                              ))}
                              {stats.assists > 0 && Array.from({ length: stats.assists }).map((_, i) => (
                                <ArrowRight key={`assist-${i}`} className="h-3 w-3" />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Match Events
              </h3>
              <MatchEventList events={match.events} players={players} />
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete match?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this match? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
