import { useState, type FormEvent } from 'react';
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
  makeStyles,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
});

interface PlayerFormProps {
  onSubmit: (name: string) => void;
  trigger?: React.ReactElement;
  initialName?: string;
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PlayerForm({
  onSubmit,
  trigger,
  initialName = '',
  title = 'Add New Player',
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: PlayerFormProps) {
  const styles = useStyles();
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState(initialName);

  // Use controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
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

    if (data.open) {
      setName(initialName);
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
            <Button type="submit" appearance="primary" disabled={!name.trim()}>
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
