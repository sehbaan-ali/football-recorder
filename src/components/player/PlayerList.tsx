import { makeStyles } from '@fluentui/react-components';
import { PlayerCard } from './PlayerCard';
import type { Player, PlayerStats } from '../../types';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  empty: {
    textAlign: 'center',
    padding: '48px 16px',
    color: '#666',
  },
});

interface PlayerListProps {
  players: Player[];
  playerStats: PlayerStats[];
  onDeletePlayer?: (playerId: string) => void;
}

export function PlayerList({ players, playerStats, onDeletePlayer }: PlayerListProps) {
  const styles = useStyles();

  if (players.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No players yet. Add your first player to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {players.map(player => {
        const stats = playerStats.find(s => s.playerId === player.id);
        return (
          <PlayerCard
            key={player.id}
            player={player}
            stats={stats}
            onDelete={onDeletePlayer}
          />
        );
      })}
    </div>
  );
}
