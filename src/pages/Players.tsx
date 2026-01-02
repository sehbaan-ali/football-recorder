import { useState } from 'react';
import { Button } from '@fluentui/react-components';
import { AddCircle24Regular } from '@fluentui/react-icons';
import { PageHeader } from '../components/layout/PageHeader';
import { PlayerForm } from '../components/player/PlayerForm';
import { PlayerTable } from '../components/player/PlayerTable';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import { useStats } from '../hooks/useStats';
import type { Player } from '../types';

export function Players() {
  const { players, addPlayer, updatePlayer, deletePlayer, archivePlayer, unarchivePlayer, loading: playersLoading } = usePlayers();
  const { matches, loading: matchesLoading } = useMatches();
  const { playerStats } = useStats(players, matches);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const handleAddPlayer = (name: string) => {
    addPlayer(name);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setEditDialogOpen(true);
  };

  const handleUpdatePlayer = (name: string) => {
    if (editingPlayer) {
      updatePlayer(editingPlayer.id, { name });
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
    if (hasMatches) {
      // Archive instead of delete for players with match history
      if (window.confirm(
        `Archive ${playerName}?\n\n` +
        `They will be removed from your active player list, but their match history and statistics will be preserved. ` +
        `You can restore them later if needed.`
      )) {
        archivePlayer(playerId);
      }
    } else {
      // True deletion for players without match history
      if (window.confirm(
        `Delete ${playerName}?\n\n` +
        `They have no match history. This action cannot be undone.`
      )) {
        deletePlayer(playerId);
      }
    }
  };

  const handleUnarchivePlayer = (playerId: string) => {
    unarchivePlayer(playerId);
  };

  const loading = playersLoading || matchesLoading;

  // Filter players based on archived status
  const filteredPlayers = players.filter(player =>
    showArchived ? player.archived : !player.archived
  );

  const archivedCount = players.filter(p => p.archived).length;

  return (
    <div>
      <PageHeader
        title="Players"
        subtitle="Manage your football players"
        actions={
          <PlayerForm
            onSubmit={handleAddPlayer}
            trigger={
              <Button
                appearance="primary"
                icon={<AddCircle24Regular />}
              >
                Add Player
              </Button>
            }
          />
        }
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
              appearance={!showArchived ? 'primary' : 'subtle'}
              onClick={() => setShowArchived(false)}
            >
              Active Players
            </Button>
            <Button
              appearance={showArchived ? 'primary' : 'subtle'}
              onClick={() => setShowArchived(true)}
            >
              Archived ({archivedCount})
            </Button>
          </div>

          <PlayerTable
            players={filteredPlayers}
            playerStats={playerStats}
            onEditPlayer={handleEditPlayer}
            onDeletePlayer={handleDeletePlayer}
            onUnarchivePlayer={handleUnarchivePlayer}
            showArchived={showArchived}
          />

          <PlayerForm
            onSubmit={handleUpdatePlayer}
            initialName={editingPlayer?.name || ''}
            title="Edit Player"
            open={editDialogOpen}
            onOpenChange={handleEditDialogClose}
          />
        </>
      )}
    </div>
  );
}
