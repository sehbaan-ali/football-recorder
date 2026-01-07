import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FormationSelector, type FormationAssignment } from '../components/match/FormationSelector';
import { LiveMatchRecorder } from '../components/match/LiveMatchRecorder';
import { MatchEventList } from '../components/match/MatchEventList';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import type { TeamColor, MatchEvent } from '../types';

type Step = 'setup' | 'recording' | 'finalized';

export function NewMatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { players, loading: playersLoading } = usePlayers();
  const { createMatch, updateMatch } = useMatches();
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('setup');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'back' | 'discard' | null>(null);
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
      toast({
        title: "Error",
        description: "Failed to save match. Please try again.",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Match saved successfully!",
      });
      navigate('/');
    } else {
      toast({
        title: "Error",
        description: "Failed to save match details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBackToSetup = () => {
    // Only show confirmation if there are recorded events
    if (events.length > 0) {
      setConfirmAction('back');
      setConfirmDialogOpen(true);
      return;
    }

    // Reset to setup (match was never saved to DB)
    setYellowScore(0);
    setRedScore(0);
    setEvents([]);
    setHasUnsavedChanges(false);
    setStep('setup');
  };

  const handleDiscardMatch = () => {
    // Warn user if there are events
    if (hasUnsavedChanges) {
      setConfirmAction('discard');
      setConfirmDialogOpen(true);
      return;
    }

    // Reset to setup (match was never saved to DB)
    setYellowScore(0);
    setRedScore(0);
    setEvents([]);
    setHasUnsavedChanges(false);
    setStep('setup');
  };

  const handleConfirmAction = () => {
    // Reset to setup (match was never saved to DB)
    setYellowScore(0);
    setRedScore(0);
    setEvents([]);
    setHasUnsavedChanges(false);
    setStep('setup');
    setConfirmDialogOpen(false);
    setConfirmAction(null);
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Match</h1>
          <p className="text-muted-foreground">Record a new football match</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6 text-center">
              You need to be logged in to record matches.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/login', { state: { from: location } })}>
                Login
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (playersLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Match</h1>
          <p className="text-muted-foreground">Record a new football match</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (players.length < 18) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Match</h1>
          <p className="text-muted-foreground">Record a new football match</p>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground">
              You need at least 18 players to start a match (9 per team).
              Please add more players first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Match</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {step === 'setup'
              ? 'Select teams to start'
              : 'Record match events in real-time'}
          </p>
        </div>
        {step === 'recording' && (
          <Button variant="outline" onClick={handleBackToSetup} size="lg" className="w-full sm:w-auto">
            Back to Setup
          </Button>
        )}
      </div>

      {step === 'setup' && (
        <div className="space-y-6">
          {/* Date Field */}
          <div className="space-y-2">
            <Label htmlFor="match-date">Match Date</Label>
            <Input
              id="match-date"
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              className="w-full sm:w-fit"
            />
          </div>

          {/* Team Selection */}
          <div className="space-y-6">
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

          {/* Actions */}
          <Button
            onClick={handleStartMatch}
            disabled={!canStartMatch}
            size="lg"
            className="-mt-2 w-full sm:w-auto"
          >
            Start Match
          </Button>
        </div>
      )}

      {step === 'recording' && (
        <div className="space-y-6">
          {/* Live Recorder */}
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

          {/* Match Events */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Match Events</h2>
            <MatchEventList events={events} players={players} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSaveMatch} size="lg" className="w-full sm:w-auto">
              Save Match
            </Button>
            <Button variant="outline" onClick={handleDiscardMatch} size="lg" className="w-full sm:w-auto">
              Discard Match
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === 'back' ? 'Go back to setup?' : 'Discard match?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              All recorded events will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {confirmAction === 'back' ? 'Go Back' : 'Discard'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
