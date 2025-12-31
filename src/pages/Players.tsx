import { Button } from '@fluentui/react-components';
import { AddCircle24Regular } from '@fluentui/react-icons';
import { PageHeader } from '../components/layout/PageHeader';
import { PlayerForm } from '../components/player/PlayerForm';
import { PlayerList } from '../components/player/PlayerList';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import { useStats } from '../hooks/useStats';

export function Players() {
  const { players, addPlayer, deletePlayer, loading: playersLoading } = usePlayers();
  const { matches, loading: matchesLoading } = useMatches();
  const { playerStats } = useStats(players, matches);

  const handleAddPlayer = (name: string) => {
    addPlayer(name);
  };

  const handleDeletePlayer = (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      deletePlayer(playerId);
    }
  };

  const loading = playersLoading || matchesLoading;

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
        <PlayerList
          players={players}
          playerStats={playerStats}
          onDeletePlayer={handleDeletePlayer}
        />
      )}
    </div>
  );
}
