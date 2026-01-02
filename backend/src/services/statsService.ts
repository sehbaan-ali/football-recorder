import type { Player, Match, PlayerStats, SortBy } from '../types';

export class StatsService {
  static calculatePlayerStats(players: Player[], matches: Match[]): PlayerStats[] {
    return players.map(player => {
      const stats = this.calculateStatsForPlayer(player.id, matches);
      return {
        playerId: player.id,
        playerName: player.name,
        ...stats,
      };
    });
  }

  static calculateStatsForPlayer(playerId: string, matches: Match[]) {
    let matchesPlayed = 0;
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let goals = 0;
    let assists = 0;
    let cleanSheets = 0;

    for (const match of matches) {
      const inYellowTeam = match.yellowTeam.playerIds.includes(playerId);
      const inRedTeam = match.redTeam.playerIds.includes(playerId);

      if (!inYellowTeam && !inRedTeam) continue;

      matchesPlayed++;

      // Calculate wins/losses/draws
      if (inYellowTeam) {
        if (match.yellowTeam.score > match.redTeam.score) wins++;
        else if (match.yellowTeam.score < match.redTeam.score) losses++;
        else draws++;
      } else {
        if (match.redTeam.score > match.yellowTeam.score) wins++;
        else if (match.redTeam.score < match.yellowTeam.score) losses++;
        else draws++;
      }

      // Calculate goals, assists, clean sheets from events
      for (const event of match.events) {
        if (event.type === 'goal' && event.playerId === playerId) {
          goals++;
        }
        if (event.type === 'goal' && event.assistPlayerId === playerId) {
          assists++;
        }
        if (event.type === 'clean-sheet' && event.playerId === playerId) {
          cleanSheets++;
        }
      }
    }

    const winRate = matchesPlayed > 0 ? (wins / matchesPlayed) * 100 : 0;

    return {
      matchesPlayed,
      wins,
      losses,
      draws,
      goals,
      assists,
      cleanSheets,
      winRate: Math.round(winRate * 10) / 10, // Round to 1 decimal
    };
  }

  static getTopPlayers(playerStats: PlayerStats[], sortBy: SortBy, limit: number = 10): PlayerStats[] {
    const sorted = [...playerStats].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return bValue - aValue;
    });

    return sorted.slice(0, limit);
  }
}
