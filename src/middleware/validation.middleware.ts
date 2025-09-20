import { Request, Response, NextFunction } from 'express'
import { z, ZodSchema } from 'zod'

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, err) => {
          const field = err.path.join('.')
          if (!acc[field]) {
            acc[field] = []
          }
          acc[field].push(err.message)
          return acc
        }, {} as Record<string, string[]>)

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors,
        })
        return
      }

      res.status(400).json({
        success: false,
        error: 'Invalid request data',
      })
    }
  }
}

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, err) => {
          const field = err.path.join('.')
          if (!acc[field]) {
            acc[field] = []
          }
          acc[field].push(err.message)
          return acc
        }, {} as Record<string, string[]>)

        res.status(400).json({
          success: false,
          error: 'Query validation failed',
          errors,
        })
        return
      }

      res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
      })
    }
  }
}

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, err) => {
          const field = err.path.join('.')
          if (!acc[field]) {
            acc[field] = []
          }
          acc[field].push(err.message)
          return acc
        }, {} as Record<string, string[]>)

        res.status(400).json({
          success: false,
          error: 'Parameter validation failed',
          errors,
        })
        return
      }

      res.status(400).json({
        success: false,
        error: 'Invalid parameters',
      })
    }
  }
}
