import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Text,
  makeStyles,
  tokens,
  Tooltip,
} from '@fluentui/react-components';
import { AddCircle24Regular, Trophy24Filled } from '@fluentui/react-icons';
import { PageHeader } from '../components/layout/PageHeader';
import { MatchCard } from '../components/match/MatchCard';
import { MatchDetailsModal } from '../components/match/MatchDetailsModal';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import { useStats } from '../hooks/useStats';
import { StatsService } from '../services/stats';
import { useAuth } from '../contexts/AuthContext';
import type { Match } from '../types';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    padding: '24px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
    marginTop: '8px',
  },
  statLabel: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '16px',
  },
  matchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
  },
  topPlayers: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  playerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  empty: {
    textAlign: 'center',
    padding: '48px 16px',
    color: tokens.colorNeutralForeground2,
  },
});

export function Dashboard() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { players, loading: playersLoading } = usePlayers();
  const { matches, deleteMatch, loading: matchesLoading } = useMatches();
  const { playerStats } = useStats(players, matches);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const loading = playersLoading || matchesLoading;
  const totalMatches = matches.length;
  const totalPlayers = players.length;
  const recentMatches = matches.slice(0, 5);

  const topByGoals = StatsService.getTopPlayers(playerStats, 'goals', 3);
  const topByAssists = StatsService.getTopPlayers(playerStats, 'assists', 3);
  const topByWins = StatsService.getTopPlayers(playerStats, 'wins', 3);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (totalPlayers === 0) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your football matches"
        />
        <div className={styles.empty}>
          <Text size={500}>Welcome to Football Recorder!</Text>
          <p>Get started by adding some players.</p>
          <Button
            appearance="primary"
            onClick={() => navigate('/players')}
            style={{ marginTop: '16px' }}
          >
            Add Players
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your football matches"
        actions={
          <Tooltip
            content={isAdmin ? "Record a new match" : "Login required to record matches"}
            relationship="description"
          >
            <Button
              appearance="primary"
              icon={<AddCircle24Regular />}
              onClick={() => navigate('/match/new')}
              disabled={!isAdmin}
            >
              Record New Match
            </Button>
          </Tooltip>
        }
      />

      <div className={styles.grid}>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Total Matches</div>
          <div className={styles.statValue}>{totalMatches}</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Total Players</div>
          <div className={styles.statValue}>{totalPlayers}</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Total Goals</div>
          <div className={styles.statValue}>
            {playerStats.reduce((sum, s) => sum + s.goals, 0)}
          </div>
        </Card>
      </div>

      {totalMatches > 0 && (
        <>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Recent Matches</div>
            <div className={styles.matchGrid}>
              {recentMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onClick={() => setSelectedMatch(match)}
                />
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <Trophy24Filled style={{ color: '#FFD700', marginRight: '8px' }} />
              Top Players
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div>
                <Text weight="semibold" style={{ marginBottom: '12px', display: 'block' }}>
                  Most Goals
                </Text>
                <div className={styles.topPlayers}>
                  {topByGoals.slice(0, 3).map((stat, index) => (
                    <div key={stat.playerId} className={styles.playerRow}>
                      <span>
                        {index + 1}. {stat.playerName}
                      </span>
                      <Text weight="semibold">{stat.goals} goals</Text>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Text weight="semibold" style={{ marginBottom: '12px', display: 'block' }}>
                  Most Assists
                </Text>
                <div className={styles.topPlayers}>
                  {topByAssists.slice(0, 3).map((stat, index) => (
                    <div key={stat.playerId} className={styles.playerRow}>
                      <span>
                        {index + 1}. {stat.playerName}
                      </span>
                      <Text weight="semibold">{stat.assists} assists</Text>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Text weight="semibold" style={{ marginBottom: '12px', display: 'block' }}>
                  Most Wins
                </Text>
                <div className={styles.topPlayers}>
                  {topByWins.slice(0, 3).map((stat, index) => (
                    <div key={stat.playerId} className={styles.playerRow}>
                      <span>
                        {index + 1}. {stat.playerName}
                      </span>
                      <Text weight="semibold">{stat.wins} wins</Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {totalMatches === 0 && (
        <div className={styles.empty}>
          <Text size={400}>No matches recorded yet.</Text>
          <p>Record your first match to see statistics!</p>
          <Button
            appearance="primary"
            icon={<AddCircle24Regular />}
            onClick={() => navigate('/match/new')}
            style={{ marginTop: '16px' }}
          >
            Record New Match
          </Button>
        </div>
      )}

      <MatchDetailsModal
        match={selectedMatch}
        players={players}
        open={selectedMatch !== null}
        onClose={() => setSelectedMatch(null)}
        onDelete={(matchId) => {
          deleteMatch(matchId);
          setSelectedMatch(null);
        }}
      />
    </div>
  );
}
