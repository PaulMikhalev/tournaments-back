import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { LoginRequest, RegisterRequest } from '../types/auth.types'
import { RequestWithUser } from '../types/api.types'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: RegisterRequest = req.body
      const result = await this.authService.register(data)

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      })
    } catch (error) {
      throw error
    }
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: LoginRequest = req.body
      const result = await this.authService.login(data)

      res.json({
        success: true,
        data: result,
        message: 'Login successful',
      })
    } catch (error) {
      throw error
    }
  }

  me = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        })
        return
      }

      const user = await this.authService.getCurrentUser(req.user.id)

      res.json({
        success: true,
        data: { user },
      })
    } catch (error) {
      throw error
    }
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    // In a JWT-based system, logout is typically handled on the client side
    // by removing the token. For server-side logout, you'd need to implement
    // a token blacklist or use refresh tokens.
    res.json({
      success: true,
      message: 'Logout successful',
    })
  }
}
