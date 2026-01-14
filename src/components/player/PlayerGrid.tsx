import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { PlayerCard } from './PlayerCard';
import type { Player, PlayerStats } from '../../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

interface PlayerGridProps {
  players: Player[];
  playerStats: PlayerStats[];
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string, playerName: string, hasMatches: boolean) => void;
  onUnarchivePlayer: (playerId: string) => void;
  showArchived: boolean;
  isAdmin: boolean;
  isFiltered?: boolean;
}

export function PlayerGrid({
  players,
  playerStats,
  onEditPlayer,
  onDeletePlayer,
  onUnarchivePlayer,
  showArchived,
  isAdmin,
  isFiltered = false,
}: PlayerGridProps) {
  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="py-16">
          <p className="text-center text-muted-foreground">
            {isFiltered
              ? 'No players found matching your search.'
              : showArchived
              ? 'No archived players.'
              : 'No players yet. Add your first player to get started!'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {players.map((player) => {
        const stats = playerStats.find(s => s.playerId === player.id);
        const hasMatches = stats ? stats.matchesPlayed > 0 : false;

        return (
          <PlayerCard
            key={player.id}
            player={player}
            isArchived={showArchived}
            isAdmin={isAdmin}
            hasMatches={hasMatches}
            onEdit={() => onEditPlayer(player)}
            onDelete={() => onDeletePlayer(player.id, player.name, hasMatches)}
            onUnarchive={() => onUnarchivePlayer(player.id)}
          />
        );
      })}
    </motion.div>
  );
}
