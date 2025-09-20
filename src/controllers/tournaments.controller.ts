import { Request, Response } from 'express'
import { TournamentsService } from '../services/tournaments.service'
import { CreateTournamentRequest, UpdateTournamentRequest, TournamentFilters } from '../types/tournament.types'
import { RequestWithUser } from '../types/api.types'

export class TournamentsController {
  private tournamentsService: TournamentsService

  constructor() {
    this.tournamentsService = new TournamentsService()
  }

  getTournaments = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: TournamentFilters = req.query as any
      const result = await this.tournamentsService.getTournaments(filters)

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      throw error
    }
  }

  getTournamentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const tournament = await this.tournamentsService.getTournamentById(id)

      res.json({
        success: true,
        data: tournament,
      })
    } catch (error) {
      throw error
    }
  }

  createTournament = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        })
        return
      }

      const data: CreateTournamentRequest = req.body
      const tournament = await this.tournamentsService.createTournament(data, req.user.id)

      res.status(201).json({
        success: true,
        data: tournament,
        message: 'Tournament created successfully',
      })
    } catch (error) {
      throw error
    }
  }

  updateTournament = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        })
        return
      }

      const { id } = req.params
      const data: UpdateTournamentRequest = req.body
      const tournament = await this.tournamentsService.updateTournament(id, data, req.user.id)

      res.json({
        success: true,
        data: tournament,
        message: 'Tournament updated successfully',
      })
    } catch (error) {
      throw error
    }
  }

  deleteTournament = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        })
        return
      }

      const { id } = req.params
      const result = await this.tournamentsService.deleteTournament(id, req.user.id)

      res.json({
        success: true,
        data: result,
        message: 'Tournament deleted successfully',
      })
    } catch (error) {
      throw error
    }
  }

  joinTournament = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        })
        return
      }

      const { id } = req.params
      const participation = await this.tournamentsService.joinTournament(id, req.user.id)

      res.status(201).json({
        success: true,
        data: participation,
        message: 'Successfully joined the tournament',
      })
    } catch (error) {
      throw error
    }
  }

  leaveTournament = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        })
        return
      }

      const { id } = req.params
      const result = await this.tournamentsService.leaveTournament(id, req.user.id)

      res.json({
        success: true,
        data: result,
        message: 'Successfully left the tournament',
      })
    } catch (error) {
      throw error
    }
  }
}
