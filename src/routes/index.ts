import { Router } from 'express'
import authRoutes from './auth.routes'
import tournamentsRoutes from './tournaments.routes'
import usersRoutes from './users.routes'
import bracketsRoutes from './brackets.routes'

const router = Router()

// API routes
router.use('/auth', authRoutes)
router.use('/tournaments', tournamentsRoutes)
router.use('/users', usersRoutes)
router.use('/brackets', bracketsRoutes)

export default router
