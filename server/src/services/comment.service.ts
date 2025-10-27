import { CommentType, CommentDocument } from '@/types';
import { commentRepo } from '@/repositories/comment.repository';
import { InternalServerError } from '@/utils/errors';
import { activityLogRepo } from '@/repositories/activity-log.repository';
import { Comment } from '@/models';

interface CommentQuery {
  page?: number;
  limit?: number;
  project?: string;
  task?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class CommentService {
  async createComment(data: Partial<CommentType>): Promise<CommentDocument> {
    try {
      const comment = await commentRepo.create(data);
      await activityLogRepo.create({
        action: 'comment_created',
        entityType: 'Comment',
        entityId: comment._id.toString(),
        user: comment.author.toString(),
        metadata: { content: comment.content }
      });
      return comment;
    } catch {
      throw new InternalServerError('COMMENT_CREATE_FAILED');
    }
  }

  async getComments(query: CommentQuery) {
    try {
      const { page = 1, limit = 20, project, task, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
      let comments: CommentDocument[] = [];
      let totalCount = 0;

      if (project) {
        comments = await commentRepo.findByProject(project, page, limit, status, sortOrder === 'desc' ? `-${sortBy}` : sortBy);
        totalCount = await Comment.countDocuments({ project, status: status || { $in: ['pending', 'approved'] } });
      } else if (task) {
        comments = await commentRepo.findByTask(task, page, limit, status, sortOrder === 'desc' ? `-${sortBy}` : sortBy);
        totalCount = await Comment.countDocuments({ task, status: status || { $in: ['pending', 'approved'] } });
      } else {
        const skip = (page - 1) * limit;
        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const filter: any = status ? { status } : { status: { $in: ['pending', 'approved'] } };

        [comments, totalCount] = await Promise.all([
          Comment.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
          Comment.countDocuments(filter)
        ]);
      }

      const totalPages = Math.ceil(totalCount / limit);
      return {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch {
      throw new InternalServerError('COMMENTS_FETCH_FAILED');
    }
  }

  async getCommentById(id: string) {
    try {
      return await commentRepo.findById(id);
    } catch {
      throw new InternalServerError('COMMENT_FETCH_FAILED');
    }
  }

  async updateComment(commentId: string, data: Partial<CommentType>) {
    try {
      const comment = await commentRepo.update(commentId, data);
      return comment;
    } catch {
      throw new InternalServerError('COMMENT_UPDATE_FAILED');
    }
  }

  async deleteComment(commentId: string) {
    try {
      await commentRepo.delete(commentId);
    } catch {
      throw new InternalServerError('COMMENT_DELETE_FAILED');
    }
  }

  async softDeleteComment(commentId: string, deletedBy: string) {
    try {
      return await commentRepo.softDelete(commentId, deletedBy);
    } catch {
      throw new InternalServerError('COMMENT_DELETE_FAILED');
    }
  }

  async approveComment(commentId: string, moderatorId: string) {
    try {
      return await commentRepo.approve(commentId, moderatorId);
    } catch {
      throw new InternalServerError('COMMENT_APPROVE_FAILED');
    }
  }

  async rejectComment(commentId: string, moderatorId: string, reason: string) {
    try {
      return await commentRepo.reject(commentId, moderatorId, reason);
    } catch {
      throw new InternalServerError('COMMENT_REJECT_FAILED');
    }
  }
}

export const commentService = new CommentService();