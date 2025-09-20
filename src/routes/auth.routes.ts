import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authenticateToken } from '../middleware/auth.middleware'
import { validateBody } from '../middleware/validation.middleware'
import { loginSchema, registerSchema } from '../utils/validators'

const router = Router()
const authController = new AuthController()

// Public routes
router.post('/register', validateBody(registerSchema), authController.register)
router.post('/login', validateBody(loginSchema), authController.login)

// Protected routes
router.get('/me', authenticateToken, authController.me)
router.post('/logout', authenticateToken, authController.logout)

export default router
