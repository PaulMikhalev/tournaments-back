import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../config/jwt'
import { RequestWithUser } from '../types/api.types'
import prisma from '../config/database'

export const authenticateToken = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
      })
      return
    }

    const decoded = verifyToken(token)
    
    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        team: true,
      },
    })

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid token - user not found',
      })
      return
    }

    req.user = user
    next()
  } catch (error) {
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    })
  }
}

export const optionalAuth = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      const decoded = verifyToken(token)
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          team: true,
        },
      })

      if (user) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}
