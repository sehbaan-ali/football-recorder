import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, Target, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchCard } from '../components/match/MatchCard';
import { MatchDetailsModal } from '../components/match/MatchDetailsModal';
import { usePlayers } from '../hooks/usePlayers';
import { useMatches } from '../hooks/useMatches';
import { useStats } from '../hooks/useStats';
import { StatsService } from '../services/stats';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import type { Match } from '../types';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const
    }
  }
};

// Count-up animation component
function CountUp({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count}</>;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { players, loading: playersLoading } = usePlayers();
  const { matches, deleteMatch, loading: matchesLoading } = useMatches();
  const { playerStats } = useStats(players, matches);
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const loading = playersLoading || matchesLoading;
  const totalMatches = matches.length;
  const totalPlayers = players.length;
  const recentMatches = matches.slice(0, 5);

  const topByGoals = StatsService.getTopPlayers(playerStats, 'goals', 3);
  const topByAssists = StatsService.getTopPlayers(playerStats, 'assists', 3);
  const topByWins = StatsService.getTopPlayers(playerStats, 'wins', 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (totalPlayers === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your football matches</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h2 className="text-xl font-semibold mb-2">Welcome to Football Tracker!</h2>
            <p className="text-muted-foreground mb-6">Get started by adding some players.</p>
            <Button onClick={() => navigate('/players')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Players
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Overview of your football matches</p>
        </div>
        <Button
          onClick={() => navigate('/match/new')}
          disabled={!isAdmin}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Record New Match</span>
          <span className="sm:hidden">New Match</span>
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid gap-4 md:grid-cols-3"
        variants={itemVariants}
      >
        <motion.div
          whileHover="hover"
          variants={cardHoverVariants}
        >
          <Card className="transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <CountUp value={totalMatches} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover="hover"
          variants={cardHoverVariants}
        >
          <Card className="transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <CountUp value={totalPlayers} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover="hover"
          variants={cardHoverVariants}
        >
          <Card className="transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <CountUp value={playerStats.reduce((sum, s) => sum + s.goals, 0)} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {totalMatches > 0 && (
        <>
          {/* Recent Matches */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h2 className="text-xl font-semibold">Recent Matches</h2>
            <div className="relative -mb-1">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
                {recentMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    className="flex-none w-[280px] sm:w-[320px] snap-start mt-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" as const }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <MatchCard
                      match={match}
                      onClick={() => setSelectedMatch(match)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Players */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <h2 className="text-xl font-semibold">Top Players</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Most Goals */}
              <motion.div
                whileHover="hover"
                variants={cardHoverVariants}
              >
                <Card className="h-full transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Most Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topByGoals.slice(0, 3).map((stat, index) => (
                    <div key={stat.playerId} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <span className="text-sm">
                        {index + 1}. {stat.playerName}
                      </span>
                      <span className="font-semibold text-sm">{stat.goals} goals</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              </motion.div>

              {/* Most Assists */}
              <motion.div
                whileHover="hover"
                variants={cardHoverVariants}
              >
                <Card className="h-full transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Most Assists
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topByAssists.slice(0, 3).map((stat, index) => (
                    <div key={stat.playerId} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <span className="text-sm">
                        {index + 1}. {stat.playerName}
                      </span>
                      <span className="font-semibold text-sm">{stat.assists} assists</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              </motion.div>

              {/* Most Wins */}
              <motion.div
                whileHover="hover"
                variants={cardHoverVariants}
              >
                <Card className="h-full transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Most Wins
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topByWins.slice(0, 3).map((stat, index) => (
                    <div key={stat.playerId} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <span className="text-sm">
                        {index + 1}. {stat.playerName}
                      </span>
                      <span className="font-semibold text-sm">{stat.wins} wins</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}

      {totalMatches === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium mb-2">No matches recorded yet.</p>
            <p className="text-muted-foreground mb-6">Record your first match to see statistics!</p>
            <Button onClick={() => navigate('/match/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Record New Match
            </Button>
          </CardContent>
        </Card>
      )}

      <MatchDetailsModal
        match={selectedMatch}
        players={players}
        open={selectedMatch !== null}
        onClose={() => setSelectedMatch(null)}
        onDelete={(matchId) => {
          deleteMatch(matchId);
          toast({
            title: "Success",
            description: "Match deleted successfully!",
          });
          setSelectedMatch(null);
        }}
        isAdmin={isAdmin}
      />
    </motion.div>
  );
}
