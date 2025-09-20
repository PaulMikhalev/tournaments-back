export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tournaments API',
      version: '1.0.0',
      description: 'API для управления киберспортивными турнирами',
      contact: {
        name: 'Tournaments Team',
        email: 'admin@tournaments.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            avatar: { type: 'string' },
            team: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Tournament: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            game: { type: 'string' },
            image: { type: 'string' },
            status: { 
              type: 'string',
              enum: ['REGISTRATION', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']
            },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            prizePool: { type: 'number' },
            maxParticipants: { type: 'number' },
            currentParticipants: { type: 'number' },
            format: {
              type: 'string',
              enum: ['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN', 'SWISS']
            },
            isPublic: { type: 'boolean' },
            registrationOpen: { type: 'boolean' },
            rules: { type: 'string' },
            organizer: { $ref: '#/components/schemas/User' },
            participants: {
              type: 'array',
              items: { $ref: '#/components/schemas/TournamentParticipant' }
            },
            matches: {
              type: 'array',
              items: { $ref: '#/components/schemas/Match' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TournamentParticipant: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            status: { 
              type: 'string',
              enum: ['REGISTERED', 'CONFIRMED', 'DISQUALIFIED', 'WITHDRAWN']
            },
            joinedAt: { type: 'string', format: 'date-time' },
          },
        },
        Match: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            round: { type: 'number' },
            matchNumber: { type: 'number' },
            player1: { $ref: '#/components/schemas/User' },
            player2: { $ref: '#/components/schemas/User' },
            player1Score: { type: 'number' },
            player2Score: { type: 'number' },
            status: {
              type: 'string',
              enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
            },
            scheduledAt: { type: 'string', format: 'date-time' },
            startedAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' },
            error: { type: 'string' },
            errors: { type: 'object' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { type: 'object' }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
                hasNext: { type: 'boolean' },
                hasPrev: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
}
