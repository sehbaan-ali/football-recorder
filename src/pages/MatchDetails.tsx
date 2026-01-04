import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Text,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowLeft24Regular, Delete24Regular } from '@fluentui/react-icons';
import { PageHeader } from '../components/layout/PageHeader';
import { MatchEventList } from '../components/match/MatchEventList';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import { formatDate } from '../utils/helpers';

const useStyles = makeStyles({
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 16px',
  },
  scoreBoard: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    gap: '32px',
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
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
    marginTop: '16px',
    marginBottom: '24px',
  },
  section: {
    marginBottom: '24px',
  },
  teams: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  team: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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
    gap: '6px',
  },
  playerItem: {
    fontSize: tokens.fontSizeBase200,
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
});

export function MatchDetails() {
  const styles = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { players } = usePlayers();
  const { getMatchById, deleteMatch } = useMatches();

  const match = id ? getMatchById(id) : undefined;

  if (!match) {
    return (
      <div className={styles.container}>
        <PageHeader title="Match Not Found" />
        <Text>This match could not be found.</Text>
        <Button
          style={{ marginTop: '16px' }}
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this match? This cannot be undone.')) {
      if (deleteMatch(match.id)) {
        navigate('/');
      }
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title={`Match Details`}
        subtitle={formatDate(match.date)}
        actions={
          <div className={styles.actions}>
            <Button
              icon={<ArrowLeft24Regular />}
              onClick={() => navigate('/')}
            >
              Back
            </Button>
            <Button
              icon={<Delete24Regular />}
              appearance="subtle"
              onClick={handleDelete}
            >
              Delete Match
            </Button>
          </div>
        }
      />

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

      <div className={styles.section}>
        <div className={styles.teams}>
          <div className={styles.team}>
            <div
              className={styles.teamHeader}
              style={{ backgroundColor: '#FFD700', color: '#000' }}
            >
              Yellow Team
            </div>
            <div className={styles.playerList}>
              {yellowPlayers.map(player => (
                <Text key={player.id} className={styles.playerItem}>
                  {player.name}
                </Text>
              ))}
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
              {redPlayers.map(player => (
                <Text key={player.id} className={styles.playerItem}>
                  {player.name}
                </Text>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Match Events</Text>
        <MatchEventList events={match.events} players={players} />
      </div>
    </div>
  );
}
