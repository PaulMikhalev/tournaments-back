import { config } from '../config/app'

export const paginate = (page: number = 1, limit: number = config.pagination.defaultLimit) => {
  const normalizedPage = Math.max(1, page)
  const normalizedLimit = Math.min(config.pagination.maxLimit, Math.max(1, limit))
  const skip = (normalizedPage - 1) * normalizedLimit

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip,
  }
}

export const createPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit)
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const formatDate = (date: Date | string): string => {
  return new Date(date).toISOString()
}

export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    const allowedDomains = ['localhost', '127.0.0.1']
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    
    // Check domain (for development)
    if (process.env.NODE_ENV === 'development') {
      allowedDomains.push('localhost', '127.0.0.1')
    }
    
    // Check file extension
    const hasValidExtension = allowedExtensions.some(ext => 
      urlObj.pathname.toLowerCase().endsWith(ext)
    )
    
    return hasValidExtension
  } catch {
    return false
  }
}

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
}

export const calculateTournamentProgress = (currentParticipants: number, maxParticipants: number): number => {
  if (maxParticipants === 0) return 0
  return Math.round((currentParticipants / maxParticipants) * 100)
}

export const generateTournamentBracket = (participants: any[], format: string) => {
  // This is a simplified bracket generation
  // In a real implementation, you'd use a proper tournament bracket library
  const bracket = []
  const numParticipants = participants.length
  
  if (format === 'SINGLE_ELIMINATION') {
    // Generate single elimination bracket
    let rounds = Math.ceil(Math.log2(numParticipants))
    for (let round = 0; round < rounds; round++) {
      const matchesInRound = Math.pow(2, rounds - round - 1)
      bracket.push({
        round: round + 1,
        matches: Array.from({ length: matchesInRound }, (_, i) => ({
          matchNumber: i + 1,
          player1: null,
          player2: null,
        })),
      })
    }
  }
  
  return bracket
}
