import mongoose from 'mongoose'
import { Badge } from '../models/badge.model.js'
import { logger } from '@/utils/logger.js'

export const badges = [
  {
    name: 'First Login',
    description: 'Awarded when the user logs in for the first time.',
    icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
    pointsRequired: 10,
    level: 'bronze'
  },
  {
    name: 'Task Master',
    description: 'Completed 10 tasks successfully.',
    icon: 'https://cdn-icons-png.flaticon.com/512/190/190406.png',
    pointsRequired: 100,
    level: 'silver'
  },
  {
    name: 'Project Hero',
    description: 'Completed the first project milestone.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png',
    pointsRequired: 200,
    level: 'gold'
  },
  {
    name: 'Consistency King',
    description: 'Logged in daily for 7 consecutive days.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png',
    pointsRequired: 150,
    level: 'silver'
  },
  {
    name: 'Community Helper',
    description: 'Contributed to helping other users in the community.',
    icon: 'https://cdn-icons-png.flaticon.com/512/190/190416.png',
    pointsRequired: 300,
    level: 'gold'
  }
]

export const seedBadges = async () => {
  try {
    await Badge.deleteMany({})
    const inserted = await Badge.insertMany(badges)
    logger.info(`${inserted.length} badges inserted successfully.`)
  } catch (error) {
    logger.error('Error seeding badges:', error)
    process.exit(1)
  }
}