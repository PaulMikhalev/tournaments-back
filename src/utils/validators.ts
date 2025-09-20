import { z } from 'zod'

// Common validation schemas
export const cuidSchema = z.string().cuid()
export const emailSchema = z.string().email('Invalid email format')
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters')
export const usernameSchema = z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters')

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  team: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Tournament validation schemas
export const createTournamentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  game: z.string().min(1, 'Game is required'),
  image: z.string().url().optional(),
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format').optional(),
  prizePool: z.number().min(0, 'Prize pool must be positive').optional(),
  maxParticipants: z.number().int().min(2, 'Minimum 2 participants').max(128, 'Maximum 128 participants'),
  format: z.enum(['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN', 'SWISS']),
  isPublic: z.boolean(),
  registrationOpen: z.boolean(),
  rules: z.string().optional(),
})

export const updateTournamentSchema = createTournamentSchema.partial()

export const tournamentFiltersSchema = z.object({
  status: z.enum(['REGISTRATION', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']).optional(),
  game: z.string().optional(),
  format: z.enum(['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN', 'SWISS']).optional(),
  isPublic: z.boolean().optional(),
  registrationOpen: z.boolean().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
})

// User validation schemas
export const updateUserSchema = z.object({
  username: usernameSchema.optional(),
  avatar: z.string().url().optional(),
  team: z.string().max(50, 'Team name must be less than 50 characters').optional(),
})

// Common parameter schemas
export const idParamSchema = z.object({
  id: cuidSchema,
})

export const tournamentIdParamSchema = z.object({
  id: cuidSchema,
})

export const userIdParamSchema = z.object({
  id: cuidSchema,
})
