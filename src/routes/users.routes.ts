import { Router } from 'express'
import { UsersController } from '../controllers/users.controller'
import { authenticateToken } from '../middleware/auth.middleware'
import { validateBody, validateParams } from '../middleware/validation.middleware'
import { updateUserSchema, userIdParamSchema } from '../utils/validators'

const router = Router()
const usersController = new UsersController()

// Public routes
router.get('/search', usersController.searchUsers)
router.get('/:id', validateParams(userIdParamSchema), usersController.getUserById)
router.get('/:id/tournaments', validateParams(userIdParamSchema), usersController.getUserTournaments)
router.get('/:id/stats', validateParams(userIdParamSchema), usersController.getUserStats)

// Protected routes
router.put('/:id', authenticateToken, validateParams(userIdParamSchema), validateBody(updateUserSchema), usersController.updateUser)

export default router
