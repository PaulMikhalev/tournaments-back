import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Clean up database before each test
beforeEach(async () => {
  // Delete all records in reverse order of dependencies
  await prisma.match.deleteMany()
  await prisma.tournamentParticipant.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.user.deleteMany()
})

// Close database connection after all tests
afterAll(async () => {
  await prisma.$disconnect()
})
