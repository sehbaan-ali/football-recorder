import { useState } from 'react';
import { Trophy, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Player, TeamColor } from '../../types';

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
    setOwnGoalDialogOpen(true);
  };

  const currentTeamPlayers = selectedTeam === 'yellow' ? yellowPlayers : redPlayers;
  const dialogTeamName = selectedTeam === 'yellow' ? 'Yellow' : 'Red';

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
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Goal - {dialogTeamName} Team</DialogTitle>
            <DialogDescription>
              Record a goal for the {dialogTeamName.toLowerCase()} team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scorer">
                Scorer <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedScorer} onValueChange={setSelectedScorer}>
                <SelectTrigger id="scorer">
                  <SelectValue placeholder="Select scorer" />
                </SelectTrigger>
                <SelectContent>
                  {currentTeamPlayers.map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assist">Assist (optional)</Label>
              <Select value={selectedAssist || '__NONE__'} onValueChange={(value) => setSelectedAssist(value === '__NONE__' ? '' : value)}>
                <SelectTrigger id="assist">
                  <SelectValue placeholder="Select assist provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__NONE__">No assist</SelectItem>
                  {currentTeamPlayers
                    .filter(p => p.id !== selectedScorer)
                    .map(player => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setGoalDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddGoal}
              disabled={!selectedScorer}
            >
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Own Goal Dialog */}
      <Dialog open={ownGoalDialogOpen} onOpenChange={setOwnGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Own Goal - {dialogTeamName} Team</DialogTitle>
            <DialogDescription>
              Record an own goal scored by a {dialogTeamName.toLowerCase()} team player
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="own-goal-player">
                Player who scored own goal <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedScorer} onValueChange={setSelectedScorer}>
                <SelectTrigger id="own-goal-player">
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {currentTeamPlayers.map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOwnGoalDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddOwnGoal}
              disabled={!selectedScorer}
            >
              Add Own Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
