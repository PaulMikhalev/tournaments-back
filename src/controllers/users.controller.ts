import { Request, Response } from 'express'
import { UsersService } from '../services/users.service'
import { UpdateUserRequest } from '../types/user.types'
import { RequestWithUser } from '../types/api.types'

export class UsersController {
  private usersService: UsersService

  constructor() {
    this.usersService = new UsersService()
  }

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const user = await this.usersService.getUserById(id)

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      throw error
    }
  }

  updateUser = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        })
        return
      }

      const { id } = req.params
      const data: UpdateUserRequest = req.body
      const user = await this.usersService.updateUser(id, data, req.user.id)

      res.json({
        success: true,
        data: user,
        message: 'User updated successfully',
      })
    } catch (error) {
      throw error
    }
  }

  getUserTournaments = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      
      const result = await this.usersService.getUserTournaments(id, page, limit)

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      throw error
    }
  }

  getUserStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const stats = await this.usersService.getUserStats(id)

      res.json({
        success: true,
        data: stats,
      })
    } catch (error) {
      throw error
    }
  }

  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Search query is required',
        })
        return
      }

      const result = await this.usersService.searchUsers(q, page, limit)

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      throw error
    }
  }
}
