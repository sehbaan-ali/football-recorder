import { useState } from 'react';
import {
  Button,
  Card,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Dropdown,
  Option,
  Label,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import {
  SportSoccer24Regular,
  ArrowUndo24Regular,
} from '@fluentui/react-icons';
import type { Player, TeamColor } from '../../types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  scoreBoard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '32px',
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
  },
  score: {
    fontSize: '48px',
    fontWeight: tokens.fontWeightBold,
  },
  teams: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  team: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  teamHeader: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    padding: '8px 12px',
    borderRadius: tokens.borderRadiusLarge,
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  field: {
    marginBottom: '16px',
  },
});

interface LiveMatchRecorderProps {
  yellowPlayers: Player[];
  redPlayers: Player[];
  yellowScore: number;
  redScore: number;
  onAddGoal: (team: TeamColor, scorerId: string, assistId?: string) => void;
  onAddOwnGoal: (team: TeamColor, playerId: string) => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function LiveMatchRecorder({
  yellowPlayers,
  redPlayers,
  yellowScore,
  redScore,
  onAddGoal,
  onAddOwnGoal,
  onUndo,
  canUndo,
}: LiveMatchRecorderProps) {
  const styles = useStyles();
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [ownGoalDialogOpen, setOwnGoalDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamColor>('yellow');
  const [selectedScorer, setSelectedScorer] = useState('');
  const [selectedAssist, setSelectedAssist] = useState('');

  const handleAddGoal = () => {
    if (selectedScorer) {
      onAddGoal(
        selectedTeam,
        selectedScorer,
        selectedAssist || undefined
      );
      setSelectedScorer('');
      setSelectedAssist('');
      setGoalDialogOpen(false);
    }
  };

  const handleAddOwnGoal = () => {
    if (selectedScorer) {
      onAddOwnGoal(selectedTeam, selectedScorer);
      setSelectedScorer('');
      setOwnGoalDialogOpen(false);
    }
  };

  const openGoalDialog = (team: TeamColor) => {
    setSelectedTeam(team);
    setSelectedScorer('');
    setSelectedAssist('');
    setGoalDialogOpen(true);
  };

  const openOwnGoalDialog = (team: TeamColor) => {
    setSelectedTeam(team);
    setSelectedScorer('');
    setOwnGoalDialogOpen(false);
    setOwnGoalDialogOpen(true);
  };

  const currentTeamPlayers = selectedTeam === 'yellow' ? yellowPlayers : redPlayers;

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.scoreBoard}>
          <div style={{ textAlign: 'center' }}>
            <Text weight="semibold">Yellow</Text>
            <div className={styles.score} style={{ color: '#FFD700' }}>
              {yellowScore}
            </div>
          </div>
          <Text size={600}>-</Text>
          <div style={{ textAlign: 'center' }}>
            <Text weight="semibold">Red</Text>
            <div className={styles.score} style={{ color: '#DC143C' }}>
              {redScore}
            </div>
          </div>
        </div>
      </Card>

      <div className={styles.teams}>
        <div className={styles.team}>
          <div
            className={styles.teamHeader}
            style={{ backgroundColor: '#FFD700', color: '#000' }}
          >
            Yellow Team
          </div>
          <div className={styles.actions}>
            <Button
              appearance="primary"
              icon={<SportSoccer24Regular />}
              onClick={() => openGoalDialog('yellow')}
            >
              Add Goal
            </Button>
            <Button
              appearance="secondary"
              onClick={() => openOwnGoalDialog('yellow')}
            >
              Own Goal
            </Button>
          </div>
        </div>

        <div className={styles.team}>
          <div
            className={styles.teamHeader}
            style={{ backgroundColor: '#DC143C', color: '#fff' }}
          >
            Red Team
          </div>
          <div className={styles.actions}>
            <Button
              appearance="primary"
              icon={<SportSoccer24Regular />}
              onClick={() => openGoalDialog('red')}
            >
              Add Goal
            </Button>
            <Button
              appearance="secondary"
              onClick={() => openOwnGoalDialog('red')}
            >
              Own Goal
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Button
          icon={<ArrowUndo24Regular />}
          onClick={onUndo}
          disabled={!canUndo}
        >
          Undo Last Event
        </Button>
      </div>

      {/* Goal Dialog */}
      <Dialog open={goalDialogOpen} onOpenChange={(_, data) => setGoalDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Add Goal</DialogTitle>
            <DialogContent>
              <div className={styles.field}>
                <Label htmlFor="scorer" required>
                  Scorer
                </Label>
                <Dropdown
                  id="scorer"
                  placeholder="Select scorer"
                  value={currentTeamPlayers.find(p => p.id === selectedScorer)?.name || ''}
                  onOptionSelect={(_, data) => setSelectedScorer(data.optionValue || '')}
                >
                  {currentTeamPlayers.map(player => (
                    <Option key={player.id} value={player.id}>
                      {player.name}
                    </Option>
                  ))}
                </Dropdown>
              </div>

              <div className={styles.field}>
                <Label htmlFor="assist">Assist (optional)</Label>
                <Dropdown
                  id="assist"
                  placeholder="Select assist provider"
                  value={currentTeamPlayers.find(p => p.id === selectedAssist)?.name || ''}
                  onOptionSelect={(_, data) => setSelectedAssist(data.optionValue || '')}
                >
                  <Option value="">No assist</Option>
                  {currentTeamPlayers
                    .filter(p => p.id !== selectedScorer)
                    .map(player => (
                      <Option key={player.id} value={player.id}>
                        {player.name}
                      </Option>
                    ))}
                </Dropdown>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setGoalDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                appearance="primary"
                onClick={handleAddGoal}
                disabled={!selectedScorer}
              >
                Add Goal
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Own Goal Dialog */}
      <Dialog open={ownGoalDialogOpen} onOpenChange={(_, data) => setOwnGoalDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Add Own Goal</DialogTitle>
            <DialogContent>
              <div className={styles.field}>
                <Label htmlFor="own-goal-player" required>
                  Player who scored own goal
                </Label>
                <Dropdown
                  id="own-goal-player"
                  placeholder="Select player"
                  value={currentTeamPlayers.find(p => p.id === selectedScorer)?.name || ''}
                  onOptionSelect={(_, data) => setSelectedScorer(data.optionValue || '')}
                >
                  {currentTeamPlayers.map(player => (
                    <Option key={player.id} value={player.id}>
                      {player.name}
                    </Option>
                  ))}
                </Dropdown>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setOwnGoalDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                appearance="primary"
                onClick={handleAddOwnGoal}
                disabled={!selectedScorer}
              >
                Add Own Goal
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
