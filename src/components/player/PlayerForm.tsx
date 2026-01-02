import { useState, useEffect, type FormEvent } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Input,
  Label,
  Dropdown,
  Option,
  makeStyles,
} from '@fluentui/react-components';
import type { PlayerPosition } from '../../types';

const useStyles = makeStyles({
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
});

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
  const styles = useStyles();
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

  const handleOpenChange = (_: unknown, data: { open: boolean }) => {
    if (isControlled && controlledOnOpenChange) {
      controlledOnOpenChange(data.open);
    } else {
      setInternalOpen(data.open);
    }
  };

  const dialogContent = (
    <DialogSurface>
      <form onSubmit={handleSubmit}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <div className={styles.field}>
              <Label htmlFor="player-name" required>
                Player Name
              </Label>
              <Input
                id="player-name"
                value={name}
                onChange={(_, data) => setName(data.value)}
                placeholder="Enter player name"
                required
                autoFocus
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="player-position" required>
                Position
              </Label>
              <Dropdown
                id="player-position"
                placeholder="Select position"
                value={POSITIONS.find(p => p.value === position)?.label}
                selectedOptions={[position]}
                onOptionSelect={(_, data) => setPosition(data.optionValue as PlayerPosition)}
                required
              >
                {POSITIONS.map((pos) => (
                  <Option key={pos.value} value={pos.value}>
                    {pos.label}
                  </Option>
                ))}
              </Dropdown>
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => {
              if (isControlled && controlledOnOpenChange) {
                controlledOnOpenChange(false);
              } else {
                setInternalOpen(false);
              }
            }}>
              Cancel
            </Button>
            <Button type="submit" appearance="primary" disabled={!name.trim() || !position}>
              {initialName ? 'Save Changes' : 'Add Player'}
            </Button>
          </DialogActions>
        </DialogBody>
      </form>
    </DialogSurface>
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
      <DialogTrigger disableButtonEnhancement>
        {trigger}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
