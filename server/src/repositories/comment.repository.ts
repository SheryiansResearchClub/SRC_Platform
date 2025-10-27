import type { CommentDocument, CommentType } from '@/types';
import { Comment } from '@/models/comment.model';

class CommentRepository {
  async create(commentData: {
    content: string;
    author: string;
    project?: string;
    task?: string;
    parentComment?: string;
    mentions?: string[];
    attachments?: Array<{
      url?: string;
      storageKey?: string;
      mimeType?: string;
      size?: number;
      filename?: string;
    }>;
  }): Promise<CommentDocument> {
    const comment = await Comment.create(commentData);
    return comment as CommentDocument;
  }

  async findById(commentId: string): Promise<CommentDocument | null> {
    return await Comment.findById(commentId)
      .populate('author', 'name email avatarUrl')
      .populate('project', 'title status')
      .populate('task', 'title status priority')
      .populate('parentComment', 'content author')
      .populate('replies', 'content author createdAt')
      .populate('mentions', 'name email')
      .exec() as CommentDocument | null;
  }

  async findByProject(projectId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
  } = {}): Promise<CommentDocument[]> {
    const { page = 1, limit = 20, status, sort = '-createdAt' } = options;
    const query: any = { project: projectId };

    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: 'rejected' };
    }

    return await Comment.find(query)
      .populate('author', 'name email avatarUrl')
      .populate('parentComment', 'content author')
      .populate('replies', 'content author createdAt')
      .populate('mentions', 'name email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as CommentDocument[];
  }

  async findByTask(taskId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
  } = {}): Promise<CommentDocument[]> {
    const { page = 1, limit = 20, status, sort = '-createdAt' } = options;
    const query: any = { task: taskId };

    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: 'rejected' };
    }

    return await Comment.find(query)
      .populate('author', 'name email avatarUrl')
      .populate('parentComment', 'content author')
      .populate('replies', 'content author createdAt')
      .populate('mentions', 'name email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as CommentDocument[];
  }

  async findByParent(parentCommentId: string): Promise<CommentDocument[]> {
    return await Comment.find({ parentComment: parentCommentId })
      .populate('author', 'name email avatarUrl')
      .populate('mentions', 'name email')
      .sort({ createdAt: 1 })
      .exec() as CommentDocument[];
  }

  async findPendingComments(options: {
    page?: number;
    limit?: number;
  } = {}): Promise<CommentDocument[]> {
    const { page = 1, limit = 20 } = options;

    return await Comment.find({ status: 'pending' })
      .populate('author', 'name email avatarUrl')
      .populate('project', 'title')
      .populate('task', 'title')
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as CommentDocument[];
  }

  async update(commentId: string, updateData: Partial<CommentType>): Promise<CommentDocument | null> {
    return await Comment.findByIdAndUpdate(commentId, updateData, { new: true })
      .populate('author', 'name email avatarUrl')
      .populate('project', 'title status')
      .populate('task', 'title status priority')
      .exec() as CommentDocument | null;
  }

  async delete(commentId: string): Promise<void> {
    await Comment.findByIdAndDelete(commentId);
  }

  async approve(commentId: string, moderatorId: string): Promise<CommentDocument | null> {
    return await Comment.findByIdAndUpdate(
      commentId,
      {
        status: 'approved',
        moderatedBy: moderatorId,
        moderatedAt: new Date()
      },
      { new: true }
    )
      .populate('author', 'name email avatarUrl')
      .exec() as CommentDocument | null;
  }

  async reject(commentId: string, moderatorId: string, reason: string): Promise<CommentDocument | null> {
    return await Comment.findByIdAndUpdate(
      commentId,
      {
        status: 'rejected',
        moderatedBy: moderatorId,
        moderatedAt: new Date(),
        moderationReason: reason
      },
      { new: true }
    )
      .populate('author', 'name email avatarUrl')
      .exec() as CommentDocument | null;
  }

  async addReaction(commentId: string, userId: string, reactionType: 'like' | 'useful'): Promise<CommentDocument | null> {
    // First, remove any existing reaction from this user
    await Comment.findByIdAndUpdate(
      commentId,
      {
        $pull: { 'reactions.users': { user: userId } }
      }
    );

    // Add new reaction
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: { 'reactions.users': { user: userId, type: reactionType } }
      },
      { new: true }
    );

    if (!comment) return null;

    // Update counts
    const likeCount = comment.reactions?.users?.filter(u => u.type === 'like').length || 0;
    const usefulCount = comment.reactions?.users?.filter(u => u.type === 'useful').length || 0;

    await Comment.findByIdAndUpdate(commentId, {
      'reactions.like': likeCount,
      'reactions.useful': usefulCount
    });

    return await this.findById(commentId);
  }

  async removeReaction(commentId: string, userId: string): Promise<CommentDocument | null> {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $pull: { 'reactions.users': { user: userId } }
      },
      { new: true }
    );

    if (comment && comment.reactions?.users) {
      // Update counts after removing the reaction
      const likeCount = comment.reactions.users.filter(u => u.type === 'like').length;
      const usefulCount = comment.reactions.users.filter(u => u.type === 'useful').length;

      await Comment.findByIdAndUpdate(commentId, {
        'reactions.like': likeCount,
        'reactions.useful': usefulCount
      });
    }

    return await this.findById(commentId);
  }

  async countByEntity(entityType: 'project' | 'task', entityId: string): Promise<number> {
    const query = entityType === 'project' ? { project: entityId } : { task: entityId };
    return await Comment.countDocuments({ ...query, status: { $ne: 'rejected' } });
  }

  async countPending(): Promise<number> {
    return await Comment.countDocuments({ status: 'pending' });
  }

  async searchComments(query: string, options: {
    projectId?: string;
    taskId?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<CommentDocument[]> {
    const { projectId, taskId, page = 1, limit = 20 } = options;
    const searchQuery: any = {
      content: { $regex: query, $options: 'i' },
      status: { $ne: 'rejected' }
    };

    if (projectId) searchQuery.project = projectId;
    if (taskId) searchQuery.task = taskId;

    return await Comment.find(searchQuery)
      .populate('author', 'name email avatarUrl')
      .populate('project', 'title')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as CommentDocument[];
  }

  async getCommentsByAuthor(authorId: string, options: {
    page?: number;
    limit?: number;
  } = {}): Promise<CommentDocument[]> {
    const { page = 1, limit = 20 } = options;

    return await Comment.find({ author: authorId, status: { $ne: 'rejected' } })
      .populate('project', 'title status')
      .populate('task', 'title status priority')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as CommentDocument[];
  }

  async softDelete(commentId: string, deletedBy: string): Promise<CommentDocument | null> {
    return await Comment.findByIdAndUpdate(
      commentId,
      {
        status: 'rejected',
        moderationReason: 'Deleted by user',
        moderatedBy: deletedBy,
        moderatedAt: new Date()
      },
      { new: true }
    ) as CommentDocument | null;
  }
}

export const commentRepo = new CommentRepository();
