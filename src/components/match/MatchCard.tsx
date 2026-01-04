import { Card, Text, makeStyles, tokens, Badge } from '@fluentui/react-components';
import type { Match } from '../../types';
import { formatDate } from '../../utils/helpers';

const useStyles = makeStyles({
  card: {
    cursor: 'pointer',
    ':hover': {
      boxShadow: tokens.shadow8,
    },
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  date: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  score: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
  },
  teamScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  result: {
    textAlign: 'center',
  },
});

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
}

export function MatchCard({ match, onClick }: MatchCardProps) {
  const styles = useStyles();

  const yellowScore = match.yellowTeam.score;
  const redScore = match.redTeam.score;

  let result = 'Draw';
  if (yellowScore > redScore) result = 'Yellow Wins';
  else if (redScore > yellowScore) result = 'Red Wins';

  return (
    <Card
      className={styles.card}
      onClick={onClick}
    >
      <div className={styles.content}>
        <div className={styles.date}>{formatDate(match.date)}</div>

        <div className={styles.score}>
          <div className={styles.teamScore}>
            <Badge appearance="filled" style={{ backgroundColor: '#FFD700', color: '#000' }}>
              Yellow
            </Badge>
            <Text style={{ color: '#FFD700' }}>{yellowScore}</Text>
          </div>

          <Text>-</Text>

          <div className={styles.teamScore}>
            <Badge appearance="filled" style={{ backgroundColor: '#DC143C' }}>
              Red
            </Badge>
            <Text style={{ color: '#DC143C' }}>{redScore}</Text>
          </div>
        </div>

        <div className={styles.result}>
          <Text size={300} weight="semibold">
            {result}
          </Text>
        </div>
      </div>
    </Card>
  );
}
