import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Match } from '../../types';
import { formatDate } from '../../utils/helpers';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
}

export function MatchCard({ match, onClick }: MatchCardProps) {
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

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
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
      </CardContent>
    </Card>
  );
}
