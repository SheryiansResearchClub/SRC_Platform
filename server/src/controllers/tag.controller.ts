import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { tagService } from '@/services/tag.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// POST /tags - Create new tag
const createTag = async (req: Request, res: Response) => {
  try {
    const tagData = {
      ...req.body,
      createdBy: req.user!._id,
    };

    const tag = await tagService.createTag(tagData);

    return sendSuccess(res, {
      tag,
      message: 'Tag created successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'TAG_CREATE_FAILED', error.message || 'Unable to create tag');
  }
};

// GET /tags - Get all tags
const getTags = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      type: req.query.type as string | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await tagService.getTags(query);

    return sendSuccess(res, {
      tags: result.tags,
      pagination: result.pagination,
      message: 'Tags retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TAGS_FETCH_FAILED', error.message || 'Unable to fetch tags');
  }
};

// GET /tags/:id - Get single tag
const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tag = await tagService.getTagById(id);

    if (!tag) {
      return sendError(res, 'TAG_NOT_FOUND', 'Tag not found', 404);
    }

    return sendSuccess(res, {
      tag,
      message: 'Tag retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TAG_FETCH_FAILED', error.message || 'Unable to fetch tag');
  }
};

// PUT /tags/:id - Update tag
const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const tag = await tagService.updateTag(id, updateData);

    if (!tag) {
      return sendError(res, 'TAG_NOT_FOUND', 'Tag not found', 404);
    }

    return sendSuccess(res, {
      tag,
      message: 'Tag updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TAG_UPDATE_FAILED', error.message || 'Unable to update tag');
  }
};

// DELETE /tags/:id - Delete tag
const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await tagService.deleteTag(id);

    return sendSuccess(res, {
      message: 'Tag deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'TAG_DELETE_FAILED', error.message || 'Unable to delete tag');
  }
};

// GET /tags/projects - Get project type tags (Web, Electronics, AI, etc.)
const getProjectTypeTags = async (req: Request, res: Response) => {
  try {
    const tags = await tagService.getProjectTypeTags();

    return sendSuccess(res, {
      tags,
      message: 'Project type tags retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'PROJECT_TYPE_TAGS_FETCH_FAILED', error.message || 'Unable to fetch project type tags');
  }
};

export default {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
  getProjectTypeTags,
};
