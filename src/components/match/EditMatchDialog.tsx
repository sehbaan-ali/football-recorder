import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FormationSelector, type FormationAssignment } from './FormationSelector';
import { ManOfTheMatchSelector } from './ManOfTheMatchSelector';
import { EventEditor } from './EventEditor';
import { useToast } from '../../hooks/use-toast';
import { calculateScoresFromEvents, generateCleanSheetEvents } from '../../utils/eventHelpers';
import type { Match, Player, MatchEvent } from '../../types';

interface EditMatchDialogProps {
  match: Match;
  players: Player[];
  open: boolean;
  onClose: () => void;
  onSave: (matchId: string, updates: Partial<Match>) => Promise<boolean>;
}

export function EditMatchDialog({
  match,
  players,
  open,
  onClose,
  onSave,
}: EditMatchDialogProps) {
  const { toast } = useToast();
  const [date, setDate] = useState(match.date);
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
  const [events, setEvents] = useState<MatchEvent[]>(
    match.events.filter(e => e.type !== 'clean-sheet')
  );
  const [manOfTheMatch, setManOfTheMatch] = useState(match.manOfTheMatch);
  const [saving, setSaving] = useState(false);

  // Initialize formations from match data
  useEffect(() => {
    if (open) {
      setDate(match.date);
      setEvents(match.events.filter(e => e.type !== 'clean-sheet'));
      setManOfTheMatch(match.manOfTheMatch);

      // Convert player IDs to formation assignments
      // For simplicity, we'll assign players to positions in order
      const yellowIds = [...match.yellowTeam.playerIds];
      const redIds = [...match.redTeam.playerIds];

      const newYellowFormation: FormationAssignment = {
        GK: yellowIds[0] || null,
        DEF_1: yellowIds[1] || null,
        DEF_2: yellowIds[2] || null,
        DEF_3: yellowIds[3] || null,
        MID_1: yellowIds[4] || null,
        MID_2: yellowIds[5] || null,
        WING_1: yellowIds[6] || null,
        WING_2: yellowIds[7] || null,
        ST: yellowIds[8] || null,
      };

      const newRedFormation: FormationAssignment = {
        GK: redIds[0] || null,
        DEF_1: redIds[1] || null,
        DEF_2: redIds[2] || null,
        DEF_3: redIds[3] || null,
        MID_1: redIds[4] || null,
        MID_2: redIds[5] || null,
        WING_1: redIds[6] || null,
        WING_2: redIds[7] || null,
        ST: redIds[8] || null,
      };

      setYellowFormation(newYellowFormation);
      setRedFormation(newRedFormation);
    }
  }, [match, open]);

  const yellowPlayerIds = Object.values(yellowFormation).filter(
    (id): id is string => id !== null
  );
  const redPlayerIds = Object.values(redFormation).filter(
    (id): id is string => id !== null
  );

  const handleSave = async () => {
    setSaving(true);

    // Validation
    if (yellowPlayerIds.length !== 9 || redPlayerIds.length !== 9) {
      toast({
        title: 'Invalid teams',
        description: 'Each team must have exactly 9 players',
        variant: 'destructive',
      });
      setSaving(false);
      return;
    }

    // Validate MOTM is in one of the teams
    if (
      manOfTheMatch &&
      !yellowPlayerIds.includes(manOfTheMatch) &&
      !redPlayerIds.includes(manOfTheMatch)
    ) {
      toast({
        title: 'Invalid Man of the Match',
        description: 'MOTM must be a player who participated in the match',
        variant: 'destructive',
      });
      setSaving(false);
      return;
    }

    // Calculate scores from events
    const { yellowScore, redScore } = calculateScoresFromEvents(events);

    // Generate clean sheets based on final scores
    const cleanSheets = generateCleanSheetEvents(
      yellowPlayerIds,
      redPlayerIds,
      yellowScore,
      redScore
    );

    // Combine all events
    const allEvents = [...events, ...cleanSheets];

    // Validate events reference valid players
    const allPlayerIds = new Set([...yellowPlayerIds, ...redPlayerIds]);
    const invalidEvents = allEvents.filter(
      e => !allPlayerIds.has(e.playerId) ||
           (e.type === 'goal' && e.assistPlayerId && !allPlayerIds.has(e.assistPlayerId))
    );

    if (invalidEvents.length > 0) {
      toast({
        title: 'Invalid events detected',
        description: 'Some events reference players not in the match. Please delete these events.',
        variant: 'destructive',
      });
      setSaving(false);
      return;
    }

    const success = await onSave(match.id, {
      date,
      yellowTeam: { playerIds: yellowPlayerIds, score: yellowScore },
      redTeam: { playerIds: redPlayerIds, score: redScore },
      events: allEvents,
      manOfTheMatch,
    });

    setSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Match</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="edit-match-date">Match Date</Label>
            <Input
              id="edit-match-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Teams */}
          <div className="space-y-3">
            <h3 className="font-semibold">Teams</h3>
            <FormationSelector
              team="yellow"
              players={players.filter((p) => !p.archived)}
              formation={yellowFormation}
              excludePlayerIds={redPlayerIds}
              onFormationChange={setYellowFormation}
            />
            <FormationSelector
              team="red"
              players={players.filter((p) => !p.archived)}
              formation={redFormation}
              excludePlayerIds={yellowPlayerIds}
              onFormationChange={setRedFormation}
            />
          </div>

          {/* Match Events */}
          <div className="space-y-2">
            <h3 className="font-semibold">Match Events</h3>
            <EventEditor
              events={events}
              yellowPlayers={players.filter(p => yellowPlayerIds.includes(p.id))}
              redPlayers={players.filter(p => redPlayerIds.includes(p.id))}
              onEventsChange={setEvents}
            />
          </div>

          {/* Man of the Match */}
          <ManOfTheMatchSelector
            players={players}
            yellowPlayerIds={yellowPlayerIds}
            redPlayerIds={redPlayerIds}
            selectedMotm={manOfTheMatch}
            onMotmChange={setManOfTheMatch}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
