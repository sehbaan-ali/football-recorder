import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { Player, TeamColor, PlayerPosition } from '../../types';
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

interface AddOwnGoalDialogProps {
  open: boolean;
  onClose: () => void;
  players: Player[];
  opposingPlayers: Player[];
  team: TeamColor;
  onAddOwnGoal: (playerId: string, assistId?: string) => void;
}

export function AddOwnGoalDialog({ open, onClose, players, opposingPlayers, team, onAddOwnGoal }: AddOwnGoalDialogProps) {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedAssist, setSelectedAssist] = useState('__NONE__');

  const teamName = team === 'yellow' ? 'Yellow' : 'Red';
  const opposingTeamName = team === 'yellow' ? 'Red' : 'Yellow';

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedPlayer('');
      setSelectedAssist('__NONE__');
    }
  }, [open]);

  const handleAddOwnGoal = () => {
    if (!selectedPlayer) return;

    // Convert sentinel value to undefined
    const assistId = selectedAssist === '__NONE__' ? undefined : selectedAssist;
    onAddOwnGoal(selectedPlayer, assistId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Own Goal - {teamName} Team</DialogTitle>
          <DialogDescription>
            Record an own goal scored by a {teamName.toLowerCase()} team player
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="own-goal-player">
              Who scored the own goal? <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
              <SelectTrigger id="own-goal-player">
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent>
                {players.map(player => (
                  <SelectItem key={player.id} value={player.id}>
                    <div className="flex items-center gap-2">
                      <span>{player.name}</span>
                      <Badge className={cn("text-[10px] px-1 py-0", getPositionBadgeColor(player.position))}>
                        {player.position}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="own-goal-assist">
              Who gets the assist? (Optional)
            </Label>
            <Select value={selectedAssist} onValueChange={setSelectedAssist}>
              <SelectTrigger id="own-goal-assist">
                <SelectValue placeholder="No assist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__NONE__">No assist</SelectItem>
                {opposingPlayers.map(player => (
                  <SelectItem key={player.id} value={player.id}>
                    <div className="flex items-center gap-2">
                      <span>{player.name}</span>
                      <Badge className={cn("text-[10px] px-1 py-0", getPositionBadgeColor(player.position))}>
                        {player.position}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the {opposingTeamName.toLowerCase()} team player whose shot/cross forced this own goal
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddOwnGoal} disabled={!selectedPlayer}>
            Add Own Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
