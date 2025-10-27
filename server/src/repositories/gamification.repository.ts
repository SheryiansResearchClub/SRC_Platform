import { Badge } from '@/models/badge.model'
import { User } from '@/models/user.model'
import { InternalServerError } from '@/utils/errors'

class GamificationRepository {
  async getUserPoints(userId: string) {
    try {
      const user = await User.findById(userId).select('gamification.points')
      if (!user) throw new InternalServerError('USER_NOT_FOUND')
      return { totalPoints: user.gamification.points || 0 }
    } catch (error) {
      throw new InternalServerError('USER_POINTS_FETCH_FAILED')
    }
  }

  async createPoints(userId: string, points: number, reason: string) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $inc: { 'gamification.points': points },
        $set: { 'gamification.lastAwardedAt': new Date() }
      },
      { new: true }
    )
  }

  async updateUserPoints(userId: string, points: number) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $inc: { 'gamification.points': points },
        $set: { lastActiveAt: new Date() }
      },
      { new: true }
    )
  }

  async getLeaderboard(filter: Record<string, any>, limit: number) {
    const leaderboard = await User.find(filter)
      .sort({ 'gamification.points': -1 })
      .limit(limit)
      .select('name email avatarUrl gamification.points gamification.badges')

    return leaderboard.map(u => ({
      user: {
        _id: u._id,
        name: u.name,
        email: u.email,
        avatarUrl: u.avatarUrl
      },
      points: u.gamification.points,
      badges: u.gamification.badges.length
    }))
  }

  async getAllBadges() {
    return await Badge.find({}).sort({ pointsRequired: 1 }).exec()
  }

  async getUserBadges(userId: string) {
    const user = await User.findById(userId).populate('gamification.badges')
    return user?.gamification.badges || []
  }

  async findBadgeById(badgeId: string) {
    return await Badge.findById(badgeId)
  }

  async findUserBadge(userId: string, badgeId: string) {
    const user = await User.findOne({
      _id: userId,
      'gamification.badges': badgeId
    })
    return !!user
  }

  async createBadgeAward(userId: string, badgeId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { 'gamification.badges': badgeId } },
      { new: true }
    )
  }
}

export const gamificationRepo = new GamificationRepository()