import app from './app'
import { config } from './config/app'
import { logger } from './utils/logger'

const PORT = config.port

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`)
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
  logger.info(`🌍 Environment: ${config.nodeEnv}`)
})
