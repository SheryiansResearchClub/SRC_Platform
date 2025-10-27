import type { Request, Response } from '@/types';
import { commentService } from '@/services/comment.service';
import { sendSuccess, sendError } from '@/utils/response';

const createComment = async (req: Request, res: Response) => {
  try {
    const commentData = { ...req.body, author: req.user!._id };
    const comment = await commentService.createComment(commentData);
    return sendSuccess(res, { comment, message: 'Comment created successfully' }, 201);
  } catch (error: any) {
    return sendError(res, 'COMMENT_CREATE_FAILED', error.message || 'Unable to create comment');
  }
};

const getComments = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      project: req.query.project as string,
      task: req.query.task as string,
      status: req.query.status as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };
    const result = await commentService.getComments(query);
    return sendSuccess(res, { ...result, message: 'Comments retrieved successfully' });
  } catch (error: any) {
    return sendError(res, 'COMMENTS_FETCH_FAILED', error.message || 'Unable to fetch comments');
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const comment = await commentService.getCommentById(req.params.id);
    if (!comment) return sendError(res, 'COMMENT_NOT_FOUND', 'Comment not found', 404);
    return sendSuccess(res, { comment, message: 'Comment retrieved successfully' });
  } catch (error: any) {
    return sendError(res, 'COMMENT_FETCH_FAILED', error.message || 'Unable to fetch comment');
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const comment = await commentService.updateComment(req.params.id, req.body);
    if (!comment) return sendError(res, 'COMMENT_NOT_FOUND', 'Comment not found', 404);
    return sendSuccess(res, { comment, message: 'Comment updated successfully' });
  } catch (error: any) {
    return sendError(res, 'COMMENT_UPDATE_FAILED', error.message || 'Unable to update comment');
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment = await commentService.softDeleteComment(req.params.id, String(req.user!._id || ""));
    if (!comment) return sendError(res, 'COMMENT_NOT_FOUND', 'Comment not found', 404);
    return sendSuccess(res, { comment, message: 'Comment deleted successfully' });
  } catch (error: any) {
    return sendError(res, 'COMMENT_DELETE_FAILED', error.message || 'Unable to delete comment');
  }
};

const approveComment = async (req: Request, res: Response) => {
  try {
    const comment = await commentService.approveComment(req.params.id, String(req.user!._id || ""));
    return sendSuccess(res, { comment, message: 'Comment approved successfully' });
  } catch (error: any) {
    return sendError(res, 'COMMENT_APPROVE_FAILED', error.message || 'Unable to approve comment');
  }
};

const rejectComment = async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const comment = await commentService.rejectComment(req.params.id, String(req.user!._id || ""), reason);
    return sendSuccess(res, { comment, message: 'Comment rejected successfully' });
  } catch (error: any) {
    return sendError(res, 'COMMENT_REJECT_FAILED', error.message || 'Unable to reject comment');
  }
};

export const commentController = {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
  approveComment,
  rejectComment
};