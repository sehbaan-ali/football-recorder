import {
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import type { Player, MatchEvent } from '../../types';
import { getPlayerName } from '../../utils/helpers';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sectionLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  columns: {
    display: 'inline-grid',
    gridTemplateColumns: 'auto auto',
    gap: '16px',
    justifyContent: 'start',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  leftColumn: {
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingRight: '12px',
  },
  eventItem: {
    fontSize: tokens.fontSizeBase200,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  empty: {
    textAlign: 'center',
    padding: '16px',
    color: tokens.colorNeutralForeground2,
  },
});

interface MatchEventListProps {
  events: MatchEvent[];
  players: Player[];
}

export function MatchEventList({ events, players }: MatchEventListProps) {
  const styles = useStyles();

  if (events.length === 0) {
    return (
      <div className={styles.empty}>
        <Text>No events yet. Start recording goals and assists!</Text>
      </div>
    );
  }

  const displayEvents = events.filter(e => e.type !== 'clean-sheet');

  // Aggregate goals by player and team
  const aggregateGoals = (team: 'yellow' | 'red') => {
    const goals = displayEvents.filter(e => e.team === team && (e.type === 'goal' || e.type === 'own-goal'));
    const playerGoalCount = new Map<string, { count: number; isOwnGoal: boolean }>();

    goals.forEach(goal => {
      const current = playerGoalCount.get(goal.playerId) || { count: 0, isOwnGoal: false };
      playerGoalCount.set(goal.playerId, {
        count: current.count + 1,
        isOwnGoal: goal.type === 'own-goal'
      });
    });

    return Array.from(playerGoalCount.entries());
  };

  // Aggregate assists by player and team
  const aggregateAssists = (team: 'yellow' | 'red') => {
    const assists = displayEvents.filter(e => e.team === team && e.type === 'goal' && e.assistPlayerId);
    const playerAssistCount = new Map<string, number>();

    assists.forEach(assist => {
      const playerId = assist.assistPlayerId!;
      playerAssistCount.set(playerId, (playerAssistCount.get(playerId) || 0) + 1);
    });

    return Array.from(playerAssistCount.entries());
  };

  const yellowGoals = aggregateGoals('yellow');
  const redGoals = aggregateGoals('red');
  const yellowAssists = aggregateAssists('yellow');
  const redAssists = aggregateAssists('red');

  return (
    <div className={styles.container}>
      {/* Goals Section */}
      <div className={styles.section}>
        <Text className={styles.sectionLabel}>Goals</Text>
        <div className={styles.columns}>
          <div className={`${styles.column} ${styles.leftColumn}`}>
            {yellowGoals.length > 0 ? (
              yellowGoals.map(([playerId, data]) => (
                <div key={playerId} className={styles.eventItem}>
                  <span>{data.isOwnGoal ? '⚠️'.repeat(data.count) : '⚽'.repeat(data.count)}</span>
                  <Text>{getPlayerName(playerId, players)}</Text>
                  {data.isOwnGoal && (
                    <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                      (OG)
                    </Text>
                  )}
                </div>
              ))
            ) : (
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                -
              </Text>
            )}
          </div>
          <div className={styles.column}>
            {redGoals.length > 0 ? (
              redGoals.map(([playerId, data]) => (
                <div key={playerId} className={styles.eventItem}>
                  <span>{data.isOwnGoal ? '⚠️'.repeat(data.count) : '⚽'.repeat(data.count)}</span>
                  <Text>{getPlayerName(playerId, players)}</Text>
                  {data.isOwnGoal && (
                    <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                      (OG)
                    </Text>
                  )}
                </div>
              ))
            ) : (
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                -
              </Text>
            )}
          </div>
        </div>
      </div>

      {/* Assists Section */}
      <div className={styles.section}>
        <Text className={styles.sectionLabel}>Assists</Text>
        <div className={styles.columns}>
          <div className={`${styles.column} ${styles.leftColumn}`}>
            {yellowAssists.length > 0 ? (
              yellowAssists.map(([playerId, count]) => (
                <div key={playerId} className={styles.eventItem}>
                  <span>{'👟'.repeat(count)}</span>
                  <Text>{getPlayerName(playerId, players)}</Text>
                </div>
              ))
            ) : (
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                -
              </Text>
            )}
          </div>
          <div className={styles.column}>
            {redAssists.length > 0 ? (
              redAssists.map(([playerId, count]) => (
                <div key={playerId} className={styles.eventItem}>
                  <span>{'👟'.repeat(count)}</span>
                  <Text>{getPlayerName(playerId, players)}</Text>
                </div>
              ))
            ) : (
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                -
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
