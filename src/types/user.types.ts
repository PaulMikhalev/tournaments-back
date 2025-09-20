export interface UserResponse {
  id: string
  username: string
  email: string
  avatar?: string
  team?: string
  createdAt: string
  stats: {
    tournaments: number
    wins: number
    top3: number
    earnings: number
  }
}

export interface UpdateUserRequest {
  username?: string
  avatar?: string
  team?: string
}

export interface UserStats {
  tournaments: number
  wins: number
  top3: number
  earnings: number
}

export interface UserTournamentHistory {
  tournament: {
    id: string
    title: string
    game: string
    status: string
    startDate: string
    prizePool: number
  }
  participation: {
    status: string
    joinedAt: string
    finalPosition?: number
  }
}
