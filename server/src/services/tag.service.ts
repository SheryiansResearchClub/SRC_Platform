import { tagRepo } from '@/repositories/tag.repository';
import { activityLogRepo } from '@/repositories/activity-log.repository';
import { InternalServerError, NotFoundError } from '@/utils/errors';
import type { TagDocument, TagType } from '@/models/tag.model';

interface TagQuery {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  sortBy?: 'name' | 'usageCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

class TagService {
  async createTag(tagData: {
    name: string;
    description?: string;
    color?: string;
    type?: 'project' | 'task' | 'general';
    createdBy: string;
  }): Promise<TagDocument> {
    try {
      const existingTag = await tagRepo.findByName(tagData.name);
      if (existingTag) {
        throw new NotFoundError('TAG_ALREADY_EXISTS');
      }

      const slug = await tagRepo.generateSlug(tagData.name);
      const tag = await tagRepo.create({ ...tagData, slug });

      await activityLogRepo.create({
        user: String(tagData.createdBy || ''),
        action: 'tag_created',
        entityType: 'Tag',
        entityId: String(tag._id || ''),
        metadata: { tagName: tag.name }
      });

      return tag;
    } catch (error) {
      throw new InternalServerError('TAG_CREATE_FAILED');
    }
  }

  async getTags(query: TagQuery) {
    try {
      return await tagRepo.findAll({
        type: query.type,
        search: query.search,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        page: query.page,
        limit: query.limit
      });
    } catch (error) {
      throw new InternalServerError('TAGS_FETCH_FAILED');
    }
  }

  async getTagById(tagId: string): Promise<TagDocument | null> {
    try {
      return await tagRepo.findById(tagId);
    } catch (error) {
      throw new InternalServerError('TAG_FETCH_FAILED');
    }
  }

  async updateTag(tagId: string, updateData: Partial<TagType>): Promise<TagDocument | null> {
    try {
      const tag = await tagRepo.update(tagId, updateData);
      if (!tag) return null;

      await activityLogRepo.create({
        user: String(tag.createdBy?._id || ''),
        action: 'tag_updated',
        entityType: 'Tag',
        entityId: tagId,
        metadata: { tagName: tag.name }
      });

      return tag;
    } catch (error) {
      throw new InternalServerError('TAG_UPDATE_FAILED');
    }
  }

  async deleteTag(tagId: string): Promise<void> {
    try {
      const tag = await tagRepo.findById(tagId);
      if (!tag) return;

      await tagRepo.delete(tagId);

      await activityLogRepo.create({
        user: String(tag.createdBy?._id || ''),
        action: 'tag_deleted',
        entityType: 'Tag',
        entityId: tagId,
        metadata: { tagName: tag.name }
      });
    } catch (error) {
      throw new InternalServerError('TAG_DELETE_FAILED');
    }
  }

  async getProjectTypeTags(): Promise<Array<{
    _id: string;
    name: string;
    description?: string;
    color?: string;
    usageCount: number;
  }>> {
    try {
      const projectTypes = [
        { name: 'Web Development', description: 'Websites and web applications', color: '#3B82F6' },
        { name: 'Mobile Development', description: 'iOS and Android applications', color: '#10B981' },
        { name: 'Desktop Application', description: 'Windows, macOS, and Linux apps', color: '#F59E0B' },
        { name: 'Artificial Intelligence', description: 'Machine learning and AI projects', color: '#8B5CF6' },
        { name: 'Electronics', description: 'Hardware and IoT projects', color: '#EF4444' },
        { name: 'Game Development', description: 'Games and interactive applications', color: '#EC4899' },
        { name: 'Data Science', description: 'Data analysis and visualization', color: '#06B6D4' },
        { name: 'DevOps', description: 'Infrastructure and deployment', color: '#84CC16' },
        { name: 'Design', description: 'UI/UX and graphic design', color: '#F97316' },
        { name: 'Other', description: 'Miscellaneous projects', color: '#6B7280' }
      ];

      const tagsWithCounts = await Promise.all(
        projectTypes.map(async (type) => {
          const existingTag = await tagRepo.findByName(type.name);
          return {
            _id: type.name.toLowerCase().replace(/\s+/g, '-'),
            name: type.name,
            description: type.description,
            color: type.color,
            usageCount: existingTag?.usageCount || 0
          };
        })
      );

      return tagsWithCounts;
    } catch (error) {
      throw new InternalServerError('PROJECT_TYPE_TAGS_FETCH_FAILED');
    }
  }
}

export const tagService = new TagService();