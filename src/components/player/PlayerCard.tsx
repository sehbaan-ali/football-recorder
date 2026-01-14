import { Edit, Trash2, Archive, Undo2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Player, PlayerPosition } from '../../types';
import { cn } from '@/lib/utils';

const getPositionBadgeColor = (position: PlayerPosition): string => {
  switch (position) {
    case 'GK':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'DEF':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'MID':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    case 'WING':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
    case 'ST':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
  }
};

const cardHoverVariants = {
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const
    }
  }
};

interface PlayerCardProps {
  player: Player;
  isArchived: boolean;
  isAdmin: boolean;
  hasMatches: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUnarchive: () => void;
}

export function PlayerCard({
  player,
  isArchived,
  isAdmin,
  hasMatches,
  onEdit,
  onDelete,
  onUnarchive,
}: PlayerCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group"
    >
      <motion.div variants={cardHoverVariants}>
        <Card className="relative h-full transition-shadow hover:shadow-md">
          <CardContent className="p-4 space-y-4">
            {/* Name with badge */}
            <div className="relative">
              <h3 className="text-lg font-semibold truncate pr-16">
                {player.name}
              </h3>
              <Badge className={cn(
                "absolute top-0 right-0 text-xs",
                getPositionBadgeColor(player.position)
              )}>
                {player.position}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full pt-2 border-t">
              {isArchived ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={onUnarchive}
                  disabled={!isAdmin}
                  title={isAdmin ? "Restore player" : "Login required"}
                >
                  <Undo2 className="h-4 w-4 mr-2" />
                  Restore
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={onEdit}
                    disabled={!isAdmin}
                    title={isAdmin ? "Edit player" : "Login required"}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={onDelete}
                    disabled={!isAdmin}
                    title={isAdmin ? (hasMatches ? "Archive player" : "Delete player") : "Login required"}
                  >
                    {hasMatches ? (
                      <>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
