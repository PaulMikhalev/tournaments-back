export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  team?: string
}

export interface AuthResponse {
  user: {
    id: string
    username: string
    email: string
    avatar?: string
    team?: string
  }
  token: string
}

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export interface AuthUser {
  id: string
  username: string
  email: string
  avatar?: string
  team?: string
}
