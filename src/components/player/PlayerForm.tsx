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
  trigger: React.ReactElement;
}

export function PlayerForm({ onSubmit, trigger }: PlayerFormProps) {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <DialogTrigger disableButtonEnhancement>
        {trigger}
      </DialogTrigger>
      <DialogSurface>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>Add New Player</DialogTitle>
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
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancel</Button>
              </DialogTrigger>
              <Button type="submit" appearance="primary" disabled={!name.trim()}>
                Add Player
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
}
