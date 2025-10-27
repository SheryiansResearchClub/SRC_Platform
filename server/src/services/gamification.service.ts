import { gamificationRepo } from '@/repositories/gamification.repository'
import { activityLogRepo } from '@/repositories/activity-log.repository'
import { NotFoundError } from '@/utils/errors'
import { userRepo } from '@/repositories'
import { Badge } from '@/models/badge.model'

class GamificationService {
  async getUserPoints(userId: string) {
    const userPoints = await gamificationRepo.getUserPoints(userId)
    if (!userPoints) throw new NotFoundError('USER_POINTS_NOT_FOUND')
    return userPoints
  }

  async awardPoints(userId: string, points: number, reason: string) {
    const userExists = await userRepo.findById(userId)
    if (!userExists) throw new NotFoundError('USER_NOT_FOUND')

    await gamificationRepo.createPoints(userId, points, reason)
    await gamificationRepo.updateUserPoints(userId, points)

    const userPoints = await this.getUserPoints(userId)
    await this.checkBadgeAchievements(userId)

    await activityLogRepo.create({
      action: 'points_awarded',
      entityType: 'Gamification',
      entityId: userId,
      user: userId,
      metadata: { points, reason, totalPoints: userPoints.totalPoints }
    })

    return { success: true, totalPoints: userPoints.totalPoints }
  }

  async getLeaderboard(period = 'all', limit = 10) {
    let dateFilter: Record<string, any> = {}
    const now = new Date()

    if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } }
    } else if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } }
    }

    const leaderboard = await gamificationRepo.getLeaderboard(dateFilter, limit)
    return leaderboard.map((entry, index) => ({ ...entry, rank: index + 1 }))
  }

  async getAllBadges() {
    const badges = await gamificationRepo.getAllBadges()
    return badges || []
  }

  async getUserBadges(userId: string) {
    const badges = await gamificationRepo.getUserBadges(userId)
    if (!badges) return []

    return badges.map(b => ({
      _id: (b as any)._id,
      name: (b as any).name,
      description: (b as any).description,
      icon: (b as any).icon,
      pointsRequired: (b as any).pointsRequired,
      level: (b as any).level
    }))
  }

  async awardBadge(userId: string, badgeId: string) {
    const existingBadge = await gamificationRepo.findUserBadge(userId, badgeId)
    if (existingBadge) throw new NotFoundError('BADGE_ALREADY_AWARDED')

    const badge = await gamificationRepo.findBadgeById(badgeId)
    if (!badge) throw new NotFoundError('BADGE_NOT_FOUND')

    await gamificationRepo.createBadgeAward(userId, badgeId)
    await this.awardPoints(userId, badge.pointsRequired, `Badge: ${badge.name}`)

    await activityLogRepo.create({
      action: 'badge_awarded',
      entityType: 'Gamification',
      entityId: userId,
      user: userId,
      metadata: { badgeName: badge.name, points: badge.pointsRequired }
    })

    return {
      _id: String(badge._id),
      name: badge.name,
      description: badge.description,
      level: badge.level,
      pointsRequired: badge.pointsRequired,
      icon: badge.icon
    }
  }

  async getUserAchievements(userId: string) {
    const badges = await this.getUserBadges(userId)
    return badges.map(b => ({
      type: 'badge',
      title: b.name,
      description: b.description,
      points: b.pointsRequired,
      level: b.level,
      icon: b.icon,
      earnedAt: new Date()
    }))
  }

  private async checkBadgeAchievements(userId: string) {
    try {
      const userPoints = await this.getUserPoints(userId)
      const userBadges = await this.getUserBadges(userId)
      const allBadges = await Badge.find({}).sort({ pointsRequired: 1 })

      for (const badge of allBadges) {
        const hasBadge = userBadges.some(b => b.name === badge.name)
        if (!hasBadge && userPoints.totalPoints >= badge.pointsRequired) {
          await this.awardBadge(userId, String(badge._id))
        }
      }
    } catch (error) {
      console.error('Badge check failed:', error)
    }
  }
}

export const gamificationService = new GamificationService();