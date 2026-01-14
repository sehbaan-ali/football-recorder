import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { GuestPlayerForm } from './GuestPlayerForm';
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
  onGuestCreated?: (player: Player) => void;
}

export function FormationSelector({
  team,
  players,
  formation,
  excludePlayerIds,
  onFormationChange,
  onGuestCreated,
}: FormationSelectorProps) {
  const [showGuestForm, setShowGuestForm] = useState<{ slotId: string; position: PlayerPosition } | null>(null);
  const [guestCache, setGuestCache] = useState<Map<string, Player>>(new Map());
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Merge players prop with cached guests for immediate display
  const getAllPlayers = (): Player[] => {
    const cachedGuests = Array.from(guestCache.values());
    const propPlayerIds = new Set(players.map(p => p.id));

    // Only include cached guests that aren't in props yet
    const uniqueCachedGuests = cachedGuests.filter(g => !propPlayerIds.has(g.id));

    return [...players, ...uniqueCachedGuests];
  };

  // Clean up guest cache when guests appear in props
  useEffect(() => {
    if (guestCache.size === 0) return;

    const playerIds = new Set(players.map(p => p.id));
    const idsToRemove: string[] = [];

    guestCache.forEach((_guest, id) => {
      if (playerIds.has(id)) {
        idsToRemove.push(id);
      }
    });

    if (idsToRemove.length > 0) {
      setGuestCache(prev => {
        const next = new Map(prev);
        idsToRemove.forEach(id => next.delete(id));
        return next;
      });
    }
  }, [players, guestCache]);

  const teamTextColor = team === 'yellow'
    ? 'text-yellow-700 dark:text-yellow-400'
    : 'text-red-700 dark:text-red-400';

  const teamName = team === 'yellow' ? 'Yellow Team' : 'Red Team';

  // Get assigned player IDs to exclude them from other dropdowns
  const assignedPlayerIds = Object.values(formation).filter((id): id is string => id !== null);

  // Calculate completion
  const filledSlots = assignedPlayerIds.length;
  const totalSlots = FORMATION_SLOTS.length;

  // Get available players for a specific slot, with preferred position first
  const getAvailablePlayers = (currentSlotId: string, preferredPosition: PlayerPosition) => {
    const currentPlayerId = formation[currentSlotId];
    const allPlayers = getAllPlayers();
    return allPlayers
      .filter(p =>
        !p.isGuest && // Exclude guest players from dropdown
        !excludePlayerIds.includes(p.id) &&
        (!assignedPlayerIds.includes(p.id) || p.id === currentPlayerId) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by search query
      )
      .sort((a, b) => {
        // First, prioritize players matching the slot's preferred position
        const aMatchesSlot = a.position === preferredPosition;
        const bMatchesSlot = b.position === preferredPosition;
        if (aMatchesSlot && !bMatchesSlot) return -1;
        if (!aMatchesSlot && bMatchesSlot) return 1;

        // Then sort by position order
        const positionDiff = POSITION_ORDER[a.position] - POSITION_ORDER[b.position];
        if (positionDiff !== 0) return positionDiff;

        // Finally sort by name
        return a.name.localeCompare(b.name);
      });
  };

  const handleSlotChange = (slotId: string, slotPosition: PlayerPosition, playerId: string | null) => {
    if (playerId === '__ADD_GUEST__') {
      setShowGuestForm({ slotId, position: slotPosition });
      return;
    }

    onFormationChange({
      ...formation,
      [slotId]: playerId,
    });
  };

  const handleGuestCreated = (player: Player) => {
    if (showGuestForm) {
      // Add guest to cache for immediate display
      setGuestCache(prev => new Map(prev).set(player.id, player));

      // Notify parent about guest creation
      onGuestCreated?.(player);

      // Update formation with guest ID
      onFormationChange({
        ...formation,
        [showGuestForm.slotId]: player.id,
      });
    }
    setShowGuestForm(null);
  };

  const handleAutoAssign = () => {
    const newFormation: FormationAssignment = {};
    const allPlayers = getAllPlayers();
    const availablePlayers = allPlayers.filter(p => !p.isGuest && !excludePlayerIds.includes(p.id));
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

  const handleClearTeam = () => {
    const clearedFormation: FormationAssignment = {};
    FORMATION_SLOTS.forEach(slot => {
      clearedFormation[slot.id] = null;
    });
    onFormationChange(clearedFormation);
  };

  const renderSlot = (slot: typeof FORMATION_SLOTS[number]) => {
    const playerId = formation[slot.id];
    const allPlayers = getAllPlayers();
    const player = playerId ? allPlayers.find(p => p.id === playerId) : null;
    const isOutOfPosition = player && player.position !== slot.position;
    const availablePlayers = getAvailablePlayers(slot.id, slot.position);

    return (
      <div key={slot.id} className="w-24 sm:w-36 space-y-1">
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
          onValueChange={(value) => {
            handleSlotChange(slot.id, slot.position, value === '__NONE__' ? null : value);
            setSearchQuery(''); // Clear search on selection
          }}
          onOpenChange={(open) => {
            if (!open) setSearchQuery(''); // Clear search when dropdown closes
          }}
        >
          <SelectTrigger id={`slot-${slot.id}`} className="h-8 text-xs w-full">
            <SelectValue placeholder="Select">
              {player ? player.name : 'Select'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="scrollbar-dropdown">
            <div className="sticky top-0 left-0 right-0 bg-popover z-20 border-b border-border p-2">
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs"
                onKeyDown={(e) => e.stopPropagation()} // Prevent dropdown from closing on key press
              />
            </div>
            <div className="max-h-[250px] overflow-y-auto p-1 dropdown-scroll">
              <SelectItem value="__NONE__">Clear</SelectItem>
            <SelectItem value="__ADD_GUEST__" className="text-primary">
              + Add Guest Player...
            </SelectItem>
            <div className="border-t my-1" />
            {availablePlayers.map(p => (
              <SelectItem key={p.id} value={p.id}>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-xs truncate">{p.name}</span>
                  <Badge className={cn("text-[10px] px-1 py-0 shrink-0", getPositionBadgeColor(p.position))}>
                    {p.position}
                  </Badge>
                </div>
              </SelectItem>
            ))}
              {availablePlayers.length === 0 && searchQuery && (
                <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                  No players found
                </div>
              )}
            </div>
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
    <>
      <Card>
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("text-sm font-medium", teamTextColor)}>
                {teamName}
              </div>
              <span className="text-xs text-muted-foreground">
                {filledSlots}/{totalSlots}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearTeam}
                className="gap-1.5 h-7 text-xs"
                disabled={filledSlots === 0}
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
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
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-2">
          <div className="space-y-2.5">
            {/* GK Row - centered */}
            {slotsByRow[1] && (
              <div className="flex justify-center gap-1 sm:gap-2">
                {slotsByRow[1].map(slot => renderSlot(slot))}
              </div>
            )}

            {/* DEF Row - spread across */}
            {slotsByRow[2] && (
              <div className="flex justify-between gap-1 sm:gap-2 px-1 sm:px-4">
                {slotsByRow[2].map(slot => renderSlot(slot))}
              </div>
            )}

            {/* MID Row - centered together */}
            {slotsByRow[3] && (
              <div className="flex justify-center gap-1 sm:gap-2">
                {slotsByRow[3].map(slot => renderSlot(slot))}
              </div>
            )}

            {/* WING Row - left and right */}
            {slotsByRow[4] && (
              <div className="flex justify-between gap-1 sm:gap-2 px-1 sm:px-4">
                {slotsByRow[4].map(slot => renderSlot(slot))}
              </div>
            )}

            {/* ST Row - centered */}
            {slotsByRow[5] && (
              <div className="flex justify-center gap-1 sm:gap-2">
                {slotsByRow[5].map(slot => renderSlot(slot))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Guest Player Form Dialog */}
      {showGuestForm && (
        <GuestPlayerForm
          position={showGuestForm.position}
          open={!!showGuestForm}
          onGuestCreated={handleGuestCreated}
          onCancel={() => setShowGuestForm(null)}
        />
      )}
    </>
  );
}
