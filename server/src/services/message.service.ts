// import { Message, MessageDocument, MessageType } from '@/models/message.model';
// import { activityLogRepo } from '@/repositories/activity-log.repository';
// import { AppError } from '@/utils/errors';

// interface MessageQuery {
//   page?: number;
//   limit?: number;
//   project?: string;
//   recipient?: string;
//   sender?: string;
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

// interface Conversation {
//   participant: any;
//   lastMessage: MessageDocument;
//   unreadCount: number;
// }

// class MessageService {
//   async sendMessage(messageData: {
//     content: string;
//     sender: string;
//     recipient?: string;
//     project?: string;
//     messageType?: 'text' | 'file' | 'image';
//     attachments?: Array<{
//       filename: string;
//       url: string;
//       mimeType: string;
//       size: number;
//     }>;
//   }): Promise<MessageDocument> {
//     try {
//       const message = await Message.create(messageData);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'message_sent',
//         entityType: 'Message',
//         entityId: message._id,
//         user: messageData.sender,
//         metadata: { recipient: messageData.recipient, project: messageData.project }
//       });

//       return message as MessageDocument;
//     } catch (error) {
//       throw new AppError('MESSAGE_SEND_FAILED', 'Failed to send message', 500);
//     }
//   }

//   async getMessages(query: MessageQuery) {
//     try {
//       const { page = 1, limit = 20, project, recipient, sender, sortBy = 'createdAt', sortOrder = 'desc' } = query;

//       let filter: any = {};

//       if (project) filter.project = project;
//       if (recipient) filter.recipient = recipient;
//       if (sender) filter.sender = sender;

//       const skip = (page - 1) * limit;
//       const sortOptions: any = {};
//       sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

//       const [messages, totalCount] = await Promise.all([
//         Message.find(filter)
//           .populate('sender', 'name email avatarUrl')
//           .populate('recipient', 'name email avatarUrl')
//           .populate('project', 'title')
//           .sort(sortOptions)
//           .skip(skip)
//           .limit(limit)
//           .exec(),
//         Message.countDocuments(filter)
//       ]);

//       const totalPages = Math.ceil(totalCount / limit);
//       const pagination: PaginationResult = {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       };

//       return {
//         messages,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('MESSAGES_FETCH_FAILED', 'Failed to fetch messages', 500);
//     }
//   }

//   async getMessageById(messageId: string): Promise<MessageDocument | null> {
//     try {
//       return await Message.findById(messageId)
//         .populate('sender', 'name email avatarUrl')
//         .populate('recipient', 'name email avatarUrl')
//         .populate('project', 'title')
//         .exec() as MessageDocument | null;
//     } catch (error) {
//       throw new AppError('MESSAGE_FETCH_FAILED', 'Failed to fetch message', 500);
//     }
//   }

//   async editMessage(messageId: string, content: string, userId: string): Promise<MessageDocument | null> {
//     try {
//       const message = await Message.findOneAndUpdate(
//         { _id: messageId, sender: userId },
//         {
//           content,
//           isEdited: true,
//           editedAt: new Date()
//         },
//         { new: true }
//       )
//         .populate('sender', 'name email avatarUrl')
//         .populate('recipient', 'name email avatarUrl')
//         .populate('project', 'title')
//         .exec() as MessageDocument | null;

//       // Log activity
//       await activityLogRepo.create({
//         action: 'message_edited',
//         entityType: 'Message',
//         entityId: messageId,
//         user: userId,
//         metadata: { messageId }
//       });

//       return message;
//     } catch (error) {
//       throw new AppError('MESSAGE_EDIT_FAILED', 'Failed to edit message', 500);
//     }
//   }

//   async deleteMessage(messageId: string, userId: string): Promise<void> {
//     try {
//       await Message.findOneAndDelete({ _id: messageId, sender: userId });

//       // Log activity
//       await activityLogRepo.create({
//         action: 'message_deleted',
//         entityType: 'Message',
//         entityId: messageId,
//         user: userId,
//         metadata: { messageId }
//       });
//     } catch (error) {
//       throw new AppError('MESSAGE_DELETE_FAILED', 'Failed to delete message', 500);
//     }
//   }

//   async getUserConversations(userId: string): Promise<Conversation[]> {
//     try {
//       // Get all messages involving this user
//       const messages = await Message.find({
//         $or: [
//           { sender: userId },
//           { recipient: userId }
//         ]
//       })
//         .populate('sender', 'name email avatarUrl')
//         .populate('recipient', 'name email avatarUrl')
//         .sort({ createdAt: -1 })
//         .exec();

//       // Group by conversation (recipient or project)
//       const conversations = new Map();

//       messages.forEach((message: any) => {
//         let conversationKey = '';
//         let participant = null;

//         if (message.recipient && message.recipient._id.toString() !== userId.toString()) {
//           conversationKey = message.recipient._id.toString();
//           participant = message.recipient;
//         } else if (message.sender && message.sender._id.toString() !== userId.toString()) {
//           conversationKey = message.sender._id.toString();
//           participant = message.sender;
//         } else if (message.project) {
//           conversationKey = `project_${message.project._id}`;
//           participant = message.project;
//         }

//         if (conversationKey && participant) {
//           if (!conversations.has(conversationKey)) {
//             conversations.set(conversationKey, {
//               participant,
//               lastMessage: message,
//               unreadCount: message.recipient && message.recipient._id.toString() === userId.toString() && !message.isRead ? 1 : 0
//             });
//           } else {
//             const conversation = conversations.get(conversationKey);
//             if (message.createdAt > conversation.lastMessage.createdAt) {
//               conversation.lastMessage = message;
//             }
//             if (message.recipient && message.recipient._id.toString() === userId.toString() && !message.isRead) {
//               conversation.unreadCount++;
//             }
//           }
//         }
//       });

//       return Array.from(conversations.values());
//     } catch (error) {
//       throw new AppError('CONVERSATIONS_FETCH_FAILED', 'Failed to fetch user conversations', 500);
//     }
//   }

//   async markAsRead(messageId: string, userId: string): Promise<MessageDocument | null> {
//     try {
//       const message = await Message.findOneAndUpdate(
//         { _id: messageId, recipient: userId },
//         { isRead: true, readAt: new Date() },
//         { new: true }
//       )
//         .populate('sender', 'name email avatarUrl')
//         .populate('recipient', 'name email avatarUrl')
//         .populate('project', 'title')
//         .exec() as MessageDocument | null;

//       return message;
//     } catch (error) {
//       throw new AppError('MESSAGE_MARK_READ_FAILED', 'Failed to mark message as read', 500);
//     }
//   }
// }

// export const messageService = new MessageService();
