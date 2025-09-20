import request from 'supertest'
import app from '../src/app'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

describe('Tournaments API', () => {
  let authToken: string
  let userId: string

  beforeEach(async () => {
    // Create a test user and get token
    const hashedPassword = await bcrypt.hash('password123', 12)
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      },
    })

    userId = user.id

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })

    authToken = loginResponse.body.data.token
  })

  describe('POST /api/tournaments', () => {
    it('should create a tournament successfully', async () => {
      const tournamentData = {
        title: 'Test Tournament',
        description: 'A test tournament',
        game: 'Counter-Strike 2',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        maxParticipants: 16,
        format: 'SINGLE_ELIMINATION',
        isPublic: true,
        registrationOpen: true,
        rules: 'Test rules',
      }

      const response = await request(app)
        .post('/api/tournaments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(tournamentData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe(tournamentData.title)
      expect(response.body.data.organizer.id).toBe(userId)
    })

    it('should fail without authentication', async () => {
      const tournamentData = {
        title: 'Test Tournament',
        game: 'Counter-Strike 2',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        maxParticipants: 16,
        format: 'SINGLE_ELIMINATION',
      }

      const response = await request(app)
        .post('/api/tournaments')
        .send(tournamentData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Authentication required')
    })
  })

  describe('GET /api/tournaments', () => {
    beforeEach(async () => {
      // Create test tournaments
      await prisma.tournament.createMany({
        data: [
          {
            title: 'Tournament 1',
            game: 'Counter-Strike 2',
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            maxParticipants: 16,
            format: 'SINGLE_ELIMINATION',
            organizerId: userId,
          },
          {
            title: 'Tournament 2',
            game: 'Dota 2',
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            maxParticipants: 32,
            format: 'DOUBLE_ELIMINATION',
            organizerId: userId,
          },
        ],
      })
    })

    it('should return list of tournaments', async () => {
      const response = await request(app)
        .get('/api/tournaments')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.data).toHaveLength(2)
      expect(response.body.data.pagination.total).toBe(2)
    })

    it('should filter tournaments by game', async () => {
      const response = await request(app)
        .get('/api/tournaments?game=Counter-Strike 2')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.data).toHaveLength(1)
      expect(response.body.data.data[0].game).toBe('Counter-Strike 2')
    })
  })

  describe('POST /api/tournaments/:id/join', () => {
    let tournamentId: string

    beforeEach(async () => {
      // Create a test tournament
      const tournament = await prisma.tournament.create({
        data: {
          title: 'Joinable Tournament',
          game: 'Counter-Strike 2',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          maxParticipants: 16,
          format: 'SINGLE_ELIMINATION',
          organizerId: userId,
          registrationOpen: true,
          status: 'REGISTRATION',
        },
      })

      tournamentId = tournament.id
    })

    it('should join tournament successfully', async () => {
      const response = await request(app)
        .post(`/api/tournaments/${tournamentId}/join`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.id).toBe(userId)
    })

    it('should fail to join same tournament twice', async () => {
      // Join first time
      await request(app)
        .post(`/api/tournaments/${tournamentId}/join`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201)

      // Try to join again
      const response = await request(app)
        .post(`/api/tournaments/${tournamentId}/join`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('You are already registered for this tournament')
    })
  })
})
