import { messageRepo } from '@/repositories/message.repository';
import { activityLogRepo } from '@/repositories/activity-log.repository';
import { InternalServerError, AppError, NotFoundError } from '@/utils/errors';
import type { MessageDocument } from '@/models/message.model';

interface SendMessageInput {
  content: string;
  sender: string;
  recipient?: string;
  project?: string;
  conversationId: string;
  messageType?: 'text' | 'file' | 'image';
  attachments?: Array<{
    filename?: string;
    url?: string;
    mimeType?: string;
    size?: number;
  }>;
  replyTo?: string;
}

class MessageService {
  async sendMessage(data: SendMessageInput): Promise<MessageDocument> {
    try {
      const message = await messageRepo.create({
        sender: data.sender,
        recipient: data.recipient,
        project: data.project,
        conversationId: data.conversationId,
        content: data.content,
        type: data.messageType === 'image' ? 'file' : (data.messageType || 'text'),
        attachments: data.attachments,
        replyTo: data.replyTo
      });

      await activityLogRepo.create({
        action: 'message_sent',
        entityType: 'Message',
        entityId: String(message._id || ''),
        user: data.sender,
        metadata: { recipient: String(data.recipient || ''), project: String(data.project || '') }
      });

      return message as MessageDocument;
    } catch (err) {
      throw new InternalServerError('MESSAGE_SEND_FAILED');
    }
  }

  async getMessages(query: {
    page?: number;
    limit?: number;
    project?: string;
    recipient?: string;
    sender?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    try {
      const { page = 1, limit = 20, project, recipient, sender, sortBy = 'createdAt', sortOrder = 'desc' } = query;
      const filter: any = {};
      if (project) filter.project = project;
      if (recipient) filter.recipient = recipient;
      if (sender) filter.sender = sender;

      const skip = (page - 1) * limit;
      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [messages, totalCount] = await Promise.all([
        (await import('@/models/message.model')).Message.find(filter)
          .populate('sender', 'name email avatarUrl')
          .populate('recipient', 'name email avatarUrl')
          .populate('project', 'title')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .exec(),
        (await import('@/models/message.model')).Message.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        messages,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (err) {
      throw new InternalServerError('MESSAGES_FETCH_FAILED');
    }
  }

  async getMessageById(messageId: string) {
    try {
      return await messageRepo.findById(messageId);
    } catch (err) {
      throw new InternalServerError('MESSAGE_FETCH_FAILED');
    }
  }

  async editMessage(messageId: string, content: string, userId: string) {
    try {
      const message = await messageRepo.editMessage(messageId, content, userId);
      await activityLogRepo.create({
        action: 'message_edited',
        entityType: 'Message',
        entityId: messageId,
        user: userId,
        metadata: { messageId }
      });
      return message;
    } catch (err) {
      throw new InternalServerError('MESSAGE_EDIT_FAILED');
    }
  }

  async deleteMessage(messageId: string, userId: string) {
    try {
      const msg = await messageRepo.findById(messageId);
      if (!msg) throw new NotFoundError('MESSAGE_NOT_FOUND');
      if (String(msg.sender?._id) !== String(userId)) throw new NotFoundError('UNAUTHORIZED');
      await messageRepo.delete(messageId);
      await activityLogRepo.create({
        action: 'message_deleted',
        entityType: 'Message',
        entityId: messageId,
        user: userId,
        metadata: { messageId }
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new InternalServerError('MESSAGE_DELETE_FAILED');
    }
  }

  // async getUserConversations(userId: string) {
  //   try {
  //     const conversations = await messageRepo.getConversationList(userId);
  //     return conversations;
  //   } catch (err) {
  //     throw new InternalServerError('CONVERSATIONS_FETCH_FAILED');
  //   }
  // }

  async markAsRead(messageId: string, userId: string) {
    try {
      const message = await messageRepo.markAsRead(messageId, userId);
      return message;
    } catch (err) {
      throw new InternalServerError('MESSAGE_MARK_READ_FAILED');
    }
  }
}

export const messageService = new MessageService();
