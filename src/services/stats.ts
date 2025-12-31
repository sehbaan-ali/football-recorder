import type { Match, Player, PlayerStats, TeamColor } from '../types';

export class StatsService {
  static calculatePlayerStats(players: Player[], matches: Match[]): PlayerStats[] {
    const statsMap = new Map<string, PlayerStats>();

    // Initialize stats for all players
    players.forEach(player => {
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
      });
    });

    // Process each match
    matches.forEach(match => {
      const { yellowTeam, redTeam, events } = match;
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
        if (!stats) return;

        switch (event.type) {
          case 'goal':
            stats.goals++;
            if (event.assistPlayerId) {
              const assistStats = statsMap.get(event.assistPlayerId);
              if (assistStats) {
                assistStats.assists++;
              }
            }
            break;
          case 'own-goal':
            stats.ownGoals++;
            break;
          case 'clean-sheet':
            stats.cleanSheets++;
            break;
        }
      });
    });

    return Array.from(statsMap.values());
  }

  static getTopPlayers(stats: PlayerStats[], sortBy: 'wins' | 'goals' | 'assists' | 'cleanSheets', limit: number = 10): PlayerStats[] {
    return [...stats]
      .sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (bValue !== aValue) {
          return bValue - aValue;
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
