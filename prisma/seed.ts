import { Prisma, PrismaClient } from '@prisma/client'
import type { UserType, ProblemStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Clear existing data
  await prisma.comment.deleteMany()
  await prisma.problem.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'User One',
      email: 'user1@example.com',
      userType: 'PROBLEM_SUBMITTER',
      // Removed invalid 'role' field
      // Minimal placeholders
      emailVerified: new Date(),
      hashedPassword: 'placeholder_password_hash'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'User Two',
      email: 'user2@example.com',
      userType: 'DEVELOPER',
      emailVerified: new Date(),
      hashedPassword: 'placeholder_password_hash'
    }
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'User Three',
      email: 'user3@example.com',
      userType: 'PROBLEM_SUBMITTER',
      emailVerified: new Date(),
      hashedPassword: 'placeholder_password_hash'
    }
  })

  // 3. Create a problem with all required fields
  const problem = await prisma.problem.create({
    data: {
      title: 'Sample Technology Problem',
      description: 'A detailed description of the technology challenge',
      category: 'Software Development',
      industry: 'Information Technology',
      status: 'OPEN', // Use string literal instead of enum value
      submitterId: user1.id,
      voteCount: 0 // explicitly set, though it defaults to 0
    }
  })

  // 4. Create comments
  //    'Comment' uses 'userId' to reference the user.
  await prisma.comment.createMany({
    data: [
      {
        content: 'Insightful first comment',
        userId: user2.id,
        problemId: problem.id
      },
      {
        content: 'Another perspective on the problem',
        userId: user3.id,
        problemId: problem.id
      },
      {
        content: 'Additional commentary',
        userId: user1.id,
        problemId: problem.id
      }
    ]
  })

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
