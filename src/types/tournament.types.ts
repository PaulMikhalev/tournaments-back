import { TournamentStatus, TournamentFormat } from '@prisma/client'

export interface CreateTournamentRequest {
  title: string
  description?: string
  game: string
  image?: string
  startDate: string
  endDate?: string
  prizePool?: number
  maxParticipants: number
  format: TournamentFormat
  isPublic: boolean
  registrationOpen: boolean
  rules?: string
}

export interface UpdateTournamentRequest {
  title?: string
  description?: string
  game?: string
  image?: string
  startDate?: string
  endDate?: string
  prizePool?: number
  maxParticipants?: number
  format?: TournamentFormat
  isPublic?: boolean
  registrationOpen?: boolean
  rules?: string
  status?: TournamentStatus
}

export interface TournamentResponse {
  id: string
  title: string
  description?: string
  game: string
  image?: string
  status: TournamentStatus
  startDate: string
  endDate?: string
  prizePool: number
  maxParticipants: number
  currentParticipants: number
  format: TournamentFormat
  isPublic: boolean
  registrationOpen: boolean
  rules?: string
  organizer: {
    id: string
    username: string
    avatar?: string
  }
  participants: TournamentParticipantResponse[]
  matches: MatchResponse[]
  createdAt: string
  updatedAt: string
}

export interface TournamentParticipantResponse {
  id: string
  user: {
    id: string
    username: string
    avatar?: string
    team?: string
  }
  status: string
  joinedAt: string
}

export interface MatchResponse {
  id: string
  round: number
  matchNumber: number
  player1?: {
    id: string
    username: string
    avatar?: string
  }
  player2?: {
    id: string
    username: string
    avatar?: string
  }
  player1Score?: number
  player2Score?: number
  status: string
  scheduledAt?: string
  startedAt?: string
  completedAt?: string
}

export interface JoinTournamentRequest {
  tournamentId: string
}

export interface TournamentFilters {
  status?: TournamentStatus
  game?: string
  format?: TournamentFormat
  isPublic?: boolean
  registrationOpen?: boolean
  page?: number
  limit?: number
  search?: string
}
