import type { Match, Player, PlayerStats, TeamColor, SortBy } from '../types';

export class StatsService {
  static calculatePlayerStats(players: Player[], matches: Match[]): PlayerStats[] {
    const statsMap = new Map<string, PlayerStats>();

    // Initialize stats for all NON-GUEST players only
    players
      .filter(player => !player.isGuest)
      .forEach(player => {
        statsMap.set(player.id, {
          playerId: player.id,
          playerName: player.name,
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          goals: 0,
          assists: 0,
          ownGoals: 0,
          cleanSheets: 0,
          manOfTheMatchAwards: 0,
        });
      });

    // Process each match
    matches.forEach(match => {
      const { yellowTeam, redTeam, events } = match;

      // Skip matches with invalid structure
      if (!yellowTeam || !redTeam || !yellowTeam.playerIds || !redTeam.playerIds) {
        return;
      }

      const yellowScore = yellowTeam.score;
      const redScore = redTeam.score;

      // Determine match result
      const yellowWon = yellowScore > redScore;
      const redWon = redScore > yellowScore;
      const draw = yellowScore === redScore;

      // Update stats for yellow team players
      yellowTeam.playerIds.forEach(playerId => {
        const stats = statsMap.get(playerId);
        if (stats) {
          stats.matchesPlayed++;
          if (yellowWon) stats.wins++;
          else if (redWon) stats.losses++;
          else if (draw) stats.draws++;
        }
      });

      // Update stats for red team players
      redTeam.playerIds.forEach(playerId => {
        const stats = statsMap.get(playerId);
        if (stats) {
          stats.matchesPlayed++;
          if (redWon) stats.wins++;
          else if (yellowWon) stats.losses++;
          else if (draw) stats.draws++;
        }
      });

      // Process events
      events.forEach(event => {
        const stats = statsMap.get(event.playerId);

        switch (event.type) {
          case 'goal':
            if (stats) {
              stats.goals++;
            }
            // Process assist even if scorer doesn't have stats
            if (event.assistPlayerId) {
              const assistStats = statsMap.get(event.assistPlayerId);
              if (assistStats) {
                assistStats.assists++;
              }
            }
            break;
          case 'own-goal':
            if (stats) {
              stats.ownGoals++;
            }
            // Process assist even if own-goal scorer doesn't have stats (e.g., guest player)
            if (event.assistPlayerId) {
              const assistStats = statsMap.get(event.assistPlayerId);
              if (assistStats) {
                assistStats.assists++;
              }
            }
            break;
          case 'clean-sheet':
            if (stats) {
              stats.cleanSheets++;
            }
            break;
        }
      });

      // Count Man of the Match awards
      if (match.manOfTheMatch) {
        const motmStats = statsMap.get(match.manOfTheMatch);
        if (motmStats) {
          motmStats.manOfTheMatchAwards++;
        }
      }
    });

    return Array.from(statsMap.values());
  }

  static getTopPlayers(stats: PlayerStats[], sortBy: SortBy, limit: number = 10, direction: 'asc' | 'desc' = 'desc'): PlayerStats[] {
    return [...stats]
      .sort((a, b) => {
        const aValue = a[sortBy] as number;
        const bValue = b[sortBy] as number;

        if (bValue !== aValue) {
          // Sort in the specified direction
          return direction === 'desc' ? bValue - aValue : aValue - bValue;
        }

        // Tiebreaker: matches played (ascending - fewer matches played wins)
        return a.matchesPlayed - b.matchesPlayed;
      })
      .slice(0, limit);
  }

  static calculateTeamScore(match: Match, team: TeamColor): number {
    return team === 'yellow' ? match.yellowTeam.score : match.redTeam.score;
  }

  static getPlayerTeam(match: Match, playerId: string): TeamColor | null {
    if (match.yellowTeam.playerIds.includes(playerId)) return 'yellow';
    if (match.redTeam.playerIds.includes(playerId)) return 'red';
    return null;
  }

  static didPlayerWin(match: Match, playerId: string): boolean | null {
    const team = this.getPlayerTeam(match, playerId);
    if (!team) return null;

    const yellowScore = match.yellowTeam.score;
    const redScore = match.redTeam.score;

    if (team === 'yellow') {
      return yellowScore > redScore;
    } else {
      return redScore > yellowScore;
    }
  }
}
