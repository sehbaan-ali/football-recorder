import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Label,
  makeStyles,
  tokens,
  Text,
  Card,
} from '@fluentui/react-components';
import { PageHeader } from '../components/layout/PageHeader';
import { FormationSelector, type FormationAssignment } from '../components/match/FormationSelector';
import { LiveMatchRecorder } from '../components/match/LiveMatchRecorder';
import { MatchEventList } from '../components/match/MatchEventList';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import { useAuth } from '../contexts/AuthContext';
import type { TeamColor, MatchEvent } from '../types';

const useStyles = makeStyles({
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 16px',
  },
  step: {
    marginBottom: '32px',
  },
  field: {
    marginBottom: '16px',
  },
  teams: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginTop: '16px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '12px',
  },
  unauthorized: {
    textAlign: 'center',
    padding: '48px 24px',
    marginTop: '32px',
  },
});

type Step = 'setup' | 'recording' | 'finalized';

export function NewMatch() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { players } = usePlayers();
  const { createMatch, updateMatch } = useMatches();
  const { isAdmin } = useAuth();

  const [step, setStep] = useState<Step>('setup');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [yellowFormation, setYellowFormation] = useState<FormationAssignment>({
    GK: null,
    DEF_1: null,
    DEF_2: null,
    DEF_3: null,
    MID_1: null,
    MID_2: null,
    WING_1: null,
    WING_2: null,
    ST: null,
  });
  const [redFormation, setRedFormation] = useState<FormationAssignment>({
    GK: null,
    DEF_1: null,
    DEF_2: null,
    DEF_3: null,
    MID_1: null,
    MID_2: null,
    WING_1: null,
    WING_2: null,
    ST: null,
  });
  const [yellowScore, setYellowScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Extract player IDs from formations
  const yellowPlayerIds = Object.values(yellowFormation).filter((id): id is string => id !== null);
  const redPlayerIds = Object.values(redFormation).filter((id): id is string => id !== null);

  const canStartMatch = yellowPlayerIds.length === 9 && redPlayerIds.length === 9;

  const handleStartMatch = () => {
    // Don't create match in DB yet - only when saving
    setStep('recording');
    setHasUnsavedChanges(true);
  };

  const handleAddGoal = (team: TeamColor, scorerId: string, assistId?: string) => {
    const event: MatchEvent = {
      type: 'goal',
      playerId: scorerId,
      assistPlayerId: assistId,
      team,
      timestamp: new Date().toISOString(),
    };

    setEvents(prev => [...prev, event]);
    if (team === 'yellow') {
      setYellowScore(prev => prev + 1);
    } else {
      setRedScore(prev => prev + 1);
    }
    setHasUnsavedChanges(true);
  };

  const handleAddOwnGoal = (team: TeamColor, playerId: string) => {
    const event: MatchEvent = {
      type: 'own-goal',
      playerId,
      team,
      timestamp: new Date().toISOString(),
    };

    setEvents(prev => [...prev, event]);
    // Own goal increases opponent's score
    if (team === 'yellow') {
      setRedScore(prev => prev + 1);
    } else {
      setYellowScore(prev => prev + 1);
    }
    setHasUnsavedChanges(true);
  };

  const handleUndo = () => {
    if (events.length === 0) return;

    setEvents(prev => prev.slice(0, -1));

    // Recalculate scores
    let newYellowScore = 0;
    let newRedScore = 0;
    events.slice(0, -1).forEach(e => {
      if (e.type === 'goal') {
        if (e.team === 'yellow') newYellowScore++;
        else newRedScore++;
      } else if (e.type === 'own-goal') {
        if (e.team === 'yellow') newRedScore++;
        else newYellowScore++;
      }
    });
    setYellowScore(newYellowScore);
    setRedScore(newRedScore);
  };

  const handleSaveMatch = async () => {
    // Add clean sheet events for players whose team didn't concede
    const cleanSheetEvents: MatchEvent[] = [];

    if (redScore === 0) {
      // Yellow team kept a clean sheet
      yellowPlayerIds.forEach(playerId => {
        cleanSheetEvents.push({
          type: 'clean-sheet',
          playerId,
          team: 'yellow',
        });
      });
    }

    if (yellowScore === 0) {
      // Red team kept a clean sheet
      redPlayerIds.forEach(playerId => {
        cleanSheetEvents.push({
          type: 'clean-sheet',
          playerId,
          team: 'red',
        });
      });
    }

    // Combine all events
    const allEvents = [...events, ...cleanSheetEvents];

    // Create the match with final scores and all events
    const match = await createMatch(date, yellowPlayerIds, redPlayerIds);
    if (!match) {
      alert('Failed to save match. Please try again.');
      return;
    }

    // Update the match with final scores and events
    const success = await updateMatch(match.id, {
      yellowTeam: { ...match.yellowTeam, score: yellowScore },
      redTeam: { ...match.redTeam, score: redScore },
      events: allEvents,
    });

    if (success) {
      setHasUnsavedChanges(false);
      alert('Match saved successfully!');
      navigate('/');
    } else {
      alert('Failed to save match details. Please try again.');
    }
  };

  const handleDiscardMatch = () => {
    // Warn user if there are events
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'Are you sure you want to discard this match?\n\n' +
        'All recorded events will be lost. This action cannot be undone.'
      );
      if (!confirmed) return;
    }

    // Reset to setup (match was never saved to DB)
    setYellowScore(0);
    setRedScore(0);
    setEvents([]);
    setHasUnsavedChanges(false);
    setStep('setup');
  };

  const yellowPlayers = players.filter(p => yellowPlayerIds.includes(p.id));
  const redPlayers = players.filter(p => redPlayerIds.includes(p.id));

  // Warn about unsaved changes when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Check admin access
  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <PageHeader
          title="New Match"
          subtitle="Record a new football match"
        />
        <Card className={styles.unauthorized}>
          <Text size={500} weight="semibold" style={{ marginBottom: '12px', display: 'block' }}>
            Login Required
          </Text>
          <Text style={{ marginBottom: '24px', display: 'block' }}>
            You need to be logged in to record matches.
          </Text>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button
              appearance="primary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              appearance="secondary"
              onClick={() => navigate('/')}
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (players.length < 18) {
    return (
      <div className={styles.container}>
        <PageHeader
          title="New Match"
          subtitle="Record a new football match"
        />
        <Text>
          You need at least 18 players to start a match (9 per team).
          Please add more players first.
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader
        title="New Match"
        subtitle={
          step === 'setup'
            ? 'Select teams to start'
            : 'Record match events in real-time'
        }
      />

      {step === 'setup' && (
        <div>
          <div className={styles.step}>
            <div className={styles.field}>
              <Label htmlFor="match-date">Match Date</Label>
              <Input
                id="match-date"
                type="date"
                value={date}
                onChange={(_, data) => setDate(data.value)}
              />
            </div>

            <div className={styles.teams}>
              <FormationSelector
                team="yellow"
                players={players.filter(p => !p.archived)}
                formation={yellowFormation}
                excludePlayerIds={redPlayerIds}
                onFormationChange={setYellowFormation}
              />
              <FormationSelector
                team="red"
                players={players.filter(p => !p.archived)}
                formation={redFormation}
                excludePlayerIds={yellowPlayerIds}
                onFormationChange={setRedFormation}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              appearance="primary"
              onClick={handleStartMatch}
              disabled={!canStartMatch}
            >
              Start Match
            </Button>
          </div>
        </div>
      )}

      {step === 'recording' && (
        <div>
          <div className={styles.section}>
            <LiveMatchRecorder
              yellowPlayers={yellowPlayers}
              redPlayers={redPlayers}
              yellowScore={yellowScore}
              redScore={redScore}
              onAddGoal={handleAddGoal}
              onAddOwnGoal={handleAddOwnGoal}
              onUndo={handleUndo}
              canUndo={events.length > 0}
            />
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Match Events</div>
            <MatchEventList events={events} players={players} />
          </div>

          <div className={styles.actions}>
            <Button appearance="primary" onClick={handleSaveMatch}>
              Save Match
            </Button>
            <Button appearance="secondary" onClick={handleDiscardMatch}>
              Discard Match
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
