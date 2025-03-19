import { PrismaClient, UserType, ProblemStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test users if they don't exist
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  })

  if (!adminExists) {
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        hashedPassword: await hash('Password123!', 10),
        userType: UserType.DEVELOPER,
        skills: ['Project Management', 'Leadership', 'Strategy'],
        interests: ['Technology', 'Innovation', 'Business'],
      },
    })
  }

  const devExists = await prisma.user.findUnique({
    where: { email: 'dev@example.com' },
  })

  if (!devExists) {
    await prisma.user.create({
      data: {
        email: 'dev@example.com',
        firstName: 'Developer',
        lastName: 'User',
        username: 'developer',
        hashedPassword: await hash('Password123!', 10),
        userType: UserType.DEVELOPER,
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        interests: ['Web Development', 'Open Source', 'AI'],
      },
    })
  }

  const userExists = await prisma.user.findUnique({
    where: { email: 'user@example.com' },
  })

  if (!userExists) {
    await prisma.user.create({
      data: {
        email: 'user@example.com',
        firstName: 'Normal',
        lastName: 'User',
        username: 'user',
        hashedPassword: await hash('Password123!', 10),
        userType: UserType.PROBLEM_SUBMITTER,
        skills: ['Communication', 'Problem-solving', 'Research'],
        interests: ['UX/UI', 'Product Management', 'Marketing'],
      },
    })
  }

  // Seed SaaS data
  const saasProductsData = [
    {
      name: 'Trello',
      description: 'Trello is a visual tool for organizing your work and life. Join more than 1 million users who are using Trello to get more done.',
      website: 'https://trello.com',
      logo: 'https://res.cloudinary.com/dk0z4ums3/image/upload/v1633962234/trello-logo_q8ypsz.png',
      pricingModel: 'Freemium',
      pricingDetails: 'Free for basic use, Business Class for $12.50/user/month, Enterprise for $17.50/user/month',
      category: 'Project Management',
      tags: ['Task Management', 'Kanban', 'Collaboration', 'Agile'],
      features: ['Boards', 'Lists', 'Cards', 'Team Collaboration', 'Power-Ups', 'Automation'],
      integrations: ['Slack', 'Google Drive', 'Dropbox', 'Jira', 'GitHub'],
      pros: ['User-friendly interface', 'Visual organization', 'Flexible workflow', 'Great mobile app'],
      cons: ['Limited in free version', 'Can become cluttered with many cards', 'Advanced reporting requires add-ons'],
      verified: true,
    },
    {
      name: 'Slack',
      description: 'Slack is a messaging app for business that connects people to the information they need.',
      website: 'https://slack.com',
      logo: 'https://res.cloudinary.com/dk0z4ums3/image/upload/v1633962234/slack-logo_awqc5m.png',
      pricingModel: 'Freemium',
      pricingDetails: 'Free for small teams, Pro for $8/user/month, Business+ for $15/user/month',
      category: 'Communication',
      tags: ['Team Communication', 'Messaging', 'Remote Work', 'Collaboration'],
      features: ['Channels', 'Direct Messages', 'File Sharing', 'Video Calls', 'Search', 'Integrations'],
      integrations: ['Google Drive', 'Asana', 'Trello', 'GitHub', 'Zoom'],
      pros: ['Real-time communication', 'Organized conversations', 'Excellent search', 'Rich integrations'],
      cons: ['Can be distracting', 'Limited message history in free plan', 'Can become overwhelming in large organizations'],
      verified: true,
    },
    {
      name: 'Notion',
      description: 'Notion is an all-in-one workspace for notes, tasks, wikis, and databases.',
      website: 'https://notion.so',
      logo: 'https://res.cloudinary.com/dk0z4ums3/image/upload/v1633962234/notion-logo_dldcih.png',
      pricingModel: 'Freemium',
      pricingDetails: 'Free for personal use, Personal Pro for $5/month, Team for $10/user/month',
      category: 'Productivity',
      tags: ['Note-taking', 'Wiki', 'Knowledge Base', 'Project Management'],
      features: ['Notes', 'Wikis', 'Databases', 'Templates', 'Collaboration', 'Page Linking'],
      integrations: ['Slack', 'GitHub', 'Figma', 'Invision', 'Evernote'],
      pros: ['Highly customizable', 'All-in-one solution', 'Great for documentation', 'Elegant UI'],
      cons: ['Steep learning curve', 'Can be slow with large files', 'Mobile apps are limited'],
      verified: true,
    },
    {
      name: 'Asana',
      description: 'Asana helps teams orchestrate their work, from daily tasks to strategic initiatives.',
      website: 'https://asana.com',
      logo: 'https://res.cloudinary.com/dk0z4ums3/image/upload/v1633962234/asana-logo_hhh2fy.png',
      pricingModel: 'Freemium',
      pricingDetails: 'Free for up to 15 users, Premium for $13.49/user/month, Business for $30.49/user/month',
      category: 'Project Management',
      tags: ['Task Management', 'Project Tracking', 'Agile', 'Team Collaboration'],
      features: ['Tasks', 'Projects', 'Portfolios', 'Timeline', 'Forms', 'Reporting'],
      integrations: ['Slack', 'Google Drive', 'Microsoft Teams', 'Zoom', 'Dropbox'],
      pros: ['Clear UI', 'Timeline view', 'Custom fields', 'Cross-functional project planning'],
      cons: ['Can get expensive', 'Complex for simple tasks', 'Limited time tracking features'],
      verified: true,
    },
    {
      name: 'Figma',
      description: 'Figma is a vector graphics editor and prototyping tool with real-time collaboration.',
      website: 'https://figma.com',
      logo: 'https://res.cloudinary.com/dk0z4ums3/image/upload/v1633962234/figma-logo_yygvgy.png',
      pricingModel: 'Freemium',
      pricingDetails: 'Free for individuals, Professional for $15/editor/month, Organization for $45/editor/month',
      category: 'Design',
      tags: ['UI/UX Design', 'Prototyping', 'Collaboration', 'Wireframing'],
      features: ['Vector Editing', 'Prototyping', 'Design Systems', 'Collaboration', 'Components', 'Plugins'],
      integrations: ['Slack', 'Jira', 'Zeplin', 'Principle', 'Notion'],
      pros: ['Real-time collaboration', 'Browser-based', 'Excellent for UI design', 'Design system friendly'],
      cons: ['Requires internet connection', 'Limited offline capabilities', 'Advanced animations require other tools'],
      verified: true,
    }
  ];

  // Add the SaaS products
  for (const saasData of saasProductsData) {
    const exists = await prisma.saaS.findFirst({
      where: { name: saasData.name },
    });

    if (!exists) {
      await prisma.saaS.create({
        data: saasData,
      });
    }
  }

  console.log('Database has been seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
