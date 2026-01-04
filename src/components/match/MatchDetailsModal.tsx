import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  Card,
  Text,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Dismiss24Regular, Delete24Regular } from '@fluentui/react-icons';
import { MatchEventList } from './MatchEventList';
import { formatDate } from '../../utils/helpers';
import type { Match, Player } from '../../types';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '900px',
    width: '85vw',
    maxHeight: '90vh',
    padding: 0,
  },
  dialogBody: {
    padding: '20px',
    overflowY: 'auto',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  scoreSection: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  },
  scoreBoard: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    gap: '32px',
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
    width: '100%',
  },
  score: {
    fontSize: '48px',
    fontWeight: tokens.fontWeightBold,
    marginTop: '8px',
  },
  result: {
    textAlign: 'center',
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginTop: '12px',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: '24px',
  },
  teamsColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  eventsColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  columnTitle: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  teams: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  team: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  teamHeader: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    padding: '8px 12px',
    borderRadius: tokens.borderRadiusLarge,
    textAlign: 'center',
  },
  playerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  playerItem: {
    fontSize: tokens.fontSizeBase200,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});

interface MatchDetailsModalProps {
  match: Match | null;
  players: Player[];
  open: boolean;
  onClose: () => void;
  onDelete: (matchId: string) => void;
}

export function MatchDetailsModal({
  match,
  players,
  open,
  onClose,
  onDelete,
}: MatchDetailsModalProps) {
  const styles = useStyles();

  if (!match) return null;

  const yellowScore = match.yellowTeam.score;
  const redScore = match.redTeam.score;

  let result = 'Draw';
  let resultColor = tokens.colorNeutralForeground1;
  if (yellowScore > redScore) {
    result = 'Yellow Team Wins!';
    resultColor = '#FFD700';
  } else if (redScore > yellowScore) {
    result = 'Red Team Wins!';
    resultColor = '#DC143C';
  }

  const yellowPlayers = match.yellowTeam.playerIds
    .map(id => players.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const redPlayers = match.redTeam.playerIds
    .map(id => players.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // Calculate player stats for emoticons
  const getPlayerStats = (playerId: string) => {
    const goals = match.events.filter(
      e => e.playerId === playerId && (e.type === 'goal' || e.type === 'own-goal')
    ).length;
    const assists = match.events.filter(
      e => e.assistPlayerId === playerId && e.type === 'goal'
    ).length;
    return { goals, assists };
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this match? This cannot be undone.')) {
      onDelete(match.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody className={styles.dialogBody}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <DialogTitle>Match Details</DialogTitle>
              <Text size={300}>{formatDate(match.date)}</Text>
            </div>
            <div className={styles.actions}>
              <Button
                icon={<Delete24Regular />}
                appearance="subtle"
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                icon={<Dismiss24Regular />}
                appearance="secondary"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>

          <div className={styles.scoreSection}>
            <Card>
              <div className={styles.scoreBoard}>
                <div style={{ textAlign: 'center' }}>
                  <Text weight="semibold">Yellow</Text>
                  <div className={styles.score} style={{ color: '#FFD700' }}>
                    {yellowScore}
                  </div>
                </div>

                <Text size={600}>-</Text>

                <div style={{ textAlign: 'center' }}>
                  <Text weight="semibold">Red</Text>
                  <div className={styles.score} style={{ color: '#DC143C' }}>
                    {redScore}
                  </div>
                </div>
              </div>
            </Card>

            <div className={styles.result} style={{ color: resultColor }}>
              {result}
            </div>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.teamsColumn}>
              <Text className={styles.columnTitle}>Teams</Text>
              <div className={styles.teams}>
                <div className={styles.team}>
                  <div
                    className={styles.teamHeader}
                    style={{ backgroundColor: '#FFD700', color: '#000' }}
                  >
                    Yellow Team
                  </div>
                  <div className={styles.playerList}>
                    {yellowPlayers.map(player => {
                      const stats = getPlayerStats(player.id);
                      return (
                        <div key={player.id} className={styles.playerItem}>
                          <Text>{player.name}</Text>
                          {(stats.goals > 0 || stats.assists > 0) && (
                            <span>
                              {stats.goals > 0 && '⚽'.repeat(stats.goals)}
                              {stats.assists > 0 && '👟'.repeat(stats.assists)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.team}>
                  <div
                    className={styles.teamHeader}
                    style={{ backgroundColor: '#DC143C', color: '#fff' }}
                  >
                    Red Team
                  </div>
                  <div className={styles.playerList}>
                    {redPlayers.map(player => {
                      const stats = getPlayerStats(player.id);
                      return (
                        <div key={player.id} className={styles.playerItem}>
                          <Text>{player.name}</Text>
                          {(stats.goals > 0 || stats.assists > 0) && (
                            <span>
                              {stats.goals > 0 && '⚽'.repeat(stats.goals)}
                              {stats.assists > 0 && '👟'.repeat(stats.assists)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.eventsColumn}>
              <Text className={styles.columnTitle}>Match Events</Text>
              <MatchEventList events={match.events} players={players} />
            </div>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
