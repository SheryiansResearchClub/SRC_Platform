import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { eventService } from '@/services/event.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// POST /events - Create event/meeting
const createEvent = async (req: Request, res: Response) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user!._id,
    };

    const event = await eventService.createEvent(eventData);

    return sendSuccess(res, {
      event,
      message: 'Event created successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'EVENT_CREATE_FAILED', error.message || 'Unable to create event');
  }
};

// GET /events - Get all events (with filters: date, type)
const getEvents = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      type: req.query.type as string | undefined,
      status: req.query.status as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await eventService.getEvents(query);

    return sendSuccess(res, {
      events: result.events,
      pagination: result.pagination,
      message: 'Events retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'EVENTS_FETCH_FAILED', error.message || 'Unable to fetch events');
  }
};

// GET /events/:id - Get single event details
const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);

    if (!event) {
      return sendError(res, 'EVENT_NOT_FOUND', 'Event not found', 404);
    }

    return sendSuccess(res, {
      event,
      message: 'Event retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'EVENT_FETCH_FAILED', error.message || 'Unable to fetch event');
  }
};

// PUT /events/:id - Update event
const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const event = await eventService.updateEvent(id, updateData);

    if (!event) {
      return sendError(res, 'EVENT_NOT_FOUND', 'Event not found', 404);
    }

    return sendSuccess(res, {
      event,
      message: 'Event updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'EVENT_UPDATE_FAILED', error.message || 'Unable to update event');
  }
};

// DELETE /events/:id - Delete event
const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await eventService.deleteEvent(id);

    return sendSuccess(res, {
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'EVENT_DELETE_FAILED', error.message || 'Unable to delete event');
  }
};

// POST /events/:id/rsvp - RSVP to event
const rsvpToEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const event = await eventService.rsvpToEvent(id, req.user!._id, status, note);

    return sendSuccess(res, {
      event,
      message: 'RSVP updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'EVENT_RSVP_FAILED', error.message || 'Unable to RSVP to event');
  }
};

// GET /events/:id/attendees - Get event attendees
const getEventAttendees = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const attendees = await eventService.getEventAttendees(id);

    return sendSuccess(res, {
      attendees,
      message: 'Event attendees retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'EVENT_ATTENDEES_FETCH_FAILED', error.message || 'Unable to fetch event attendees');
  }
};

// DELETE /events/:id/rsvp - Cancel RSVP
const cancelRsvp = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await eventService.cancelRsvp(id, req.user!._id);

    return sendSuccess(res, {
      event,
      message: 'RSVP cancelled successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'EVENT_RSVP_CANCEL_FAILED', error.message || 'Unable to cancel RSVP');
  }
};

// GET /events/calendar - Get calendar view of events
const getCalendarView = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const events = await eventService.getCalendarView(
      startDate as string,
      endDate as string
    );

    return sendSuccess(res, {
      events,
      message: 'Calendar view retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'CALENDAR_VIEW_FETCH_FAILED', error.message || 'Unable to fetch calendar view');
  }
};

// GET /events/upcoming - Get upcoming events
const getUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const events = await eventService.getUpcomingEvents(req.user!._id);

    return sendSuccess(res, {
      events,
      message: 'Upcoming events retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'UPCOMING_EVENTS_FETCH_FAILED', error.message || 'Unable to fetch upcoming events');
  }
};

export default {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  getEventAttendees,
  cancelRsvp,
  getCalendarView,
  getUpcomingEvents,
};
