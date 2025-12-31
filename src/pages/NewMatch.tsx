import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Label,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { PageHeader } from '../components/layout/PageHeader';
import { TeamSelector } from '../components/match/TeamSelector';
import { LiveMatchRecorder } from '../components/match/LiveMatchRecorder';
import { MatchEventList } from '../components/match/MatchEventList';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import type { TeamColor, MatchEvent } from '../types';

const useStyles = makeStyles({
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  step: {
    marginBottom: '32px',
  },
  field: {
    marginBottom: '16px',
  },
  teams: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
});

type Step = 'setup' | 'recording' | 'finalized';

export function NewMatch() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { players } = usePlayers();
  const { createMatch, addMatchEvent, removeLastEvent, finalizeMatch } = useMatches();

  const [step, setStep] = useState<Step>('setup');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [yellowPlayerIds, setYellowPlayerIds] = useState<string[]>([]);
  const [redPlayerIds, setRedPlayerIds] = useState<string[]>([]);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
  const [yellowScore, setYellowScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);

  const canStartMatch = yellowPlayerIds.length === 9 && redPlayerIds.length === 9;

  const handleStartMatch = () => {
    const match = createMatch(date, yellowPlayerIds, redPlayerIds);
    if (match) {
      setCurrentMatchId(match.id);
      setStep('recording');
    }
  };

  const handleAddGoal = (team: TeamColor, scorerId: string, assistId?: string) => {
    if (!currentMatchId) return;

    const event: MatchEvent = {
      type: 'goal',
      playerId: scorerId,
      assistPlayerId: assistId,
      team,
      timestamp: new Date().toISOString(),
    };

    const success = addMatchEvent(currentMatchId, event);
    if (success) {
      setEvents(prev => [...prev, event]);
      if (team === 'yellow') {
        setYellowScore(prev => prev + 1);
      } else {
        setRedScore(prev => prev + 1);
      }
    }
  };

  const handleAddOwnGoal = (team: TeamColor, playerId: string) => {
    if (!currentMatchId) return;

    const event: MatchEvent = {
      type: 'own-goal',
      playerId,
      team,
      timestamp: new Date().toISOString(),
    };

    const success = addMatchEvent(currentMatchId, event);
    if (success) {
      setEvents(prev => [...prev, event]);
      // Own goal increases opponent's score
      if (team === 'yellow') {
        setRedScore(prev => prev + 1);
      } else {
        setYellowScore(prev => prev + 1);
      }
    }
  };

  const handleUndo = () => {
    if (!currentMatchId || events.length === 0) return;

    const success = removeLastEvent(currentMatchId);
    if (success) {
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
    }
  };

  const handleEndMatch = () => {
    if (!currentMatchId) return;

    const success = finalizeMatch(currentMatchId);
    if (success) {
      navigate(`/match/${currentMatchId}`);
    }
  };

  const yellowPlayers = players.filter(p => yellowPlayerIds.includes(p.id));
  const redPlayers = players.filter(p => redPlayerIds.includes(p.id));

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
              <TeamSelector
                team="yellow"
                players={players}
                selectedPlayerIds={yellowPlayerIds}
                excludePlayerIds={redPlayerIds}
                onSelectionChange={setYellowPlayerIds}
                requiredCount={9}
              />
              <TeamSelector
                team="red"
                players={players}
                selectedPlayerIds={redPlayerIds}
                excludePlayerIds={yellowPlayerIds}
                onSelectionChange={setRedPlayerIds}
                requiredCount={9}
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
            <Button appearance="primary" onClick={handleEndMatch}>
              End Match
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
