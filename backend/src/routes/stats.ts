import { Router } from 'express';
import { StatsController } from '../controllers/statsController';

const router = Router();

// GET /api/stats - Get all player statistics
router.get('/', StatsController.getPlayerStats);

// GET /api/stats/top - Get top players by category
router.get('/top', StatsController.getTopPlayers);

// GET /api/stats/:id - Get stats for specific player
router.get('/:id', StatsController.getPlayerStatsById);

export default router;
