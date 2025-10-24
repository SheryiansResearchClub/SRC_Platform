// import { Schema, model, Types } from 'mongoose';
// import type { HydratedDocument, InferSchemaType } from 'mongoose';
// import { Resource, ResourceDocument, ResourceType } from '../models/resource.model';

// class ResourceRepository {
//   async create(resourceData: {
//     title: string;
//     description: string;
//     uploader: string;
//     category: 'tutorial' | 'document' | 'snippet' | 'reference' | 'tool';
//     storageKey?: string;
//     url?: string;
//     size?: number;
//     mimeType?: string;
//     externalUrl?: string;
//     isExternal?: boolean;
//     tags?: string[];
//     approved?: boolean;
//     approvedBy?: string;
//     featured?: boolean;
//   }): Promise<ResourceDocument> {
//     const resource = await Resource.create(resourceData);
//     return resource as ResourceDocument;
//   }

//   async findById(resourceId: string): Promise<ResourceDocument | null> {
//     return await Resource.findById(resourceId)
//       .populate('uploader', 'name email avatarUrl')
//       .populate('approvedBy', 'name email')
//       .populate('likedBy', 'name email avatarUrl')
//       .exec() as ResourceDocument | null;
//   }

//   async findAll(options: {
//     category?: string;
//     uploader?: string;
//     featured?: boolean;
//     approved?: boolean;
//     search?: string;
//     tags?: string[];
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<ResourceDocument[]> {
//     const {
//       category,
//       uploader,
//       featured,
//       approved = true,
//       search,
//       tags,
//       page = 1,
//       limit = 20,
//       sort = '-createdAt'
//     } = options;

//     const query: any = {};

//     if (category) query.category = category;
//     if (uploader) query.uploader = uploader;
//     if (featured !== undefined) query.featured = featured;
//     if (approved !== undefined) query.approved = approved;
//     if (tags && tags.length > 0) query.tags = { $in: tags };

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { tags: { $regex: search, $options: 'i' } }
//       ];
//     }

//     return await Resource.find(query)
//       .populate('uploader', 'name email avatarUrl')
//       .populate('approvedBy', 'name email')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async findByCategory(category: string, options: {
//     featured?: boolean;
//     approved?: boolean;
//     uploader?: string;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<ResourceDocument[]> {
//     const {
//       featured,
//       approved = true,
//       uploader,
//       page = 1,
//       limit = 20,
//       sort = '-downloads'
//     } = options;

//     const query: any = { category };

//     if (featured !== undefined) query.featured = featured;
//     if (approved !== undefined) query.approved = approved;
//     if (uploader) query.uploader = uploader;

//     return await Resource.find(query)
//       .populate('uploader', 'name email avatarUrl')
//       .populate('approvedBy', 'name email')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async findByUploader(uploaderId: string, options: {
//     category?: string;
//     featured?: boolean;
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<ResourceDocument[]> {
//     const {
//       category,
//       featured,
//       approved,
//       page = 1,
//       limit = 20,
//       sort = '-createdAt'
//     } = options;

//     const query: any = { uploader: uploaderId };

//     if (category) query.category = category;
//     if (featured !== undefined) query.featured = featured;
//     if (approved !== undefined) query.approved = approved;

//     return await Resource.find(query)
//       .populate('approvedBy', 'name email')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async findFeatured(options: {
//     category?: string;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<ResourceDocument[]> {
//     const { category, page = 1, limit = 20, sort = '-downloads' } = options;

//     const query: any = { featured: true, approved: true };

//     if (category) query.category = category;

//     return await Resource.find(query)
//       .populate('uploader', 'name email avatarUrl')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async findPendingApproval(options: {
//     page?: number;
//     limit?: number;
//   } = {}): Promise<ResourceDocument[]> {
//     const { page = 1, limit = 20 } = options;

//     return await Resource.find({ approved: false })
//       .populate('uploader', 'name email avatarUrl')
//       .sort({ createdAt: 1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async update(resourceId: string, updateData: Partial<ResourceType>): Promise<ResourceDocument | null> {
//     return await Resource.findByIdAndUpdate(resourceId, updateData, { new: true })
//       .populate('uploader', 'name email avatarUrl')
//       .populate('approvedBy', 'name email')
//       .exec() as ResourceDocument | null;
//   }

//   async delete(resourceId: string): Promise<void> {
//     await Resource.findByIdAndDelete(resourceId);
//   }

//   async approve(resourceId: string, approvedBy: string): Promise<ResourceDocument | null> {
//     return await Resource.findByIdAndUpdate(
//       resourceId,
//       {
//         approved: true,
//         approvedBy: approvedBy
//       },
//       { new: true }
//     )
//       .populate('uploader', 'name email avatarUrl')
//       .exec() as ResourceDocument | null;
//   }

//   async toggleLike(resourceId: string, userId: string): Promise<ResourceDocument | null> {
//     const resource = await Resource.findById(resourceId);
//     if (!resource) return null;

//     const isLiked = resource.likedBy.some((id: any) => id.toString() === userId);

//     if (isLiked) {
//       // Remove like
//       resource.likedBy = resource.likedBy.filter((id: any) => id.toString() !== userId);
//     } else {
//       // Add like
//       resource.likedBy.push(new Types.ObjectId(userId));
//     }

//     resource.likesCount = resource.likedBy.length;
//     await resource.save();

//     return await this.findById(resourceId);
//   }

//   async incrementDownload(resourceId: string): Promise<ResourceDocument | null> {
//     return await Resource.findByIdAndUpdate(
//       resourceId,
//       { $inc: { downloads: 1 } },
//       { new: true }
//     ) as ResourceDocument | null;
//   }

//   async incrementView(resourceId: string): Promise<ResourceDocument | null> {
//     return await Resource.findByIdAndUpdate(
//       resourceId,
//       { $inc: { views: 1 } },
//       { new: true }
//     ) as ResourceDocument | null;
//   }

//   async findMostDownloaded(options: {
//     category?: string;
//     limit?: number;
//     timeframe?: 'week' | 'month' | 'all';
//   } = {}): Promise<ResourceDocument[]> {
//     const { category, limit = 20, timeframe = 'all' } = options;

//     const query: any = { approved: true };

//     if (category) query.category = category;

//     // Timeframe filtering
//     if (timeframe !== 'all') {
//       const date = new Date();
//       if (timeframe === 'week') {
//         date.setDate(date.getDate() - 7);
//       } else if (timeframe === 'month') {
//         date.setMonth(date.getMonth() - 1);
//       }
//       query.createdAt = { $gte: date };
//     }

//     return await Resource.find(query)
//       .populate('uploader', 'name email avatarUrl')
//       .sort({ downloads: -1 })
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async findMostLiked(options: {
//     category?: string;
//     limit?: number;
//   } = {}): Promise<ResourceDocument[]> {
//     const { category, limit = 20 } = options;

//     const query: any = { approved: true };

//     if (category) query.category = category;

//     return await Resource.find(query)
//       .populate('uploader', 'name email avatarUrl')
//       .sort({ likesCount: -1 })
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async findByTags(tags: string[], options: {
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<ResourceDocument[]> {
//     const { approved = true, page = 1, limit = 20, sort = '-downloads' } = options;

//     return await Resource.find({
//       tags: { $in: tags },
//       approved
//     })
//       .populate('uploader', 'name email avatarUrl')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async findExternalResources(options: {
//     category?: string;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<ResourceDocument[]> {
//     const { category, page = 1, limit = 20 } = options;

//     const query: any = { isExternal: true, approved: true };

//     if (category) query.category = category;

//     return await Resource.find(query)
//       .populate('uploader', 'name email avatarUrl')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async searchResources(query: string, options: {
//     category?: string;
//     uploader?: string;
//     tags?: string[];
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<ResourceDocument[]> {
//     const {
//       category,
//       uploader,
//       tags,
//       approved = true,
//       page = 1,
//       limit = 20
//     } = options;

//     const searchQuery: any = {
//       $or: [
//         { title: { $regex: query, $options: 'i' } },
//         { description: { $regex: query, $options: 'i' } },
//         { tags: { $regex: query, $options: 'i' } }
//       ],
//       approved
//     };

//     if (category) searchQuery.category = category;
//     if (uploader) searchQuery.uploader = uploader;
//     if (tags && tags.length > 0) searchQuery.tags = { $in: tags };

//     return await Resource.find(searchQuery)
//       .populate('uploader', 'name email avatarUrl')
//       .sort({ downloads: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async getResourceStats(): Promise<{
//     total: number;
//     byCategory: Record<string, number>;
//     totalDownloads: number;
//     totalViews: number;
//     featured: number;
//     external: number;
//   }> {
//     const [total, byCategory, totalDownloads, totalViews, featured, external] = await Promise.all([
//       Resource.countDocuments({ approved: true }),
//       this.getCountByCategory(),
//       Resource.aggregate([{ $match: { approved: true } }, { $group: { _id: null, total: { $sum: '$downloads' } } }]),
//       Resource.aggregate([{ $match: { approved: true } }, { $group: { _id: null, total: { $sum: '$views' } } }]),
//       Resource.countDocuments({ featured: true, approved: true }),
//       Resource.countDocuments({ isExternal: true, approved: true })
//     ]);

//     return {
//       total,
//       byCategory,
//       totalDownloads: totalDownloads[0]?.total || 0,
//       totalViews: totalViews[0]?.total || 0,
//       featured,
//       external
//     };
//   }

//   private async getCountByCategory(): Promise<Record<string, number>> {
//     const results = await Resource.aggregate([
//       { $match: { approved: true } },
//       { $group: { _id: '$category', count: { $sum: 1 } } }
//     ]);

//     const byCategory: Record<string, number> = {};
//     results.forEach(result => {
//       byCategory[result._id] = result.count;
//     });

//     return byCategory;
//   }

//   async getUserLikedResources(userId: string, options: {
//     page?: number;
//     limit?: number;
//   } = {}): Promise<ResourceDocument[]> {
//     const { page = 1, limit = 20 } = options;

//     return await Resource.find({
//       likedBy: userId,
//       approved: true
//     })
//       .populate('uploader', 'name email avatarUrl')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async getUserUploadedResources(userId: string, options: {
//     approved?: boolean;
//     featured?: boolean;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<ResourceDocument[]> {
//     const { approved, featured, page = 1, limit = 20 } = options;

//     const query: any = { uploader: userId };

//     if (approved !== undefined) query.approved = approved;
//     if (featured !== undefined) query.featured = featured;

//     return await Resource.find(query)
//       .populate('approvedBy', 'name email')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async getRecentResources(options: {
//     category?: string;
//     limit?: number;
//     days?: number;
//   } = {}): Promise<ResourceDocument[]> {
//     const { category, limit = 20, days = 7 } = options;

//     const query: any = {
//       approved: true,
//       createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
//     };

//     if (category) query.category = category;

//     return await Resource.find(query)
//       .populate('uploader', 'name email avatarUrl')
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .exec() as ResourceDocument[];
//   }

//   async countByCategory(category: string): Promise<number> {
//     return await Resource.countDocuments({ category, approved: true });
//   }

//   async countPendingApproval(): Promise<number> {
//     return await Resource.countDocuments({ approved: false });
//   }
// }

// export const resourceRepo = new ResourceRepository();
