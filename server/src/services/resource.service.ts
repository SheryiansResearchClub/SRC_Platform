import s3Service from '@/integrations/s3Bucket/storage';
import { Resource, ResourceDocument, ResourceType } from '@/models/resource.model';
import { activityLogRepo } from '@/repositories/activity-log.repository';
import { InternalServerError } from '@/utils/errors';

interface ResourceQuery {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginationResult {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

class ResourceService {
  async createResource(resourceData: {
    title: string;
    description: string;
    content: string;
    category: string;
    type: 'tutorial' | 'document' | 'snippet' | 'template';
    tags: string[];
    uploadedBy: string;
    fileUrl?: string;
    githubUrl?: string;
    demoUrl?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: number;
  }): Promise<ResourceDocument> {
    try {
      const resource = await Resource.create(resourceData);

      await activityLogRepo.create({
        action: 'resource_created',
        entityType: 'Resource',
        entityId: String(resource._id || " "),
        user: resourceData.uploadedBy,
        metadata: { title: resource.title, category: resource.category }
      });

      return resource as ResourceDocument;
    } catch (error) {
      throw new InternalServerError('RESOURCE_CREATE_FAILED');
    }
  }

  async getResources(query: ResourceQuery) {
    try {
      const { page = 1, limit = 20, category, type, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;

      let filter: any = {};

      if (category) filter.category = category;
      if (type) filter.type = type;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      const skip = (page - 1) * limit;
      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [resources, totalCount] = await Promise.all([
        Resource.find(filter)
          .populate('uploadedBy', 'name email avatarUrl')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .exec(),
        Resource.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      const pagination: PaginationResult = {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };

      return {
        resources,
        pagination
      };
    } catch (error) {
      throw new InternalServerError('RESOURCES_FETCH_FAILED');
    }
  }

  async getResourceById(resourceId: string): Promise<ResourceDocument | null> {
    try {
      return await Resource.findById(resourceId)
        .populate('uploadedBy', 'name email avatarUrl')
        .exec() as ResourceDocument | null;
    } catch (error) {
      throw new InternalServerError('RESOURCE_FETCH_FAILED');
    }
  }

  async updateResource(resourceId: string, updateData: Partial<ResourceType>): Promise<ResourceDocument | null> {
    try {
      const resource = await Resource.findByIdAndUpdate(resourceId, updateData, { new: true })
        .populate('uploadedBy', 'name email avatarUrl')
        .exec() as ResourceDocument | null;

      // Log activity
      await activityLogRepo.create({
        user: String(resource?.uploader || ""),
        action: 'resource_updated',
        entityType: 'Resource',
        entityId: resourceId,
        metadata: { title: resource?.title }
      });

      return resource;
    } catch (error) {
      throw new InternalServerError('RESOURCE_UPDATE_FAILED');
    }
  }

  async deleteResource(resourceId: string): Promise<void> {
    try {
      const resource = await Resource.findById(resourceId);
      if (!resource) return;

      // Delete associated files from Cloudinary if any
      if (resource.s3?.url) {
        const publicId = resource.s3.url.split('/').pop()?.split('.')[0];
        if (publicId) {
          await s3Service.deleteFile(publicId);
        }
      }

      await Resource.findByIdAndDelete(resourceId);

      // Log activity
      await activityLogRepo.create({
        user: String(resource?.uploader || ""),
        action: 'resource_deleted',
        entityType: 'Resource',
        entityId: resourceId,
        metadata: { title: resource.title }
      });
    } catch (error) {
      throw new InternalServerError('RESOURCE_DELETE_FAILED');
    }
  }

  async getResourceDownloadInfo(resourceId: string): Promise<{
    downloadUrl: string;
    filename: string;
    mimeType: string;
  }> {
    try {
      const resource = await Resource.findById(resourceId);
      if (!resource) {
        throw new InternalServerError('RESOURCE_NOT_FOUND');
      }

      return {
        downloadUrl: resource.url || '',
        filename: resource.title,
        mimeType: 'application/octet-stream'
      };
    } catch (error) {
      throw new InternalServerError('RESOURCE_DOWNLOAD_FAILED');
    }
  }

  async likeResource(resourceId: string, userId: string): Promise<ResourceDocument | null> {
    try {
      const resource = await Resource.findById(resourceId);
      if (!resource) return null;

      // Toggle like
      const likeIndex = resource.likes.indexOf(userId);
      if (likeIndex > -1) {
        resource.likes.pull(userId);
      } else {
        resource.likes.push(userId);
      }

      await resource.save();

      const populatedResource = await Resource.findById(resourceId)
        .populate('uploadedBy', 'name email avatarUrl')
        .exec() as ResourceDocument;

      // Log activity
      await activityLogRepo.create({
        action: 'resource_liked',
        entityType: 'Resource',
        entityId: resourceId,
        user: userId,
        metadata: { title: resource.title, liked: true }
      });

      return populatedResource;
    } catch (error) {
      throw new InternalServerError('RESOURCE_LIKE_FAILED');
    }
  }

  async getCategories(): Promise<Array<{ name: string; count: number }>> {
    try {
      const categories = await Resource.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            _id: 0
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      return categories;
    } catch (error) {
      throw new InternalServerError('CATEGORIES_FETCH_FAILED');
    }
  }
}

export const resourceService = new ResourceService();
