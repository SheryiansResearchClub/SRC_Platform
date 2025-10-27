// import { Event, EventDocument, EventType } from '@/models/event.model';
// import { activityLogRepo } from '@/repositories/activity-log.repository';
// import { AppError } from '@/utils/errors';

// interface EventQuery {
//   page?: number;
//   limit?: number;
//   type?: string;
//   status?: string;
//   startDate?: string;
//   endDate?: string;
//   search?: string;
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

// class EventService {
//   async createEvent(eventData: {
//     title: string;
//     description: string;
//     startDate: Date;
//     endDate: Date;
//     type: string;
//     location?: string;
//     maxAttendees?: number;
//     createdBy: string;
//     attendees?: string[];
//   }): Promise<EventDocument> {
//     try {
//       const event = await Event.create(eventData);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'event_created',
//         entityType: 'Event',
//         entityId: event._id,
//         user: eventData.createdBy,
//         metadata: { eventTitle: event.title }
//       });

//       return event as EventDocument;
//     } catch (error) {
//       throw new AppError('EVENT_CREATE_FAILED', 'Failed to create event', 500);
//     }
//   }

//   async getEvents(query: EventQuery) {
//     try {
//       const { page = 1, limit = 20, type, status, startDate, endDate, search, sortBy = 'startDate', sortOrder = 'asc' } = query;

//       let filter: any = {};

//       if (type) filter.type = type;
//       if (status) filter.status = status;
//       if (startDate) filter.startDate = { $gte: new Date(startDate) };
//       if (endDate) filter.endDate = { $lte: new Date(endDate) };
//       if (search) {
//         filter.$or = [
//           { title: { $regex: search, $options: 'i' } },
//           { description: { $regex: search, $options: 'i' } }
//         ];
//       }

//       const skip = (page - 1) * limit;
//       const sortOptions: any = {};
//       sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

//       const [events, totalCount] = await Promise.all([
//         Event.find(filter)
//           .populate('createdBy', 'name email avatarUrl')
//           .populate('attendees.user', 'name email avatarUrl')
//           .sort(sortOptions)
//           .skip(skip)
//           .limit(limit)
//           .exec(),
//         Event.countDocuments(filter)
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
//         events,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('EVENTS_FETCH_FAILED', 'Failed to fetch events', 500);
//     }
//   }

//   async getEventById(eventId: string): Promise<EventDocument | null> {
//     try {
//       return await Event.findById(eventId)
//         .populate('createdBy', 'name email avatarUrl')
//         .populate('attendees.user', 'name email avatarUrl')
//         .exec() as EventDocument | null;
//     } catch (error) {
//       throw new AppError('EVENT_FETCH_FAILED', 'Failed to fetch event', 500);
//     }
//   }

//   async updateEvent(eventId: string, updateData: Partial<EventType>): Promise<EventDocument | null> {
//     try {
//       const event = await Event.findByIdAndUpdate(eventId, updateData, { new: true })
//         .populate('createdBy', 'name email avatarUrl')
//         .populate('attendees.user', 'name email avatarUrl')
//         .exec() as EventDocument | null;

//       // Log activity
//       await activityLogRepo.create({
//         action: 'event_updated',
//         entityType: 'Event',
//         entityId: eventId,
//         metadata: { eventTitle: event?.title }
//       });

//       return event;
//     } catch (error) {
//       throw new AppError('EVENT_UPDATE_FAILED', 'Failed to update event', 500);
//     }
//   }

//   async deleteEvent(eventId: string): Promise<void> {
//     try {
//       await Event.findByIdAndDelete(eventId);

//       // Log activity
//       await activityLogRepo.create({
//         action: 'event_deleted',
//         entityType: 'Event',
//         entityId: eventId,
//         metadata: { eventId }
//       });
//     } catch (error) {
//       throw new AppError('EVENT_DELETE_FAILED', 'Failed to delete event', 500);
//     }
//   }

//   async rsvpToEvent(eventId: string, userId: string, status: 'yes' | 'no' | 'maybe', note?: string): Promise<EventDocument | null> {
//     try {
//       const event = await Event.findById(eventId);
//       if (!event) return null;

//       // Remove existing RSVP
//       event.attendees = event.attendees?.filter(attendee => attendee.user.toString() !== userId.toString()) || [];

//       // Add new RSVP
//       event.attendees.push({
//         user: userId,
//         status,
//         note,
//         rsvpDate: new Date()
//       });

//       await event.save();

//       const populatedEvent = await Event.findById(eventId)
//         .populate('createdBy', 'name email avatarUrl')
//         .populate('attendees.user', 'name email avatarUrl')
//         .exec() as EventDocument;

//       // Log activity
//       await activityLogRepo.create({
//         action: 'event_rsvp',
//         entityType: 'Event',
//         entityId: eventId,
//         user: userId,
//         metadata: { status, eventTitle: event.title }
//       });

//       return populatedEvent;
//     } catch (error) {
//       throw new AppError('EVENT_RSVP_FAILED', 'Failed to RSVP to event', 500);
//     }
//   }

//   async getEventAttendees(eventId: string): Promise<Array<{
//     user: any;
//     status: string;
//     note?: string;
//     rsvpDate: Date;
//   }>> {
//     try {
//       const event = await Event.findById(eventId)
//         .populate('attendees.user', 'name email avatarUrl')
//         .exec();

//       if (!event) return [];

//       return event.attendees || [];
//     } catch (error) {
//       throw new AppError('EVENT_ATTENDEES_FETCH_FAILED', 'Failed to fetch event attendees', 500);
//     }
//   }

//   async cancelRsvp(eventId: string, userId: string): Promise<EventDocument | null> {
//     try {
//       const event = await Event.findById(eventId);
//       if (!event) return null;

//       // Remove RSVP
//       event.attendees = event.attendees?.filter(attendee => attendee.user.toString() !== userId.toString()) || [];
//       await event.save();

//       const populatedEvent = await Event.findById(eventId)
//         .populate('createdBy', 'name email avatarUrl')
//         .populate('attendees.user', 'name email avatarUrl')
//         .exec() as EventDocument;

//       // Log activity
//       await activityLogRepo.create({
//         action: 'event_rsvp_cancelled',
//         entityType: 'Event',
//         entityId: eventId,
//         user: userId,
//         metadata: { eventTitle: event.title }
//       });

//       return populatedEvent;
//     } catch (error) {
//       throw new AppError('EVENT_RSVP_CANCEL_FAILED', 'Failed to cancel RSVP', 500);
//     }
//   }

//   async getCalendarView(startDate: string, endDate: string): Promise<EventDocument[]> {
//     try {
//       const events = await Event.find({
//         startDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
//       })
//         .populate('createdBy', 'name email')
//         .sort({ startDate: 1 })
//         .exec() as EventDocument[];

//       return events;
//     } catch (error) {
//       throw new AppError('CALENDAR_VIEW_FETCH_FAILED', 'Failed to fetch calendar view', 500);
//     }
//   }

//   async getUpcomingEvents(userId: string): Promise<EventDocument[]> {
//     try {
//       const now = new Date();
//       const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//       const events = await Event.find({
//         $or: [
//           { createdBy: userId },
//           { 'attendees.user': userId }
//         ],
//         startDate: { $gte: now, $lte: weekFromNow }
//       })
//         .populate('createdBy', 'name email avatarUrl')
//         .populate('attendees.user', 'name email avatarUrl')
//         .sort({ startDate: 1 })
//         .exec() as EventDocument[];

//       return events;
//     } catch (error) {
//       throw new AppError('UPCOMING_EVENTS_FETCH_FAILED', 'Failed to fetch upcoming events', 500);
//     }
//   }
// }

// export const eventService = new EventService();
