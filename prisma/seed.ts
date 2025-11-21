import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@cardeeno.com' },
    update: {},
    create: {
      email: 'demo@cardeeno.com',
      name: 'Demo User',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create German Basics study set
  const germanSet = await prisma.set.upsert({
    where: { id: 'german-basics-001' },
    update: {},
    create: {
      id: 'german-basics-001',
      title: 'German Basics',
      description: 'Essential German words and phrases for beginners',
      isPublic: true,
      userId: user.id,
      cards: {
        create: [
          { term: 'Hello', definition: 'Hallo', orderIndex: 0 },
          { term: 'Goodbye', definition: 'Auf Wiedersehen', orderIndex: 1 },
          { term: 'Please', definition: 'Bitte', orderIndex: 2 },
          { term: 'Thank you', definition: 'Danke', orderIndex: 3 },
          { term: 'Yes', definition: 'Ja', orderIndex: 4 },
          { term: 'No', definition: 'Nein', orderIndex: 5 },
          { term: 'Good morning', definition: 'Guten Morgen', orderIndex: 6 },
          { term: 'Good night', definition: 'Gute Nacht', orderIndex: 7 },
          { term: 'Water', definition: 'Wasser', orderIndex: 8 },
          { term: 'Bread', definition: 'Brot', orderIndex: 9 },
        ],
      },
    },
  })

  console.log('✅ Created German Basics set with 10 cards')

  // Create Spanish Essentials study set
  const spanishSet = await prisma.set.upsert({
    where: { id: 'spanish-essentials-001' },
    update: {},
    create: {
      id: 'spanish-essentials-001',
      title: 'Spanish Essentials',
      description: 'Common Spanish phrases for travelers',
      isPublic: true,
      userId: user.id,
      cards: {
        create: [
          { term: 'Hello', definition: 'Hola', orderIndex: 0 },
          { term: 'Goodbye', definition: 'Adiós', orderIndex: 1 },
          { term: 'Please', definition: 'Por favor', orderIndex: 2 },
          { term: 'Thank you', definition: 'Gracias', orderIndex: 3 },
          { term: 'Yes', definition: 'Sí', orderIndex: 4 },
          { term: 'No', definition: 'No', orderIndex: 5 },
          { term: 'Excuse me', definition: 'Perdón', orderIndex: 6 },
          { term: "I don't understand", definition: 'No entiendo', orderIndex: 7 },
        ],
      },
    },
  })

  console.log('✅ Created Spanish Essentials set with 8 cards')

  // Create French Vocabulary study set
  const frenchSet = await prisma.set.upsert({
    where: { id: 'french-vocab-001' },
    update: {},
    create: {
      id: 'french-vocab-001',
      title: 'French Vocabulary',
      description: 'Basic French words for everyday conversation',
      isPublic: false,
      userId: user.id,
      cards: {
        create: [
          { term: 'Hello', definition: 'Bonjour', orderIndex: 0 },
          { term: 'Goodbye', definition: 'Au revoir', orderIndex: 1 },
          { term: 'Please', definition: "S'il vous plaît", orderIndex: 2 },
          { term: 'Thank you', definition: 'Merci', orderIndex: 3 },
          { term: 'Yes', definition: 'Oui', orderIndex: 4 },
          { term: 'No', definition: 'Non', orderIndex: 5 },
        ],
      },
    },
  })

  console.log('✅ Created French Vocabulary set with 6 cards')

  // Create a sample study session
  const session = await prisma.studySession.create({
    data: {
      userId: user.id,
      setId: germanSet.id,
      mode: 'flashcard',
      totalCards: 10,
      completedCards: 7,
      score: 6,
      completedAt: new Date(),
    },
  })

  console.log('✅ Created sample study session')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log('  • 1 demo user')
  console.log('  • 3 study sets (24 cards total)')
  console.log('  • 1 study session')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
