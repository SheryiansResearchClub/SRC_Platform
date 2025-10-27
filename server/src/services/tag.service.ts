// import { Tag, TagDocument, TagType } from '@/models/tag.model';
// import { activityLogRepo } from '@/repositories/activity-log.repository';
// import { AppError } from '@/utils/errors';

// interface TagQuery {
//   page?: number;
//   limit?: number;
//   type?: string;
//   search?: string;
//   sortBy?: string;
//   sortOrder?: 'asc' | 'desc';
// }

// interface PaginationResult {
//   currentPage: number;
//   totalPages: number;
//   totalCount: number;
//   hasNext: boolean;
//   hasPrev: boolean;
// }

// class TagService {
//   async createTag(tagData: {
//     name: string;
//     description?: string;
//     color?: string;
//     type?: 'project' | 'task' | 'general';
//     createdBy: string;
//   }): Promise<TagDocument> {
//     try {
//       // Check if tag already exists
//       const existingTag = await Tag.findOne({ name: tagData.name });
//       if (existingTag) {
//         throw new AppError('TAG_ALREADY_EXISTS', 'Tag with this name already exists', 400);
//       }

//       const tag = await Tag.create(tagData);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'tag_created',
//         entityType: 'Tag',
//         entityId: tag._id,
//         user: tagData.createdBy,
//         metadata: { tagName: tag.name }
//       });

//       return tag as TagDocument;
//     } catch (error) {
//       throw new AppError('TAG_CREATE_FAILED', 'Failed to create tag', 500);
//     }
//   }

//   async getTags(query: TagQuery) {
//     try {
//       const { page = 1, limit = 20, type, search, sortBy = 'name', sortOrder = 'asc' } = query;

//       let filter: any = {};

//       if (type) filter.type = type;
//       if (search) {
//         filter.$or = [
//           { name: { $regex: search, $options: 'i' } },
//           { description: { $regex: search, $options: 'i' } }
//         ];
//       }

//       const skip = (page - 1) * limit;
//       const sortOptions: any = {};
//       sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

//       const [tags, totalCount] = await Promise.all([
//         Tag.find(filter)
//           .populate('createdBy', 'name email avatarUrl')
//           .sort(sortOptions)
//           .skip(skip)
//           .limit(limit)
//           .exec(),
//         Tag.countDocuments(filter)
//       ]);

//       const totalPages = Math.ceil(totalCount / limit);
//       const pagination: PaginationResult = {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       };

//       return {
//         tags,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('TAGS_FETCH_FAILED', 'Failed to fetch tags', 500);
//     }
//   }

//   async getTagById(tagId: string): Promise<TagDocument | null> {
//     try {
//       return await Tag.findById(tagId)
//         .populate('createdBy', 'name email avatarUrl')
//         .exec() as TagDocument | null;
//     } catch (error) {
//       throw new AppError('TAG_FETCH_FAILED', 'Failed to fetch tag', 500);
//     }
//   }

//   async updateTag(tagId: string, updateData: Partial<TagType>): Promise<TagDocument | null> {
//     try {
//       const tag = await Tag.findByIdAndUpdate(tagId, updateData, { new: true })
//         .populate('createdBy', 'name email avatarUrl')
//         .exec() as TagDocument | null;

//       // Log activity
//       await activityLogRepo.create({
//         action: 'tag_updated',
//         entityType: 'Tag',
//         entityId: tagId,
//         metadata: { tagName: tag?.name }
//       });

//       return tag;
//     } catch (error) {
//       throw new AppError('TAG_UPDATE_FAILED', 'Failed to update tag', 500);
//     }
//   }

//   async deleteTag(tagId: string): Promise<void> {
//     try {
//       const tag = await Tag.findById(tagId);
//       if (!tag) return;

//       await Tag.findByIdAndDelete(tagId);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'tag_deleted',
//         entityType: 'Tag',
//         entityId: tagId,
//         metadata: { tagName: tag.name }
//       });
//     } catch (error) {
//       throw new AppError('TAG_DELETE_FAILED', 'Failed to delete tag', 500);
//     }
//   }

//   async getProjectTypeTags(): Promise<Array<{
//     _id: string;
//     name: string;
//     description?: string;
//     color?: string;
//     usageCount: number;
//   }>> {
//     try {
//       const projectTypes = [
//         { name: 'Web Development', description: 'Websites and web applications', color: '#3B82F6' },
//         { name: 'Mobile Development', description: 'iOS and Android applications', color: '#10B981' },
//         { name: 'Desktop Application', description: 'Windows, macOS, and Linux apps', color: '#F59E0B' },
//         { name: 'Artificial Intelligence', description: 'Machine learning and AI projects', color: '#8B5CF6' },
//         { name: 'Electronics', description: 'Hardware and IoT projects', color: '#EF4444' },
//         { name: 'Game Development', description: 'Games and interactive applications', color: '#EC4899' },
//         { name: 'Data Science', description: 'Data analysis and visualization', color: '#06B6D4' },
//         { name: 'DevOps', description: 'Infrastructure and deployment', color: '#84CC16' },
//         { name: 'Design', description: 'UI/UX and graphic design', color: '#F97316' },
//         { name: 'Other', description: 'Miscellaneous projects', color: '#6B7280' }
//       ];

//       // Get usage counts for each type
//       const tagsWithCounts = await Promise.all(
//         projectTypes.map(async (type) => {
//           const count = await Tag.countDocuments({
//             name: type.name,
//             type: 'project'
//           });
//           return {
//             _id: type.name.toLowerCase().replace(/\s+/g, '-'),
//             name: type.name,
//             description: type.description,
//             color: type.color,
//             usageCount: count
//           };
//         })
//       );

//       return tagsWithCounts;
//     } catch (error) {
//       throw new AppError('PROJECT_TYPE_TAGS_FETCH_FAILED', 'Failed to fetch project type tags', 500);
//     }
//   }
// }

// export const tagService = new TagService();
