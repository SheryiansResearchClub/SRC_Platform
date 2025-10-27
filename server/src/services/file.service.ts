// import { File, FileDocument, FileType } from '../models/file.model';
// import { activityLogRepo } from '../repositories/activity-log.repository';
// import { AppError } from '../utils/errors';
// import cloudinary from '../config/cloudinary.config';

// interface FileQuery {
//   page?: number;
//   limit?: number;
//   project?: string;
//   resourceType?: string;
//   uploadedBy?: string;
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

// class FileService {
//   async uploadFile(fileData: {
//     filename: string;
//     originalName: string;
//     mimeType: string;
//     size: number;
//     uploadedBy: string;
//     project?: string;
//     resourceType?: string;
//   }, fileBuffer?: Buffer): Promise<FileDocument> {
//     try {
//       let storageUrl = '';
//       let storageKey = '';

//       if (fileBuffer) {
//         // Upload to Cloudinary
//         const uploadResult = await cloudinary.uploader.upload(`data:${fileData.mimeType};base64,${fileBuffer.toString('base64')}`, {
//           folder: 'src-platform',
//           resource_type: 'auto'
//         });

//         storageUrl = uploadResult.secure_url;
//         storageKey = uploadResult.public_id;
//       }

//       const file = await File.create({
//         ...fileData,
//         storageUrl,
//         storageKey,
//         status: 'pending'
//       });

//       // Log activity
//       await activityLogRepo.create({
//         action: 'file_uploaded',
//         entityType: 'File',
//         entityId: file._id,
//         user: fileData.uploadedBy,
//         metadata: { filename: file.filename }
//       });

//       return file as FileDocument;
//     } catch (error) {
//       throw new AppError('FILE_UPLOAD_FAILED', 'Failed to upload file', 500);
//     }
//   }

//   async getFiles(query: FileQuery) {
//     try {
//       const { page = 1, limit = 20, project, resourceType, uploadedBy, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;

//       let filter: any = {};

//       if (project) filter.project = project;
//       if (resourceType) filter.resourceType = resourceType;
//       if (uploadedBy) filter.uploadedBy = uploadedBy;
//       if (search) {
//         filter.$or = [
//           { filename: { $regex: search, $options: 'i' } },
//           { originalName: { $regex: search, $options: 'i' } }
//         ];
//       }

//       const skip = (page - 1) * limit;
//       const sortOptions: any = {};
//       sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

//       const [files, totalCount] = await Promise.all([
//         File.find(filter)
//           .populate('uploadedBy', 'name email avatarUrl')
//           .populate('project', 'title')
//           .sort(sortOptions)
//           .skip(skip)
//           .limit(limit)
//           .exec(),
//         File.countDocuments(filter)
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
//         files,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('FILES_FETCH_FAILED', 'Failed to fetch files', 500);
//     }
//   }

//   async getFileById(fileId: string): Promise<FileDocument | null> {
//     try {
//       return await File.findById(fileId)
//         .populate('uploadedBy', 'name email avatarUrl')
//         .populate('project', 'title')
//         .exec() as FileDocument | null;
//     } catch (error) {
//       throw new AppError('FILE_FETCH_FAILED', 'Failed to fetch file', 500);
//     }
//   }

//   async getFileDownloadInfo(fileId: string): Promise<{
//     downloadUrl: string;
//     filename: string;
//     mimeType: string;
//   }> {
//     try {
//       const file = await File.findById(fileId);
//       if (!file) {
//         throw new AppError('FILE_NOT_FOUND', 'File not found', 404);
//       }

//       return {
//         downloadUrl: file.storageUrl,
//         filename: file.originalName,
//         mimeType: file.mimeType
//       };
//     } catch (error) {
//       throw new AppError('FILE_DOWNLOAD_FAILED', 'Failed to get file download info', 500);
//     }
//   }

//   async deleteFile(fileId: string): Promise<void> {
//     try {
//       const file = await File.findById(fileId);
//       if (!file) return;

//       // Delete from Cloudinary
//       if (file.storageKey) {
//         await cloudinary.uploader.destroy(file.storageKey);
//       }

//       await File.findByIdAndDelete(fileId);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'file_deleted',
//         entityType: 'File',
//         entityId: fileId,
//         metadata: { filename: file.filename }
//       });
//     } catch (error) {
//       throw new AppError('FILE_DELETE_FAILED', 'Failed to delete file', 500);
//     }
//   }

//   async approveFile(fileId: string, approvedBy: string): Promise<FileDocument | null> {
//     try {
//       const file = await File.findByIdAndUpdate(
//         fileId,
//         {
//           status: 'approved',
//           approvedBy,
//           approvedAt: new Date()
//         },
//         { new: true }
//       )
//         .populate('uploadedBy', 'name email avatarUrl')
//         .populate('project', 'title')
//         .exec() as FileDocument | null;

//       // Log activity
//       await activityLogRepo.create({
//         action: 'file_approved',
//         entityType: 'File',
//         entityId: fileId,
//         user: approvedBy,
//         metadata: { filename: file?.filename }
//       });

//       return file;
//     } catch (error) {
//       throw new AppError('FILE_APPROVE_FAILED', 'Failed to approve file', 500);
//     }
//   }

//   async getFileVersions(fileId: string): Promise<FileDocument[]> {
//     try {
//       // This would need a versions field in the File model
//       // For now, returning the current file
//       const file = await this.getFileById(fileId);
//       return file ? [file] : [];
//     } catch (error) {
//       throw new AppError('FILE_VERSIONS_FETCH_FAILED', 'Failed to fetch file versions', 500);
//     }
//   }

//   async uploadFileVersion(fileId: string, versionData: Partial<FileType>, fileBuffer?: Buffer): Promise<FileDocument | null> {
//     try {
//       let storageUrl = '';
//       let storageKey = '';

//       if (fileBuffer && versionData.filename && versionData.mimeType) {
//         // Upload to Cloudinary
//         const uploadResult = await cloudinary.uploader.upload(`data:${versionData.mimeType};base64,${fileBuffer.toString('base64')}`, {
//           folder: 'src-platform',
//           resource_type: 'auto'
//         });

//         storageUrl = uploadResult.secure_url;
//         storageKey = uploadResult.public_id;
//       }

//       const file = await File.findByIdAndUpdate(
//         fileId,
//         {
//           ...versionData,
//           storageUrl,
//           storageKey,
//           version: (versionData.version || 1) + 1,
//           status: 'pending'
//         },
//         { new: true }
//       )
//         .populate('uploadedBy', 'name email avatarUrl')
//         .populate('project', 'title')
//         .exec() as FileDocument | null;

//       // Log activity
//       await activityLogRepo.create({
//         action: 'file_version_uploaded',
//         entityType: 'File',
//         entityId: fileId,
//         metadata: { filename: file?.filename, version: file?.version }
//       });

//       return file;
//     } catch (error) {
//       throw new AppError('FILE_VERSION_UPLOAD_FAILED', 'Failed to upload file version', 500);
//     }
//   }
// }

// export const fileService = new FileService();
