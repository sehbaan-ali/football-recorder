import { Router } from 'express';
import { MatchController } from '../controllers/matchController';

const router = Router();

// GET /api/matches - Get all matches
router.get('/', MatchController.getAllMatches);

// GET /api/matches/:id - Get match by ID
router.get('/:id', MatchController.getMatchById);

// POST /api/matches - Create new match
router.post('/', MatchController.createMatch);

// PUT /api/matches/:id - Update match
router.put('/:id', MatchController.updateMatch);

// DELETE /api/matches/:id - Delete match
router.delete('/:id', MatchController.deleteMatch);

export default router;
