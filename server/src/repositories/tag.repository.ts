import { Tag, TagDocument, TagType } from '@/models/tag.model';

class TagRepository {
  async create(tagData: {
    name: string;
    slug: string;
    description?: string;
    type?: 'project' | 'task' | 'resource' | 'general';
    color?: string;
    createdBy?: string;
  }): Promise<TagDocument> {
    const tag = await Tag.create(tagData);
    return tag as TagDocument;
  }

  async findById(tagId: string): Promise<TagDocument | null> {
    return await Tag.findById(tagId)
      .populate('createdBy', 'name email avatarUrl')
      .exec() as TagDocument | null;
  }

  async findBySlug(slug: string): Promise<TagDocument | null> {
    return await Tag.findOne({ slug })
      .populate('createdBy', 'name email avatarUrl')
      .exec() as TagDocument | null;
  }

  async findAll(options: {
    type?: string;
    search?: string;
    sortBy?: 'name' | 'usageCount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}): Promise<{
    tags: TagDocument[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const {
      type,
      search,
      sortBy = 'usageCount',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = options;

    const query: any = {};
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOption: any = {};
    sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [tags, totalCount] = await Promise.all([
      Tag.find(query)
        .populate('createdBy', 'name email avatarUrl')
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      Tag.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };

    return { tags, pagination };
  }


  async findByType(type: 'project' | 'task' | 'resource' | 'general', options: {
    minUsageCount?: number;
    limit?: number;
    sort?: string;
  } = {}): Promise<TagDocument[]> {
    const { minUsageCount = 0, limit = 50, sort = '-usageCount' } = options;

    return await Tag.find({
      type,
      usageCount: { $gte: minUsageCount }
    })
      .sort(sort)
      .limit(limit)
      .exec() as TagDocument[];
  }

  async findPopular(options: {
    type?: string;
    limit?: number;
    minUsageCount?: number;
  } = {}): Promise<TagDocument[]> {
    const { type, limit = 20, minUsageCount = 1 } = options;

    const query: any = { usageCount: { $gte: minUsageCount } };
    if (type) query.type = type;

    return await Tag.find(query)
      .sort({ usageCount: -1 })
      .limit(limit)
      .exec() as TagDocument[];
  }

  async findProjectTypeTags(): Promise<TagDocument[]> {
    return await Tag.find({
      type: 'project',
      usageCount: { $gt: 0 }
    })
      .sort({ usageCount: -1 })
      .exec() as TagDocument[];
  }

  async update(tagId: string, updateData: Partial<TagType>): Promise<TagDocument | null> {
    return await Tag.findByIdAndUpdate(tagId, updateData, { new: true })
      .populate('createdBy', 'name email avatarUrl')
      .exec() as TagDocument | null;
  }

  async delete(tagId: string): Promise<void> {
    await Tag.findByIdAndDelete(tagId);
  }

  async incrementUsage(tagId: string): Promise<TagDocument | null> {
    return await Tag.findByIdAndUpdate(
      tagId,
      { $inc: { usageCount: 1 } },
      { new: true }
    ) as TagDocument | null;
  }

  async decrementUsage(tagId: string): Promise<TagDocument | null> {
    return await Tag.findByIdAndUpdate(
      tagId,
      { $inc: { usageCount: -1 } },
      { new: true }
    ) as TagDocument | null;
  }

  async updateUsageCount(tagId: string, count: number): Promise<TagDocument | null> {
    return await Tag.findByIdAndUpdate(
      tagId,
      { usageCount: Math.max(0, count) },
      { new: true }
    ) as TagDocument | null;
  }

  async findByName(name: string): Promise<TagDocument | null> {
    return await Tag.findOne({ name })
      .populate('createdBy', 'name email avatarUrl')
      .exec() as TagDocument | null;
  }

  async findSimilar(name: string, options: {
    type?: string;
    limit?: number;
  } = {}): Promise<TagDocument[]> {
    const { type, limit = 10 } = options;

    const regex = new RegExp(name.split('').join('.*'), 'i');
    const query: any = {
      name: { $regex: regex }
    };

    if (type) query.type = type;

    return await Tag.find(query)
      .sort({ usageCount: -1 })
      .limit(limit)
      .exec() as TagDocument[];
  }

  async searchTags(query: string, options: {
    type?: string;
    limit?: number;
    minUsageCount?: number;
  } = {}): Promise<TagDocument[]> {
    const { type, limit = 20, minUsageCount = 0 } = options;

    const searchQuery: any = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      usageCount: { $gte: minUsageCount }
    };

    if (type) searchQuery.type = type;

    return await Tag.find(searchQuery)
      .sort({ usageCount: -1 })
      .limit(limit)
      .exec() as TagDocument[];
  }

  async getTagStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    mostUsed: TagDocument[];
    recentlyCreated: TagDocument[];
  }> {
    const [total, byType, mostUsed, recentlyCreated] = await Promise.all([
      Tag.countDocuments(),
      this.getCountByType(),
      Tag.find().sort({ usageCount: -1 }).limit(10).exec() as Promise<TagDocument[]>,
      Tag.find().sort({ createdAt: -1 }).limit(10).exec() as Promise<TagDocument[]>
    ]);

    return {
      total,
      byType,
      mostUsed,
      recentlyCreated
    };
  }

  private async getCountByType(): Promise<Record<string, number>> {
    const results = await Tag.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const byType: Record<string, number> = {};
    results.forEach(result => {
      byType[result._id] = result.count;
    });

    return byType;
  }

  async getTagsByUsage(minUsageCount: number = 1): Promise<TagDocument[]> {
    return await Tag.find({ usageCount: { $gte: minUsageCount } })
      .sort({ usageCount: -1 })
      .exec() as TagDocument[];
  }

  async findUnusedTags(daysSinceCreated: number = 30): Promise<TagDocument[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceCreated);

    return await Tag.find({
      usageCount: 0,
      createdAt: { $lt: cutoffDate }
    })
      .sort({ createdAt: 1 })
      .exec() as TagDocument[];
  }

  async bulkIncrementUsage(tagIds: string[]): Promise<void> {
    await Tag.updateMany(
      { _id: { $in: tagIds } },
      { $inc: { usageCount: 1 } }
    );
  }

  async bulkCreate(tags: Array<{
    name: string;
    slug: string;
    description?: string;
    type?: 'project' | 'task' | 'resource' | 'general';
    color?: string;
    createdBy?: string;
  }>): Promise<TagDocument[]> {
    const createdTags = await Tag.insertMany(tags);
    return createdTags as TagDocument[];
  }

  async generateSlug(name: string): Promise<string> {
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let counter = 1;
    let originalSlug = slug;

    while (await Tag.exists({ slug })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async getAutocompleteSuggestions(query: string, options: {
    type?: string;
    limit?: number;
  } = {}): Promise<TagDocument[]> {
    const { type, limit = 10 } = options;

    const searchQuery: any = {
      name: { $regex: `^${query}`, $options: 'i' }
    };

    if (type) searchQuery.type = type;

    return await Tag.find(searchQuery)
      .sort({ usageCount: -1 })
      .limit(limit)
      .exec() as TagDocument[];
  }

  async getTrendingTags(days: number = 7, options: {
    type?: string;
    limit?: number;
  } = {}): Promise<TagDocument[]> {
    const { type, limit = 10 } = options;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const query: any = {
      createdAt: { $gte: cutoffDate }
    };

    if (type) query.type = type;

    return await Tag.find(query)
      .sort({ usageCount: -1 })
      .limit(limit)
      .exec() as TagDocument[];
  }
}

export const tagRepo = new TagRepository();
