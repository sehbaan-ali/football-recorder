import {
  Card,
  CardHeader,
  Text,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Delete24Regular } from '@fluentui/react-icons';
import type { Player, PlayerStats } from '../../types';

const useStyles = makeStyles({
  card: {
    width: '100%',
    maxWidth: '300px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginTop: '12px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  statValue: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

interface PlayerCardProps {
  player: Player;
  stats?: PlayerStats;
  onDelete?: (playerId: string) => void;
}

export function PlayerCard({ player, stats, onDelete }: PlayerCardProps) {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        header={<Text weight="semibold">{player.name}</Text>}
        action={
          onDelete && (
            <Button
              icon={<Delete24Regular />}
              appearance="subtle"
              onClick={() => onDelete(player.id)}
              title="Delete player"
            />
          )
        }
      />

      {stats && (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Matches</div>
            <div className={styles.statValue}>{stats.matchesPlayed}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Wins</div>
            <div className={styles.statValue}>{stats.wins}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Goals</div>
            <div className={styles.statValue}>{stats.goals}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Assists</div>
            <div className={styles.statValue}>{stats.assists}</div>
          </div>
        </div>
      )}
    </Card>
  );
}
