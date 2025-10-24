// import { Preview, PreviewDocument, PreviewType } from '@/models/preview.model';

// class PreviewRepository {
//   async create(previewData: {
//     project: string;
//     type: 'figma' | 'website' | 'media';
//     figma?: {
//       url?: string;
//       fileKey?: string;
//       meta?: any;
//       thumbnailUrl?: string;
//     };
//     website?: {
//       url?: string;
//       screenshotUrl?: string;
//       isLive?: boolean;
//     };
//     media?: Array<{
//       storageKey?: string;
//       url?: string;
//       mimeType?: string;
//       caption?: string;
//       uploadedBy: string;
//       thumbnailUrl?: string;
//       order?: number;
//     }>;
//     uploadedBy: string;
//     notes?: string;
//     approved?: boolean;
//   }): Promise<PreviewDocument> {
//     const preview = await Preview.create(previewData);
//     return preview as PreviewDocument;
//   }

//   async findById(previewId: string): Promise<PreviewDocument | null> {
//     return await Preview.findById(previewId)
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('media.uploadedBy', 'name email avatarUrl')
//       .exec() as PreviewDocument | null;
//   }

//   async findByProject(projectId: string, options: {
//     type?: string;
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<PreviewDocument[]> {
//     const {
//       type,
//       approved,
//       page = 1,
//       limit = 20,
//       sort = '-createdAt'
//     } = options;

//     const query: any = { project: projectId };

//     if (type) query.type = type;
//     if (approved !== undefined) query.approved = approved;

//     return await Preview.find(query)
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('media.uploadedBy', 'name email avatarUrl')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as PreviewDocument[];
//   }

//   async findByType(type: 'figma' | 'website' | 'media', options: {
//     projectId?: string;
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<PreviewDocument[]> {
//     const {
//       projectId,
//       approved,
//       page = 1,
//       limit = 20,
//       sort = '-createdAt'
//     } = options;

//     const query: any = { type };

//     if (projectId) query.project = projectId;
//     if (approved !== undefined) query.approved = approved;

//     return await Preview.find(query)
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('media.uploadedBy', 'name email avatarUrl')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as PreviewDocument[];
//   }

//   async findAll(options: {
//     type?: string;
//     projectId?: string;
//     approved?: boolean;
//     search?: string;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<PreviewDocument[]> {
//     const {
//       type,
//       projectId,
//       approved,
//       search,
//       page = 1,
//       limit = 20,
//       sort = '-createdAt'
//     } = options;

//     const query: any = {};

//     if (type) query.type = type;
//     if (projectId) query.project = projectId;
//     if (approved !== undefined) query.approved = approved;

//     if (search) {
//       query.$or = [
//         { notes: { $regex: search, $options: 'i' } },
//         { 'figma.url': { $regex: search, $options: 'i' } },
//         { 'website.url': { $regex: search, $options: 'i' } },
//         { 'media.caption': { $regex: search, $options: 'i' } }
//       ];
//     }

//     return await Preview.find(query)
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('media.uploadedBy', 'name email avatarUrl')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as PreviewDocument[];
//   }

//   async update(previewId: string, updateData: Partial<PreviewType>): Promise<PreviewDocument | null> {
//     return await Preview.findByIdAndUpdate(previewId, updateData, { new: true })
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('media.uploadedBy', 'name email avatarUrl')
//       .exec() as PreviewDocument | null;
//   }

//   async delete(previewId: string): Promise<void> {
//     await Preview.findByIdAndDelete(previewId);
//   }

//   async addMedia(previewId: string, mediaData: {
//     storageKey?: string;
//     url?: string;
//     mimeType?: string;
//     caption?: string;
//     uploadedBy: string;
//     thumbnailUrl?: string;
//     order?: number;
//   }): Promise<PreviewDocument | null> {
//     const preview = await Preview.findById(previewId);
//     if (!preview) return null;

//     preview.media.push({
//       ...mediaData,
//       order: mediaData.order || preview.media.length
//     });

//     await preview.save();
//     return await this.findById(previewId);
//   }

//   async removeMedia(previewId: string, mediaIndex: number): Promise<PreviewDocument | null> {
//     const preview = await Preview.findById(previewId);
//     if (!preview || !preview.media[mediaIndex]) return null;

//     preview.media.splice(mediaIndex, 1);
//     await preview.save();
//     return await this.findById(previewId);
//   }

//   async updateMediaOrder(previewId: string, mediaOrders: Array<{ index: number; order: number }>): Promise<PreviewDocument | null> {
//     const preview = await Preview.findById(previewId);
//     if (!preview) return null;

//     mediaOrders.forEach(({ index, order }) => {
//       if (preview.media[index]) {
//         preview.media[index].order = order;
//       }
//     });

//     await preview.save();
//     return await this.findById(previewId);
//   }

//   async updateFigmaData(previewId: string, figmaData: {
//     url?: string;
//     fileKey?: string;
//     meta?: any;
//     thumbnailUrl?: string;
//   }): Promise<PreviewDocument | null> {
//     return await Preview.findByIdAndUpdate(
//       previewId,
//       { figma: figmaData },
//       { new: true }
//     )
//       .populate('project', 'title status')
//       .exec() as PreviewDocument | null;
//   }

//   async updateWebsiteData(previewId: string, websiteData: {
//     url?: string;
//     screenshotUrl?: string;
//     isLive?: boolean;
//   }): Promise<PreviewDocument | null> {
//     return await Preview.findByIdAndUpdate(
//       previewId,
//       { website: websiteData },
//       { new: true }
//     )
//       .populate('project', 'title status')
//       .exec() as PreviewDocument | null;
//   }

//   async incrementViewCount(previewId: string): Promise<PreviewDocument | null> {
//     return await Preview.findByIdAndUpdate(
//       previewId,
//       { $inc: { viewCount: 1 } },
//       { new: true }
//     ) as PreviewDocument | null;
//   }

//   async findMostViewed(options: {
//     type?: string;
//     limit?: number;
//     days?: number;
//   } = {}): Promise<PreviewDocument[]> {
//     const { type, limit = 10, days } = options;

//     const query: any = { approved: true };

//     if (type) query.type = type;

//     if (days) {
//       const cutoffDate = new Date();
//       cutoffDate.setDate(cutoffDate.getDate() - days);
//       query.createdAt = { $gte: cutoffDate };
//     }

//     return await Preview.find(query)
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .sort({ viewCount: -1 })
//       .limit(limit)
//       .exec() as PreviewDocument[];
//   }

//   async findRecent(options: {
//     type?: string;
//     projectId?: string;
//     limit?: number;
//     days?: number;
//   } = {}): Promise<PreviewDocument[]> {
//     const { type, projectId, limit = 20, days = 7 } = options;

//     const query: any = {
//       approved: true,
//       createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
//     };

//     if (type) query.type = type;
//     if (projectId) query.project = projectId;

//     return await Preview.find(query)
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .exec() as PreviewDocument[];
//   }

//   async searchPreviews(query: string, options: {
//     type?: string;
//     projectId?: string;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<PreviewDocument[]> {
//     const {
//       type,
//       projectId,
//       page = 1,
//       limit = 20
//     } = options;

//     const searchQuery: any = {
//       $or: [
//         { notes: { $regex: query, $options: 'i' } },
//         { 'figma.url': { $regex: query, $options: 'i' } },
//         { 'website.url': { $regex: query, $options: 'i' } },
//         { 'media.caption': { $regex: query, $options: 'i' } }
//       ],
//       approved: true
//     };

//     if (type) searchQuery.type = type;
//     if (projectId) searchQuery.project = projectId;

//     return await Preview.find(searchQuery)
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as PreviewDocument[];
//   }

//   async getPreviewStats(): Promise<{
//     total: number;
//     byType: Record<string, number>;
//     totalViews: number;
//     averageViews: number;
//     mostViewed: PreviewDocument[];
//   }> {
//     const [total, byType, totalViews, mostViewed] = await Promise.all([
//       Preview.countDocuments({ approved: true }),
//       this.getCountByType(),
//       Preview.aggregate([
//         { $match: { approved: true } },
//         { $group: { _id: null, total: { $sum: '$viewCount' } } }
//       ]),
//       Preview.find({ approved: true })
//         .populate('project', 'title status')
//         .populate('uploadedBy', 'name email avatarUrl')
//         .sort({ viewCount: -1 })
//         .limit(5)
//         .exec() as Promise<PreviewDocument[]>
//     ]);

//     const averageViews = total > 0 ? Math.round((totalViews[0]?.total || 0) / total) : 0;

//     return {
//       total,
//       byType,
//       totalViews: totalViews[0]?.total || 0,
//       averageViews,
//       mostViewed
//     };
//   }

//   private async getCountByType(): Promise<Record<string, number>> {
//     const results = await Preview.aggregate([
//       { $match: { approved: true } },
//       { $group: { _id: '$type', count: { $sum: 1 } } }
//     ]);

//     const byType: Record<string, number> = {};
//     results.forEach(result => {
//       byType[result._id] = result.count;
//     });

//     return byType;
//   }

//   async countByProject(projectId: string): Promise<number> {
//     return await Preview.countDocuments({ project: projectId, approved: true });
//   }

//   async countByType(type: string): Promise<number> {
//     return await Preview.countDocuments({ type, approved: true });
//   }

//   async findByUploader(uploaderId: string, options: {
//     type?: string;
//     projectId?: string;
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<PreviewDocument[]> {
//     const {
//       type,
//       projectId,
//       approved,
//       page = 1,
//       limit = 20,
//       sort = '-createdAt'
//     } = options;

//     const query: any = { uploadedBy: uploaderId };

//     if (type) query.type = type;
//     if (projectId) query.project = projectId;
//     if (approved !== undefined) query.approved = approved;

//     return await Preview.find(query)
//       .populate('project', 'title status')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as PreviewDocument[];
//   }

//   async getFigmaPreviews(options: {
//     projectId?: string;
//     limit?: number;
//   } = {}): Promise<PreviewDocument[]> {
//     const { projectId, limit = 20 } = options;

//     const query: any = { type: 'figma', approved: true };

//     if (projectId) query.project = projectId;

//     return await Preview.find(query)
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .exec() as PreviewDocument[];
//   }

//   async getWebsitePreviews(options: {
//     projectId?: string;
//     limit?: number;
//   } = {}): Promise<PreviewDocument[]> {
//     const { projectId, limit = 20 } = options;

//     const query: any = { type: 'website', approved: true };

//     if (projectId) query.project = projectId;

//     return await Preview.find(query)
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .exec() as PreviewDocument[];
//   }

//   async getMediaPreviews(options: {
//     projectId?: string;
//     limit?: number;
//   } = {}): Promise<PreviewDocument[]> {
//     const { projectId, limit = 20 } = options;

//     const query: any = { type: 'media', approved: true };

//     if (projectId) query.project = projectId;

//     return await Preview.find(query)
//       .populate('project', 'title status')
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('media.uploadedBy', 'name email avatarUrl')
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .exec() as PreviewDocument[];
//   }
// }

// export const previewRepo = new PreviewRepository();
