import type { CommentDocument, CommentType } from '@/types';
import { Comment } from '@/models/comment.model';

class CommentRepository {
  async create(data: Partial<CommentType>): Promise<CommentDocument> {
    return await Comment.create(data) as CommentDocument;
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

  async findByProject(projectId: string, page = 1, limit = 20, status?: string, sort = '-createdAt'): Promise<CommentDocument[]> {
    const query: any = { project: projectId, status: status || { $in: ['pending', 'approved'] } };
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

  async findByTask(taskId: string, page = 1, limit = 20, status?: string, sort = '-createdAt'): Promise<CommentDocument[]> {
    const query: any = { task: taskId, status: status || { $in: ['pending', 'approved'] } };
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

  async update(commentId: string, data: Partial<CommentType>): Promise<CommentDocument | null> {
    return await Comment.findByIdAndUpdate(commentId, data, { new: true })
      .populate('author', 'name email avatarUrl')
      .populate('project', 'title status')
      .populate('task', 'title status priority')
      .exec() as CommentDocument | null;
  }

  async delete(commentId: string): Promise<CommentDocument | null> {
    return await Comment.findByIdAndDelete(commentId) as CommentDocument | null;
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

  async approve(commentId: string, moderatorId: string): Promise<CommentDocument | null> {
    return await Comment.findByIdAndUpdate(
      commentId,
      { status: 'approved', moderatedBy: moderatorId, moderatedAt: new Date() },
      { new: true }
    )
      .populate('author', 'name email avatarUrl')
      .exec() as CommentDocument | null;
  }

  async reject(commentId: string, moderatorId: string, reason: string): Promise<CommentDocument | null> {
    return await Comment.findByIdAndUpdate(
      commentId,
      { status: 'rejected', moderatedBy: moderatorId, moderatedAt: new Date(), moderationReason: reason },
      { new: true }
    )
      .populate('author', 'name email avatarUrl')
      .exec() as CommentDocument | null;
  }

  async addReaction(commentId: string, userId: string, type: 'like' | 'useful'): Promise<CommentDocument | null> {
    // Remove any previous reaction
    await Comment.updateOne({ _id: commentId }, { $pull: { 'reactions.users': { user: userId } } });
    // Add new reaction
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { 'reactions.users': { user: userId, type } } },
      { new: true }
    );

    if (!comment) return null;

    // Update counts
    const likeCount = comment?.reactions?.users?.filter(u => u.type === 'like').length;
    const usefulCount = comment?.reactions?.users?.filter(u => u.type === 'useful').length;
    await Comment.findByIdAndUpdate(commentId, { 'reactions.like': likeCount, 'reactions.useful': usefulCount });

    return await this.findById(commentId);
  }

  async removeReaction(commentId: string, userId: string): Promise<CommentDocument | null> {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $pull: { 'reactions.users': { user: userId } } },
      { new: true }
    );

    if (comment) {
      const likeCount = comment?.reactions?.users?.filter(u => u.type === 'like').length;
      const usefulCount = comment?.reactions?.users?.filter(u => u.type === 'useful').length;
      await Comment.findByIdAndUpdate(commentId, { 'reactions.like': likeCount, 'reactions.useful': usefulCount });
    }

    return await this.findById(commentId);
  }
}

export const commentRepo = new CommentRepository();