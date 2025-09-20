import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { ApiError } from '../types/api.types'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error)

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          error: 'A record with this data already exists',
          field: error.meta?.target,
        })
        return
      case 'P2025':
        res.status(404).json({
          success: false,
          error: 'Record not found',
        })
        return
      case 'P2003':
        res.status(400).json({
          success: false,
          error: 'Invalid reference to related record',
        })
        return
      default:
        res.status(500).json({
          success: false,
          error: 'Database error',
        })
        return
    }
  }

  // Custom API errors
  if (error instanceof Error && 'statusCode' in error) {
    const apiError = error as ApiError
    res.status(apiError.statusCode).json({
      success: false,
      error: apiError.message,
      errors: apiError.errors,
    })
    return
  }

  // Default error
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
  })
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  })
}

export const createError = (message: string, statusCode: number = 500, errors?: Record<string, string[]>): ApiError => {
  const error = new Error(message) as ApiError
  error.statusCode = statusCode
  error.errors = errors
  return error
}
