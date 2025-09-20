import { Router } from 'express'
import { TournamentsController } from '../controllers/tournaments.controller'
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware'
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware'
import {
  createTournamentSchema,
  updateTournamentSchema,
  tournamentFiltersSchema,
  tournamentIdParamSchema,
} from '../utils/validators'

const router = Router()
const tournamentsController = new TournamentsController()

// Public routes
router.get('/', validateQuery(tournamentFiltersSchema), tournamentsController.getTournaments)
router.get('/:id', validateParams(tournamentIdParamSchema), tournamentsController.getTournamentById)

// Protected routes
router.post('/', authenticateToken, validateBody(createTournamentSchema), tournamentsController.createTournament)
router.put('/:id', authenticateToken, validateParams(tournamentIdParamSchema), validateBody(updateTournamentSchema), tournamentsController.updateTournament)
router.delete('/:id', authenticateToken, validateParams(tournamentIdParamSchema), tournamentsController.deleteTournament)
router.post('/:id/join', authenticateToken, validateParams(tournamentIdParamSchema), tournamentsController.joinTournament)
router.post('/:id/leave', authenticateToken, validateParams(tournamentIdParamSchema), tournamentsController.leaveTournament)

export default router
