import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import prisma from '../config/database'
import { generateToken } from '../config/jwt'
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types'
import { createError } from '../middleware/error.middleware'

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { username: data.username },
          ],
        },
      })

      if (existingUser) {
        if (existingUser.email === data.email) {
          throw createError('User with this email already exists', 409)
        }
        if (existingUser.username === data.username) {
          throw createError('User with this username already exists', 409)
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12)

      // Create user
      const user = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          team: data.team,
        },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          team: true,
        },
      })

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
      })

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar ?? undefined,
          team: user.team ?? undefined,
        },
        token,
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw createError('User with this email or username already exists', 409)
        }
      }
      throw error
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw createError('Invalid email or password', 401)
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401)
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar ?? undefined,
        team: user.team ?? undefined,
      },
      token,
    }
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        team: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw createError('User not found', 404)
    }

    return user
  }
}
