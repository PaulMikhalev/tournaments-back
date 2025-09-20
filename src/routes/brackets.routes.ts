import { Router } from 'express'
import { BracketsController } from '../controllers/brackets.controller'
import { authenticateToken } from '../middleware/auth.middleware'
import { validateParams } from '../middleware/validation.middleware'
import { tournamentIdParamSchema } from '../utils/validators'

const router = Router()
const bracketsController = new BracketsController()

// Public routes
router.get('/:id', validateParams(tournamentIdParamSchema), bracketsController.getBracket)

// Protected routes (organizer only)
router.post('/:id/generate', authenticateToken, validateParams(tournamentIdParamSchema), bracketsController.generateBracket)
router.put('/:tournamentId/matches/:matchId', authenticateToken, bracketsController.updateMatchResult)

export default router
