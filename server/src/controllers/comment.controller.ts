import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { commentService } from '@/services/comment.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// POST /comments - Create comment (on project/task)
const createComment = async (req: Request, res: Response) => {
  try {
    const commentData = {
      ...req.body,
      author: req.user!._id,
    };

    const comment = await commentService.createComment(commentData);

    return sendSuccess(res, {
      comment,
      message: 'Comment created successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'COMMENT_CREATE_FAILED', error.message || 'Unable to create comment');
  }
};

// GET /comments - Get comments (filtered by project/task)
const getComments = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      project: req.query.project as string | undefined,
      task: req.query.task as string | undefined,
      status: req.query.status as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await commentService.getComments(query);

    return sendSuccess(res, {
      comments: result.comments,
      pagination: result.pagination,
      message: 'Comments retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'COMMENTS_FETCH_FAILED', error.message || 'Unable to fetch comments');
  }
};

// GET /comments/:id - Get single comment
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await commentService.getCommentById(id);

    if (!comment) {
      return sendError(res, 'COMMENT_NOT_FOUND', 'Comment not found', 404);
    }

    return sendSuccess(res, {
      comment,
      message: 'Comment retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'COMMENT_FETCH_FAILED', error.message || 'Unable to fetch comment');
  }
};

// PUT /comments/:id - Update comment
const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const comment = await commentService.updateComment(id, updateData);

    if (!comment) {
      return sendError(res, 'COMMENT_NOT_FOUND', 'Comment not found', 404);
    }

    return sendSuccess(res, {
      comment,
      message: 'Comment updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'COMMENT_UPDATE_FAILED', error.message || 'Unable to update comment');
  }
};

// DELETE /comments/:id - Delete comment
const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await commentService.deleteComment(id);

    return sendSuccess(res, {
      message: 'Comment deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'COMMENT_DELETE_FAILED', error.message || 'Unable to delete comment');
  }
};

// PUT /comments/:id/approve - Approve comment (admin/moderator)
const approveComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await commentService.approveComment(id, req.user._id);

    return sendSuccess(res, {
      comment,
      message: 'Comment approved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'COMMENT_APPROVE_FAILED', error.message || 'Unable to approve comment');
  }
};

// PUT /comments/:id/reject - Reject comment (admin/moderator)
const rejectComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const comment = await commentService.rejectComment(id, req.user._id, reason);

    return sendSuccess(res, {
      comment,
      message: 'Comment rejected successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'COMMENT_REJECT_FAILED', error.message || 'Unable to reject comment');
  }
};

export default {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
  approveComment,
  rejectComment,
};
