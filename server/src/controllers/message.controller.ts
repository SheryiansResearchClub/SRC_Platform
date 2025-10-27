import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { messageService } from '@/services/message.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// POST /messages - Send message
const sendMessage = async (req: Request, res: Response) => {
  try {
    const messageData = {
      ...req.body,
      sender: req.user!._id,
    };

    const message = await messageService.sendMessage(messageData);

    return sendSuccess(res, {
      message,
      message: 'Message sent successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'MESSAGE_SEND_FAILED', error.message || 'Unable to send message');
  }
};

// GET /messages - Get messages (filtered by project/user)
const getMessages = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      project: req.query.project as string | undefined,
      recipient: req.query.recipient as string | undefined,
      sender: req.query.sender as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await messageService.getMessages(query);

    return sendSuccess(res, {
      messages: result.messages,
      pagination: result.pagination,
      message: 'Messages retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MESSAGES_FETCH_FAILED', error.message || 'Unable to fetch messages');
  }
};

// GET /messages/:id - Get single message
const getMessageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await messageService.getMessageById(id);

    if (!message) {
      return sendError(res, 'MESSAGE_NOT_FOUND', 'Message not found', 404);
    }

    return sendSuccess(res, {
      message,
      message: 'Message retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MESSAGE_FETCH_FAILED', error.message || 'Unable to fetch message');
  }
};

// PUT /messages/:id - Edit message
const editMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const message = await messageService.editMessage(id, content, req.user!._id);

    return sendSuccess(res, {
      message,
      message: 'Message updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MESSAGE_EDIT_FAILED', error.message || 'Unable to edit message');
  }
};

// DELETE /messages/:id - Delete message
const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await messageService.deleteMessage(id, req.user!._id);

    return sendSuccess(res, {
      message: 'Message deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MESSAGE_DELETE_FAILED', error.message || 'Unable to delete message');
  }
};

// GET /messages/conversations - Get user conversations
const getUserConversations = async (req: Request, res: Response) => {
  try {
    const conversations = await messageService.getUserConversations(req.user!._id);

    return sendSuccess(res, {
      conversations,
      message: 'User conversations retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'CONVERSATIONS_FETCH_FAILED', error.message || 'Unable to fetch user conversations');
  }
};

// PUT /messages/:id/read - Mark message as read
const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await messageService.markAsRead(id, req.user!._id);

    return sendSuccess(res, {
      message,
      message: 'Message marked as read successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MESSAGE_MARK_READ_FAILED', error.message || 'Unable to mark message as read');
  }
};

export default {
  sendMessage,
  getMessages,
  getMessageById,
  editMessage,
  deleteMessage,
  getUserConversations,
  markAsRead,
};
