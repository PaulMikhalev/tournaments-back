import { Prisma } from '@prisma/client'
import prisma from '../config/database'
import { CreateTournamentRequest, UpdateTournamentRequest, TournamentFilters } from '../types/tournament.types'
import { createError } from '../middleware/error.middleware'
import { paginate, createPaginationResponse } from '../utils/helpers'

export class TournamentsService {
  async createTournament(data: CreateTournamentRequest, organizerId: string) {
    try {
      const tournament = await prisma.tournament.create({
        data: {
          ...data,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          organizerId,
        },
        include: {
          organizer: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  team: true,
                },
              },
            },
          },
          matches: true,
        },
      })

      return this.formatTournamentResponse(tournament)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw createError('Tournament with this title already exists', 409)
        }
      }
      throw error
    }
  }

  async getTournaments(filters: TournamentFilters) {
    const { page, limit, skip } = paginate(filters.page, filters.limit)
    
    const where: Prisma.TournamentWhereInput = {
      ...(filters.status && { status: filters.status }),
      ...(filters.game && { game: { contains: filters.game } }),
      ...(filters.format && { format: filters.format }),
      ...(filters.isPublic !== undefined && { isPublic: filters.isPublic }),
      ...(filters.registrationOpen !== undefined && { registrationOpen: filters.registrationOpen }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search } },
          { description: { contains: filters.search } },
        ],
      }),
    }

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        include: {
          organizer: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  team: true,
                },
              },
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy: [
          { status: 'asc' },
          { startDate: 'asc' },
        ],
        skip,
        take: limit,
      }),
      prisma.tournament.count({ where }),
    ])

    const formattedTournaments = tournaments.map(tournament => ({
      ...tournament,
      currentParticipants: tournament._count.participants,
    }))

    return createPaginationResponse(formattedTournaments, total, page, limit)
  }

  async getTournamentById(id: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                team: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
        matches: {
          include: {
            player1: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            player2: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: [
            { round: 'asc' },
            { matchNumber: 'asc' },
          ],
        },
      },
    })

    if (!tournament) {
      throw createError('Tournament not found', 404)
    }

    return this.formatTournamentResponse(tournament)
  }

  async updateTournament(id: string, data: UpdateTournamentRequest, userId: string) {
    // Check if user is the organizer
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      select: { organizerId: true },
    })

    if (!tournament) {
      throw createError('Tournament not found', 404)
    }

    if (tournament.organizerId !== userId) {
      throw createError('You can only update your own tournaments', 403)
    }

    const updateData: Prisma.TournamentUpdateInput = {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.game && { game: data.game }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
      ...(data.prizePool !== undefined && { prizePool: data.prizePool }),
      ...(data.maxParticipants !== undefined && { maxParticipants: data.maxParticipants }),
      ...(data.format && { format: data.format }),
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      ...(data.registrationOpen !== undefined && { registrationOpen: data.registrationOpen }),
      ...(data.rules !== undefined && { rules: data.rules }),
      ...(data.status && { status: data.status }),
    }

    const updatedTournament = await prisma.tournament.update({
      where: { id },
      data: updateData,
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                team: true,
              },
            },
          },
        },
        matches: true,
      },
    })

    return this.formatTournamentResponse(updatedTournament)
  }

  async deleteTournament(id: string, userId: string) {
    // Check if user is the organizer
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      select: { organizerId: true },
    })

    if (!tournament) {
      throw createError('Tournament not found', 404)
    }

    if (tournament.organizerId !== userId) {
      throw createError('You can only delete your own tournaments', 403)
    }

    await prisma.tournament.delete({
      where: { id },
    })

    return { message: 'Tournament deleted successfully' }
  }

  async joinTournament(tournamentId: string, userId: string) {
    // Check if tournament exists and registration is open
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        participants: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
    })

    if (!tournament) {
      throw createError('Tournament not found', 404)
    }

    if (!tournament.registrationOpen) {
      throw createError('Registration for this tournament is closed', 400)
    }

    if (tournament.status !== 'REGISTRATION') {
      throw createError('Tournament is not in registration phase', 400)
    }

    if (tournament._count.participants >= tournament.maxParticipants) {
      throw createError('Tournament is full', 400)
    }

    // Check if user is already registered
    const existingParticipation = await prisma.tournamentParticipant.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId,
        },
      },
    })

    if (existingParticipation) {
      throw createError('You are already registered for this tournament', 400)
    }

    // Add participant
    const participation = await prisma.tournamentParticipant.create({
      data: {
        tournamentId,
        userId,
        status: 'REGISTERED',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            team: true,
          },
        },
      },
    })

    return participation
  }

  async leaveTournament(tournamentId: string, userId: string) {
    const participation = await prisma.tournamentParticipant.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId,
        },
      },
    })

    if (!participation) {
      throw createError('You are not registered for this tournament', 404)
    }

    await prisma.tournamentParticipant.delete({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId,
        },
      },
    })

    return { message: 'Successfully left the tournament' }
  }

  private formatTournamentResponse(tournament: any) {
    return {
      id: tournament.id,
      title: tournament.title,
      description: tournament.description,
      game: tournament.game,
      image: tournament.image,
      status: tournament.status,
      startDate: tournament.startDate.toISOString(),
      endDate: tournament.endDate?.toISOString(),
      prizePool: tournament.prizePool,
      maxParticipants: tournament.maxParticipants,
      currentParticipants: tournament.participants?.length || tournament._count?.participants || 0,
      format: tournament.format,
      isPublic: tournament.isPublic,
      registrationOpen: tournament.registrationOpen,
      rules: tournament.rules,
      organizer: tournament.organizer,
      participants: tournament.participants?.map((p: any) => ({
        id: p.id,
        user: p.user,
        status: p.status,
        joinedAt: p.joinedAt.toISOString(),
      })) || [],
      matches: tournament.matches?.map((m: any) => ({
        id: m.id,
        round: m.round,
        matchNumber: m.matchNumber,
        player1: m.player1,
        player2: m.player2,
        player1Score: m.player1Score,
        player2Score: m.player2Score,
        status: m.status,
        scheduledAt: m.scheduledAt?.toISOString(),
        startedAt: m.startedAt?.toISOString(),
        completedAt: m.completedAt?.toISOString(),
      })) || [],
      createdAt: tournament.createdAt.toISOString(),
      updatedAt: tournament.updatedAt.toISOString(),
    }
  }
}
