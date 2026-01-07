import { Circle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Player, MatchEvent } from '../../types';
import { getPlayerName } from '../../utils/helpers';
import { cn } from '@/lib/utils';

interface MatchEventListProps {
  events: MatchEvent[];
  players: Player[];
}

export function MatchEventList({ events, players }: MatchEventListProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No events yet. Start recording goals and assists!
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayEvents = events.filter(e => e.type !== 'clean-sheet');

  // Aggregate goals by player and team
  const aggregateGoals = (team: 'yellow' | 'red') => {
    const goals = displayEvents.filter(e => e.team === team && (e.type === 'goal' || e.type === 'own-goal'));
    const playerGoalCount = new Map<string, { count: number; isOwnGoal: boolean }>();

    goals.forEach(goal => {
      const current = playerGoalCount.get(goal.playerId) || { count: 0, isOwnGoal: false };
      playerGoalCount.set(goal.playerId, {
        count: current.count + 1,
        isOwnGoal: goal.type === 'own-goal'
      });
    });

    return Array.from(playerGoalCount.entries());
  };

  // Aggregate assists by player and team
  const aggregateAssists = (team: 'yellow' | 'red') => {
    const assists = displayEvents.filter(e => e.team === team && e.type === 'goal' && e.assistPlayerId);
    const playerAssistCount = new Map<string, number>();

    assists.forEach(assist => {
      const playerId = assist.assistPlayerId!;
      playerAssistCount.set(playerId, (playerAssistCount.get(playerId) || 0) + 1);
    });

    return Array.from(playerAssistCount.entries());
  };

  const yellowGoals = aggregateGoals('yellow');
  const redGoals = aggregateGoals('red');
  const yellowAssists = aggregateAssists('yellow');
  const redAssists = aggregateAssists('red');

  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-sm font-semibold">Match Summary</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goals Section */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Goals
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Yellow Team Goals */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                Yellow
              </div>
              {yellowGoals.length > 0 ? (
                <div className="space-y-1.5">
                  {yellowGoals.map(([playerId, data]) => (
                    <div key={playerId} className="flex items-center gap-2 text-sm">
                      <span>{getPlayerName(playerId, players)}</span>
                      <div className="inline-flex items-center gap-1 text-muted-foreground -mb-0.5">
                        {Array.from({ length: data.count }).map((_, i) => (
                          <Circle key={i} className={cn("h-3 w-3", data.isOwnGoal ? "fill-amber-500 text-amber-500" : "fill-current")} />
                        ))}
                      </div>
                      {data.isOwnGoal && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 text-amber-600">
                          OG
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">-</div>
              )}
            </div>

            {/* Red Team Goals */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-red-700 dark:text-red-400 mb-2">
                Red
              </div>
              {redGoals.length > 0 ? (
                <div className="space-y-1.5">
                  {redGoals.map(([playerId, data]) => (
                    <div key={playerId} className="flex items-center gap-2 text-sm">
                      <span>{getPlayerName(playerId, players)}</span>
                      <div className="inline-flex items-center gap-1 text-muted-foreground -mb-0.5">
                        {Array.from({ length: data.count }).map((_, i) => (
                          <Circle key={i} className={cn("h-3 w-3", data.isOwnGoal ? "fill-amber-500 text-amber-500" : "fill-current")} />
                        ))}
                      </div>
                      {data.isOwnGoal && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 text-amber-600">
                          OG
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">-</div>
              )}
            </div>
          </div>
        </div>

        {/* Assists Section */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Assists
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Yellow Team Assists */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                Yellow
              </div>
              {yellowAssists.length > 0 ? (
                <div className="space-y-1.5">
                  {yellowAssists.map(([playerId, count]) => (
                    <div key={playerId} className="flex items-center gap-2 text-sm">
                      <span>{getPlayerName(playerId, players)}</span>
                      <div className="inline-flex items-center gap-1 text-muted-foreground -mb-0.5">
                        {Array.from({ length: count }).map((_, i) => (
                          <ArrowRight key={i} className="h-3 w-3" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">-</div>
              )}
            </div>

            {/* Red Team Assists */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-red-700 dark:text-red-400 mb-2">
                Red
              </div>
              {redAssists.length > 0 ? (
                <div className="space-y-1.5">
                  {redAssists.map(([playerId, count]) => (
                    <div key={playerId} className="flex items-center gap-2 text-sm">
                      <span>{getPlayerName(playerId, players)}</span>
                      <div className="inline-flex items-center gap-1 text-muted-foreground -mb-0.5">
                        {Array.from({ length: count }).map((_, i) => (
                          <ArrowRight key={i} className="h-3 w-3" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">-</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
