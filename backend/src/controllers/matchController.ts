import { Request, Response } from 'express';
import { MatchService } from '../services/matchService';
import { v4 as uuidv4 } from 'uuid';
import type { Match } from '../types';

export class MatchController {
  static getAllMatches(req: Request, res: Response) {
    try {
      const matches = MatchService.getAllMatches();
      res.json(matches);
    } catch (error) {
      console.error('Error getting matches:', error);
      res.status(500).json({ error: 'Failed to get matches' });
    }
  }

  static getMatchById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = MatchService.getMatchById(id);

      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }

      res.json(match);
    } catch (error) {
      console.error('Error getting match:', error);
      res.status(500).json({ error: 'Failed to get match' });
    }
  }

  static createMatch(req: Request, res: Response) {
    try {
      const { date, yellowTeam, redTeam, events } = req.body;

      // Validation
      if (!date || !yellowTeam || !redTeam) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!Array.isArray(yellowTeam.playerIds) || !Array.isArray(redTeam.playerIds)) {
        return res.status(400).json({ error: 'Team playerIds must be arrays' });
      }

      const newMatch: Match = {
        id: uuidv4(),
        date,
        yellowTeam: {
          playerIds: yellowTeam.playerIds,
          score: yellowTeam.score || 0,
        },
        redTeam: {
          playerIds: redTeam.playerIds,
          score: redTeam.score || 0,
        },
        events: events || [],
        createdAt: new Date().toISOString(),
      };

      const match = MatchService.createMatch(newMatch);
      res.status(201).json(match);
    } catch (error) {
      console.error('Error creating match:', error);
      res.status(500).json({ error: 'Failed to create match' });
    }
  }

  static updateMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const match = MatchService.updateMatch(id, updates);

      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }

      res.json(match);
    } catch (error) {
      console.error('Error updating match:', error);
      res.status(500).json({ error: 'Failed to update match' });
    }
  }

  static deleteMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = MatchService.deleteMatch(id);

      if (!success) {
        return res.status(404).json({ error: 'Match not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting match:', error);
      res.status(500).json({ error: 'Failed to delete match' });
    }
  }
}
