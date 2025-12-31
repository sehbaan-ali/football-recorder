import {
  makeStyles,
  tokens,
  Text,
  Card,
} from '@fluentui/react-components';
import {
  SportSoccer24Filled,
  Warning24Filled,
} from '@fluentui/react-icons';
import type { Player, MatchEvent } from '../../types';
import { getPlayerName } from '../../utils/helpers';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  event: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
  },
  icon: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  empty: {
    textAlign: 'center',
    padding: '24px',
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

  return (
    <div className={styles.container}>
      {displayEvents.map((event, index) => {
        const teamColor = event.team === 'yellow' ? '#FFD700' : '#DC143C';
        const playerName = getPlayerName(event.playerId, players);

        return (
          <Card key={index} className={styles.event}>
            <div className={styles.icon} style={{ color: teamColor }}>
              {event.type === 'goal' ? (
                <SportSoccer24Filled />
              ) : (
                <Warning24Filled />
              )}
            </div>
            <div className={styles.content}>
              {event.type === 'goal' && (
                <>
                  <Text weight="semibold">
                    Goal by {playerName}
                  </Text>
                  {event.assistPlayerId && (
                    <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
                      Assist: {getPlayerName(event.assistPlayerId, players)}
                    </Text>
                  )}
                </>
              )}
              {event.type === 'own-goal' && (
                <Text weight="semibold">
                  Own Goal by {playerName}
                </Text>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
