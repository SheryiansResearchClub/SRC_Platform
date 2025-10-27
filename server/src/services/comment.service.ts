// import { Comment, CommentDocument, CommentType } from '@/models/comment.model';
// import { commentRepo } from '@/repositories/comment.repository';
// import { activityLogRepo } from '@/repositories/activity-log.repository';
// import { AppError } from '@/utils/errors';

// interface CommentQuery {
//   page?: number;
//   limit?: number;
//   project?: string;
//   task?: string;
//   status?: string;
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

// class CommentService {
//   async createComment(commentData: {
//     content: string;
//     author: string;
//     project?: string;
//     task?: string;
//     parentComment?: string;
//     mentions?: string[];
//     attachments?: Array<{
//       url?: string;
//       storageKey?: string;
//       mimeType?: string;
//       size?: number;
//       filename?: string;
//     }>;
//   }): Promise<CommentDocument> {
//     try {
//       const comment = await commentRepo.create(commentData);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'comment_created',
//         entityType: 'Comment',
//         entityId: comment._id,
//         user: commentData.author,
//         metadata: { commentContent: comment.content }
//       });

//       return comment;
//     } catch (error) {
//       throw new AppError('COMMENT_CREATE_FAILED', 'Failed to create comment', 500);
//     }
//   }

//   async getComments(query: CommentQuery) {
//     try {
//       const { page = 1, limit = 20, project, task, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;

//       let comments: CommentDocument[] = [];
//       let totalCount = 0;

//       if (project) {
//         const result = await commentRepo.findByProject(project, {
//           page,
//           limit,
//           status: status || 'approved',
//           sort: sortOrder === 'desc' ? `-${sortBy}` : sortBy
//         });
//         comments = result;
//         totalCount = await Comment.countDocuments({
//           project,
//           status: status || { $ne: 'rejected' }
//         });
//       } else if (task) {
//         const result = await commentRepo.findByTask(task, {
//           page,
//           limit,
//           status: status || 'approved',
//           sort: sortOrder === 'desc' ? `-${sortBy}` : sortBy
//         });
//         comments = result;
//         totalCount = await Comment.countDocuments({
//           task,
//           status: status || { $ne: 'rejected' }
//         });
//       } else {
//         // Get all comments with pagination
//         const skip = (page - 1) * limit;
//         const sortOptions: any = {};
//         sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

//         let filter: any = {};
//         if (status) filter.status = status;
//         else filter.status = { $ne: 'rejected' };

//         [comments, totalCount] = await Promise.all([
//           Comment.find(filter)
//             .populate('author', 'name email avatarUrl')
//             .populate('project', 'title status')
//             .populate('task', 'title status priority')
//             .sort(sortOptions)
//             .skip(skip)
//             .limit(limit)
//             .exec(),
//           Comment.countDocuments(filter)
//         ]);
//       }

//       const totalPages = Math.ceil(totalCount / limit);
//       const pagination: PaginationResult = {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       };

//       return {
//         comments,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('COMMENTS_FETCH_FAILED', 'Failed to fetch comments', 500);
//     }
//   }

//   async getCommentById(commentId: string): Promise<CommentDocument | null> {
//     try {
//       return await commentRepo.findById(commentId);
//     } catch (error) {
//       throw new AppError('COMMENT_FETCH_FAILED', 'Failed to fetch comment', 500);
//     }
//   }

//   async updateComment(commentId: string, updateData: Partial<CommentType>): Promise<CommentDocument | null> {
//     try {
//       const comment = await commentRepo.update(commentId, updateData);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'comment_updated',
//         entityType: 'Comment',
//         entityId: commentId,
//         user: updateData.author?.toString(),
//         metadata: { commentId }
//       });

//       return comment;
//     } catch (error) {
//       throw new AppError('COMMENT_UPDATE_FAILED', 'Failed to update comment', 500);
//     }
//   }

//   async deleteComment(commentId: string): Promise<void> {
//     try {
//       await commentRepo.delete(commentId);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'comment_deleted',
//         entityType: 'Comment',
//         entityId: commentId,
//         metadata: { commentId }
//       });
//     } catch (error) {
//       throw new AppError('COMMENT_DELETE_FAILED', 'Failed to delete comment', 500);
//     }
//   }

//   async approveComment(commentId: string, moderatorId: string): Promise<CommentDocument | null> {
//     try {
//       const comment = await commentRepo.approve(commentId, moderatorId);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'comment_approved',
//         entityType: 'Comment',
//         entityId: commentId,
//         user: moderatorId,
//         metadata: { commentId }
//       });

//       return comment;
//     } catch (error) {
//       throw new AppError('COMMENT_APPROVE_FAILED', 'Failed to approve comment', 500);
//     }
//   }

//   async rejectComment(commentId: string, moderatorId: string, reason: string): Promise<CommentDocument | null> {
//     try {
//       const comment = await commentRepo.reject(commentId, moderatorId, reason);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'comment_rejected',
//         entityType: 'Comment',
//         entityId: commentId,
//         user: moderatorId,
//         metadata: { commentId, reason }
//       });

//       return comment;
//     } catch (error) {
//       throw new AppError('COMMENT_REJECT_FAILED', 'Failed to reject comment', 500);
//     }
//   }
// }

// export const commentService = new CommentService();
