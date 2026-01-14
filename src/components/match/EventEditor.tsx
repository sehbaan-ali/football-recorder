import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AddGoalDialog } from './AddGoalDialog';
import { AddOwnGoalDialog } from './AddOwnGoalDialog';
import { calculateScoresFromEvents } from '../../utils/eventHelpers';
import type { MatchEvent, Player, GoalEvent, OwnGoalEvent } from '../../types';

interface EventEditorProps {
  events: MatchEvent[];
  yellowPlayers: Player[];
  redPlayers: Player[];
  onEventsChange: (events: MatchEvent[]) => void;
}

type DialogState =
  | { type: 'goal'; team: 'yellow' | 'red'; editingIndex?: number }
  | { type: 'own-goal'; team: 'yellow' | 'red'; editingIndex?: number }
  | null;

export function EventEditor({ events, yellowPlayers, redPlayers, onEventsChange }: EventEditorProps) {
  const [dialogState, setDialogState] = useState<DialogState>(null);

  // Filter out clean sheets for display
  const displayEvents = events.filter(e => e.type !== 'clean-sheet');

  // Separate events by team
  const yellowEvents = displayEvents.filter(e => e.team === 'yellow');
  const redEvents = displayEvents.filter(e => e.team === 'red');

  // Calculate current scores
  const { yellowScore, redScore } = calculateScoresFromEvents(events);

  const handleAddGoal = (team: 'yellow' | 'red') => {
    setDialogState({ type: 'goal', team });
  };

  const handleAddOwnGoal = (team: 'yellow' | 'red') => {
    setDialogState({ type: 'own-goal', team });
  };

  const handleGoalAdded = (scorerId: string, assistId?: string) => {
    if (!dialogState || dialogState.type !== 'goal') return;

    const newEvent: GoalEvent = {
      type: 'goal',
      playerId: scorerId,
      assistPlayerId: assistId,
      team: dialogState.team,
      timestamp: new Date().toISOString(),
    };

    if (dialogState.editingIndex !== undefined) {
      // Editing existing event
      const updatedEvents = [...events];
      updatedEvents[dialogState.editingIndex] = newEvent;
      onEventsChange(updatedEvents);
    } else {
      // Adding new event
      onEventsChange([...events, newEvent]);
    }

    setDialogState(null);
  };

  const handleOwnGoalAdded = (playerId: string, assistId?: string) => {
    if (!dialogState || dialogState.type !== 'own-goal') return;

    const newEvent: OwnGoalEvent = {
      type: 'own-goal',
      playerId,
      ...(assistId && { assistPlayerId: assistId }),
      team: dialogState.team,
      timestamp: new Date().toISOString(),
    };

    if (dialogState.editingIndex !== undefined) {
      // Editing existing event
      const updatedEvents = [...events];
      updatedEvents[dialogState.editingIndex] = newEvent;
      onEventsChange(updatedEvents);
    } else {
      // Adding new event
      onEventsChange([...events, newEvent]);
    }

    setDialogState(null);
  };

  const handleEditEvent = (index: number) => {
    const event = events[index];
    if (event.type === 'goal') {
      setDialogState({ type: 'goal', team: event.team, editingIndex: index });
    } else if (event.type === 'own-goal') {
      setDialogState({ type: 'own-goal', team: event.team, editingIndex: index });
    }
  };

  const handleDeleteEvent = (index: number) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    onEventsChange(updatedEvents);
  };

  const getPlayerName = (playerId: string, team: 'yellow' | 'red') => {
    const players = team === 'yellow' ? yellowPlayers : redPlayers;
    const player = players.find(p => p.id === playerId);
    return player?.name || 'Unknown Player';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const renderEvent = (event: MatchEvent, index: number) => {
    if (event.type === 'clean-sheet') return null;

    const isOwnGoal = event.type === 'own-goal';
    const playerName = getPlayerName(event.playerId, event.team);
    const assistName = event.type === 'goal' && event.assistPlayerId
      ? getPlayerName(event.assistPlayerId, event.team)
      : null;

    return (
      <div
        key={index}
        className="flex items-start justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{isOwnGoal ? '🔴' : '⚽'}</span>
            <span className="font-medium">{playerName}</span>
            {isOwnGoal && (
              <span className="text-xs text-muted-foreground">(own goal)</span>
            )}
          </div>
          {assistName && (
            <div className="text-sm text-muted-foreground pl-7">
              Assist: {assistName}
            </div>
          )}
          <div className="text-xs text-muted-foreground pl-7">
            {formatTime(event.timestamp)}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditEvent(index)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteEvent(index)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddGoal('yellow')}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Yellow Goal
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddGoal('red')}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Red Goal
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddOwnGoal('yellow')}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Yellow Own Goal
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddOwnGoal('red')}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Red Own Goal
        </Button>
      </div>

      {/* Events Lists */}
      <div className="space-y-4">
        {/* Yellow Team Events */}
        {yellowEvents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
              Yellow Team Events
            </h4>
            <div className="space-y-2">
              {events.map((event, index) => {
                if (event.team === 'yellow' && event.type !== 'clean-sheet') {
                  return renderEvent(event, index);
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Red Team Events */}
        {redEvents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
              Red Team Events
            </h4>
            <div className="space-y-2">
              {events.map((event, index) => {
                if (event.team === 'red' && event.type !== 'clean-sheet') {
                  return renderEvent(event, index);
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {displayEvents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No events recorded yet. Add a goal or own goal to get started.
          </div>
        )}
      </div>

      {/* Calculated Score */}
      <div className="pt-4 border-t">
        <div className="text-center">
          <span className="text-sm text-muted-foreground">Calculated Score: </span>
          <span className="font-semibold text-yellow-700 dark:text-yellow-400">{yellowScore}</span>
          <span className="mx-2">-</span>
          <span className="font-semibold text-red-700 dark:text-red-400">{redScore}</span>
        </div>
      </div>

      {/* Dialogs */}
      {dialogState && dialogState.type === 'goal' && (
        <AddGoalDialog
          open={true}
          onClose={() => setDialogState(null)}
          players={dialogState.team === 'yellow' ? yellowPlayers : redPlayers}
          team={dialogState.team}
          onAddGoal={handleGoalAdded}
        />
      )}

      {dialogState && dialogState.type === 'own-goal' && (
        <AddOwnGoalDialog
          open={true}
          onClose={() => setDialogState(null)}
          players={dialogState.team === 'yellow' ? yellowPlayers : redPlayers}
          opposingPlayers={dialogState.team === 'yellow' ? redPlayers : yellowPlayers}
          team={dialogState.team}
          onAddOwnGoal={handleOwnGoalAdded}
        />
      )}
    </Card>
  );
}
