import { Request, Response } from 'express'
import { BracketsService } from '../services/brackets.service'
import { RequestWithUser } from '../types/api.types'

export class BracketsController {
  private bracketsService: BracketsService

  constructor() {
    this.bracketsService = new BracketsService()
  }

  generateBracket = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        })
        return
      }

      const { id } = req.params
      const result = await this.bracketsService.generateBracket(id, req.user.id)

      res.json({
        success: true,
        data: result,
        message: 'Bracket generated successfully',
      })
    } catch (error) {
      throw error
    }
  }

  getBracket = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const bracket = await this.bracketsService.getBracket(id)

      res.json({
        success: true,
        data: bracket,
      })
    } catch (error) {
      throw error
    }
  }

  updateMatchResult = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        })
        return
      }

      const { tournamentId, matchId } = req.params
      const { player1Score, player2Score } = req.body

      if (typeof player1Score !== 'number' || typeof player2Score !== 'number') {
        res.status(400).json({
          success: false,
          error: 'Player scores must be numbers',
        })
        return
      }

      const result = await this.bracketsService.updateMatchResult(
        tournamentId,
        matchId,
        player1Score,
        player2Score,
        req.user.id
      )

      res.json({
        success: true,
        data: result,
        message: 'Match result updated successfully',
      })
    } catch (error) {
      throw error
    }
  }
}
