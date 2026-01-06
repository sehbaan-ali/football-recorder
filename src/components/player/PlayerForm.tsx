import { useState, useEffect, type FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PlayerPosition } from '../../types';

const POSITIONS = [
  { value: 'GK', label: 'Goalkeeper' },
  { value: 'DEF', label: 'Defender' },
  { value: 'MID', label: 'Midfielder' },
  { value: 'WING', label: 'Winger' },
  { value: 'ST', label: 'Striker' },
] as const;

interface PlayerFormProps {
  onSubmit: (name: string, position: PlayerPosition) => void;
  trigger?: React.ReactElement;
  initialName?: string;
  initialPosition?: PlayerPosition;
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PlayerForm({
  onSubmit,
  trigger,
  initialName = '',
  initialPosition = 'ST',
  title = 'Add New Player',
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: PlayerFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [position, setPosition] = useState<PlayerPosition>(initialPosition);

  // Use controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  // Sync form state when dialog opens or initial values change
  useEffect(() => {
    if (open) {
      setName(initialName);
      setPosition(initialPosition);
    }
  }, [open, initialName, initialPosition]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() && position) {
      onSubmit(name.trim(), position);
      setName('');
      setPosition('ST');
      if (isControlled && controlledOnOpenChange) {
        controlledOnOpenChange(false);
      } else {
        setInternalOpen(false);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isControlled && controlledOnOpenChange) {
      controlledOnOpenChange(open);
    } else {
      setInternalOpen(open);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialName ? 'Update player information' : 'Add a new player to your roster'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="player-name">
              Player Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter player name"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="player-position">
              Position <span className="text-destructive">*</span>
            </Label>
            <Select value={position} onValueChange={(value) => setPosition(value as PlayerPosition)}>
              <SelectTrigger id="player-position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((pos) => (
                  <SelectItem key={pos.value} value={pos.value}>
                    {pos.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim() || !position}>
            {initialName ? 'Save Changes' : 'Add Player'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  // Controlled mode (no trigger needed)
  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }

  // Uncontrolled mode (with trigger)
  if (!trigger) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
