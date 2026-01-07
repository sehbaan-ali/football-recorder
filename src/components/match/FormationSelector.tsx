import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { Player, TeamColor, PlayerPosition } from '../../types';
import { cn } from '@/lib/utils';

// Formation slot definitions
const FORMATION_SLOTS = [
  { id: 'GK', position: 'GK' as PlayerPosition, label: 'GK', row: 1 },
  { id: 'DEF_1', position: 'DEF' as PlayerPosition, label: 'DEF 1', row: 2 },
  { id: 'DEF_2', position: 'DEF' as PlayerPosition, label: 'DEF 2', row: 2 },
  { id: 'DEF_3', position: 'DEF' as PlayerPosition, label: 'DEF 3', row: 2 },
  { id: 'MID_1', position: 'MID' as PlayerPosition, label: 'MID 1', row: 3 },
  { id: 'MID_2', position: 'MID' as PlayerPosition, label: 'MID 2', row: 3 },
  { id: 'WING_1', position: 'WING' as PlayerPosition, label: 'WING 1', row: 4 },
  { id: 'WING_2', position: 'WING' as PlayerPosition, label: 'WING 2', row: 4 },
  { id: 'ST', position: 'ST' as PlayerPosition, label: 'ST', row: 5 },
] as const;

const POSITION_ORDER: Record<PlayerPosition, number> = {
  'GK': 1,
  'DEF': 2,
  'MID': 3,
  'WING': 4,
  'ST': 5,
};

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

export type FormationAssignment = Record<string, string | null>;

interface FormationSelectorProps {
  team: TeamColor;
  players: Player[];
  formation: FormationAssignment;
  excludePlayerIds: string[];
  onFormationChange: (formation: FormationAssignment) => void;
}

export function FormationSelector({
  team,
  players,
  formation,
  excludePlayerIds,
  onFormationChange,
}: FormationSelectorProps) {
  const teamTextColor = team === 'yellow'
    ? 'text-yellow-700 dark:text-yellow-400'
    : 'text-red-700 dark:text-red-400';

  const teamName = team === 'yellow' ? 'Yellow Team' : 'Red Team';

  // Get assigned player IDs to exclude them from other dropdowns
  const assignedPlayerIds = Object.values(formation).filter((id): id is string => id !== null);

  // Calculate completion
  const filledSlots = assignedPlayerIds.length;
  const totalSlots = FORMATION_SLOTS.length;

  // Get available players for a specific slot
  const getAvailablePlayers = (currentSlotId: string) => {
    const currentPlayerId = formation[currentSlotId];
    return players
      .filter(p =>
        !excludePlayerIds.includes(p.id) &&
        (!assignedPlayerIds.includes(p.id) || p.id === currentPlayerId)
      )
      .sort((a, b) => {
        const positionDiff = POSITION_ORDER[a.position] - POSITION_ORDER[b.position];
        if (positionDiff !== 0) return positionDiff;
        return a.name.localeCompare(b.name);
      });
  };

  const handleSlotChange = (slotId: string, playerId: string | null) => {
    onFormationChange({
      ...formation,
      [slotId]: playerId,
    });
  };

  const handleAutoAssign = () => {
    const newFormation: FormationAssignment = {};
    const availablePlayers = players.filter(p => !excludePlayerIds.includes(p.id));
    const unassignedPlayers = [...availablePlayers];

    // First pass: Assign players to their natural positions
    FORMATION_SLOTS.forEach(slot => {
      const matchingPlayer = unassignedPlayers.find(p => p.position === slot.position);
      if (matchingPlayer) {
        newFormation[slot.id] = matchingPlayer.id;
        unassignedPlayers.splice(unassignedPlayers.indexOf(matchingPlayer), 1);
      } else {
        newFormation[slot.id] = null;
      }
    });

    // Second pass: Fill remaining slots with any available players
    const emptySlots = FORMATION_SLOTS.filter(slot => !newFormation[slot.id]);
    emptySlots.forEach(slot => {
      if (unassignedPlayers.length > 0) {
        newFormation[slot.id] = unassignedPlayers[0].id;
        unassignedPlayers.shift();
      }
    });

    onFormationChange(newFormation);
  };

  const renderSlot = (slot: typeof FORMATION_SLOTS[number]) => {
    const playerId = formation[slot.id];
    const player = playerId ? players.find(p => p.id === playerId) : null;
    const isOutOfPosition = player && player.position !== slot.position;
    const availablePlayers = getAvailablePlayers(slot.id);

    return (
      <div key={slot.id} className="w-36 space-y-1">
        <Label htmlFor={`slot-${slot.id}`} className="text-xs flex items-center justify-center gap-1.5">
          <span className="text-muted-foreground whitespace-nowrap">{slot.label}</span>
          <Badge className={cn("text-[10px] px-1 py-0", getPositionBadgeColor(slot.position))}>
            {slot.position}
          </Badge>
          {isOutOfPosition && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 text-amber-600">
              OOP
            </Badge>
          )}
        </Label>
        <Select
          value={playerId || '__NONE__'}
          onValueChange={(value) => handleSlotChange(slot.id, value === '__NONE__' ? null : value)}
        >
          <SelectTrigger id={`slot-${slot.id}`} className="h-8 text-xs w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__NONE__">Clear</SelectItem>
            {availablePlayers.map(p => (
              <SelectItem key={p.id} value={p.id}>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{p.name}</span>
                  <Badge className={cn("text-[10px] px-1 py-0", getPositionBadgeColor(p.position))}>
                    {p.position}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // Group slots by row
  type FormationSlot = typeof FORMATION_SLOTS[number];
  const slotsByRow: Record<number, FormationSlot[]> = {};
  FORMATION_SLOTS.forEach(slot => {
    if (!slotsByRow[slot.row]) {
      slotsByRow[slot.row] = [];
    }
    slotsByRow[slot.row].push(slot);
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("text-sm font-medium", teamTextColor)}>
              {teamName}
            </div>
            <span className="text-xs text-muted-foreground">
              {filledSlots}/{totalSlots}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAutoAssign}
            className="gap-1.5 h-7 text-xs"
          >
            <Sparkles className="h-3 w-3" />
            Auto
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-3">
        <div className="space-y-3">
          {/* GK Row - centered */}
          {slotsByRow[1] && (
            <div className="flex justify-center gap-2">
              {slotsByRow[1].map(slot => renderSlot(slot))}
            </div>
          )}

          {/* DEF Row - spread across */}
          {slotsByRow[2] && (
            <div className="flex justify-between gap-2 px-4">
              {slotsByRow[2].map(slot => renderSlot(slot))}
            </div>
          )}

          {/* MID Row - centered together */}
          {slotsByRow[3] && (
            <div className="flex justify-center gap-2">
              {slotsByRow[3].map(slot => renderSlot(slot))}
            </div>
          )}

          {/* WING Row - left and right */}
          {slotsByRow[4] && (
            <div className="flex justify-between gap-2 px-4">
              {slotsByRow[4].map(slot => renderSlot(slot))}
            </div>
          )}

          {/* ST Row - centered */}
          {slotsByRow[5] && (
            <div className="flex justify-center gap-2">
              {slotsByRow[5].map(slot => renderSlot(slot))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
