import { Request, Response } from 'express';
import { PlayerService } from '../services/playerService';
import { v4 as uuidv4 } from 'uuid';

export class PlayerController {
  static getAllPlayers(req: Request, res: Response) {
    try {
      const players = PlayerService.getAllPlayers();
      res.json(players);
    } catch (error) {
      console.error('Error getting players:', error);
      res.status(500).json({ error: 'Failed to get players' });
    }
  }

  static getPlayerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const player = PlayerService.getPlayerById(id);

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      res.json(player);
    } catch (error) {
      console.error('Error getting player:', error);
      res.status(500).json({ error: 'Failed to get player' });
    }
  }

  static createPlayer(req: Request, res: Response) {
    try {
      const { name, position } = req.body;

      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Player name is required' });
      }

      if (!position || !['GK', 'DEF', 'MID', 'WING', 'ST'].includes(position)) {
        return res.status(400).json({ error: 'Valid position is required' });
      }

      const newPlayer = {
        id: uuidv4(),
        name: name.trim(),
        position,
        createdAt: new Date().toISOString(),
        archived: false,
      };

      const player = PlayerService.createPlayer(newPlayer);
      res.status(201).json(player);
    } catch (error) {
      console.error('Error creating player:', error);
      res.status(500).json({ error: 'Failed to create player' });
    }
  }

  static updatePlayer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const player = PlayerService.updatePlayer(id, updates);

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      res.json(player);
    } catch (error) {
      console.error('Error updating player:', error);
      res.status(500).json({ error: 'Failed to update player' });
    }
  }

  static deletePlayer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = PlayerService.deletePlayer(id);

      if (!success) {
        return res.status(404).json({ error: 'Player not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting player:', error);
      res.status(500).json({ error: 'Failed to delete player' });
    }
  }

  static archivePlayer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = PlayerService.archivePlayer(id);

      if (!success) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const player = PlayerService.getPlayerById(id);
      res.json(player);
    } catch (error) {
      console.error('Error archiving player:', error);
      res.status(500).json({ error: 'Failed to archive player' });
    }
  }

  static unarchivePlayer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = PlayerService.unarchivePlayer(id);

      if (!success) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const player = PlayerService.getPlayerById(id);
      res.json(player);
    } catch (error) {
      console.error('Error unarchiving player:', error);
      res.status(500).json({ error: 'Failed to unarchive player' });
    }
  }
}
