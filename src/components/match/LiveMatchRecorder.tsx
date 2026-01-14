import { useState } from 'react';
import { Trophy, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AddGoalDialog } from './AddGoalDialog';
import { AddOwnGoalDialog } from './AddOwnGoalDialog';
import type { Player, TeamColor } from '../../types';

interface LiveMatchRecorderProps {
  yellowPlayers: Player[];
  redPlayers: Player[];
  yellowScore: number;
  redScore: number;
  onAddGoal: (team: TeamColor, scorerId: string, assistId?: string) => void;
  onAddOwnGoal: (team: TeamColor, playerId: string, assistId?: string) => void;
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
  const [goalDialogState, setGoalDialogState] = useState<{ team: TeamColor; open: boolean }>({
    team: 'yellow',
    open: false,
  });
  const [ownGoalDialogState, setOwnGoalDialogState] = useState<{ team: TeamColor; open: boolean }>({
    team: 'yellow',
    open: false,
  });

  const handleGoalAdded = (scorerId: string, assistId?: string) => {
    onAddGoal(goalDialogState.team, scorerId, assistId);
    setGoalDialogState({ ...goalDialogState, open: false });
  };

  const handleOwnGoalAdded = (playerId: string, assistId?: string) => {
    onAddOwnGoal(ownGoalDialogState.team, playerId, assistId);
    setOwnGoalDialogState({ ...ownGoalDialogState, open: false });
  };

  const openGoalDialog = (team: TeamColor) => {
    setGoalDialogState({ team, open: true });
  };

  const openOwnGoalDialog = (team: TeamColor) => {
    setOwnGoalDialogState({ team, open: true });
  };

  const currentGoalTeamPlayers = goalDialogState.team === 'yellow' ? yellowPlayers : redPlayers;
  const currentOwnGoalTeamPlayers = ownGoalDialogState.team === 'yellow' ? yellowPlayers : redPlayers;

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 items-center gap-8">
            {/* Yellow Team */}
            <div className="text-center space-y-2">
              <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Yellow</div>
              <div className="text-5xl font-bold">
                {yellowScore}
              </div>
            </div>

            {/* Separator */}
            <div className="text-center">
              <div className="text-2xl font-light text-muted-foreground">-</div>
            </div>

            {/* Red Team */}
            <div className="text-center space-y-2">
              <div className="text-xs font-medium text-red-700 dark:text-red-400">Red</div>
              <div className="text-5xl font-bold">
                {redScore}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Yellow Team */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="text-center mb-4">
              <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Yellow Team</h3>
            </div>
            <Button
              className="w-full"
              onClick={() => openGoalDialog('yellow')}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => openOwnGoalDialog('yellow')}
            >
              Own Goal
            </Button>
          </CardContent>
        </Card>

        {/* Red Team */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="text-center mb-4">
              <h3 className="text-sm font-medium text-red-700 dark:text-red-400">Red Team</h3>
            </div>
            <Button
              className="w-full"
              onClick={() => openGoalDialog('red')}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => openOwnGoalDialog('red')}
            >
              Own Goal
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Undo Button */}
      <Button
        variant="outline"
        onClick={onUndo}
        disabled={!canUndo}
        className="gap-2"
      >
        <Undo2 className="h-4 w-4" />
        Undo Last Event
      </Button>

      {/* Goal Dialog */}
      <AddGoalDialog
        open={goalDialogState.open}
        onClose={() => setGoalDialogState({ ...goalDialogState, open: false })}
        players={currentGoalTeamPlayers}
        team={goalDialogState.team}
        onAddGoal={handleGoalAdded}
      />

      {/* Own Goal Dialog */}
      <AddOwnGoalDialog
        open={ownGoalDialogState.open}
        onClose={() => setOwnGoalDialogState({ ...ownGoalDialogState, open: false })}
        players={currentOwnGoalTeamPlayers}
        opposingPlayers={ownGoalDialogState.team === 'yellow' ? redPlayers : yellowPlayers}
        team={ownGoalDialogState.team}
        onAddOwnGoal={handleOwnGoalAdded}
      />
    </div>
  );
}
