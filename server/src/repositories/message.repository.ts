// import { Message, MessageDocument, MessageType } from '@/models/message.model';

// class MessageRepository {
//   async create(messageData: {
//     sender: string;
//     project: string;
//     conversationId: string;
//     content: string;
//     type?: 'text' | 'system' | 'file';
//     attachments?: Array<{
//       url?: string;
//       storageKey?: string;
//       mimeType?: string;
//       filename?: string;
//       size?: number;
//     }>;
//     replyTo?: string;
//   }): Promise<MessageDocument> {
//     const message = await Message.create(messageData);
//     return message as MessageDocument;
//   }

//   async findById(messageId: string): Promise<MessageDocument | null> {
//     return await Message.findById(messageId)
//       .populate('sender', 'name email avatarUrl')
//       .populate('replyTo', 'content sender createdAt')
//       .exec() as MessageDocument | null;
//   }

//   async findByProject(projectId: string, options: {
//     conversationId?: string;
//     sender?: string;
//     type?: string;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<MessageDocument[]> {
//     const {
//       conversationId,
//       sender,
//       type,
//       page = 1,
//       limit = 50,
//       sort = 'createdAt'
//     } = options;

//     const query: any = { project: projectId };

//     if (conversationId) query.conversationId = conversationId;
//     if (sender) query.sender = sender;
//     if (type) query.type = type;

//     return await Message.find(query)
//       .populate('sender', 'name email avatarUrl')
//       .populate('replyTo', 'content sender createdAt')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as MessageDocument[];
//   }

//   async findByConversation(conversationId: string, options: {
//     sender?: string;
//     type?: string;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<MessageDocument[]> {
//     const {
//       sender,
//       type,
//       page = 1,
//       limit = 50,
//       sort = 'createdAt'
//     } = options;

//     const query: any = { conversationId };

//     if (sender) query.sender = sender;
//     if (type) query.type = type;

//     return await Message.find(query)
//       .populate('sender', 'name email avatarUrl')
//       .populate('replyTo', 'content sender createdAt')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as MessageDocument[];
//   }

//   async findBySender(senderId: string, options: {
//     projectId?: string;
//     conversationId?: string;
//     type?: string;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<MessageDocument[]> {
//     const {
//       projectId,
//       conversationId,
//       type,
//       page = 1,
//       limit = 50,
//       sort = '-createdAt'
//     } = options;

//     const query: any = { sender: senderId };

//     if (projectId) query.project = projectId;
//     if (conversationId) query.conversationId = conversationId;
//     if (type) query.type = type;

//     return await Message.find(query)
//       .populate('project', 'title status')
//       .populate('replyTo', 'content sender createdAt')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as MessageDocument[];
//   }

//   async findReplies(parentMessageId: string): Promise<MessageDocument[]> {
//     return await Message.find({ replyTo: parentMessageId })
//       .populate('sender', 'name email avatarUrl')
//       .sort({ createdAt: 1 })
//       .exec() as MessageDocument[];
//   }

//   async update(messageId: string, updateData: Partial<MessageType>): Promise<MessageDocument | null> {
//     return await Message.findByIdAndUpdate(messageId, updateData, { new: true })
//       .populate('sender', 'name email avatarUrl')
//       .populate('replyTo', 'content sender createdAt')
//       .exec() as MessageDocument | null;
//   }

//   async delete(messageId: string): Promise<void> {
//     await Message.findByIdAndDelete(messageId);
//   }

//   async softDelete(messageId: string, userId: string): Promise<MessageDocument | null> {
//     return await Message.findByIdAndUpdate(
//       messageId,
//       {
//         $addToSet: { deletedFor: userId }
//       },
//       { new: true }
//     ) as MessageDocument | null;
//   }

//   async markAsRead(messageId: string, userId: string): Promise<MessageDocument | null> {
//     return await Message.findByIdAndUpdate(
//       messageId,
//       {
//         $addToSet: { readBy: userId }
//       },
//       { new: true }
//     ) as MessageDocument | null;
//   }

//   async markConversationAsRead(conversationId: string, userId: string): Promise<number> {
//     const result = await Message.updateMany(
//       {
//         conversationId,
//         sender: { $ne: userId }, // Don't mark own messages as read
//         readBy: { $ne: userId }
//       },
//       {
//         $addToSet: { readBy: userId }
//       }
//     );
//     return result.modifiedCount;
//   }

//   async findUnreadMessages(userId: string, options: {
//     projectId?: string;
//     conversationId?: string;
//     limit?: number;
//   } = {}): Promise<MessageDocument[]> {
//     const { projectId, conversationId, limit = 50 } = options;

//     const query: any = {
//       sender: { $ne: userId },
//       readBy: { $ne: userId }
//     };

//     if (projectId) query.project = projectId;
//     if (conversationId) query.conversationId = conversationId;

//     return await Message.find(query)
//       .populate('sender', 'name email avatarUrl')
//       .populate('project', 'title status')
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .exec() as MessageDocument[];
//   }

//   async getConversationList(userId: string, options: {
//     projectId?: string;
//     limit?: number;
//   } = {}): Promise<Array<{
//     conversationId: string;
//     project: string;
//     lastMessage: MessageDocument;
//     unreadCount: number;
//     participants: string[];
//   }>> {
//     const { projectId, limit = 20 } = options;

//     // Get all conversations for the user
//     const conversations = await Message.aggregate([
//       {
//         $match: projectId ? { project: projectId } : {}
//       },
//       {
//         $match: {
//           $or: [
//             { sender: userId },
//             { readBy: userId }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: '$conversationId',
//           project: { $first: '$project' },
//           lastMessage: { $last: '$$ROOT' },
//           participants: { $addToSet: '$sender' },
//           createdAt: { $min: '$createdAt' }
//         }
//       },
//       {
//         $sort: { 'lastMessage.createdAt': -1 }
//       },
//       {
//         $limit: limit
//       }
//     ]);

//     // Get unread counts for each conversation
//     const conversationList = await Promise.all(
//       conversations.map(async (conv) => {
//         const unreadCount = await this.countUnreadInConversation(conv._id, userId);
//         const lastMessage = await this.findById(conv.lastMessage._id);

//         return {
//           conversationId: conv._id,
//           project: conv.project,
//           lastMessage: lastMessage!,
//           unreadCount,
//           participants: conv.participants
//         };
//       })
//     );

//     return conversationList;
//   }

//   async countUnreadInConversation(conversationId: string, userId: string): Promise<number> {
//     return await Message.countDocuments({
//       conversationId,
//       sender: { $ne: userId },
//       readBy: { $ne: userId }
//     });
//   }

//   async findByUser(userId: string, options: {
//     projectId?: string;
//     conversationId?: string;
//     type?: string;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<MessageDocument[]> {
//     const {
//       projectId,
//       conversationId,
//       type,
//       page = 1,
//       limit = 50,
//       sort = '-createdAt'
//     } = options;

//     const query: any = {
//       $or: [
//         { sender: userId },
//         { readBy: userId }
//       ]
//     };

//     if (projectId) query.project = projectId;
//     if (conversationId) query.conversationId = conversationId;
//     if (type) query.type = type;

//     return await Message.find(query)
//       .populate('sender', 'name email avatarUrl')
//       .populate('project', 'title status')
//       .populate('replyTo', 'content sender createdAt')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as MessageDocument[];
//   }

//   async searchMessages(query: string, options: {
//     projectId?: string;
//     conversationId?: string;
//     sender?: string;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<MessageDocument[]> {
//     const {
//       projectId,
//       conversationId,
//       sender,
//       page = 1,
//       limit = 20
//     } = options;

//     const searchQuery: any = {
//       content: { $regex: query, $options: 'i' }
//     };

//     if (projectId) searchQuery.project = projectId;
//     if (conversationId) searchQuery.conversationId = conversationId;
//     if (sender) searchQuery.sender = sender;

//     return await Message.find(searchQuery)
//       .populate('sender', 'name email avatarUrl')
//       .populate('project', 'title status')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as MessageDocument[];
//   }

//   async getMessageThread(messageId: string): Promise<MessageDocument[]> {
//     const message = await this.findById(messageId);
//     if (!message) return [];

//     const thread: MessageDocument[] = [];
//     let currentMessage: MessageDocument | null = message;

//     // Get the entire thread from root to this message
//     while (currentMessage) {
//       thread.unshift(currentMessage);
//       if (currentMessage.replyTo) {
//         currentMessage = await this.findById(currentMessage.replyTo.toString());
//       } else {
//         break;
//       }
//     }

//     // Get all replies to this message
//     const replies = await this.findReplies(messageId);
//     thread.push(...replies);

//     return thread;
//   }

//   async countByProject(projectId: string): Promise<number> {
//     return await Message.countDocuments({ project: projectId });
//   }

//   async countByConversation(conversationId: string): Promise<number> {
//     return await Message.countDocuments({ conversationId });
//   }

//   async getUserMessageStats(userId: string): Promise<{
//     totalSent: number;
//     totalReceived: number;
//     conversations: number;
//   }> {
//     const [totalSent, totalReceived, conversations] = await Promise.all([
//       Message.countDocuments({ sender: userId }),
//       Message.countDocuments({ readBy: userId }),
//       Message.distinct('conversationId', {
//         $or: [
//           { sender: userId },
//           { readBy: userId }
//         ]
//       })
//     ]);

//     return {
//       totalSent,
//       totalReceived,
//       conversations: conversations.length
//     };
//   }

//   async getRecentConversations(userId: string, options: {
//     limit?: number;
//   } = {}): Promise<string[]> {
//     const { limit = 10 } = options;

//     const conversations = await Message.aggregate([
//       {
//         $match: {
//           $or: [
//             { sender: userId },
//             { readBy: userId }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: '$conversationId',
//           lastActivity: { $max: '$createdAt' }
//         }
//       },
//       {
//         $sort: { lastActivity: -1 }
//       },
//       {
//         $limit: limit
//       }
//     ]);

//     return conversations.map(conv => conv._id);
//   }

//   async getProjectMessages(projectId: string, options: {
//     conversationId?: string;
//     limit?: number;
//     before?: Date;
//   } = {}): Promise<MessageDocument[]> {
//     const { conversationId, limit = 50, before } = options;

//     const query: any = { project: projectId };

//     if (conversationId) query.conversationId = conversationId;
//     if (before) query.createdAt = { $lt: before };

//     return await Message.find(query)
//       .populate('sender', 'name email avatarUrl')
//       .populate('replyTo', 'content sender createdAt')
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .exec() as MessageDocument[];
//   }

//   async editMessage(messageId: string, newContent: string, editedBy: string): Promise<MessageDocument | null> {
//     return await Message.findByIdAndUpdate(
//       messageId,
//       {
//         content: newContent,
//         edited: true,
//         editedAt: new Date()
//       },
//       { new: true }
//     )
//       .populate('sender', 'name email avatarUrl')
//       .exec() as MessageDocument | null;
//   }

//   async getMessagesBetweenUsers(user1Id: string, user2Id: string, options: {
//     projectId?: string;
//     limit?: number;
//     page?: number;
//   } = {}): Promise<MessageDocument[]> {
//     const { projectId, limit = 50, page = 1 } = options;

//     const query: any = {
//       $or: [
//         { sender: user1Id },
//         { sender: user2Id }
//       ]
//     };

//     if (projectId) query.project = projectId;

//     return await Message.find(query)
//       .populate('sender', 'name email avatarUrl')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as MessageDocument[];
//   }
// }

// export const messageRepo = new MessageRepository();
