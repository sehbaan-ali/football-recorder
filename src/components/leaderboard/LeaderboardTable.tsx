import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { Trophy24Filled } from '@fluentui/react-icons';
import type { PlayerStats } from '../../types';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  rank: {
    fontWeight: tokens.fontWeightSemibold,
  },
  topRank: {
    color: '#FFD700',
  },
  empty: {
    textAlign: 'center',
    padding: '48px 16px',
    color: tokens.colorNeutralForeground2,
  },
});

interface LeaderboardTableProps {
  stats: PlayerStats[];
}

export function LeaderboardTable({ stats }: LeaderboardTableProps) {
  const styles = useStyles();

  if (stats.length === 0) {
    return (
      <div className={styles.empty}>
        <Text>No statistics available yet. Play some matches to see the leaderboard!</Text>
      </div>
    );
  }

  return (
    <Table className={styles.table}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Rank</TableHeaderCell>
          <TableHeaderCell>Player</TableHeaderCell>
          <TableHeaderCell>Matches</TableHeaderCell>
          <TableHeaderCell>Wins</TableHeaderCell>
          <TableHeaderCell>Draws</TableHeaderCell>
          <TableHeaderCell>Losses</TableHeaderCell>
          <TableHeaderCell>Goals</TableHeaderCell>
          <TableHeaderCell>Assists</TableHeaderCell>
          <TableHeaderCell>Clean Sheets</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((stat, index) => (
          <TableRow key={stat.playerId}>
            <TableCell>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {index === 0 && <Trophy24Filled className={styles.topRank} />}
                <span className={index < 3 ? styles.topRank : styles.rank}>
                  {index + 1}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Text weight="semibold">{stat.playerName}</Text>
            </TableCell>
            <TableCell>{stat.matchesPlayed}</TableCell>
            <TableCell>{stat.wins}</TableCell>
            <TableCell>{stat.draws}</TableCell>
            <TableCell>{stat.losses}</TableCell>
            <TableCell>{stat.goals}</TableCell>
            <TableCell>{stat.assists}</TableCell>
            <TableCell>{stat.cleanSheets}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
