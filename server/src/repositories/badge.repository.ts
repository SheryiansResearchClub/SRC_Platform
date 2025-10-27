import { Badge } from '@/models/badge.model';

class BadgeRepository {
  async findByIds(badgeIds: string[]): Promise<any[]> {
    return await Badge.find({
      _id: { $in: badgeIds },
      isActive: true
    }).sort({ points: -1 }).exec();
  }

  async findAll(): Promise<any[]> {
    return await Badge.find({ isActive: true })
      .sort({ category: 1, points: -1 })
      .exec();
  }

  async findByCategory(category: string): Promise<any[]> {
    return await Badge.find({
      category,
      isActive: true
    }).sort({ points: -1 }).exec();
  }
}

export const badgeRepo = new BadgeRepository();
