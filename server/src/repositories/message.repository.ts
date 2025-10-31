import { Message, MessageDocument, MessageType } from '@/models/message.model';

class MessageRepository {
  async create(messageData: {
    sender: string;
    recipient?: string;
    project?: string;
    conversationId: string;
    content: string;
    type?: 'text' | 'system' | 'file';
    attachments?: Array<{
      url?: string;
      storageKey?: string;
      mimeType?: string;
      filename?: string;
      size?: number;
    }>;
    replyTo?: string;
  }): Promise<MessageDocument> {
    const message = await Message.create(messageData);
    return message as MessageDocument;
  }

  async findById(messageId: string): Promise<MessageDocument | null> {
    return await Message.findById(messageId)
      .populate('sender', 'name email avatarUrl')
      .populate('recipient', 'name email avatarUrl')
      .populate('replyTo', 'content sender createdAt')
      .exec() as MessageDocument | null;
  }

  async findByProject(projectId: string, options: {
    conversationId?: string;
    sender?: string;
    type?: string;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}): Promise<MessageDocument[]> {
    const {
      conversationId,
      sender,
      type,
      page = 1,
      limit = 50,
      sort = '-createdAt'
    } = options;

    const query: any = { project: projectId };
    if (conversationId) query.conversationId = conversationId;
    if (sender) query.sender = sender;
    if (type) query.type = type;

    return await Message.find(query)
      .populate('sender', 'name email avatarUrl')
      .populate('replyTo', 'content sender createdAt')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as MessageDocument[];
  }

  async findByConversation(conversationId: string, options: {
    sender?: string;
    type?: string;
    page?: number;
    limit?: number;
    sort?: string;
    before?: Date;
  } = {}): Promise<MessageDocument[]> {
    const {
      sender,
      type,
      page = 1,
      limit = 50,
      sort = '-createdAt',
      before
    } = options;

    const query: any = { conversationId };
    if (sender) query.sender = sender;
    if (type) query.type = type;
    if (before) query.createdAt = { $lt: before };

    return await Message.find(query)
      .populate('sender', 'name email avatarUrl')
      .populate('replyTo', 'content sender createdAt')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as MessageDocument[];
  }

  async findBySender(senderId: string, options: {
    projectId?: string;
    conversationId?: string;
    type?: string;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}): Promise<MessageDocument[]> {
    const {
      projectId,
      conversationId,
      type,
      page = 1,
      limit = 50,
      sort = '-createdAt'
    } = options;

    const query: any = { sender: senderId };
    if (projectId) query.project = projectId;
    if (conversationId) query.conversationId = conversationId;
    if (type) query.type = type;

    return await Message.find(query)
      .populate('project', 'title status')
      .populate('replyTo', 'content sender createdAt')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as MessageDocument[];
  }

  async findReplies(parentMessageId: string): Promise<MessageDocument[]> {
    return await Message.find({ replyTo: parentMessageId })
      .populate('sender', 'name email avatarUrl')
      .sort({ createdAt: 1 })
      .exec() as MessageDocument[];
  }

  async update(messageId: string, updateData: Partial<MessageType>): Promise<MessageDocument | null> {
    return await Message.findByIdAndUpdate(messageId, updateData, { new: true })
      .populate('sender', 'name email avatarUrl')
      .populate('recipient', 'name email avatarUrl')
      .populate('replyTo', 'content sender createdAt')
      .exec() as MessageDocument | null;
  }

  async delete(messageId: string): Promise<void> {
    console.log(messageId)
    await Message.findByIdAndDelete(messageId).exec();
  }

  async softDelete(messageId: string, userId: string): Promise<MessageDocument | null> {
    return await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { deletedFor: userId } },
      { new: true }
    ) as MessageDocument | null;
  }

  async markAsRead(messageId: string, userId: string): Promise<MessageDocument | null> {
    return await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId }, isRead: true, readAt: new Date() },
      { new: true }
    )
      .populate('sender', 'name email avatarUrl')
      .populate('recipient', 'name email avatarUrl')
      .exec() as MessageDocument | null;
  }

  async markConversationAsRead(conversationId: string, userId: string): Promise<number> {
    const result = await Message.updateMany(
      { conversationId, sender: { $ne: userId }, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId }, isRead: true, readAt: new Date() }
    ).exec();
    return result.modifiedCount ?? 0;
  }

  async findUnreadMessages(userId: string, options: {
    projectId?: string;
    conversationId?: string;
    limit?: number;
  } = {}): Promise<MessageDocument[]> {
    const { projectId, conversationId, limit = 50 } = options;
    const query: any = { sender: { $ne: userId }, readBy: { $ne: userId } };
    if (projectId) query.project = projectId;
    if (conversationId) query.conversationId = conversationId;

    return await Message.find(query)
      .populate('sender', 'name email avatarUrl')
      .populate('project', 'title status')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec() as MessageDocument[];
  }

  async getConversationList(userId: string, options: { projectId?: string; limit?: number; } = {}) {
    const { projectId, limit = 20 } = options;
    const matchStage: any = projectId ? { project: projectId } : {};
    const conversations = await Message.aggregate([
      { $match: matchStage },
      { $match: { $or: [{ sender: userId }, { readBy: userId }, { recipient: userId }] } },
      {
        $group: {
          _id: '$conversationId',
          project: { $first: '$project' },
          lastMessage: { $last: '$$ROOT' },
          participants: { $addToSet: '$sender' },
          createdAt: { $min: '$createdAt' }
        }
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
      { $limit: limit }
    ]).exec();

    const list = await Promise.all(conversations.map(async (conv: any) => {
      const unreadCount = await this.countUnreadInConversation(conv._id, userId);
      const lastMessage = await this.findById(conv.lastMessage._id);
      return {
        conversationId: conv._id,
        project: conv.project,
        lastMessage: lastMessage!,
        unreadCount,
        participants: conv.participants
      };
    }));

    return list;
  }

  async countUnreadInConversation(conversationId: string, userId: string): Promise<number> {
    return await Message.countDocuments({
      conversationId,
      sender: { $ne: userId },
      readBy: { $ne: userId }
    }).exec();
  }

  async findByUser(userId: string, options: {
    projectId?: string;
    conversationId?: string;
    type?: string;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}): Promise<MessageDocument[]> {
    const {
      projectId,
      conversationId,
      type,
      page = 1,
      limit = 50,
      sort = '-createdAt'
    } = options;

    const query: any = {
      $or: [
        { sender: userId },
        { readBy: userId },
        { recipient: userId }
      ]
    };

    if (projectId) query.project = projectId;
    if (conversationId) query.conversationId = conversationId;
    if (type) query.type = type;

    return await Message.find(query)
      .populate('sender', 'name email avatarUrl')
      .populate('project', 'title status')
      .populate('replyTo', 'content sender createdAt')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as MessageDocument[];
  }

  async searchMessages(q: string, options: {
    projectId?: string;
    conversationId?: string;
    sender?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<MessageDocument[]> {
    const { projectId, conversationId, sender, page = 1, limit = 20 } = options;
    const searchQuery: any = { content: { $regex: q, $options: 'i' } };
    if (projectId) searchQuery.project = projectId;
    if (conversationId) searchQuery.conversationId = conversationId;
    if (sender) searchQuery.sender = sender;

    return await Message.find(searchQuery)
      .populate('sender', 'name email avatarUrl')
      .populate('project', 'title status')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as MessageDocument[];
  }

  async getMessageThread(messageId: string): Promise<MessageDocument[]> {
    const root = await this.findById(messageId);
    if (!root) return [];
    const thread: MessageDocument[] = [];
    let current: MessageDocument | null = root;
    while (current) {
      thread.unshift(current);
      if (current.replyTo) {
        current = await this.findById(String(current.replyTo));
      } else break;
    }
    const replies = await this.findReplies(messageId);
    thread.push(...replies);
    return thread;
  }

  async countByProject(projectId: string): Promise<number> {
    return await Message.countDocuments({ project: projectId }).exec();
  }

  async countByConversation(conversationId: string): Promise<number> {
    return await Message.countDocuments({ conversationId }).exec();
  }

  async getUserMessageStats(userId: string) {
    const [totalSent, totalReceived, conversations] = await Promise.all([
      Message.countDocuments({ sender: userId }).exec(),
      Message.countDocuments({ recipient: userId }).exec(),
      Message.distinct('conversationId', { $or: [{ sender: userId }, { recipient: userId }, { readBy: userId }] }).exec()
    ]);
    return {
      totalSent,
      totalReceived,
      conversations: conversations.length
    };
  }

  async getRecentConversations(userId: string, options: { limit?: number } = {}) {
    const { limit = 10 } = options;
    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { recipient: userId }, { readBy: userId }] } },
      { $group: { _id: '$conversationId', lastActivity: { $max: '$createdAt' } } },
      { $sort: { lastActivity: -1 } },
      { $limit: limit }
    ]).exec();
    return conversations.map(conv => conv._id);
  }

  async getProjectMessages(projectId: string, options: { conversationId?: string; limit?: number; before?: Date } = {}) {
    const { conversationId, limit = 50, before } = options;
    const query: any = { project: projectId };
    if (conversationId) query.conversationId = conversationId;
    if (before) query.createdAt = { $lt: before };
    return await Message.find(query)
      .populate('sender', 'name email avatarUrl')
      .populate('replyTo', 'content sender createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec() as MessageDocument[];
  }

  async editMessage(messageId: string, newContent: string, editedBy: string) {
    return await Message.findOneAndUpdate(
      { _id: messageId, sender: editedBy },
      { content: newContent, edited: true, editedAt: new Date() },
      { new: true }
    )
      .populate('sender', 'name email avatarUrl')
      .exec() as MessageDocument | null;
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string, options: { projectId?: string; limit?: number; page?: number } = {}) {
    const { projectId, limit = 50, page = 1 } = options;
    const query: any = {
      $or: [
        { sender: user1Id, recipient: user2Id },
        { sender: user2Id, recipient: user1Id }
      ]
    };
    if (projectId) query.project = projectId;
    return await Message.find(query)
      .populate('sender', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec() as MessageDocument[];
  }
}

export const messageRepo = new MessageRepository();