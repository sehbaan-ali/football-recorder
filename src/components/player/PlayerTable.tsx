import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { Edit24Regular, Delete24Regular, Archive24Regular, ArrowUndo24Regular } from '@fluentui/react-icons';
import type { Player, PlayerStats } from '../../types';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  empty: {
    textAlign: 'center',
    padding: '48px 16px',
    color: tokens.colorNeutralForeground2,
  },
  nameCell: {
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface PlayerTableProps {
  players: Player[];
  playerStats: PlayerStats[];
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string, playerName: string, hasMatches: boolean) => void;
  onUnarchivePlayer: (playerId: string) => void;
  showArchived: boolean;
}

export function PlayerTable({ players, playerStats, onEditPlayer, onDeletePlayer, onUnarchivePlayer, showArchived }: PlayerTableProps) {
  const styles = useStyles();

  if (players.length === 0) {
    return (
      <div className={styles.empty}>
        <Text>
          {showArchived
            ? 'No archived players.'
            : 'No players yet. Add your first player to get started!'}
        </Text>
      </div>
    );
  }

  return (
    <Table className={styles.table}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Matches</TableHeaderCell>
          <TableHeaderCell>Wins</TableHeaderCell>
          <TableHeaderCell>Draws</TableHeaderCell>
          <TableHeaderCell>Losses</TableHeaderCell>
          <TableHeaderCell>Goals</TableHeaderCell>
          <TableHeaderCell>Assists</TableHeaderCell>
          <TableHeaderCell>Clean Sheets</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map(player => {
          const stats = playerStats.find(s => s.playerId === player.id);
          const hasMatches = stats ? stats.matchesPlayed > 0 : false;

          return (
            <TableRow key={player.id}>
              <TableCell>
                <Text className={styles.nameCell}>{player.name}</Text>
              </TableCell>
              <TableCell>{stats?.matchesPlayed || 0}</TableCell>
              <TableCell>{stats?.wins || 0}</TableCell>
              <TableCell>{stats?.draws || 0}</TableCell>
              <TableCell>{stats?.losses || 0}</TableCell>
              <TableCell>{stats?.goals || 0}</TableCell>
              <TableCell>{stats?.assists || 0}</TableCell>
              <TableCell>{stats?.cleanSheets || 0}</TableCell>
              <TableCell>
                <div className={styles.actions}>
                  {showArchived ? (
                    // Archived players: Show unarchive button
                    <Button
                      icon={<ArrowUndo24Regular />}
                      appearance="subtle"
                      size="small"
                      onClick={() => onUnarchivePlayer(player.id)}
                      title="Restore player"
                    >
                      Restore
                    </Button>
                  ) : (
                    // Active players: Show edit and archive/delete buttons
                    <>
                      <Button
                        icon={<Edit24Regular />}
                        appearance="subtle"
                        size="small"
                        onClick={() => onEditPlayer(player)}
                        title="Edit player"
                      />
                      <Button
                        icon={hasMatches ? <Archive24Regular /> : <Delete24Regular />}
                        appearance="subtle"
                        size="small"
                        onClick={() => onDeletePlayer(player.id, player.name, hasMatches)}
                        title={hasMatches ? 'Archive player' : 'Delete player'}
                      >
                        {hasMatches ? 'Archive' : 'Delete'}
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
