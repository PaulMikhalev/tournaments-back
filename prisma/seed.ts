import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tournaments.com' },
    update: {},
    create: {
      email: 'admin@tournaments.com',
      username: 'admin',
      password: hashedPassword,
      team: 'Tournaments Team',
    },
  })

  console.log('✅ Admin user created:', adminUser.username)

  // Create test users
  const testUsers = []
  for (let i = 1; i <= 5; i++) {
    const hashedTestPassword = await bcrypt.hash('test123', 12)
    const user = await prisma.user.upsert({
      where: { email: `test${i}@example.com` },
      update: {},
      create: {
        email: `test${i}@example.com`,
        username: `testuser${i}`,
        password: hashedTestPassword,
        team: `Team ${i}`,
      },
    })
    testUsers.push(user)
  }

  console.log('✅ Test users created:', testUsers.length)

  // Create sample tournaments
  const games = ['Counter-Strike 2', 'Dota 2', 'Valorant', 'League of Legends', 'Soulcalibur VI']
  const formats = ['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN']
  const statuses = ['REGISTRATION', 'UPCOMING', 'LIVE', 'COMPLETED']

  const tournaments = []
  for (let i = 1; i <= 10; i++) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + i * 7) // Start dates spread over 10 weeks

    const tournament = await prisma.tournament.create({
      data: {
        title: `Tournament ${i}`,
        description: `This is a sample tournament #${i} for testing purposes.`,
        game: games[i % games.length],
        status: statuses[i % statuses.length] as any,
        startDate,
        endDate: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days later
        prizePool: Math.floor(Math.random() * 10000) + 1000,
        maxParticipants: [16, 32, 64][i % 3],
        format: formats[i % formats.length] as any,
        isPublic: true,
        registrationOpen: i % 3 !== 0, // Some tournaments have closed registration
        rules: `Tournament rules for tournament ${i}. Please read carefully.`,
        organizerId: adminUser.id,
      },
    })
    tournaments.push(tournament)
  }

  console.log('✅ Sample tournaments created:', tournaments.length)

  // Add participants to some tournaments
  for (const tournament of tournaments.slice(0, 5)) {
    const participantCount = Math.floor(Math.random() * 8) + 2 // 2-10 participants
    
    for (let i = 0; i < participantCount && i < testUsers.length; i++) {
      await prisma.tournamentParticipant.create({
        data: {
          tournamentId: tournament.id,
          userId: testUsers[i].id,
          status: 'REGISTERED',
        },
      })
    }
  }

  console.log('✅ Tournament participants added')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
