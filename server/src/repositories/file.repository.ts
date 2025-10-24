// import { File, FileDocument, FileType } from '@/models/file.model';

// class FileRepository {
//   async create(fileData: {
//     name: string;
//     storageKey: string;
//     url: string;
//     mimeType: string;
//     size: number;
//     category: 'document' | 'image' | 'video' | 'code' | 'other';
//     project: string;
//     uploadedBy: string;
//     approved?: boolean;
//     approvedBy?: string;
//     version?: number;
//     versions?: Array<{
//       versionNumber: number;
//       storageKey: string;
//       url: string;
//       uploadedBy: string;
//       uploadedAt: Date;
//       changelog?: string;
//       size: number;
//     }>;
//     scanStatus?: 'pending' | 'clean' | 'infected' | 'failed';
//   }): Promise<FileDocument> {
//     const file = await File.create(fileData);
//     return file as FileDocument;
//   }

//   async findById(fileId: string): Promise<FileDocument | null> {
//     return await File.findById(fileId)
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('approvedBy', 'name email')
//       .populate('deletedBy', 'name email')
//       .populate('versions.uploadedBy', 'name email')
//       .exec() as FileDocument | null;
//   }

//   async findByProject(projectId: string, options: {
//     category?: string;
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<FileDocument[]> {
//     const { category, approved = true, page = 1, limit = 20, sort = '-createdAt' } = options;
//     const query: any = { project: projectId };

//     if (category) query.category = category;
//     if (approved !== undefined) query.approved = approved;

//     return await File.find(query)
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('approvedBy', 'name email')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as FileDocument[];
//   }

//   async findByUploader(uploaderId: string, options: {
//     projectId?: string;
//     category?: string;
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<FileDocument[]> {
//     const { projectId, category, approved, page = 1, limit = 20, sort = '-createdAt' } = options;
//     const query: any = { uploadedBy: uploaderId };

//     if (projectId) query.project = projectId;
//     if (category) query.category = category;
//     if (approved !== undefined) query.approved = approved;

//     return await File.find(query)
//       .populate('project', 'title status')
//       .populate('approvedBy', 'name email')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as FileDocument[];
//   }

//   async findPendingApproval(options: {
//     page?: number;
//     limit?: number;
//   } = {}): Promise<FileDocument[]> {
//     const { page = 1, limit = 20 } = options;

//     return await File.find({ approved: false })
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('project', 'title status')
//       .sort({ createdAt: 1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as FileDocument[];
//   }

//   async update(fileId: string, updateData: Partial<FileType>): Promise<FileDocument | null> {
//     return await File.findByIdAndUpdate(fileId, updateData, { new: true })
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('approvedBy', 'name email')
//       .exec() as FileDocument | null;
//   }

//   async delete(fileId: string): Promise<void> {
//     await File.findByIdAndDelete(fileId);
//   }

//   async softDelete(fileId: string, deletedBy: string): Promise<FileDocument | null> {
//     return await File.findByIdAndUpdate(
//       fileId,
//       {
//         deletedAt: new Date(),
//         deletedBy: deletedBy,
//         approved: false
//       },
//       { new: true }
//     ) as FileDocument | null;
//   }

//   async approve(fileId: string, approvedBy: string): Promise<FileDocument | null> {
//     return await File.findByIdAndUpdate(
//       fileId,
//       {
//         approved: true,
//         approvedBy: approvedBy,
//         approvedAt: new Date()
//       },
//       { new: true }
//     )
//       .populate('uploadedBy', 'name email avatarUrl')
//       .exec() as FileDocument | null;
//   }

//   async createVersion(fileId: string, versionData: {
//     versionNumber: number;
//     storageKey: string;
//     url: string;
//     uploadedBy: string;
//     changelog?: string;
//     size: number;
//   }): Promise<FileDocument | null> {
//     const file = await File.findById(fileId);
//     if (!file) return null;

//     file.versions.push({
//       ...versionData,
//       uploadedAt: new Date()
//     });

//     file.version = versionData.versionNumber;
//     await file.save();

//     return await this.findById(fileId);
//   }

//   async incrementDownloadCount(fileId: string): Promise<FileDocument | null> {
//     return await File.findByIdAndUpdate(
//       fileId,
//       { $inc: { downloadCount: 1 } },
//       { new: true }
//     ) as FileDocument | null;
//   }

//   async updateScanStatus(fileId: string, scanStatus: 'pending' | 'clean' | 'infected' | 'failed'): Promise<FileDocument | null> {
//     return await File.findByIdAndUpdate(
//       fileId,
//       { scanStatus },
//       { new: true }
//     ) as FileDocument | null;
//   }

//   async findByCategory(category: string, options: {
//     projectId?: string;
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<FileDocument[]> {
//     const { projectId, approved = true, page = 1, limit = 20, sort = '-createdAt' } = options;
//     const query: any = { category };

//     if (projectId) query.project = projectId;
//     if (approved !== undefined) query.approved = approved;

//     return await File.find(query)
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('project', 'title status')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as FileDocument[];
//   }

//   async findInfectedFiles(): Promise<FileDocument[]> {
//     return await File.find({ scanStatus: 'infected' })
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('project', 'title status')
//       .sort({ createdAt: -1 })
//       .exec() as FileDocument[];
//   }

//   async findByStorageKey(storageKey: string): Promise<FileDocument | null> {
//     return await File.findOne({ storageKey })
//       .populate('uploadedBy', 'name email avatarUrl')
//       .exec() as FileDocument | null;
//   }

//   async getVersionHistory(fileId: string): Promise<FileDocument['versions'] | null> {
//     const file = await File.findById(fileId)
//       .populate('versions.uploadedBy', 'name email')
//       .exec();

//     return file ? file.versions : null;
//   }

//   async countByProject(projectId: string): Promise<number> {
//     return await File.countDocuments({ project: projectId, approved: true });
//   }

//   async countByCategory(category: string): Promise<number> {
//     return await File.countDocuments({ category, approved: true });
//   }

//   async countPendingApproval(): Promise<number> {
//     return await File.countDocuments({ approved: false });
//   }

//   async searchFiles(query: string, options: {
//     projectId?: string;
//     category?: string;
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<FileDocument[]> {
//     const { projectId, category, approved = true, page = 1, limit = 20 } = options;
//     const searchQuery: any = {
//       name: { $regex: query, $options: 'i' },
//       approved
//     };

//     if (projectId) searchQuery.project = projectId;
//     if (category) searchQuery.category = category;

//     return await File.find(searchQuery)
//       .populate('uploadedBy', 'name email avatarUrl')
//       .populate('project', 'title status')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as FileDocument[];
//   }

//   async getRecentFiles(projectId: string, options: {
//     limit?: number;
//     category?: string;
//   } = {}): Promise<FileDocument[]> {
//     const { limit = 10, category } = options;
//     const query: any = { project: projectId, approved: true };

//     if (category) query.category = category;

//     return await File.find(query)
//       .populate('uploadedBy', 'name email avatarUrl')
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .exec() as FileDocument[];
//   }

//   async getFilesByUser(userId: string, options: {
//     projectId?: string;
//     category?: string;
//     approved?: boolean;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<FileDocument[]> {
//     const { projectId, category, approved, page = 1, limit = 20 } = options;
//     const query: any = {
//       $or: [
//         { uploadedBy: userId },
//         { 'versions.uploadedBy': userId }
//       ]
//     };

//     if (projectId) query.project = projectId;
//     if (category) query.category = category;
//     if (approved !== undefined) query.approved = approved;

//     return await File.find(query)
//       .populate('project', 'title status')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as FileDocument[];
//   }
// }

// export const fileRepo = new FileRepository();
