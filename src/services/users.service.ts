import { Prisma } from '@prisma/client'
import prisma from '../config/database'
import { UpdateUserRequest, UserResponse, UserStats, UserTournamentHistory } from '../types/user.types'
import { createError } from '../middleware/error.middleware'
import { paginate, createPaginationResponse } from '../utils/helpers'

export class UsersService {
  async getUserById(id: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        team: true,
        createdAt: true,
        participations: {
          include: {
            tournament: {
              select: {
                id: true,
                title: true,
                game: true,
                status: true,
                startDate: true,
                prizePool: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw createError('User not found', 404)
    }

    const stats = await this.calculateUserStats(id)

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar ?? undefined,
      team: user.team ?? undefined,
      createdAt: user.createdAt.toISOString(),
      stats,
    }
  }

  async updateUser(id: string, data: UpdateUserRequest, currentUserId: string): Promise<UserResponse> {
    // Check if user is updating their own profile
    if (id !== currentUserId) {
      throw createError('You can only update your own profile', 403)
    }

    const updateData: Prisma.UserUpdateInput = {
      ...(data.username && { username: data.username }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
      ...(data.team !== undefined && { team: data.team }),
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        team: true,
        createdAt: true,
      },
    })

    const stats = await this.calculateUserStats(id)

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar ?? undefined,
      team: user.team ?? undefined,
      createdAt: user.createdAt.toISOString(),
      stats,
    }
  }

  async getUserTournaments(userId: string, page: number = 1, limit: number = 10) {
    const { skip } = paginate(page, limit)

    const [participations, total] = await Promise.all([
      prisma.tournamentParticipant.findMany({
        where: { userId },
        include: {
          tournament: {
            include: {
              organizer: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
              _count: {
                select: {
                  participants: true,
                },
              },
            },
          },
        },
        orderBy: {
          joinedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.tournamentParticipant.count({
        where: { userId },
      }),
    ])

    const formattedData = participations.map(participation => ({
      tournament: {
        id: participation.tournament.id,
        title: participation.tournament.title,
        game: participation.tournament.game,
        status: participation.tournament.status,
        startDate: participation.tournament.startDate.toISOString(),
        prizePool: participation.tournament.prizePool,
        currentParticipants: participation.tournament._count.participants,
        maxParticipants: participation.tournament.maxParticipants,
        organizer: participation.tournament.organizer,
      },
      participation: {
        status: participation.status,
        joinedAt: participation.joinedAt.toISOString(),
        finalPosition: null, // TODO: Calculate final position based on tournament results
      },
    }))

    return createPaginationResponse(formattedData, total, page, limit)
  }

  async getUserStats(userId: string): Promise<UserStats> {
    return this.calculateUserStats(userId)
  }

  private async calculateUserStats(userId: string): Promise<UserStats> {
    const [
      totalTournaments,
      completedTournaments,
      wins,
      top3Finishes,
      totalEarnings,
    ] = await Promise.all([
      // Total tournaments participated
      prisma.tournamentParticipant.count({
        where: { userId },
      }),
      // Completed tournaments
      prisma.tournamentParticipant.count({
        where: {
          userId,
          tournament: {
            status: 'COMPLETED',
          },
        },
      }),
      // Wins (1st place finishes) - TODO: Implement when match results are available
      0,
      // Top 3 finishes - TODO: Implement when match results are available
      0,
      // Total earnings - TODO: Implement when prize distribution is available
      0,
    ])

    return {
      tournaments: totalTournaments,
      wins,
      top3: top3Finishes,
      earnings: totalEarnings,
    }
  }

  async searchUsers(query: string, page: number = 1, limit: number = 10) {
    const { skip } = paginate(page, limit)

    const where: Prisma.UserWhereInput = {
      OR: [
        { username: { contains: query } },
        { email: { contains: query } },
        { team: { contains: query } },
      ],
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          team: true,
          createdAt: true,
          _count: {
            select: {
              participations: true,
            },
          },
        },
        orderBy: {
          username: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar ?? undefined,
      team: user.team ?? undefined,
      createdAt: user.createdAt.toISOString(),
      tournamentCount: user._count.participations,
    }))

    return createPaginationResponse(formattedUsers, total, page, limit)
  }
}
