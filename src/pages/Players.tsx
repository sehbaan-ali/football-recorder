import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-spinner';
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
import { PlayerForm } from '../components/player/PlayerForm';
import { PlayerGrid } from '../components/player/PlayerGrid';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import { useStats } from '../hooks/useStats';
import { useAuth } from '../contexts/AuthContext';
import type { Player, PlayerPosition } from '../types';

// Position sort order
const POSITION_ORDER: Record<PlayerPosition, number> = {
  'GK': 1,
  'DEF': 2,
  'MID': 3,
  'WING': 4,
  'ST': 5,
};

export function Players() {
  const { players, addPlayer, updatePlayer, deletePlayer, archivePlayer, unarchivePlayer, loading: playersLoading } = usePlayers();
  const { matches, loading: matchesLoading } = useMatches();
  const { playerStats } = useStats(players, matches);
  const { isAdmin } = useAuth();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<{ id: string; name: string; hasMatches: boolean } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('All');

  const handleAddPlayer = (name: string, position: string) => {
    addPlayer(name, position);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setEditDialogOpen(true);
  };

  const handleUpdatePlayer = (name: string, position: string) => {
    if (editingPlayer) {
      updatePlayer(editingPlayer.id, { name, position: position as any });
      setEditingPlayer(null);
      setEditDialogOpen(false);
    }
  };

  const handleEditDialogClose = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setEditingPlayer(null);
    }
  };

  const handleDeletePlayer = (playerId: string, playerName: string, hasMatches: boolean) => {
    setPlayerToDelete({ id: playerId, name: playerName, hasMatches });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!playerToDelete) return;

    if (playerToDelete.hasMatches) {
      archivePlayer(playerToDelete.id);
    } else {
      deletePlayer(playerToDelete.id);
    }

    setDeleteDialogOpen(false);
    setPlayerToDelete(null);
  };

  const handleUnarchivePlayer = (playerId: string) => {
    unarchivePlayer(playerId);
  };

  const loading = playersLoading || matchesLoading;

  // Filter players based on archived status and sort by position
  // Exclude guest players from the players management page
  const baseFilteredPlayers = players
    .filter(player => !player.isGuest)
    .filter(player => showArchived ? player.archived : !player.archived)
    .sort((a, b) => {
      // Sort by position first
      const positionDiff = POSITION_ORDER[a.position] - POSITION_ORDER[b.position];
      if (positionDiff !== 0) return positionDiff;

      // If same position, sort alphabetically by name
      return a.name.localeCompare(b.name);
    });

  // Apply search and position filters
  const filteredPlayers = baseFilteredPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesPosition = positionFilter === 'All' || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const archivedCount = players.filter(p => !p.isGuest && p.archived).length;
  const isFiltered = searchText.length > 0 || positionFilter !== 'All';
  const totalCount = baseFilteredPlayers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground">Manage your football players</p>
        </div>
        <PlayerForm
          onSubmit={handleAddPlayer}
          trigger={
            <Button disabled={!isAdmin}>
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          }
        />
      </div>

      {loading ? (
        <LoadingState message="Loading players" />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={!showArchived ? 'default' : 'outline'}
              onClick={() => setShowArchived(false)}
            >
              Active Players
            </Button>
            <Button
              variant={showArchived ? 'default' : 'outline'}
              onClick={() => setShowArchived(true)}
            >
              Archived ({archivedCount})
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search players..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Position Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={positionFilter === 'All' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPositionFilter('All')}
                >
                  All
                </Button>
                <Button
                  variant={positionFilter === 'GK' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPositionFilter('GK')}
                >
                  GK
                </Button>
                <Button
                  variant={positionFilter === 'DEF' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPositionFilter('DEF')}
                >
                  DEF
                </Button>
                <Button
                  variant={positionFilter === 'MID' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPositionFilter('MID')}
                >
                  MID
                </Button>
                <Button
                  variant={positionFilter === 'WING' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPositionFilter('WING')}
                >
                  WING
                </Button>
                <Button
                  variant={positionFilter === 'ST' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPositionFilter('ST')}
                >
                  ST
                </Button>
              </div>
            </div>
          </div>

          <PlayerGrid
            players={filteredPlayers}
            playerStats={playerStats}
            onEditPlayer={handleEditPlayer}
            onDeletePlayer={handleDeletePlayer}
            onUnarchivePlayer={handleUnarchivePlayer}
            showArchived={showArchived}
            isAdmin={isAdmin}
            isFiltered={isFiltered}
          />

          {/* Result count */}
          {isFiltered && filteredPlayers.length > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              Showing {filteredPlayers.length} of {totalCount} players
            </p>
          )}

          <PlayerForm
            onSubmit={handleUpdatePlayer}
            initialName={editingPlayer?.name || ''}
            initialPosition={editingPlayer?.position || 'ST'}
            title="Edit Player"
            open={editDialogOpen}
            onOpenChange={handleEditDialogClose}
          />
        </>
      )}

      {/* Delete/Archive Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {playerToDelete?.hasMatches ? `Archive ${playerToDelete?.name}?` : `Delete ${playerToDelete?.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {playerToDelete?.hasMatches
                ? "They will be removed from your active player list, but their match history and statistics will be preserved. You can restore them later if needed."
                : "They have no match history. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              {playerToDelete?.hasMatches ? 'Archive' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
