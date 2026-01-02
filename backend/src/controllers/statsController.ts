import { Request, Response } from 'express';
import { PlayerService } from '../services/playerService';
import { MatchService } from '../services/matchService';
import { StatsService } from '../services/statsService';
import type { SortBy } from '../types';

export class StatsController {
  static getPlayerStats(req: Request, res: Response) {
    try {
      const players = PlayerService.getAllPlayers();
      const matches = MatchService.getAllMatches();

      const stats = StatsService.calculatePlayerStats(players, matches);
      res.json(stats);
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({ error: 'Failed to get stats' });
    }
  }

  static getTopPlayers(req: Request, res: Response) {
    try {
      const { sortBy = 'wins', limit = '10' } = req.query;

      const players = PlayerService.getAllPlayers();
      const matches = MatchService.getAllMatches();

      const allStats = StatsService.calculatePlayerStats(players, matches);
      const topPlayers = StatsService.getTopPlayers(
        allStats,
        sortBy as SortBy,
        parseInt(limit as string)
      );

      res.json(topPlayers);
    } catch (error) {
      console.error('Error getting top players:', error);
      res.status(500).json({ error: 'Failed to get top players' });
    }
  }

  static getPlayerStatsById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const player = PlayerService.getPlayerById(id);

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const matches = MatchService.getAllMatches();
      const stats = StatsService.calculateStatsForPlayer(id, matches);

      res.json({
        playerId: player.id,
        playerName: player.name,
        ...stats,
      });
    } catch (error) {
      console.error('Error getting player stats:', error);
      res.status(500).json({ error: 'Failed to get player stats' });
    }
  }
}
