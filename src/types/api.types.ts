export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

import { Request } from 'express'

export interface RequestWithUser extends Request {
  user?: {
    id: string
    username: string
    email: string
  }
}
