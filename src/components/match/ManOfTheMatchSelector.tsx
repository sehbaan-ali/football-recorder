import { Trophy } from 'lucide-react';
import type { Player, PlayerPosition } from '../../types';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

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

interface ManOfTheMatchSelectorProps {
  players: Player[];
  yellowPlayerIds: string[];
  redPlayerIds: string[];
  selectedMotm: string | undefined;
  onMotmChange: (playerId: string | undefined) => void;
}

export function ManOfTheMatchSelector({
  players,
  yellowPlayerIds,
  redPlayerIds,
  selectedMotm,
  onMotmChange,
}: ManOfTheMatchSelectorProps) {
  // Filter players to only those in the match
  const matchPlayers = players.filter(
    (p) => yellowPlayerIds.includes(p.id) || redPlayerIds.includes(p.id)
  );

  // Sort by team then name
  const sortedPlayers = matchPlayers.sort((a, b) => {
    const aTeam = yellowPlayerIds.includes(a.id) ? 'yellow' : 'red';
    const bTeam = yellowPlayerIds.includes(b.id) ? 'yellow' : 'red';
    if (aTeam !== bTeam) return aTeam === 'yellow' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-yellow-600" />
        Man of the Match (Optional)
      </Label>
      <Select
        value={selectedMotm || '__NONE__'}
        onValueChange={(value) =>
          onMotmChange(value === '__NONE__' ? undefined : value)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Skip" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__NONE__">Skip</SelectItem>
          {sortedPlayers.map((player) => {
            const team = yellowPlayerIds.includes(player.id) ? 'yellow' : 'red';
            return (
              <SelectItem key={player.id} value={player.id}>
                <div className="flex items-center gap-2">
                  <span>{player.name}</span>
                  <Badge className={cn("text-[10px] px-1 py-0", getPositionBadgeColor(player.position))}>
                    {player.position}
                  </Badge>
                  <Badge
                    className={cn(
                      'text-[10px] px-1.5 py-0',
                      team === 'yellow'
                        ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                        : 'bg-red-500/10 text-red-700 dark:text-red-400'
                    )}
                  >
                    {team}
                  </Badge>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
