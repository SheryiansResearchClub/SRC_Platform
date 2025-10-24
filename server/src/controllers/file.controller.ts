import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { fileService } from '@/services/file.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// POST /files/upload - Upload file/attachment
const uploadFile = async (req: Request, res: Response) => {
  try {
    const fileData = {
      ...req.body,
      uploadedBy: req.user!._id,
    };

    const file = await fileService.uploadFile(fileData, req.file);

    return sendSuccess(res, {
      file,
      message: 'File uploaded successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'FILE_UPLOAD_FAILED', error.message || 'Unable to upload file');
  }
};

// GET /files - Get all files (filtered by project/resource type)
const getFiles = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      project: req.query.project as string | undefined,
      resourceType: req.query.resourceType as string | undefined,
      uploadedBy: req.query.uploadedBy as string | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await fileService.getFiles(query);

    return sendSuccess(res, {
      files: result.files,
      pagination: result.pagination,
      message: 'Files retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'FILES_FETCH_FAILED', error.message || 'Unable to fetch files');
  }
};

// GET /files/:id - Get single file details
const getFileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = await fileService.getFileById(id);

    if (!file) {
      return sendError(res, 'FILE_NOT_FOUND', 'File not found', 404);
    }

    return sendSuccess(res, {
      file,
      message: 'File retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'FILE_FETCH_FAILED', error.message || 'Unable to fetch file');
  }
};

// GET /files/:id/download - Download file
const downloadFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const downloadInfo = await fileService.getFileDownloadInfo(id);

    // Set appropriate headers and return file
    res.setHeader('Content-Type', downloadInfo.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadInfo.filename}"`);

    return sendSuccess(res, {
      downloadUrl: downloadInfo.downloadUrl,
      message: 'File download initiated',
    });
  } catch (error: any) {
    return handleError(res, error, 'FILE_DOWNLOAD_FAILED', error.message || 'Unable to download file');
  }
};

// DELETE /files/:id - Delete file
const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await fileService.deleteFile(id);

    return sendSuccess(res, {
      message: 'File deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'FILE_DELETE_FAILED', error.message || 'Unable to delete file');
  }
};

// PUT /files/:id/approve - Approve file (admin only)
const approveFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = await fileService.approveFile(id, req.user!._id);

    return sendSuccess(res, {
      file,
      message: 'File approved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'FILE_APPROVE_FAILED', error.message || 'Unable to approve file');
  }
};

// GET /files/:id/versions - Get file version history
const getFileVersions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const versions = await fileService.getFileVersions(id);

    return sendSuccess(res, {
      versions,
      message: 'File versions retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'FILE_VERSIONS_FETCH_FAILED', error.message || 'Unable to fetch file versions');
  }
};

// POST /files/:id/versions - Upload new file version
const uploadFileVersion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = await fileService.uploadFileVersion(id, req.body, req.file);

    return sendSuccess(res, {
      file,
      message: 'File version uploaded successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'FILE_VERSION_UPLOAD_FAILED', error.message || 'Unable to upload file version');
  }
};

export default {
  uploadFile,
  getFiles,
  getFileById,
  downloadFile,
  deleteFile,
  approveFile,
  getFileVersions,
  uploadFileVersion,
};
