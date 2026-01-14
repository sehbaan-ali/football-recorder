import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Match, Player } from '../../types';
import { formatDate } from '../../utils/helpers';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  players: Player[];
  onClick?: () => void;
}

export function MatchCard({ match, players, onClick }: MatchCardProps) {
  // Handle matches with invalid structure
  if (!match.yellowTeam || !match.redTeam) {
    return null;
  }

  const yellowScore = match.yellowTeam.score;
  const redScore = match.redTeam.score;

  let result = 'Draw';
  let resultColor = 'text-muted-foreground';
  if (yellowScore > redScore) {
    result = 'Yellow Wins';
    resultColor = 'text-foreground';
  } else if (redScore > yellowScore) {
    result = 'Red Wins';
    resultColor = 'text-foreground';
  }

  const motmPlayer = match.manOfTheMatch
    ? players.find((p) => p.id === match.manOfTheMatch)
    : null;

  return (
    <Card
      className="cursor-pointer h-full transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="text-xs text-muted-foreground font-medium">
          {formatDate(match.date)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
              Yellow
            </div>
            <div className="text-3xl font-bold">
              {yellowScore}
            </div>
          </div>

          <div className="text-xl font-light text-muted-foreground">
            -
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="text-xs font-medium text-red-700 dark:text-red-400">
              Red
            </div>
            <div className="text-3xl font-bold">
              {redScore}
            </div>
          </div>
        </div>

        <div className={cn("text-center text-sm font-medium", resultColor)}>
          {result}
        </div>

        {motmPlayer && (
          <div className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-muted">
            <Trophy className="h-3 w-3 text-yellow-600" />
            <span className="text-xs text-muted-foreground">MOTM:</span>
            <span className="text-xs font-medium">{motmPlayer.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
