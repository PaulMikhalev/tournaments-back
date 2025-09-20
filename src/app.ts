import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import dotenv from 'dotenv'

import { config } from './config/app'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'
import routes from './routes'
import { logger } from './utils/logger'

// Load environment variables
dotenv.config()

const app = express()

// Swagger configuration
import { swaggerOptions } from './docs/swagger'
const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Security middleware
app.use(helmet())
app.use(cors(config.cors))

// Rate limiting
app.use(rateLimit(config.rateLimit))

// Compression
app.use(compression())

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Tournaments API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  })
})

// API routes
app.use('/api', routes)

// 404 handler
app.use(notFoundHandler)

// Error handling
app.use(errorHandler)

export default app
