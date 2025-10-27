import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { resourceService } from '@/services/resource.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// POST /resources - Upload new resource (tutorial, document, snippet)
const createResource = async (req: Request, res: Response) => {
  try {
    const resourceData = {
      ...req.body,
      uploadedBy: req.user!._id,
    };

    const resource = await resourceService.createResource(resourceData);

    return sendSuccess(res, {
      resource,
      message: 'Resource created successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'RESOURCE_CREATE_FAILED', error.message || 'Unable to create resource');
  }
};

// GET /resources - Get all resources (with filters: type, category)
const getResources = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      category: req.query.category as string | undefined,
      type: req.query.type as string | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await resourceService.getResources(query);

    return sendSuccess(res, {
      resources: result.resources,
      pagination: result.pagination,
      message: 'Resources retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'RESOURCES_FETCH_FAILED', error.message || 'Unable to fetch resources');
  }
};

// GET /resources/:id - Get single resource
const getResourceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await resourceService.getResourceById(id);

    if (!resource) {
      return sendError(res, 'RESOURCE_NOT_FOUND', 'Resource not found', 404);
    }

    return sendSuccess(res, {
      resource,
      message: 'Resource retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'RESOURCE_FETCH_FAILED', error.message || 'Unable to fetch resource');
  }
};

// PUT /resources/:id - Update resource
const updateResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const resource = await resourceService.updateResource(id, updateData);

    if (!resource) {
      return sendError(res, 'RESOURCE_NOT_FOUND', 'Resource not found', 404);
    }

    return sendSuccess(res, {
      resource,
      message: 'Resource updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'RESOURCE_UPDATE_FAILED', error.message || 'Unable to update resource');
  }
};

// DELETE /resources/:id - Delete resource
const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await resourceService.deleteResource(id);

    return sendSuccess(res, {
      message: 'Resource deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'RESOURCE_DELETE_FAILED', error.message || 'Unable to delete resource');
  }
};

// GET /resources/:id/download - Download resource
const downloadResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const downloadInfo = await resourceService.getResourceDownloadInfo(id);

    // Set appropriate headers and return file
    res.setHeader('Content-Type', downloadInfo.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadInfo.filename}"`);

    return sendSuccess(res, {
      downloadUrl: downloadInfo.downloadUrl,
      message: 'Resource download initiated',
    });
  } catch (error: any) {
    return handleError(res, error, 'RESOURCE_DOWNLOAD_FAILED', error.message || 'Unable to download resource');
  }
};

// POST /resources/:id/like - Like/favorite resource
const likeResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await resourceService.likeResource(id, req.user!._id);

    return sendSuccess(res, {
      resource,
      message: 'Resource liked successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'RESOURCE_LIKE_FAILED', error.message || 'Unable to like resource');
  }
};

// GET /resources/categories - Get resource categories
const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await resourceService.getCategories();

    return sendSuccess(res, {
      categories,
      message: 'Categories retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'CATEGORIES_FETCH_FAILED', error.message || 'Unable to fetch categories');
  }
};

export default {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  downloadResource,
  likeResource,
  getCategories,
};
