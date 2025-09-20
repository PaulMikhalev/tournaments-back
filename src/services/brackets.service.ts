import { Prisma, MatchStatus } from '@prisma/client'
import prisma from '../config/database'
import { createError } from '../middleware/error.middleware'
import { generateTournamentBracket } from '../utils/helpers'

export class BracketsService {
  async generateBracket(tournamentId: string, organizerId: string) {
    // Check if user is the organizer
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        matches: true,
      },
    })

    if (!tournament) {
      throw createError('Tournament not found', 404)
    }

    if (tournament.organizerId !== organizerId) {
      throw createError('You can only manage your own tournaments', 403)
    }

    if (tournament.participants.length < 2) {
      throw createError('Tournament needs at least 2 participants to generate bracket', 400)
    }

    // Check if bracket already exists
    if (tournament.matches.length > 0) {
      throw createError('Bracket already exists for this tournament', 400)
    }

    // Generate bracket based on tournament format
    const bracket = this.generateBracketStructure(tournament.participants, tournament.format)
    
    // Create matches in database
    const matches = []
    for (const round of bracket) {
      for (const match of round.matches) {
        const createdMatch = await prisma.match.create({
          data: {
            tournamentId,
            round: round.round,
            matchNumber: match.matchNumber,
            player1Id: match.player1?.id || null,
            player2Id: match.player2?.id || null,
            status: 'SCHEDULED',
          },
        })
        matches.push(createdMatch)
      }
    }

    return {
      message: 'Bracket generated successfully',
      matches: matches.length,
      rounds: bracket.length,
    }
  }

  async updateMatchResult(
    tournamentId: string,
    matchId: string,
    player1Score: number,
    player2Score: number,
    organizerId: string
  ) {
    // Check if user is the organizer
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { organizerId: true },
    })

    if (!tournament) {
      throw createError('Tournament not found', 404)
    }

    if (tournament.organizerId !== organizerId) {
      throw createError('You can only manage your own tournaments', 403)
    }

    // Get match details
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        tournament: true,
      },
    })

    if (!match) {
      throw createError('Match not found', 404)
    }

    if (match.tournamentId !== tournamentId) {
      throw createError('Match does not belong to this tournament', 400)
    }

    if (match.status === 'COMPLETED') {
      throw createError('Match is already completed', 400)
    }

    // Update match result
    const winnerId = player1Score > player2Score ? match.player1Id : match.player2Id
    const loserId = player1Score > player2Score ? match.player2Id : match.player1Id

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        player1Score,
        player2Score,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })

    // Advance winner to next round (for elimination tournaments)
    if (match.tournament.format === 'SINGLE_ELIMINATION' || match.tournament.format === 'DOUBLE_ELIMINATION') {
      await this.advanceWinner(tournamentId, match, winnerId)
    }

    return updatedMatch
  }

  async getBracket(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
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

    // Group matches by rounds
    const bracket = tournament.matches.reduce((acc, match) => {
      const roundIndex = match.round - 1
      if (!acc[roundIndex]) {
        acc[roundIndex] = {
          round: match.round,
          matches: [],
        }
      }
      acc[roundIndex].matches.push({
        id: match.id,
        matchNumber: match.matchNumber,
        player1: match.player1,
        player2: match.player2,
        player1Score: match.player1Score,
        player2Score: match.player2Score,
        status: match.status,
        scheduledAt: match.scheduledAt?.toISOString(),
        startedAt: match.startedAt?.toISOString(),
        completedAt: match.completedAt?.toISOString(),
      })
      return acc
    }, [] as any[])

    return {
      tournamentId,
      format: tournament.format,
      status: tournament.status,
      bracket,
    }
  }

  private generateBracketStructure(participants: any[], format: string) {
    const numParticipants = participants.length
    const bracket = []

    if (format === 'SINGLE_ELIMINATION') {
      // Calculate number of rounds needed
      const rounds = Math.ceil(Math.log2(numParticipants))
      
      // First round - some players might get byes
      const firstRoundMatches = Math.floor(numParticipants / 2)
      const byes = numParticipants - (firstRoundMatches * 2)
      
      // Create first round matches
      const firstRound = {
        round: 1,
        matches: [],
      }

      let participantIndex = 0
      for (let i = 0; i < firstRoundMatches; i++) {
        const match = {
          matchNumber: i + 1,
          player1: participants[participantIndex] || null,
          player2: participants[participantIndex + 1] || null,
        }
        firstRound.matches.push(match)
        participantIndex += 2
      }

      // Add bye matches if needed
      if (byes > 0) {
        for (let i = 0; i < byes; i++) {
          const match = {
            matchNumber: firstRoundMatches + i + 1,
            player1: participants[participantIndex] || null,
            player2: null, // Bye
          }
          firstRound.matches.push(match)
          participantIndex++
        }
      }

      bracket.push(firstRound)

      // Create subsequent rounds
      let currentRoundParticipants = Math.ceil(numParticipants / 2)
      for (let round = 2; round <= rounds; round++) {
        const matchesInRound = Math.floor(currentRoundParticipants / 2)
        const roundData = {
          round,
          matches: [],
        }

        for (let i = 0; i < matchesInRound; i++) {
          roundData.matches.push({
            matchNumber: i + 1,
            player1: null, // Will be filled by winners from previous round
            player2: null,
          })
        }

        bracket.push(roundData)
        currentRoundParticipants = matchesInRound
      }
    }

    return bracket
  }

  private async advanceWinner(tournamentId: string, completedMatch: any, winnerId: string | null) {
    if (!winnerId) return

    // Find the next match for this winner
    const nextRound = completedMatch.round + 1
    const nextMatchNumber = Math.ceil(completedMatch.matchNumber / 2)

    const nextMatch = await prisma.match.findFirst({
      where: {
        tournamentId,
        round: nextRound,
        matchNumber: nextMatchNumber,
      },
    })

    if (nextMatch) {
      // Determine if winner should be player1 or player2
      const isPlayer1 = completedMatch.matchNumber % 2 === 1
      
      await prisma.match.update({
        where: { id: nextMatch.id },
        data: {
          [isPlayer1 ? 'player1Id' : 'player2Id']: winnerId,
        },
      })
    }
  }
}
