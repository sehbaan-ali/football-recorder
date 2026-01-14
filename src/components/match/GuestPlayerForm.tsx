import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePlayers } from '@/hooks/usePlayers';
import type { Player, PlayerPosition } from '@/types';

interface GuestPlayerFormProps {
  position: PlayerPosition;
  open: boolean;
  onGuestCreated: (player: Player) => void;
  onCancel: () => void;
}

export function GuestPlayerForm({ position, open, onGuestCreated, onCancel }: GuestPlayerFormProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPlayer } = usePlayers();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const guestPlayer = await addPlayer(name.trim(), position, true); // isGuest = true

    if (guestPlayer) {
      onGuestCreated(guestPlayer);
      setName('');
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setName('');
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Guest Player</DialogTitle>
          <DialogDescription>
            Add a temporary guest player for this match. They won't appear in leaderboards.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="guest-name">Player Name</Label>
              <Input
                id="guest-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter guest player name..."
                autoFocus
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest-position">Position</Label>
              <Input
                id="guest-position"
                value={`${position} (assigned to slot)`}
                disabled
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Guest'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
