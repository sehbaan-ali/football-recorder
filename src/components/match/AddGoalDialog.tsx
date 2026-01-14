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

interface AddGoalDialogProps {
  open: boolean;
  onClose: () => void;
  players: Player[];
  team: TeamColor;
  onAddGoal: (scorerId: string, assistId?: string) => void;
  initialScorerId?: string;
  initialAssistId?: string;
}

export function AddGoalDialog({
  open,
  onClose,
  players,
  team,
  onAddGoal,
  initialScorerId,
  initialAssistId
}: AddGoalDialogProps) {
  const [selectedScorer, setSelectedScorer] = useState('');
  const [selectedAssist, setSelectedAssist] = useState('');

  const teamName = team === 'yellow' ? 'Yellow' : 'Red';

  // Set initial values or reset when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedScorer(initialScorerId || '');
      setSelectedAssist(initialAssistId || '');
    }
  }, [open, initialScorerId, initialAssistId]);

  const handleAddGoal = () => {
    if (!selectedScorer) return;

    onAddGoal(selectedScorer, selectedAssist || undefined);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Goal - {teamName} Team</DialogTitle>
          <DialogDescription>
            Record a goal for the {teamName.toLowerCase()} team
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="scorer">
              Scorer <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedScorer} onValueChange={setSelectedScorer}>
              <SelectTrigger id="scorer">
                <SelectValue placeholder="Select scorer" />
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
            <Label htmlFor="assist">Assist (optional)</Label>
            <Select
              value={selectedAssist || '__NONE__'}
              onValueChange={(value) => setSelectedAssist(value === '__NONE__' ? '' : value)}
            >
              <SelectTrigger id="assist">
                <SelectValue placeholder="Select assist provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__NONE__">No assist</SelectItem>
                {players
                  .filter(p => p.id !== selectedScorer)
                  .map(player => (
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
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddGoal} disabled={!selectedScorer}>
            Add Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
